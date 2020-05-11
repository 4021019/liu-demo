import MarkdownIt from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import React from 'react';
import { Input, Row } from 'antd';
import './style.less';
import {
  IMdTokenProps,
  IProps,
  IRenderReturn,
  TypeOnEdit,
  TypeOnChange,
} from './type';
import { escapeHtml, unescapeAll } from './utils.js';
import { stat } from 'fs';

const md = new MarkdownIt();
const rd = new Renderer();
const { TextArea } = Input;

const fence = function(tokens, idx, options, env) {
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
    const renderAttrs = rd.renderAttrs(tmpToken as Token);
    return (
      <pre className="line" data-line={tokens[idx].map[0]}>
        <code {...renderAttrs}>{highlighted}</code>
      </pre>
    );
  }
  return (
    <pre className="line" data-line={tokens[idx].map[0]}>
      <code {...rd.renderAttrs(token)}>{highlighted}</code>
    </pre>
  );
};

const rules: any = {};
rules.fence = fence;
rules.hr = () => {
  return <hr />;
};
rules.softbreak = () => {
  return <br />;
};

rules.image = (tokens, idx, options, env) => {
  const token = tokens[idx];
  return <img {...renderAttrs(token)} />;
};

const renderAttrs = (token: Token) => {
  const a: any = {};
  for (let i = 0, l = token.attrs.length; i < l; i++) {
    a[escapeHtml(token.attrs[i][0])] = escapeHtml(token.attrs[i][1]);
  }
  return a;
};

const render = (
  markup: string,
  index: number,
  array: Token[],
  stop: boolean,
  onChange: TypeOnChange,
  onEdit: TypeOnEdit,
  parent?: Token,
): IRenderReturn => {
  let step = 0;
  let i = index;
  let children: any[] = [];
  let cursor = 0;
  for (; i < array.length; i++) {
    const token = array[i];
    step++;
    if (
      token.type === 'inline' ||
      token.type === 'fence' ||
      token.type === 'hr' ||
      token.type === 'softbreak' ||
      token.type === 'image'
    ) {
      children.push(
        <MdToken
          markup={markup}
          onEdit={onEdit}
          onChange={onChange}
          array={array}
          index={i}
        />,
      );
      continue;
    }
    if (token.nesting == 1) {
      let mkup = token.markup;
      if (mkup === '') {
        mkup = markup;
      }
      const c = render(mkup, i + 1, array, true, onChange, onEdit);
      step += c.step;
      children.push(c.content);
      i += c.step;
      continue;
    }
    if (token.nesting == 0) {
      // console.log(`${i} --- ${token.content} --- ${map} --- | ${i}`);
      const currentI = cursor++;
      let lineNumber: number | undefined = undefined;
      if (parent) {
        lineNumber = parent.map ? parent.map[0] + currentI : undefined;
      }
      children.push(
        <Row>
          <MdInput
            markup={markup}
            on2Click={() => {
              return onEdit(lineNumber);
            }}
            // onFocus={e => onEdit(parent ? parent.map[0] + currentI : undefined)}
            value={token.content}
            onChange={(e, src, markup) => {
              if (markup && markup !== '') {
                const mIndex: number = src.indexOf(markup);
                const header: string = src.substring(
                  0,
                  mIndex + markup.length + 1,
                );
                onChange(src, header + e.target.value, lineNumber);
              }
              //console.log(`${src}`);
            }}
          />
        </Row>,
      );
      if (token.content) continue;
    }
    if (token.nesting == -1 && stop) {
      return {
        step: step,
        content: (
          <MdToken
            markup={markup}
            onEdit={onEdit}
            onChange={onChange}
            array={array}
            index={i}
          >
            {children}
          </MdToken>
        ),
      };
    } else {
      children.push(
        <MdToken
          markup={markup}
          onEdit={onEdit}
          onChange={onChange}
          array={array}
          index={i}
        />,
      );
    }
  }
  return {
    step: step,
    content: <div>{children}</div>,
  };
};

class MdInput extends React.Component<
  {
    on2Click: () => string;
    onFocus: (e: any) => void;
    onChange: (e: any, src: string, markup?: string) => void;
    value: string;
    markup: string;
  },
  {
    input: boolean;
    value: string;
    editValue?: string;
  }
> {
  constructor(prpos: any) {
    super(prpos);
    this.state = {
      input: false,
      value: prpos.value,
    };
  }

  render() {
    return this.state.input ? (
      <TextArea
        onFocus={this.props.onFocus}
        autoSize
        autoFocus
        onBlur={e => {
          this.setState({
            input: false,
          });
        }}
        value={this.state.value}
        onChange={e => {
          this.setState({
            value: e.target.value,
          });
          this.props.onChange(
            e,
            this.state.editValue ? this.state.editValue : '',
            this.props.markup,
          );
        }}
      />
    ) : (
      <span
        onDoubleClick={e => {
          this.setState({
            input: true,
            editValue: this.props.on2Click(),
          });
        }}
      >
        {this.props.value}
      </span>
    );
  }
}

const MdToken = (props: IMdTokenProps) => {
  const { children, array, index, markup } = props;
  const token = array[index];
  const { type } = token;
  const currentMarkup = markup ? markup : '';
  if (type === 'inline') {
    return render(
      currentMarkup,
      0,
      token.children,
      false,
      props.onChange,
      props.onEdit,
      token,
    ).content;
  }
  if (rules[type]) {
    return rules[type](array, index, {}, {}, rd);
  }
  let currentContent = (
    <span>
      {token.tag}
      {children}
    </span>
  );
  if (
    token.tag === 'td' ||
    token.tag === 'tbody' ||
    token.tag === 'thead' ||
    token.tag === 'table' ||
    token.tag === 'tr' ||
    token.tag === 'th' ||
    token.tag === 'li' ||
    token.tag === 'ul' ||
    token.tag === 'ol' ||
    token.tag === 'h1' ||
    token.tag === 'h2' ||
    token.tag === 'h3' ||
    token.tag === 'h4' ||
    token.tag === 'h5' ||
    token.tag === 'h6' ||
    token.tag === 'strong' ||
    token.tag === 'em' ||
    token.tag === 's' ||
    token.tag === 'a' ||
    token.tag === 'img'
  ) {
    currentContent = (
      <token.tag className={`md-${token.tag}`}>{children}</token.tag>
    );
  }
  if (token.tag === 'img') {
    debugger;
    const attrs = rd.renderAttrs(token);
    currentContent = <img {...attrs}>{children}</img>;
  }
  if (token.tag == 'p') {
    currentContent = <pre>{children}</pre>;
  }
  return currentContent;
};

export default class MdRender extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    // this.state = {
    //   arrays : md.parse(this.props.value, {})
    // }
  }

  render() {
    return render(
      '',
      0,
      md.parse(this.props.value, {}),
      false,
      this.props.onChange,
      this.props.onEdit,
    ).content;
  }
}
