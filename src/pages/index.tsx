import Test from '@/components/Test';
import { Layout } from 'antd';
import MarkdownIt from 'markdown-it';
import React from 'react';
const { Header, Sider, Content } = Layout;
var md = new MarkdownIt();

export default () => {
  return (
    // <div
    //  dangerouslySetInnerHTML={{
    //       __html: md.render('# markdown-it rulezz! '),
    //  }}
    // ></div>
    <Test name="liuwentao">123123</Test>
  );
};
