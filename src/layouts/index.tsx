import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import { Anchor, Layout, Menu, Switch, Tree } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';


const { Header, Content, Footer, Sider } = Layout;


export default (props: React.Props<any>) => {

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
              onClick={() => {
                alert('waiting')
              }}
            >
              创建代码块
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout" style={{ 
          marginLeft: 200 ,
        }}>
          <Content
            style={{
              margin: '24px 16px 0',
              overflow: 'initial',
            }}
          >
            <div
              className="site-layout-background"
            >
              {props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Anchor>
  );
};
