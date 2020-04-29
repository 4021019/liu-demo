import { ConnectProps, Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface IProps extends ConnectProps {
  editor: IEditorModelState;
}

export interface IState {
  menuDrawer: boolean;
}

export interface IEditorModelState {
  paneMap: Map<String, any>;
  order: string[];
  activeKey: string;
}

export interface IEditorModelType {
  namespace: 'editor';
  state: IEditorModelState;
  effects: {
    load: Effect;
    storeAll: Effect;
    update: Effect;
    updateOne: Effect;
  };
  reducers: {
    _load: Reducer<IEditorModelState>;
    _storeAll: Reducer<IEditorModelState>;
    save: Reducer<IEditorModelState>;
    saveOne: ImmerReducer<IEditorModelState>;
  };
  subscriptions: { setup: Subscription };
}
