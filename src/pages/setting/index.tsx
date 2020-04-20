import { Divider, List } from 'antd';
import React from 'react';
import { connect, ISettingModelProps } from 'umi';

interface IProps extends ISettingModelProps {}

class SettingPage extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log(this.props);
    const data = new Array();
    data.push(`homedir: ${this.props.setting.homedir}`);
    data.push(`configname: ${this.props.setting.configname}`);
    data.push(`baseconfig: ${JSON.stringify(this.props.setting.baseconfig)}`);
    data.push(`baseconfig: ${this.props.setting.charset}`);
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
  }
}

export default connect((module: ISettingModelProps) => ({
  setting: module.setting,
}))(SettingPage);
