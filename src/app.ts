import { notification } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getDvaApp } from 'umi';
import { IEditorModelState } from './models/page-editor';

document
  .getElementsByTagName('body')[0]
  .addEventListener('keydown', function(e) {
    if (e.metaKey && e.keyCode === 83) {
      const { _models } = getDvaApp();
      Array.from<{
        namespace: string;
        state: IEditorModelState;
      }>(_models)
        .filter(model => 'editor' === model.namespace)
        .forEach(model => {
          console.log(model.state.order);
          Array.from(model.state.paneMap.values()).forEach(pane => {
            console.log(pane.key);
            console.log(pane.value);
          });
        });
      NProgress.start();
      notification.open({
        key: 'save',
        message: '保存成功',
        description: 'nice',
        duration: 1,
        onClick: () => {
          NProgress.start();
          console.log(new Date().getTime());
        },
      });
    }
  });
