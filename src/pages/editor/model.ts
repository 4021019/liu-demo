import { IPane } from '@/components/PageTab/type';
import { systemConfig } from '@/config/SystemConfig';
import { fs, mkdir, path } from '@/util/FileUtil';
import _ from 'lodash';
import 'nprogress/nprogress.css';
import { IEditorModelState, IEditorModelType } from './type';

const EditorModel: IEditorModelType = {
  namespace: 'editor',
  state: {
    paneMap: new Map(),
    order: [],
    activeKey: '',
  },
  effects: {
    *load({ payload }, { call, put }) {
      yield put({
        type: '_load',
      });
    },
    *storeAll({ payload }, { call, put }) {
      const { nProgress } = payload;
      nProgress.start();
      yield put({
        type: '_storeAll',
        payload: payload,
      });
      nProgress.done();
    },
    *updateOne({ payload }, { call, put }) {
      yield put({
        type: 'saveOne',
        payload: payload,
      });
    },
    *update({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
    },
  },
  reducers: {
    _load(state: any, action: any) {
      const newMap = readPane(systemConfig.docdir);
      let config: any;
      try {
        const data = fs.readFileSync(
          path.join(systemConfig.docdir, 'doc.json'),
          'utf-8',
        );
        config = JSON.parse(data);
      } catch (err) {
        console.log(err);
      }
      return {
        ...state,
        ...config,
        paneMap: newMap,
      };
    },
    _storeAll(state: any, action: any) {
      Array.from((state as IEditorModelState).paneMap.values())
        .filter(pane => pane.type !== 'new')
        .forEach(pane => {
          const dir = path.join(systemConfig.docdir, pane.key);
          mkdir(dir);
          writeFile(dir, 'text.txt', pane.value);
          writeFile(
            dir,
            'text.json',
            JSON.stringify({
              type: pane.type,
              tab: pane.tab,
              key: pane.key,
            }),
          );
        });
      writeFile(
        systemConfig.docdir,
        'doc.json',
        JSON.stringify({
          activeKey: state.activeKey,
          order: state.order,
        }),
      );
      return state;
    },
    saveOne(state: any, action: any) {
      const {
        payload: { key, content },
      } = action;
      const { paneMap } = state;
      const value = {
        ...paneMap.get(key),
        ...content,
      };
      const newMap = _.clone(paneMap);
      if (value) {
        newMap.delete(key);
      }
      newMap.set(key, value);
      state.paneMap = newMap;
      return {
        ...state,
        paneMap: newMap,
      };
    },
    save(state: any, action: any) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(pathname);
        if (pathname === '/editor') {
          dispatch({
            type: 'load',
          });
        }
      });
    },
  },
};

const writeFile = (dir: string, fileName: string, value: any): void => {
  fs.writeFile(
    path.join(dir, fileName),
    value,
    { flag: 'w', encoding: 'utf-8', mode: '0666' },
    function(err: any) {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
    },
  );
};

const readPane = (dir: string) => {
  const files = fs.readdirSync(dir);
  const map: Map<string, IPane> = new Map();
  files.forEach((item: any, index: any) => {
    var fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      console.log(item);
      const text = readText(path.join(dir, item));
      map.set(item, {
        key: item,
        ...text,
      });
    }
  });
  return map;
};

const readText = (dir: string): IPane => {
  const files = fs.readdirSync(dir);
  let value = '';
  let config: any;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    var fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      if ('text.txt' === file) {
        value = fs.readFileSync(fullPath, 'utf-8');
        continue;
      }
      if ('text.json' === file) {
        const data = fs.readFileSync(fullPath, 'utf-8');
        config = JSON.parse(data);
      }
    }
  }
  return {
    value: value,
    ...config,
  };
};

export default EditorModel;
