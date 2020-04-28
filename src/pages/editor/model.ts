import _ from 'lodash';
import { IEditorModelType } from './type';

const EditorModel: IEditorModelType = {
  namespace: 'editor',
  state: {
    paneMap: new Map(),
    order: [],
    activeKey: '',
  },
  effects: {
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
    saveOne(state: any, action: any) {
      const {
        payload: { key, content },
      } = action;
      console.log(key);
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
        console.log('loading');
      });
    },
  },
};
export default EditorModel;
