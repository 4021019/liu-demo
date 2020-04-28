export interface IEditorModelProps extends ConnectProps {
  editor: IEditorModelState;
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
    update: Effect;
    updateOne: Effect;
  };
  reducers: {
    save: Reducer<IEditorModelState>;
    saveOne: Reducer<IEditorModelState>;
  };
  subscriptions: { setup: Subscription };
}
