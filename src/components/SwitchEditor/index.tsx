import CodeEditor from '@/components/CodeEditor';
import { Card } from 'antd';
import React from 'react';
// import { ConnectProps } from 'umi';

interface PageProps {
  type: 'markdown' | 'codemirror' | 'new';
}

interface IState {}

const gridStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};

export default class SwitchEditor extends React.Component<PageProps, IState> {
  constructor(props: PageProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {(key => {
          switch (key) {
            case 'codemirror':
              return <CodeEditor value={key} renderMerge={true} />;
            case 'markdown':
              return <div>{this.props.type}</div>;
            default:
              return (
                <Card title={'test'}>
                  <div
                    onClick={() => {
                      this.setState({
                        type: 'markdown',
                      });
                    }}
                  >
                    <Card.Grid style={gridStyle}>markdown</Card.Grid>
                  </div>
                  <div
                    onClick={() => {
                      this.setState({
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
