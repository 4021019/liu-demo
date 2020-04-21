import PageTab from '@/components/PageTab';
import SwitchEditor from '@/components/SwitchEditor';
import { fs, os } from '@/config/SystemConfig.ts';
import { fileId } from '@/util/FileUtil';
import { PlusSquareOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Switch, Tabs, Empty } from 'antd';
import React from 'react';
import { connect, useDispatch } from 'umi';
import { IEditorModelProps } from '@/models/editor';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const d = fs.readFileSync(os.homedir() + '/test.json', 'utf-8');

interface IState {
  renderMerge: boolean;
}
const gridStyle = {
  width: '100%',
  textAlign: 'center',
};

const PageEditor = (props: IEditorModelProps, state: IState) => {
  const dispatch = useDispatch();

  const updatePaneList = (list: any[]): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        ...props.editor,
        paneList: list,
      },
    });
  };

  const updateOrder = (list: string[]): void => {
    dispatch({
      type: 'editor/update',
      payload: {
        ...props.editor,
        order: list,
      },
    });
  };

  const add = (): void => {
    let key = fileId();
    props.editor.paneList.push({
      tab: key,
      key: key,
      content: <SwitchEditor type="new" />,
    });
    updatePaneList(props.editor.paneList);
  };
  const remove = (targetKey: string): void => {
    let index = 0;
    for (; index < props.editor.paneList.length; index++) {
      const element = props.editor.paneList[index];
      if (element.key === targetKey) {
        break;
      }
    }
    props.editor.paneList.splice(index, 1);
    updatePaneList(props.editor.paneList);
  };
  console.log(props.editor);
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
                // this.setState({
                //   renderMerge: !this.state.renderMerge,
                // });
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
              onClick={add}
            >
              <PlusSquareOutlined />
            </div>
          </Col>
        </Row>
      </Header>
      <Content>
        {props.editor.paneList.length > 0 ? (
          <PageTab
            order={props.editor.order}
            remove={remove}
            update={updateOrder}
            paneList={props.editor.paneList}
          />
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
};
export default connect((module: IEditorModelProps) => ({
  editor: module.editor,
}))(PageEditor);
