import { systemConfig } from '@/config/SystemConfig';
import { Effect, Reducer, Subscription } from 'umi';

export type ISettingModelProps = {
  setting: ISettingModelState;
};

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
    // save: ImmerReducer<ISettingModelState>;
  };
  subscriptions: { setup: Subscription };
}

const SettingModel: ISettingModelType = {
  namespace: 'setting',
  state: {},
  effects: {
    *query({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: payload,
      });
    },
  },
  reducers: {
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

export default SettingModel;
