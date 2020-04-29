import Tool from '@/components/EditorTool';
import PageTab from '@/components/PageTab';
import { IPane } from '@/components/PageTab/type';
import { fileId } from '@/util/FileUtil';
import {
  PlusSquareOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Col, Drawer, Empty, Layout, Row, Switch } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect, Loading } from 'umi';
import { IEditorModelState, IProps, IState } from './type';

const { Header, Content } = Layout;

class PageEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      menuDrawer: false,
    };
  }

  updateOne = (key: string, content: IPane): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'editor/updateOne',
        payload: {
          key: key,
          content: content,
        },
      });
    }
  };

  setActive = (key: string): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'editor/update',
        payload: {
          activeKey: key,
        },
      });
    }
  };

  /**
   * 更新 tab 页面顺序
   * @param list 新顺序
   */
  updateOrder = (list: string[]): void => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'editor/update',
        payload: {
          order: list,
        },
      });
    }
  };

  /**
   * 增加 tab 页节点
   */
  add = (): void => {
    const { dispatch, editor } = this.props;
    const key = fileId();
    const { order } = editor;
    const newMap = _.clone(editor.paneMap);
    const old = newMap.get(key);
    const content = {
      tab: key,
      key: key,
      type: 'new',
      updateContent: this.updateOne,
      value: 'testValue',
    };
    newMap.delete(key);
    newMap.set(key, {
      ...old,
      ...content,
    });
    if (dispatch) {
      dispatch({
        type: 'editor/update',
        payload: {
          activeKey: key,
          paneMap: newMap,
          order: [...order, key],
        },
      });
    }
  };

  /**
   * 删除 tab 页节点
   * @param targetKey tab页key
   */
  remove = (targetKey: string): void => {
    const {
      dispatch,
      editor: { paneMap, order },
    } = this.props;
    const newMap = _.clone(paneMap);
    const newOrder = [...order];
    _.remove(newOrder, o => o === targetKey);
    newMap.delete(targetKey);
    if (dispatch) {
      dispatch({
        type: 'editor/update',
        payload: {
          activeKey: order.filter((o, i, arr) => arr[i + 1] === targetKey)[0],
          order: newOrder,
          paneMap: newMap,
        },
      });
    }
  };

  closeMenuDrawer = (): void => {
    this.setState({
      menuDrawer: false,
    });
  };

  openMenuDrawer = (): void => {
    this.setState({
      menuDrawer: true,
    });
  };

  render() {
    const { paneMap } = this.props.editor;
    const { menuDrawer } = this.state;
    let { activeKey, order } = this.props.editor;
    if (paneMap.size === 1) {
      activeKey = paneMap.keys().next().value;
    }
    return (
      <div>
        <Drawer
          title="文档基础信息"
          placement="right"
          closable={true}
          onClose={this.closeMenuDrawer}
          visible={menuDrawer}
        >
          <p>TODO 这里是文本编辑详情</p>
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
                <Tool onClick={this.add}>
                  <PlusSquareOutlined />
                </Tool>
                <Tool onClick={this.openMenuDrawer}>
                  <SettingOutlined />
                </Tool>
                <Tool
                  onClick={() => {
                    alert('TODO save hai mei zuo');
                  }}
                >
                  <SaveOutlined />
                </Tool>
              </Col>
            </Row>
          </Header>
          <Content>
            {paneMap.size > 0 ? (
              <PageTab
                setActive={this.setActive}
                order={order}
                activeKey={activeKey}
                remove={this.remove}
                updateOrder={this.updateOrder}
                updateContent={this.updateOne}
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
  }
}

export default connect(
  (module: { editor: IEditorModelState; loading: Loading }) => ({
    editor: module.editor,
    loading: module.loading,
  }),
)(PageEditor);
