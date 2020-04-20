import CodeEditor from '@/components/CodeEditor';
import { Card } from 'antd';
import React from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';

interface PageProps extends ConnectProps {
  index: IndexModelState;
  loading: boolean;
}

interface IState {
  type?: 'markdown' | 'codemirror' | 'new';
}

const gridStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};

class IndexPage extends React.Component<PageProps, IState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      type: 'new',
    };
  }

  render() {
    const { name } = this.props.index;
    console.log(this.props);
    return (
      <div>
        {(key => {
          switch (key) {
            case 'codemirror':
              return <CodeEditor value={key} renderMerge={true} />;
            case 'markdown':
              return <div>{this.state.type}</div>;
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
        })(this.state.type)}
      </div>
    );
  }
}

export default connect(
  ({ index2, loading }: { index2: IndexModelState; loading: Loading }) => ({
    index: index2,
    loading: loading.models.index,
  }),
)(IndexPage);
