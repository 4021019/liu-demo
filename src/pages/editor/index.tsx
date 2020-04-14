import CodeEditor from '@/components/CodeEditor';
import PageTab from '@/components/PageTab';
import { fs, os } from '@/config/SystemConfig.ts';
import { Col, Layout, Row, Switch, Tabs } from 'antd';
import React from 'react';
import { fileId } from '@/util/FileUtil';

import { PlusSquareOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const d = fs.readFileSync(os.homedir() + '/test.json', 'utf-8');

interface IState {
  renderMerge: boolean;
  paneList: any;
}

export default class PageEditor extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderMerge: false,
      paneList: [
        {
          tab: 'liuwentao',
          key: '1',
          content: <CodeEditor value={d.toString()} renderMerge={false} />,
        },
        {
          tab: 'liuwentao2',
          key: '2',
          content: <CodeEditor value={d.toString()} renderMerge={false} />,
        },
      ],
    };
  }

  add = () => {
    this.state.paneList.push({
      tab: 'new file',
      key: fileId(),
      content: <div>123</div>,
    });
    this.setState({
      paneList: this.state.paneList,
    });
  };

  onEdit = (targetKey: any, action: string) => {
    // this[action](targetKey);
    console.log(action);
  };

  render() {
    return (
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
              <div
                className="line"
                style={{
                  width: '40px',
                  float: 'left',
                  textAlign: 'center',
                  lineHeight: '40px',
                  textAnchor: 'middle',
                }}
                onClick={e => {
                  const reply = window
                    .require('electron')
                    .ipcRenderer.sendSync('synchronous-message', 'ping');
                  this.setState({
                    renderMerge: !this.state.renderMerge,
                  });
                }}
              >
                <Switch size="small" defaultChecked />
              </div>
              <div
                className="line"
                style={{
                  width: '40px',
                  float: 'left',
                  textAlign: 'center',
                  lineHeight: '40px',
                  textAnchor: 'middle',
                }}
                onClick={this.add}
              >
                <PlusSquareOutlined />
              </div>
            </Col>
          </Row>
        </Header>
        <Content>
          <PageTab paneList={this.state.paneList} />
        </Content>
      </Layout>
    );
  }
}
