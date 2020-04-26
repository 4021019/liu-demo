import CodeEditor from '@/components/CodeEditor';
import { Card } from 'antd';
import React from 'react';
import MdEditor from '../MdEditor';
// import { ConnectProps } from 'umi';

interface PageProps {
  type: 'markdown' | 'codemirror' | 'new';
  value: string;
  dataKey: string;
  updateContent: (key: string, content: any) => void;
}

const gridStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};

export default (props: PageProps) => {
  const saveValue = (value: string): boolean => {
    props.updateContent(props.dataKey, {
      value: value,
    });
    // todo 增加返回值
    return true;
  };

  return (
    <div>
      {(type => {
        switch (type) {
          case 'codemirror':
            return (
              <CodeEditor
                mode="text/x-java"
                theme="idea"
                saveValue={saveValue}
                value={props.value}
                renderMerge={true}
              />
            );
          case 'markdown':
            return <MdEditor />;
          default:
            return (
              <Card title={'test'}>
                <div
                  onClick={() => {
                    props.updateContent(props.dataKey, {
                      type: 'markdown',
                    });
                  }}
                >
                  <Card.Grid style={gridStyle}>markdown</Card.Grid>
                </div>
                <div
                  onClick={() => {
                    props.updateContent(props.dataKey, {
                      type: 'codemirror',
                    });
                  }}
                >
                  <Card.Grid style={gridStyle}>codemirror</Card.Grid>
                </div>
                <Card.Grid style={gridStyle}>waiting...</Card.Grid>
              </Card>
            );
        }
      })(props.type)}
    </div>
  );
};
