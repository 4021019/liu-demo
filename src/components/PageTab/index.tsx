import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import React, { ReactElement, ComponentClass, ComponentType } from 'react';
import {
  DndProvider,
  DragElementWrapper,
  DragSource,
  DropTarget,
  DragSourceOptions,
} from 'react-dnd';
import {
  DndComponentEnhancer,
  DndComponentClass,
} from 'react-dnd/lib/decorators/interfaces';
import HTML5Backend from 'react-dnd-html5-backend';
import './style.less';

const { TabPane } = Tabs;

const TYPE = 'TAB';

/**
 * tab 编辑
 */
interface IEditTabProps {
  // 移除tab
  remove: (targetKey: string) => void;
}

interface x {
  index: string;
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
  key: string;
  paneList: IPane[];
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
          style: {
            ...children.props.style,
            border: isDragging ? '1px dashed black' : '1px solid #A0A0A0',
            background: isDragging ? '' : isOver ? '#A0A0A0' : '',
            height: '25px',
            fontSize: 'small',
            lineHeight: '25px',
            fontWeight: 'normal',
            maxWidth: '100px',

            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          },
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
  order: string[];
}

class DraggableTabs extends React.Component<
  IDraggableTabProps,
  IDraggableTabState
> {
  constructor(props: IDraggableTabProps) {
    super(props);
    this.state = {
      order: [],
    };
  }

  move = (dragKey: string, hoverKey: string): void => {
    const newOrder: string[] = this.state.order.slice();
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
    this.setState({
      order: newOrder,
    });
  };

  remove = (targetKey: string) => {
    const newOrder: string[] = [];
    const { children } = this.props;
    React.Children.forEach<ITagNodeProps>(children, c => {
      if (c.key !== targetKey) {
        newOrder.push(c.key);
      }
    });
    console.log(`new order ${newOrder}`);
    this.setState({
      order: newOrder,
    });
  };

  renderTabBar = (
    props: TabsProps,
    DefaultTabBar: React.ComponentClass<TabsProps>,
  ): React.ReactElement => (
    <DefaultTabBar {...props}>
      {(node: any): ReactElement => {
        console.log(node);
        return (
          <WrapTabNode index={node.key} key={node.key} move={this.move}>
            {node}
          </WrapTabNode>
        );
      }}
    </DefaultTabBar>
  );

  render() {
    const { order } = this.state;
    const { children } = this.props;
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
          tabBarGutter={0}
          onEdit={(targetKey, action) => {
            if ('remove' === action) {
              this.props.remove(targetKey.toString());
            }
          }}
          hideAdd
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

export default (props: IProps) => {
  return (
    <DraggableTabs remove={props.remove}>
      {props.paneList.map(o => {
        return (
          <TabPane tab={o.tab} key={o.key}>
            {o.content}
          </TabPane>
        );
      })}
    </DraggableTabs>
  );
};
