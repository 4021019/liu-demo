import { IPane } from '@/components/PageTab/type';
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
  category: IPane[];
  activeKey: string;
}

export interface IEditorModelType {
  namespace: 'editor';
  state: IEditorModelState;
  effects: {
    deleteByKey: Effect;
    load: Effect;
    loadByKey: Effect;
    storeAll: Effect;
    update: Effect;
    updateOne: Effect;
  };
  reducers: {
    _deleteFileByKey: Reducer<IEditorModelState>;
    _loadCategory: Reducer<IEditorModelState>;
    _loadConfig: Reducer<IEditorModelState>;
    _loadByKey: Reducer<IEditorModelState>;
    _storeConfig: Reducer<IEditorModelState>;
    _storeOne: Reducer<IEditorModelState>;
    save: Reducer<IEditorModelState>;
    saveOne: ImmerReducer<IEditorModelState>;
  };
  subscriptions: { setup: Subscription };
}
