import React from 'react';
import { connect, ConnectProps, IndexModelState, Loading } from 'umi';
import { render } from 'react-dom';

interface PageProps extends ConnectProps {
  index: IndexModelState;
  loading: boolean;
}

@connect(
  ({ index2, loading }: { index2: IndexModelState; loading: Loading }) => ({
    index: index2,
    loading: loading.models.index,
  }),
)
export default class IndexPage extends React.Component<PageProps> {
  render() {
    const { name } = this.props.index;
    console.log(this.props);
    return <div>Hello {name}</div>;
  }
}

// export default connect(
//   ({ index2, loading }: { index2: IndexModelState; loading: Loading }) => ({
//     index: index2,
//     loading: loading.models.index,
//   }),
// )(IndexPage);
