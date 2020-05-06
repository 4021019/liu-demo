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

export type MtdMove = (dragKey: string, hoverKey: string) => void;
export type MtdUpdateContent = (key: string, content: IPane) => void;

/**
 * tabs 内元素更新
 */
export interface IUpdateContent {
  updateContent?: MtdUpdateContent;
}

/**
 * tab 面板参数类型
 */
export interface IPane extends IUpdateContent {
  // tab title
  tab: string;
  // tab 唯一 key
  key: string;
  // 页面类型
  type: 'new' | 'markdown' | 'codemirror';
  // 页面文本
  value?: string;
  // 创建日期
  createDate?: string;
}

/**
 * tab 编辑
 */
export interface IEditTabProps extends IUpdateContent {
  // 移除tab
  remove: (targetKey: string) => void;
  updateOrder: (order: string[]) => void;
  setActive: (key: string) => void;
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
  activeKey: string;
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
  activeKey: string;
}
