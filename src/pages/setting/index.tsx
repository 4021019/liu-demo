import { systemConfig, fs, path } from '@/config/SystemConfig';
import { Divider, List } from 'antd';
import React from 'react';

export default () => {
  const data = new Array();
  data.push(`homedir: ${systemConfig.homedir}`);
  data.push(`configname: ${systemConfig.configname}`);
  data.push(`baseconfig: ${JSON.stringify(systemConfig.baseconfig)}`);
  data.push(`baseconfig: ${systemConfig.charset}`);
  return (
    <div
      style={{
        border: '1px solid grey',
      }}
    >
      <Divider orientation="left">系统配置</Divider>
      <List
        header={<div>...</div>}
        footer={<div>...</div>}
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </div>
  );
};
