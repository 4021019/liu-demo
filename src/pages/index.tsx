import CodeEditor from '@/components/CodeEditor';
import { fs, os } from '@/config/SystemConfig.ts';
import { Layout, Switch, Row, Col, Tabs } from 'antd';
import React from 'react';
import { Rnd } from 'react-rnd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
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
          <DndProvider backend={HTML5Backend}>
            <Tabs activeKey={'1'} type="editable-card" onEdit={this.onEdit}>
              <TabPane tab={'tableName'} key={'1'} closable={true}>
                <CodeEditor
                  value={d.toString()}
                  renderMerge={this.state.renderMerge}
                />
              </TabPane>
            </Tabs>
          </DndProvider>
          {/* <Rnd
            className="line"
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 200,
            }}
          >
            Rnd1
          </Rnd>
          <Rnd
            className="line"
            default={{
              x: 320,
              y: 0,
              width: 320,
              height: 200,
            }}
          >
            Rnd2
          </Rnd> */}
        </Content>
      </Layout>
    );
  }
}
