import { Effect, Reducer, Subscription, ConnectProps } from 'umi';

export interface IEditorModelProps extends ConnectProps {
  editor: IEditorModelState;
}

export interface IEditorModelState {
  paneMap: Map<String, any>;
  order: string[];
}

export interface IEditorModelType {
  namespace: 'editor';
  state: IEditorModelState;
  effects: {
    update: Effect;
  };
  reducers: {
    save: Reducer<IEditorModelState>;
  };
  subscriptions: { setup: Subscription };
}
const EditorModel: IEditorModelType = {
  namespace: 'editor',
  state: {
    paneMap: new Map(),
    order: [],
  },
  effects: {
    *update({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
    },
  },
  reducers: {
    save(state: any, action: any) {
      return {
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
