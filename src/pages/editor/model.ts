import { IPane } from '@/components/PageTab/type';
import { systemConfig } from '@/config/SystemConfig';
import { fs, mkdir, path } from '@/util/FileUtil';
import _ from 'lodash';
import 'nprogress/nprogress.css';
import { IEditorModelType } from './type';

const EditorModel: IEditorModelType = {
  namespace: 'editor',
  state: {
    paneMap: new Map(),
    order: [],
    category: [],
    activeKey: '',
  },
  effects: {
    *load({ payload }, { call, put }) {
      yield put({
        type: '_loadConfig',
      });
      yield put({
        type: '_loadCategory',
      });
    },
    *loadByKey({ payload }, { call, put }) {
      yield put({
        type: '_loadByKey',
        payload: payload,
      });
      yield put({
        type: '_storeConfig',
        payload: payload,
      });
    },
    *storeAll({ payload }, { call, put }) {
      const { nProgress } = payload;
      nProgress.start();
      yield put({
        type: '_storeConfig',
        payload: payload,
      });
      nProgress.done();
    },
    *updateOne({ payload }, { call, put }) {
      yield put({
        type: 'saveOne',
        payload: payload,
      });
      yield put({
        type: '_storeOne',
        payload: payload,
      });
      yield put({
        type: '_storeConfig',
        payload: payload,
      });
    },
    *update({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
      yield put({
        type: '_storeConfig',
        payload: payload,
      });
    },
    *deleteByKey({ payload }, { call, put }) {
      yield put({
        type: '_deleteFileByKey',
        payload: payload,
      });
    },
  },
  reducers: {
    _loadCategory(state: any, action: any) {
      const { order } = state;
      const { map, open } = readPane(systemConfig.docdir, order);
      return {
        ...state,
        category: sortCategory(Array.from(map.values())),
        paneMap: open,
      };
    },
    _loadByKey(state: any, action: any) {
      const {
        payload: { key },
      } = action;
      const { paneMap, order } = state;
      if (paneMap.get(key)) {
        return {
          ...state,
          activeKey: key,
        };
      }
      const newMap = _.clone(paneMap);
      const pane = readTextDir(systemConfig.docdir, key, true);
      newMap.set(key, pane);
      return {
        ...state,
        activeKey: key,
        order: [...order, key],
        paneMap: newMap,
      };
    },
    _loadConfig(state: any, action: any) {
      let config: any;
      try {
        const data = fs.readFileSync(
          path.join(systemConfig.docdir, '_config.json'),
          'utf-8',
        );
        config = JSON.parse(data);
      } catch (err) {
        console.log(err);
      }
      return {
        ...state,
        ...config,
      };
    },
    _storeOne(state: any, action: any) {
      const {
        payload: { key },
      } = action;
      const { paneMap } = state;
      const pane: IPane = paneMap.get(key);
      if (pane.type !== 'new') {
        const dir = path.join(systemConfig.docdir, pane.key);
        const { category } = state;
        const index = _.findIndex<IPane>(category, c => c.key === key);
        const find: boolean = index >= 0;
        mkdir(dir);
        writeFile(dir, 'text.txt', pane.value);
        const element: IPane = {
          type: pane.type,
          tab: pane.tab,
          key: pane.key,
          createDate: pane.createDate,
        };
        writeFile(dir, 'text.json', JSON.stringify(element));
        if (find) {
          return {
            ...state,
            category: sortCategory([
              ..._.slice<IPane>(category, 0, index),
              element,
              ..._.slice<IPane>(category, index + 1),
            ]),
          };
        } else {
          return {
            ...state,
            category: sortCategory([...category, element]),
          };
        }
      }
      return state;
    },
    _storeConfig(state: any, action: any) {
      writeFile(
        systemConfig.docdir,
        '_config.json',
        JSON.stringify({
          activeKey: state.activeKey,
          order: state.order,
        }),
      );
      return state;
    },
    _deleteFileByKey(state: any, action: any) {
      const {
        payload: { key },
      } = action;
      const p = path.join(systemConfig.docdir, key);
      fs.rmdirSync(p, {
        recursive: true,
      });
      const { category, order, paneMap, activeKey } = state;

      const newCategory = [...category];
      _.remove(newCategory, o => o.key === key);
      const newMap: Map<String, IPane> = _.clone(paneMap);
      newMap.delete(key);
      const newOrder = [...order];
      let newState = {
        ...state,
        category: sortCategory(newCategory),
        paneMap: newMap,
      };
      if (key === activeKey) {
        let newActiveKey = newOrder.filter(
          (o, i, arr) => arr[i + 1] === key,
        )[0];
        if (!newActiveKey) {
          newActiveKey = newOrder.filter((o, i, arr) => arr[i - 1] === key)[0];
        }
        newState = {
          ...newState,
          activeKey: newActiveKey,
        };
      }
      _.remove(newOrder, o => o === key);
      return {
        ...newState,
        order: newOrder,
      };
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
        if (pathname === '/editor') {
          dispatch({
            type: 'load',
          });
        }
      });
    },
  },
};

const sortCategory = (array: IPane[]): IPane[] => {
  return array.sort((b: IPane, a: IPane): number => {
    if (!a.createDate) {
      return -1;
    }
    if (!b.createDate) {
      return 1;
    }
    return new Date(a.createDate).getTime() - new Date(b.createDate).getTime();
  });
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

const readPane = (dir: string, order: string[]) => {
  const files = fs.readdirSync(dir);
  const map: Map<string, IPane> = new Map();
  const open: Map<string, IPane> = new Map();
  files.forEach((item: any, index: any) => {
    if (_.indexOf(order, item) >= 0) {
      const pane: IPane | undefined = readTextDir(dir, item, true);
      if (pane) {
        open.set(item, pane);
      }
    }
    const pane: IPane | undefined = readTextDir(dir, item, false);
    if (pane) {
      map.set(item, pane);
    }
  });
  return {
    map: map,
    open: open,
  };
};

const readTextDir = (
  baseDir: string,
  item: string,
  readValue: boolean,
): IPane | undefined => {
  let fullPath: string = path.join(baseDir, item);
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    const text = readText(path.join(baseDir, item), readValue);
    return {
      key: item,
      ...text,
    };
  }
};

const readText = (dir: string, readValue: boolean = true): IPane => {
  const files = fs.readdirSync(dir);
  let value = '';
  let config: IPane | undefined = undefined;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    var fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (!stat.isDirectory()) {
      if (readValue) {
        if ('text.txt' === file) {
          value = fs.readFileSync(fullPath, 'utf-8');
          continue;
        }
      }
      if ('text.json' === file) {
        const data = fs.readFileSync(fullPath, 'utf-8');
        config = JSON.parse(data);
      }
    }
  }
  if (!config) {
    throw new Error('-----');
  }
  return {
    ...config,
    value: value,
  };
};

export default EditorModel;
