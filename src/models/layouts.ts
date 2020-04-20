import { Effect, Subscription } from 'umi';

export interface ILayoutModelProps {
  layouts: ILayoutModelState;
}

export interface ILayoutModelState {
  name: string;
}

export interface ILayoutModelType {
  namespace: 'layouts';
  state: ILayoutModelState;
  effects: {
    query: Effect;
  };
  reducers: {};
  subscriptions: { setup: Subscription };
}
const Model: ILayoutModelType = {
  namespace: 'layouts',

  state: {
    name: '',
  },

  effects: {
    *query({ payload }, { call, put }) {},
  },
  reducers: {},
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log('loading');
      });
    },
  },
};

export default Model;
