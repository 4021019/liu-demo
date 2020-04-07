import * as cdm from 'codemirror';
import './merge.less';
import './codemirror.less';
import './diff_match_patch.js';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/theme/material.css';
import 'codemirror/theme/idea.css';

import React, { createRef } from 'react';
import { Button } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { Layout, Menu, Breadcrumb, Switch, notification } from 'antd';
import { SettingFilled } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

interface IState {
  value: string;
  isRenderMerge: boolean;
}

interface IProps {
  value: string;
  renderMerge: boolean;
  onScroll?: any;
}

export default class CodeEditor extends React.Component<IProps, IState> {
  private mergeRef: any;
  private merge?: cdm.MergeView.MergeViewEditor;
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: props.value,
      isRenderMerge: this.props.renderMerge,
    };
    this.mergeRef = createRef();
  }

  componentDidUpdate() {
    this.createMerge();
  }

  componentDidMount() {
    this.createMerge();
  }

  createMerge = () => {
    if (this.props.renderMerge && this.state.isRenderMerge) {
      this.setState({
        isRenderMerge: false,
      });
    }
    if (!this.props.renderMerge && !this.state.isRenderMerge) {
      this.setState({
        isRenderMerge: true,
      });
      const mergeOptions: cdm.MergeView.MergeViewEditorConfiguration = {
        value: this.state.value,
        origRight: this.state.value,
        lineNumbers: true,
        collapseIdentical: 2,
        allowEditingOriginals: false,
        orig: null,
      };
      this.merge = cdm.MergeView(this.mergeRef.current, mergeOptions);
      this.merge.editor().on('change', (editor, data) => {
        let value = editor.getValue();
        this.setState({ value });
      });
      this.merge.editor().setOption('theme', 'material');
      this.merge.rightOriginal().setOption('theme', 'material');
    }
  };
  render() {
    return (
      <div>
        {this.props.renderMerge ? (
          <CodeMirror
            onScroll = {this.props.onScroll}
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
        ) : (
          <div ref={this.mergeRef} />
        )}
      </div>
    );
  }
}
