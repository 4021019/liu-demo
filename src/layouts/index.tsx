import { SmileOutlined, UserOutlined } from '@ant-design/icons';
import { Anchor, Button, Layout, Menu, notification, Result } from 'antd';
import React from 'react';
import { Rnd } from 'react-rnd';
import { connect, history, ILayoutModelProps, getDvaApp } from 'umi';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class MyLayout extends React.Component<any, any> {
  private rnd: any;
  constructor(props: any) {
    super(props);
    this.state = {
      x1: 195,
      x2: 200,
      collapsed: false,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toggleMin = () => {
    this.setWidth(80);
    this.close();
  };

  close = () => {
    if (!this.state.collapsed) {
      this.setState({
        collapsed: true,
      });
    }
  };

  open = () => {
    if (this.state.collapsed) {
      this.setState({
        collapsed: false,
      });
    }
  };

  setWidth = (w: number) => {
    this.setState({
      x1: w,
      x2: w + 5,
    });
  };

  render() {
    return (
      <div>
        {this.props.location.pathname === '/' ? (
          <Result
            style={{
              paddingTop: '150px',
            }}
            icon={<SmileOutlined />}
            title="Hello World"
            extra={
              <Button
                onClick={() => {
                  history.push('/editor');
                }}
                type="primary"
              >
                Start
              </Button>
            }
          />
        ) : (
          <Anchor>
            <Rnd
              className="drag-and-drop"
              ref={c => {
                this.rnd = c;
              }}
              dragAxis="x"
              bounds="parent"
              position={{ x: this.state.x1, y: 0 }}
              enableResizing={{}}
              size={{ width: '5px', height: '100vh' }}
              onDragStop={(e, d) => {
                if (d.x <= 100) {
                  this.toggleMin();
                } else {
                  this.setWidth(d.x);
                  this.open();
                }
              }}
            />
            <Layout>
              <Sider
                theme="light"
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  left: 0,
                }}
                collapsed={this.state.collapsed}
                width={this.state.x1}
              >
                <Menu mode="inline" defaultSelectedKeys={['2']}>
                  <Menu.Item key="3" onClick={this.toggleMin}>
                    <UserOutlined />
                    <span>侧边栏收回</span>
                  </Menu.Item>
                  <SubMenu
                    key="sub1"
                    title={
                      <span>
                        <UserOutlined />
                        <span>子菜单测试</span>
                      </span>
                    }
                  >
                    <Menu.Item key="sub1-1">Option 1</Menu.Item>
                    <Menu.Item key="sub1-2">Option 2</Menu.Item>
                  </SubMenu>
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      history.push('/editor');
                    }}
                  >
                    <UserOutlined />
                    <span>代码编辑页面</span>
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    onClick={() => {
                      history.push('/setting');
                    }}
                  >
                    <UserOutlined />
                    <span>setting</span>
                  </Menu.Item>
                  <Menu.Item
                    key="5"
                    onClick={() => {
                      history.push('/move');
                    }}
                  >
                    <UserOutlined />
                    <span>拖拽测试</span>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout
                className="site-layout"
                style={{
                  marginLeft: this.state.x2,
                }}
              >
                <Content
                  style={{
                    overflow: 'initial',
                  }}
                >
                  <div className="site-layout-background">
                    {this.props.children}
                  </div>
                </Content>
              </Layout>
            </Layout>
          </Anchor>
        )}
      </div>
    );
  }
}

export default connect((module: ILayoutModelProps) => ({
  layouts: module.layouts,
}))(MyLayout);
