import Tool from '@/components/EditorTool';
import NativeMenu from '@/components/NativeMenu';
import PageTab from '@/components/PageTab';
import { IPane } from '@/components/PageTab/type';
import { fileId } from '@/util/FileUtil';
import { createItem, createSepItem } from '@/util/MenuUtil';
import {
  PlusSquareOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Form,
  Input,
  Layout,
  Row,
  Switch,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import _ from 'lodash';
import React from 'react';
import { connect, Loading } from 'umi';
import { IEditorModelState, IProps, IState } from './type';
import './style.less';

const { Header, Content, Sider } = Layout;

class PageEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();

  constructor(props: IProps) {
    super(props);
    this.state = {
      menuDrawer: false,
    };
  }

  updateOne = (key: string, content: any): void => {
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
    const content: IPane = {
      tab: 'NEW FILE',
      key: key,
      type: 'new',
      updateContent: this.updateOne,
      value: '',
      createDate: new Date().toString(),
    };
    newMap.delete(key);
    newMap.set(key, {
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

  delete = (targetKey: string): void => {
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
        type: 'editor/deleteByKey',
        payload: {
          key: targetKey,
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
    const { paneMap } = this.props.editor;
    let { activeKey, order } = this.props.editor;
    if (paneMap.size === 1) {
      activeKey = paneMap.keys().next().value;
    }
    this.setState({
      menuDrawer: true,
    });
    this.formRef.current?.setFieldsValue({
      key: activeKey,
      tab: paneMap.get(activeKey)?.tab,
    });
  };

  render() {
    const { paneMap } = this.props.editor;
    const { menuDrawer } = this.state;
    let { activeKey, order } = this.props.editor;
    if (paneMap.size === 1) {
      activeKey = paneMap.keys().next().value;
    }
    const cunrrent = paneMap.get(activeKey);
    const init = {
      key: activeKey ? activeKey : '',
      tab: cunrrent?.tab ? cunrrent.tab : '',
    };
    return (
      <div>
        <Drawer
          title="文档基础信息"
          placement="right"
          width="40%"
          closable={true}
          onClose={this.closeMenuDrawer}
          visible={menuDrawer}
        >
          <Form
            ref={this.formRef}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="basic"
            initialValues={init}
          >
            <Form.Item label="文件key" name="key">
              <Input disabled />
            </Form.Item>
            <Form.Item label="标题" name="tab">
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  const data = this.formRef.current?.getFieldsValue();
                  if (data) {
                    this.updateOne(activeKey, data);
                  }
                }}
              >
                更新
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
        <Layout>
          <Sider
            theme="light"
            style={{
              overflow: 'auto',
              height: '100vh',
              left: 0,
            }}
            // collapsed={this.state.collapsed}
            //width={this.state.x1}
          >
            {Array.from(this.props.editor.category).map(o => {
              return (
                <Card
                  className="category-card"
                  key={o.key}
                  onClick={() => {
                    const { dispatch, editor } = this.props;
                    if (dispatch) {
                      dispatch({
                        type: 'editor/loadByKey',
                        payload: {
                          key: o.key,
                        },
                      });
                    }
                  }}
                >
                  <NativeMenu
                    items={[
                      createItem({
                        label: o.key,
                        enabled: false,
                      }),
                      createSepItem(),
                      createItem({
                        label: '删除文件',
                        click: () => {
                          this.delete(o.key);
                        },
                      }),
                    ]}
                  >
                    <p className="category-card-line category-card-inner">
                      <strong>{o.tab}</strong>
                    </p>
                    <p className="category-card-date category-card-inner">
                      <small>{o.createDate}</small>
                    </p>
                    <p className="category-card-tag category-card-inner">
                      <small>[{o.type}]</small>
                    </p>
                  </NativeMenu>
                </Card>
              );
            })}
          </Sider>
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
                  <Tool onClick={() => {}}>
                    <Switch size="small" defaultChecked />
                  </Tool>
                  <Tool onClick={this.add}>
                    <PlusSquareOutlined />
                  </Tool>
                  <Tool onClick={this.openMenuDrawer}>
                    <SettingOutlined />
                  </Tool>
                  <Tool>
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
