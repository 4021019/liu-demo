import React from 'react';
import {
  createSepItem,
  createItem,
  createMenu,
  popMenu,
} from '@/util/MenuUtil';
import { IProps } from './type';

export default (props: IProps) => {
  const { items } = props;
  const meun = createMenu(items);
  const rightClick = () => {
    popMenu(meun);
  };
  return (
    <span
      className={props.className}
      style={props.style}
      onContextMenu={rightClick}
    >
      {props.children}
    </span>
  );
};
