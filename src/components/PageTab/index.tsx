import SwitchEditor from '@/components/SwitchEditor';
import { Dropdown, Menu, Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React, { ReactElement } from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './style.less';
import IProps, {
  DndDragMethod,
  IDraggableTabProps,
  ITagNodeProps,
  MtdMove,
  TYPE,
  WrapTabNodeType,
} from './type';
import NativeMenu from '../NativeMenu';
import { createItem } from '@/util/MenuUtil';

const { TabPane } = Tabs;

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

const dragMethod: DndDragMethod = DragSource(
  TYPE,
  sourceSpec,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
);
const dropMethod = DropTarget(TYPE, targetSpec, (connect, monitor) => ({
  isOver: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
}));

const WrapTabNode: WrapTabNodeType = dragMethod(dropMethod(TabNode));

class DraggableTabs extends React.Component<IDraggableTabProps> {
  move: MtdMove = (dragKey, hoverKey) => {
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
    const { children, order, activeKey } = this.props;
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
            }
          }}
          activeKey={activeKey}
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

const menu = (
  <Menu>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd menu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

export default (props: IProps) => {
  const {
    order,
    setActive,
    updateContent,
    updateOrder,
    remove,
    activeKey,
    paneList,
  } = props;
  return (
    <DraggableTabs
      order={order}
      setActive={setActive}
      updateContent={updateContent}
      updateOrder={updateOrder}
      remove={remove}
      activeKey={activeKey}
    >
      {paneList.map(o => {
        return (
          <TabPane
            tab={
              <NativeMenu
                items={
                  [
                    // createItem({
                    //   label: '关闭',
                    //   click: () => {
                    //     remove(o.key);
                    //   },
                    // }),
                  ]
                }
                className="tabs-tab-title"
              >
                {o.tab}
              </NativeMenu>
            }
            closable={activeKey === o.key}
            key={o.key}
          >
            <SwitchEditor
              value={o.value}
              updateContent={updateContent ? updateContent : () => {}}
              dataKey={o.key}
              key={o.key}
              type={o.type}
            />
          </TabPane>
        );
      })}
    </DraggableTabs>
  );
};
