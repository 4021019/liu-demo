import PageTab, { IPane } from '@/components/PageTab';
import { fs, os } from '@/config/SystemConfig.ts';
import { IEditorModelProps } from '@/models/page-editor';
import { fileId } from '@/util/FileUtil';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Col, Empty, Layout, Row, Switch, Tabs } from 'antd';
import React from 'react';
import { connect, useDispatch } from 'umi';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const d = fs.readFileSync(os.homedir() + '/test.json', 'utf-8');

interface IState {
  renderMerge: boolean;
}
const gridStyle = {
  width: '100%',
  textAlign: 'center',
};

const PageEditor = (props: IEditorModelProps) => {
  const dispatch = useDispatch();

  /**
   * 更新 tab 页面内容
   * @param list 新list
   */
  const updatePaneMap = (map: Map<String, IPane>): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        ...props.editor,
        paneMap: map,
      },
    });
  };

  const updateContent = (key: string, content: IPane): void => {
    console.log(key);
    const newMap = props.editor.paneMap;
    const old = newMap.get(key);
    newMap.delete(key);
    newMap.set(key, {
      ...old,
      ...content,
    });
    updatePaneMap(newMap);
  };

  /**
   * 更新 tab 页面顺序
   * @param list 新顺序
   */
  const updateOrder = (list: string[]): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        ...props.editor,
        order: list,
      },
    });
  };

  /**
   * 增加 tab 页节点
   */
  const add = (): void => {
    const key = fileId();
    updateContent(key, {
      tab: key,
      key: key,
      type: 'new',
      updateContent: updateContent,
      // value: 'testValue',
    });
  };

  /**
   * 删除 tab 页节点
   * @param targetKey tab页key
   */
  const remove = (targetKey: string): void => {
    const newMap = props.editor.paneMap;
    // const newList = [...props.editor.paneList];
    // let index = 0;
    // for (; index < props.editor.paneList.length; index++) {
    //   const element = props.editor.paneList[index];
    //   if (element.key === targetKey) {
    //     break;
    //   }
    // }
    // newList.splice(index, 1);
    newMap.delete(targetKey);
    updatePaneMap(newMap);
  };
  return (
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
            <div
              className="line"
              style={{
                width: '40px',
                float: 'left',
                textAlign: 'center',
                lineHeight: '40px',
                textAnchor: 'middle',
              }}
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
            </div>
            <div
              className="line"
              style={{
                width: '40px',
                float: 'left',
                textAlign: 'center',
                lineHeight: '40px',
                textAnchor: 'middle',
              }}
              onClick={add}
            >
              <PlusSquareOutlined />
            </div>
          </Col>
        </Row>
      </Header>
      <Content>
        {props.editor.paneMap.size > 0 ? (
          <PageTab
            order={props.editor.order}
            remove={remove}
            updateOrder={updateOrder}
            updateContent={updateContent}
            paneList={Array.from(props.editor.paneMap.values())}
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
  );
};

export default connect((module: IEditorModelProps) => ({
  editor: module.editor,
}))(PageEditor);
