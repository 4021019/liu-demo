import CodeEditor from '@/components/CodeEditor';
import { Col, Row } from 'antd';
import React, { createRef } from 'react';
import MdRender from '../MdRender';
import './style.less';
import { IProps, IState } from './type.js';

export default class MdEditor extends React.Component<IProps, IState> {
  private editRef: any = createRef();
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
              }}
              ref={this.editRef}
              value={this.state.text}
              renderMerge={true}
            />
          </Col>
          <Col span={12}>
            <div className="md-view-container">
              <MdRender value={this.state.text} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
