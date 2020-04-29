import { notification } from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getDvaApp } from 'umi';

document
  .getElementsByTagName('body')[0]
  .addEventListener('keydown', function(e) {
    if (e.metaKey && e.keyCode === 83) {
      const { _store } = getDvaApp();
      const { dispatch } = _store;
      dispatch({
        type: 'editor/storeAll',
        payload: {
          nProgress: NProgress,
        },
      });
      notification.open({
        key: 'save',
        message: '保存成功',
        description: 'nice',
        duration: 1,
      });
    }
  });
