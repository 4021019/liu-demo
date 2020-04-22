import { Effect, Reducer, Subscription, ConnectProps } from 'umi';

export interface ILayoutModelProps extends ConnectProps {
  layouts: ILayoutModelState;
}

export interface ILayoutModelState {
  name: string;
}

export interface ILayoutModelType {
  namespace: 'layouts';
  state: ILayoutModelState;
  effects: {
    xxx: Effect;
  };
  reducers: {
    save: Reducer<ILayoutModelState>;
  };
  subscriptions: { setup: Subscription };
}
const Model: ILayoutModelType = {
  namespace: 'layouts',
  state: {
    name: '',
  },
  effects: {
    *xxx({ payload }, { call, put }) {
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
export default Model;
