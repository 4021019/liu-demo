import { ComponentType } from 'react';
import {
  DndComponentClass,
  DndComponentEnhancer,
  DragElementWrapper,
  DragSourceOptions,
} from 'react-dnd';

export const TYPE = 'TAB';

/**
 * dnd 拖拽节点类型
 */
export type WrapTabNodeType = DndComponentClass<
  DndComponentClass<ComponentType<ITagNodeProps>, ITagNodeProps>,
  Pick<ITagNodeProps, 'children' | 'index' | 'move' | 'key'>
>;

export type DndDragMethod = DndComponentEnhancer<{
  connectDragSource: DragElementWrapper<DragSourceOptions>;
  isDragging: boolean;
}>;

/**
 * tabs 内元素更新
 */
export interface IUpdateContent {
  updateContent: (key: string, content: IPane) => void;
}

/**
 * tab 面板参数类型
 */
export interface IPane extends IUpdateContent {
  // tab title
  tab: string;
  // tab 唯一 key
  key: string;
  // tab 本体内容 eg：<div>123</div>
  type: 'new' | 'markdown' | 'codemirror';
}

/**
 * tab 编辑
 */
export interface IEditTabProps extends IUpdateContent {
  // 移除tab
  remove: (targetKey: string) => void;
  updateOrder: (order: string[]) => void;
}

/**
 * 拖拽节点内容 props
 */
export interface ITagNodeProps {
  index: string;
  key: string;
  move: (dragKey: string, hoverKey: string) => void;
  children: any;
  connectDragSource: DragElementWrapper<any>;
  connectDropTarget: DragElementWrapper<any>;
  isOver: boolean;
  isDragging: boolean;
}

/**
 * 拖拽 tab 面板
 */
export interface IDraggableTabProps extends IEditTabProps {
  children: any;
  order: string[];
  setActive: (key: string) => void;
}

/**
 * 组件参数类型
 */
export default interface IProps extends IEditTabProps {
  // tab 渲染列表
  paneList: Array<IPane>;
  // 渲染顺序
  order: string[];
}
