import { Divider, List } from 'antd';
import React from 'react';

export default (props: any) => {
  return (
    <div
      style={{
        width: '40px',
        float: 'left',
        textAlign: 'center',
        lineHeight: '40px',
        textAnchor: 'middle',
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};
