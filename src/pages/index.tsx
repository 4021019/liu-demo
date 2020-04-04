import CodeEditor from '@/components/CodeEditor';
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
    <CodeEditor name="liuwentao">123123</CodeEditor>
  );
};
