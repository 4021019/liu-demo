import React, { createRef } from 'react';
import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import Renderer from 'markdown-it/lib/renderer';
import { unescapeAll, escapeHtml } from './utils.js';
import { Row, Col } from 'antd';
import CodeEditor from '@/components/CodeEditor';

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
    console.log(tokens[idx]);
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
      slf.renderAttrs(tmpToken) +
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

const text = '# markdown-it rulezz! \n```\n12312312\n123123\n```';

export default class MdEditor extends React.Component<any, any> {
  private editRef: any = createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      text: '',
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            <CodeEditor
              mode="text/x-markdown"
              changeValue={value => {
                this.setState({
                  text: value,
                });
              }}
              saveValue={() => true}
              onScroll={() => {
                console.log('123123');
              }}
              ref={this.editRef}
              value={this.state.text}
              renderMerge={true}
            />
          </Col>
          <Col span={12}>
            <div
              dangerouslySetInnerHTML={{
                __html: md.render(this.state.text),
              }}
            ></div>
          </Col>
        </Row>
      </div>
    );
  }
}
