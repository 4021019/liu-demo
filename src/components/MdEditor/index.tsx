import CodeEditor from '@/components/CodeEditor';
import { Col, Row } from 'antd';
import MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import React, { createRef } from 'react';
import { escapeHtml, unescapeAll } from './utils.js';
import './style.less';
import { IProps, IState } from './type.js';

var md = new MarkdownIt();

const line = (
  tokens: Token[],
  idx: number,
  options: any,
  env: any,
  slf: Renderer,
) => {
  var line;
  if (tokens[idx].map && tokens[idx].level === 0) {
    line = tokens[idx].map[0];
    tokens[idx].attrJoin('class', 'line');
    tokens[idx].attrSet('data-line', String(line));
  }
  return slf.renderToken(tokens, idx, options);
};

md.renderer.rules.heading_open = md.renderer.rules.paragraph_open = line;
md.renderer.rules.fence = function(tokens, idx, options, env, slf) {
  var token = tokens[idx],
    info = token.info ? unescapeAll(token.info).trim() : '',
    langName = '',
    highlighted,
    i,
    tmpAttrs,
    tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (options.highlight) {
    highlighted =
      options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .clone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push(['class', options.langPrefix + langName]);
    } else {
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs,
    };

    return (
      `<pre class = "line" data-line = "${tokens[idx].map[0]}"><code` +
      slf.renderAttrs(tmpToken as Token) +
      '>' +
      highlighted +
      '</code></pre>\n'
    );
  }

  return (
    `<pre class = "line" data-line = "${tokens[idx].map[0]}"><code` +
    slf.renderAttrs(token) +
    '>' +
    highlighted +
    '</code></pre>\n'
  );
};

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
                console.log('123123');
              }}
              ref={this.editRef}
              value={this.state.text}
              renderMerge={true}
            />
          </Col>
          <Col span={12}>
            <div className="md-view-container">
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(this.state.text),
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
