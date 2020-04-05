import * as cdm from 'codemirror';
import './merge.less';
import './codemirror.less';
import './diff_match_patch.js';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/material.css';
import React, { createRef } from 'react';
import { Button } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { Layout, Menu, Breadcrumb, Switch, notification } from 'antd';
import { SettingFilled } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

export default class CodeEditor extends React.Component<any, any> {
  private mergeRef: any;
  private merge?: cdm.MergeView.MergeViewEditor;
  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value,
      show: true,
      isMergeRender: false,
    };
    this.mergeRef = createRef();
  }

  componentDidUpdate() {
    !this.state.show && !this.state.isMergeRender && this.createMerge();
  }

  componentDidMount() {}

  private createMerge() {
    {
      this.setState({
        isMergeRender: true,
      });
      const mergeOptions: cdm.MergeView.MergeViewEditorConfiguration = {
        value: this.state.value,
        origRight: '',
        lineNumbers: true,
        collapseIdentical: 2,
        allowEditingOriginals: false,
        orig: null,
      };
      console.log(this.mergeRef.current);
      this.merge = cdm.MergeView(this.mergeRef.current, mergeOptions);
      this.merge.editor().on('change', (editor, data) => {
        let value = editor.getValue();
        this.setState({ value });
      });
      this.merge.editor().setOption('theme', 'material');
      this.merge.rightOriginal().setOption('theme', 'material');
      console.log(this.state.value);
      this.merge.rightOriginal().setValue(this.state.value);
    }
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
          <div
            className="line"
            style={{
              height: '100%',
              width: '40px',
              textAlign: 'center',
              lineHeight: '40px',
              textAnchor: 'middle',
            }}
            onClick={e => {
              const reply = window
                .require('electron')
                .ipcRenderer.sendSync('synchronous-message', 'ping');
              console.log(reply);
              this.setState({
                show: !this.state.show,
              });
              console.log(this.state.show);
              !this.state.show &&
                this.setState({
                  isMergeRender: false,
                });
              !this.state.show && require('@/layouts/theme.less');
            }}
          >
            <Switch size="small" defaultChecked />
            {/* <SettingFilled /> */}
          </div>
        </Header>
        <Content>
          {this.state.show && (
            <CodeMirror
              value={this.state.value}
              onKeyDown={(m, e) => {
                console.log(e);
                if (e.metaKey && e.keyCode === 83) {
                  notification.open({
                    key: 'save',
                    message: '保存成功',
                    description: 'nice',
                    duration: 1,
                    onClick: () => {
                      console.log('Notification Clicked!');
                    },
                  });
                }
              }}
              options={{
                mode: 'text/x-java',
                theme: 'material',
                lineNumbers: true,
              }}
              onBeforeChange={(editor, data, value) => {
                this.setState({ value });
                this.merge ? this.merge.editor().setValue(value) : null;
              }}
              onChange={(editor, data, value) => {}}
            />
          )}
          {!this.state.show && <div ref={this.mergeRef} />}
        </Content>
      </Layout>
    );
  }
}
