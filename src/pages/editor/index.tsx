import PageTab from '@/components/PageTab';
import SwitchEditor from '@/components/SwitchEditor';
import { fs, os } from '@/config/SystemConfig.ts';
import { fileId } from '@/util/FileUtil';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Switch, Tabs, Empty } from 'antd';
import React from 'react';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const d = fs.readFileSync(os.homedir() + '/test.json', 'utf-8');

interface IState {
  renderMerge: boolean;
  paneList: any;
}
const gridStyle = {
  width: '100%',
  textAlign: 'center',
};

export default class PageEditor extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      renderMerge: false,
      paneList: [],
    };
  }

  add = (): void => {
    let key = fileId();
    this.state.paneList.push({
      tab: key,
      key: key,
      content: <SwitchEditor />,
    });
    this.setState({
      paneList: this.state.paneList,
    });
  };

  remove = (targetKey: string): void => {
    this.state.paneList;
    let index = 0;
    for (; index < this.state.paneList.length; index++) {
      const element = this.state.paneList[index];
      if (element.key === targetKey) {
        break;
      }
    }
    this.state.paneList.splice(index, 1);
    this.setState({
      ...this.state,
      paneList: this.state.paneList,
    });
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
          {this.state.paneList.length > 0 ? (
            <PageTab remove={this.remove} paneList={this.state.paneList} />
          ) : (
            <Empty
              description="点击左上角[+]创建新的文件"
              style={{
                lineHeight: '80vh',
              }}
            />
          )}
        </Content>
      </Layout>
    );
  }
}
