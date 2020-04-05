import CodeEditor from '@/components/CodeEditor';
import { Layout } from 'antd';
import MarkdownIt from 'markdown-it';
import React from 'react';

import { fs, os } from '@/config/SystemConfig.ts';

const { Header, Sider, Content } = Layout;
var md = new MarkdownIt();

const d = fs.readFileSync(
  os.homedir() + '/test.json',
  'utf-8'
);

export default () => {
  return (
    // <div
    //  dangerouslySetInnerHTML={{
    //       __html: md.render('# markdown-it rulezz! '),
    //  }}
    // ></div>
    <CodeEditor value={d.toString()}/>
  );
};
