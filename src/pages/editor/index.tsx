import Tool from '@/components/EditorTool';
import PageTab from '@/components/PageTab';
import { IPane } from '@/components/PageTab/type';
import { fileId } from '@/util/FileUtil';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Col, Drawer, Empty, Layout, Row, Switch } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect, useDispatch } from 'umi';
import { IEditorModelProps } from './type';

const { Header, Content } = Layout;

const PageEditor = (props: IEditorModelProps) => {
  const dispatch = useDispatch();

  const updateOne = (key: string, content: IPane): void => {
    dispatch({
      type: 'editor/updateOne',
      payload: {
        key: key,
        content: content,
      },
    });
  };

  const setActive = (key: string): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        activeKey: key,
      },
    });
  };

  /**
   * 更新 tab 页面顺序
   * @param list 新顺序
   */
  const updateOrder = (list: string[]): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        order: list,
      },
    });
  };

  /**
   * 增加 tab 页节点
   */
  const add = (): void => {
    const key = fileId();
    const { order } = props.editor;
    const newMap = _.clone(props.editor.paneMap);
    const old = newMap.get(key);
    const content = {
      tab: key,
      key: key,
      type: 'new',
      updateContent: updateOne,
      value: 'testValue',
    };
    newMap.delete(key);
    newMap.set(key, {
      ...old,
      ...content,
    });
    dispatch({
      type: 'editor/update',
      payload: {
        activeKey: key,
        paneMap: newMap,
        order: [...order, key],
      },
    });
  };

  /**
   * 删除 tab 页节点
   * @param targetKey tab页key
   */
  const remove = (targetKey: string): void => {
    const { paneMap, order } = props.editor;
    const newMap = _.clone(paneMap);
    const newOrder = [...order];
    _.remove(newOrder, o => o === targetKey);
    newMap.delete(targetKey);
    dispatch({
      type: 'editor/update',
      payload: {
        activeKey: order.filter((o, i, arr) => arr[i + 1] === targetKey)[0],
        order: newOrder,
        paneMap: newMap,
      },
    });
  };

  const { paneMap } = props.editor;
  let { activeKey, order } = props.editor;
  if (paneMap.size === 1) {
    activeKey = paneMap.keys().next().value;
  }
  return (
    <div>
      <Drawer
        title="文档基础信息"
        placement="right"
        closable={true}
        visible={false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Layout>
        <Header
          style={{
            padding: '0px',
            height: '40px',
            backgroundColor: 'white',
            paddingTop: '0px',
          }}
        >
          <Row>
            <Col span={24}>
              <Tool
                onClick={e => {
                  const reply = window
                    .require('electron')
                    .ipcRenderer.sendSync('synchronous-message', 'ping');
                  // this.setState({
                  //   renderMerge: !this.state.renderMerge,
                  // });
                }}
              >
                <Switch size="small" defaultChecked />
              </Tool>
              <Tool onClick={add}>
                <PlusSquareOutlined />
              </Tool>
            </Col>
          </Row>
        </Header>
        <Content>
          {paneMap.size > 0 ? (
            <PageTab
              setActive={setActive}
              order={order}
              activeKey={activeKey}
              remove={remove}
              updateOrder={updateOrder}
              updateContent={updateOne}
              paneList={Array.from(paneMap.values())}
            />
          ) : (
            <Empty
              description="点击左上角[+]创建新的文件"
              style={{
                lineHeight: '80vh',
              }}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default connect((module: IEditorModelProps) => ({
  editor: module.editor,
}))(PageEditor);
