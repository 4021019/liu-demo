import * as cdm from 'codemirror';
import './merge.less';
import 'codemirror/addon/merge/merge.js';
import './codemirror.less';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/material.css';
import React, { createRef } from 'react';
import { Button } from 'antd';
import ReactDOM from 'react-dom';
import { Controlled as CodeMirror } from 'react-codemirror2';
import './x.js';
import { systemConfig } from '@/config/SystemConfig';

console.log(systemConfig)

export default class Test extends React.Component<any, any> {
  private mergeRef: any;
  private merge?: cdm.MergeView.MergeViewEditor;
  constructor(props: any) {
    super(props);
    this.state = {
      value: '',
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
      this.merge.rightOriginal().setValue('liuwentao');
    }
  }

  render() {
    return (
      <div
        style={{
          textAlign: 'left',
        }}
      >
        <Button
          type="primary"
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
          Primary
        </Button>
        {this.state.show && (
          <CodeMirror
            value={this.state.value}
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
      </div>
    );
  }
}
