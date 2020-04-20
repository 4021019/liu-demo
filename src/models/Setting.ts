import { Effect, Reducer, Subscription } from 'umi';
import { systemConfig } from '@/config/SystemConfig';

export interface ISettingModelState {
  homedir?: string;
  appdir?: string;
  configname?: string;
  charset?: string;
  baseconfig?: any;
}

export interface ISettingModelType {
  namespace: 'setting';
  state: ISettingModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    save: Reducer<ISettingModelState>;
    // save: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
}
const Model: ISettingModelType = {
  namespace: 'setting',
  state: {},
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
      return {
        ...state,
        ...action.payload,
      };
    },
    // 启用 immer 之后
    // save(state:ISettingModelState, action:any) {
    //   state = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/setting') {
          dispatch({
            type: 'query',
            payload: systemConfig,
          });
        }
      });
    },
  },
};

export default Model;
