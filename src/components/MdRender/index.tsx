import { escapeHtml, unescapeAll } from './utils.js';
import Renderer from 'markdown-it/lib/renderer';
import Token from 'markdown-it/lib/token';
import React from 'react';
import './style.less';
import { IMdTokenProps, IProps, IRenderReturn } from './type';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();
const rd = new Renderer();

const fence = function(tokens, idx, options, env, slf) {
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

const rules: any = {};
rules.fence = fence;

const render = (
  index: number,
  array: Token[],
  stop: boolean,
): IRenderReturn => {
  let step = 0;
  let i = index;
  let children: any[] = [];
  for (; i < array.length; i++) {
    const token = array[i];
    step++;
    if (token.type === 'inline' || token.type === 'fence') {
      children.push(<MdToken array={array} index={i} />);
      continue;
    }
    if (token.nesting == 1) {
      const c = render(i + 1, array, true);
      step += c.step;
      children.push(c.content);
      i += c.step;
      continue;
    }
    if (token.nesting == 0) {
      children.push(token.content);
      continue;
    }
    if (token.nesting == -1 && stop) {
      return {
        step: step,
        content: (
          <MdToken array={array} index={i}>
            {children}
          </MdToken>
        ),
      };
    } else {
      children.push(<MdToken array={array} index={i} />);
    }
  }
  return {
    step: step,
    content: <div>{children}</div>,
  };
};

const MdToken = (props: IMdTokenProps) => {
  const { children, array, index } = props;
  const token = array[index];
  const { type } = token;
  if (type === 'inline') {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: rd.renderInline(token.children, {}, {}),
        }}
      />
    );
  }

  if (rules[type]) {
    return rules[type](array, index, {}, {}, rd);
  }

  let currentContent = <span>{children}</span>;
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
    token.tag === 'h2'
  ) {
    currentContent = (
      <token.tag className={`md-${token.tag}`}>{children}</token.tag>
    );
  }
  if (token.tag == 'p') {
    currentContent = <pre>{children}</pre>;
  }
  return currentContent;
};

export default (props: IProps) => {
  const arrays: Token[] = md.parse(props.value, {});
  return render(0, arrays, false).content;
};
