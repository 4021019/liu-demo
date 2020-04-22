import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React, { ComponentType, ReactElement } from 'react';
import {
  DndProvider,
  DragElementWrapper,
  DragSource,
  DragSourceOptions,
  DropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {
  DndComponentClass,
  DndComponentEnhancer,
} from 'react-dnd/lib/decorators/interfaces';
import './style.less';
import SwitchEditor from '@/components/SwitchEditor';

const { TabPane } = Tabs;

const TYPE = 'TAB';

/**
 * tab 编辑
 */
interface IEditTabProps {
  // 移除tab
  remove: (targetKey: string) => void;
  updateOrder: (order: string[]) => void;
  updateContent: (key: string, content: any) => void;
}

/**
 * 拖拽 tab 节点
 */
interface ITagNodeProps {
  index: string;
  key: string;
  move: (dragKey: string, hoverKey: string) => void;
  children: any;
  connectDragSource: DragElementWrapper<any>;
  connectDropTarget: DragElementWrapper<any>;
  isOver: boolean;
  isDragging: boolean;
}

type WrapTabNodeType = DndComponentClass<
  DndComponentClass<ComponentType<ITagNodeProps>, ITagNodeProps>,
  Pick<ITagNodeProps, 'children' | 'index' | 'move' | 'key'>
>;

/**
 * 拖拽 tab 面板
 */
interface IDraggableTabProps extends IEditTabProps {
  children: any;
  order: string[];
  setActive: (key: string) => void;
}

/**
 * tab 面板参数类型
 */
interface IPane {
  // tab title
  tab: string;
  // tab 唯一 key
  key: string;
  // tab 本体内容 eg：<div>123</div>
  content: any;
}

/**
 * 组件参数类型
 */
interface IProps extends IEditTabProps {
  // tab 渲染列表'
  paneList: Array<any>;
  order: string[];
}

class TabNode extends React.Component<ITagNodeProps> {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      children,
      isDragging,
      isOver,
    } = this.props;
    return connectDragSource(
      connectDropTarget({
        ...children,
        props: {
          ...children.props,
          className: `${children.props.className} ${
            isDragging ? 'tabs-is-dragging' : ''
          } ${isOver ? 'tabs-is-over' : ''}`,
        },
      }),
    );
  }
}

const sourceSpec = {
  beginDrag(props: ITagNodeProps, monitor: any, component: any) {
    return props;
  },
};

const targetSpec = {
  drop(props: ITagNodeProps, monitor: any, component: React.Component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.move(dragIndex, hoverIndex);
  },
};

const dragMethod: DndComponentEnhancer<{
  connectDragSource: DragElementWrapper<DragSourceOptions>;
  isDragging: boolean;
}> = DragSource(TYPE, sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}));
const dropMethod = DropTarget(TYPE, targetSpec, (connect, monitor) => ({
  isOver: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
}));

const WrapTabNode: WrapTabNodeType = dragMethod(dropMethod(TabNode));

interface IDraggableTabState {
  // todo 移除
}

class DraggableTabs extends React.Component<
  IDraggableTabProps,
  IDraggableTabState
> {
  constructor(props: IDraggableTabProps) {
    super(props);
  }

  move = (dragKey: string, hoverKey: string): void => {
    const newOrder: string[] = this.props.order.slice();
    const { children } = this.props;
    React.Children.forEach<ITagNodeProps>(children, c => {
      const { key } = c;
      if (newOrder.indexOf(key) === -1) {
        newOrder.push(key);
      }
    });
    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);
    this.props.updateOrder(newOrder);
  };

  renderTabBar = (
    props: TabsProps,
    DefaultTabBar: React.ComponentClass<TabsProps>,
  ): React.ReactElement => (
    <DefaultTabBar {...props}>
      {(node: any): ReactElement => {
        return (
          <WrapTabNode index={node.key} key={node.key} move={this.move}>
            {node}
          </WrapTabNode>
        );
      }}
    </DefaultTabBar>
  );

  render() {
    const { children, order } = this.props;
    const tabs: ITagNodeProps[] = [];
    React.Children.forEach<ITagNodeProps>(children, c => {
      tabs.push(c);
    });
    const orderTabs = tabs
      .slice()
      .sort((a: ITagNodeProps, b: ITagNodeProps) => {
        const orderA = order.indexOf(a.key);
        const orderB = order.indexOf(b.key);
        if (orderA !== -1 && orderB !== -1) {
          return orderA - orderB;
        }
        if (orderA !== -1) {
          return -1;
        }
        if (orderB !== -1) {
          return 1;
        }
        const ia = tabs.indexOf(a);
        const ib = tabs.indexOf(b);
        return ia - ib;
      });
    return (
      <DndProvider backend={HTML5Backend}>
        <Tabs
          onChange={activeKey => {
            this.props.setActive(activeKey);
          }}
          tabBarGutter={0}
          onEdit={(targetKey, action) => {
            if ('remove' === action) {
              this.props.remove(targetKey.toString());
              if (targetKey === orderTabs[0].key) {
                if (orderTabs.length >= 2) {
                  this.props.setActive(orderTabs[1].key);
                }
              } else {
                if (orderTabs.length >= 1) {
                  this.props.setActive(orderTabs[0].key);
                }
              }
            }
          }}
          hideAdd={true}
          type="editable-card"
          renderTabBar={this.renderTabBar}
          {...this.props}
        >
          {orderTabs}
        </Tabs>
      </DndProvider>
    );
  }
}

export default class PageTab extends React.Component<IProps> {
  state = {
    activeKey:
      this.props.paneList.length > 0 ? this.props.paneList[0].key : null,
  };

  componentWillReceiveProps(nextProps: IProps) {
    // 如果 变为 1条数据 则该数据为 active
    if (nextProps.paneList.length == 1) {
      this.setState({
        activeKey: nextProps.paneList[0].key,
      });
    }
  }

  setActive = (key: string): void => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    return (
      <DraggableTabs
        order={this.props.order}
        setActive={this.setActive}
        updateContent={this.props.updateContent}
        updateOrder={this.props.updateOrder}
        remove={this.props.remove}
      >
        {this.props.paneList.map(o => {
          return (
            <TabPane
              tab={<div className="tabs-tab-title">{o.tab}</div>}
              closable={this.state.activeKey === o.key}
              key={o.key}
            >
              <SwitchEditor
                updateContent={o.updateContent}
                dataKey={o.key}
                type={o.type}
              />
            </TabPane>
          );
        })}
      </DraggableTabs>
    );
  }
}
