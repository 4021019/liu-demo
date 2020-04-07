import CodeEditor from '@/components/CodeEditor';
import { fs, os } from '@/config/SystemConfig.ts';
import { Layout, Switch, Row, Col } from 'antd';
import React from 'react';

const { Header, Sider, Content } = Layout;
const d = fs.readFileSync(os.homedir() + '/test.json', 'utf-8');

interface IState {
  renderMerge: boolean;
}

export default class PageEditor extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderMerge: false,
    };
  }

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
            </Col>
          </Row>
        </Header>
        <Content>
          <CodeEditor
            value={d.toString()}
            renderMerge={this.state.renderMerge}
          />
        </Content>
      </Layout>
    );
  }
}
