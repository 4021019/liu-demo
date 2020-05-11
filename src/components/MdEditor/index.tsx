import CodeEditor from '@/components/CodeEditor';
import { Col, Row } from 'antd';
import React, { createRef } from 'react';
import MdRender from '../MdRender';
import './style.less';
import { IProps, IState } from './type.js';

export default class MdEditor extends React.Component<IProps, IState> {
  private editRef: any = createRef();
  private codeEdt: any;
  constructor(props: IProps) {
    super(props);
    this.state = {
      text: this.props.value,
    };
  }

  render() {
    const { saveValue } = this.props;
    return (
      <div>
        <Row>
          <Col span={12}>
            <CodeEditor
              setInstance={e => (this.codeEdt = e)}
              theme="idea"
              mode="text/x-markdown"
              changeValue={value => {
                this.setState({
                  text: value,
                });
              }}
              saveValue={saveValue}
              onScroll={() => {
                // console.log('123123');
                console.log(this.codeEdt.getLine(0));
                // this.codeEdt.setSelection({line:0, ch: 0}, {line:0, ch: 9999})
              }}
              ref={this.editRef}
              value={this.state.text}
              renderMerge={true}
            />
          </Col>
          <Col span={12}>
            <div className="md-view-container">
              <MdRender
                onEdit={lineNumber => {
                  if (lineNumber !== undefined) {
                    this.codeEdt.setSelection(
                      { line: lineNumber, ch: 0 },
                      { line: lineNumber },
                    );
                    return this.codeEdt.getSelection();
                  }
                  return undefined;
                }}
                onChange={(src, target, lineNumber) => {
                  if (lineNumber !== undefined) {
                    this.codeEdt.setSelection(
                      { line: lineNumber, ch: 0 },
                      { line: lineNumber },
                    );
                    this.codeEdt.replaceSelection(target, src);
                  }
                }}
                value={this.state.text}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
