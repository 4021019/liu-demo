import React, { ReactInstance } from 'react';
import {
  DndProvider,
  DragSource,
  DropTarget,
  XYCoord,
  DragElementWrapper,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Tabs } from 'antd';
import { findDOMNode } from 'react-dom';
const { TabPane } = Tabs;

const TYPE = 'TAB';

// Drag & Drop node

interface ITagNodeProps {
  connectDragSource: DragElementWrapper<any>;
  connectDropTarget: DragElementWrapper<any>;
  isOver: boolean;
  isDragging: boolean;
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
            border: isDragging ? '1px dashed black' : '',
            background: isDragging ? '' : isOver ? '#A0A0A0' : '',
          },
        },
      }),
    );
  }
}

const sourceSpec = {
  beginDrag(props, monitor, component) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const targetSpec = {
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveTabNode(dragIndex, hoverIndex);
  },
};

const dragMethod = DragSource(TYPE, sourceSpec, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}));

const dropMethod = DropTarget(TYPE, targetSpec, (connect, monitor) => ({
  isOver: monitor.isOver(),
  connectDropTarget: connect.dropTarget(),
}));

const WrapTabNode = dragMethod(dropMethod(TabNode));

class DraggableTabs extends React.Component {
  state = {
    order: [],
  };

  moveTabNode = (dragKey, hoverKey) => {
    const newOrder = this.state.order.slice();
    const { children } = this.props;
    React.Children.forEach(children, c => {
      if (newOrder.indexOf(c.key) === -1) {
        newOrder.push(c.key);
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

  renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props}>
      {node => {
        return (
          <WrapTabNode
            key={node.key}
            index={node.key}
            moveTabNode={this.moveTabNode}
          >
            {node}
          </WrapTabNode>
        );
      }}
    </DefaultTabBar>
  );

  render() {
    const { order } = this.state;
    const { children } = this.props;

    const tabs: any = [];
    React.Children.forEach(children, c => {
      tabs.push(c);
    });

    const orderTabs = tabs.slice().sort((a, b) => {
      console.log(a);
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

/**
 * tab 面板参数类型
 */
interface IPane {
  tab: string;
  key: string;
  content: any;
}

/**
 * 组件参数类型
 */
interface IProps {
  paneList: IPane[];
}

export default (props: IProps) => {
  return (
    <DraggableTabs>
      {props.paneList.map(o => (
        <TabPane tab={o.tab} key={o.key}>
          {o.content}
        </TabPane>
      ))}
    </DraggableTabs>
  );
};
