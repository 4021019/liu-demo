import { Effect, Reducer, Subscription } from 'umi';

export interface IndexModelState {
  name: string;
}

export interface IndexModelType {
  namespace: 'index2';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<IndexModelState>;
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}
const IndexModel: IndexModelType = {
  namespace: 'index2',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
      console.log(payload);
    },
  },
  reducers: {
    save(state, action) {
      console.log('save');
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(pathname);
        if (pathname === '/move2') {
          dispatch({
            type: 'query',
            payload: {
              liu: 'wentao',
            },
          });
        }
      });
    },
  },
};

export default IndexModel;
