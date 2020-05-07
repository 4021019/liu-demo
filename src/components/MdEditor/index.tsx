import CodeEditor from '@/components/CodeEditor';
import { Col, Row } from 'antd';
import MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import React, { createRef } from 'react';
import './style.less';
import { IProps, IState } from './type.js';
import { escapeHtml, unescapeAll } from './utils.js';

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
    const { info } = token;
    const renderAttrs = slf.renderAttrs(tmpToken as Token);
    return `<div class = "line" >${info}</div><pre class = "line" data-line = "${tokens[idx].map[0]}"><code ${renderAttrs}>${highlighted}</code></pre>\n`;
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
    const rd = new Renderer();
    const nice: any = {
      rules: {},
    };
    // nice.rules.heading_open = nice.rules.paragraph_open = line;
    nice.rules.fence = function(tokens, idx, options, env, slf) {
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
          options.highlight(token.content, langName) ||
          escapeHtml(token.content);
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
        const { info } = token;
        const renderAttrs = slf.renderAttrs(tmpToken as Token);
        return (
          <pre className="line" data-line={tokens[idx].map[0]}>
            <code {...renderAttrs}>{highlighted}</code>
          </pre>
        );
      }
      return (
        <pre className="line" data-line={tokens[idx].map[0]}>
          <code {...slf.renderAttrs(token)}>{highlighted}</code>
        </pre>
      );
    };

    const tokens: Token[] = md.parse(this.state.text, { breaks: true });

    // console.log(tokens);

    interface c {
      step: number;
      content?: any;
    }

    const render = (index: number, array: Token[], stop: boolean): c => {
      let step = 0;
      let i = index;
      let t: Token[] = [];
      let children: any[] = [];
      for (; i < array.length; i++) {
        const token = array[i];
        step++;
        if (token.type === 'inline') {
          children.push(
            <div
              dangerouslySetInnerHTML={{
                __html: rd.renderInline(token.children, {}, {}),
              }}
            />,
          );
        } else if (nice.rules[token.type]) {
          // return {
          //   step: step,
          //   content: nice.rules[token.type](array, index, {}, {}, rd),
          // };
          children.push(nice.rules[token.type](array, i, {}, {}, rd));
        } else {
          if (token.nesting == 1) {
            const c = render(i + 1, array, true);
            step += c.step;
            children.push(c.content);
            i += c.step;
            continue;
          }
          if (token.nesting == 0) {
            children.push(token.content);
          }
          if (token.nesting == -1 && stop) {
            let currentContent = <span>{children}</span>;
            if (token.tag == 'p') {
              currentContent = <pre>{children}</pre>;
            }
            if (token.tag == 'td') {
              currentContent = <td>{children}</td>;
            }
            if (token.tag == 'table') {
              currentContent = <table className="md-table">{children}</table>;
            }
            if (token.tag == 'tbody') {
              currentContent = <tbody>{children}</tbody>;
            }
            if (token.tag == 'thead') {
              currentContent = <thead>{children}</thead>;
            }
            if (token.tag == 'tr') {
              currentContent = <tr>{children}</tr>;
            }
            if (token.tag == 'th') {
              currentContent = <th>{children}</th>;
            }
            if (token.tag == 'li') {
              currentContent = <li>{children}</li>;
            }
            if (token.tag == 'ul') {
              currentContent = <ul>{children}</ul>;
            }
            if (token.tag == 'ol') {
              currentContent = <ol>{children}</ol>;
            }
            if (token.tag == 'h2') {
              currentContent = <h2>{children}</h2>;
            }
            if (token.tag == 'blockquote') {
              currentContent = (
                <blockquote className="md-blockquote">{children}</blockquote>
              );
            }
            return {
              step: step,
              content: currentContent,
            };
          }
        }
      }
      return {
        step: step,
        content: <div>{children}</div>,
      };
    };
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
              {render(0, tokens, false).content}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
