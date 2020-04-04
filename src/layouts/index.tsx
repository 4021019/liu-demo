import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { Anchor, Layout, Menu, Switch, Tree } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';

const { Link } = Anchor;

const { Header, Content, Footer, Sider } = Layout;

const { TreeNode } = Tree;

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: <CarryOutOutlined />,
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-0-0', icon: <CarryOutOutlined /> },
          { title: 'leaf', key: '0-0-0-1', icon: <CarryOutOutlined /> },
          { title: 'leaf', key: '0-0-0-2', icon: <CarryOutOutlined /> },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-1-0', icon: <CarryOutOutlined /> },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        icon: <CarryOutOutlined />,
        children: [
          { title: 'leaf', key: '0-0-2-0', icon: <CarryOutOutlined /> },
          {
            title: 'leaf',
            key: '0-0-2-1',
            icon: <CarryOutOutlined />,
            switcherIcon: <FormOutlined />,
          },
        ],
      },
    ],
  },
];

export default (props: React.Props<any>) => {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  const onSelect = (selectedKeys:any, info:any) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Anchor>
      <Layout style={{
        border: "1px solid black",
        height: "100%"
      }}>
        <Sider
          theme="light"
          style={{
            backgroundColor: 'green',
            border: '1px solid black',
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item
              key="1"
              onClick={() => {
                history.push('/test');
              }}
            >
              test page
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => {
                history.push('/');
              }}
            >
              home page
            </Menu.Item>
            <Menu.Item
              key="3"
              style={{
                height: 'auto',
              }}
            >
              <div>
                <div style={{ marginBottom: 16 }}>
                  showLine: <Switch checked={showLine} onChange={setShowLine} />
                  <br />
                  <br />
                  showIcon: <Switch checked={showIcon} onChange={setShowIcon} />
                </div>
                <Tree
                  showLine={showLine}
                  showIcon={showIcon}
                  defaultExpandedKeys={['0-0-0']}
                  onSelect={onSelect}
                  treeData={treeData}
                />
              </div>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ 
          marginLeft: 200 ,
          border: "1px solid black",
          height: "100%"
        }}>
          <Content
            style={{
              margin: '24px 16px 0',
              overflow: 'initial',
              border: "1px solid black",
              height: "100%"
            }}
          >
            <div
              className="site-layout-background"
              style={{ padding: 24, textAlign: 'center' }}
            >
              {props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Anchor>
  );
};
