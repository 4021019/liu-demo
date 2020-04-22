import CodeEditor from '@/components/CodeEditor';
import { Card } from 'antd';
import React from 'react';
// import { ConnectProps } from 'umi';

interface PageProps {
  type: 'markdown' | 'codemirror' | 'new';
  dataKey: string;
  updateContent: (key: string, content: any) => void;
}

const gridStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};

export default class SwitchEditor extends React.Component<PageProps> {
  constructor(props: PageProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {(type => {
          switch (type) {
            case 'codemirror':
              return <CodeEditor value={'test'} renderMerge={true} />;
            case 'markdown':
              return <div>{type}</div>;
            default:
              return (
                <Card title={'test'}>
                  <div
                    onClick={() => {
                      this.props.updateContent(this.props.dataKey, {
                        type: 'markdown',
                      });
                    }}
                  >
                    <Card.Grid style={gridStyle}>markdown</Card.Grid>
                  </div>
                  <div
                    onClick={() => {
                      this.props.updateContent(this.props.dataKey, {
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
        })(this.props.type)}
      </div>
    );
  }
}
