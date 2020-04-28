import React from 'react';
import './style.less';

export default (props: any) => {
  return (
    <div className="editor-tool" onClick={props.onClick}>
      {props.children}
    </div>
  );
};
