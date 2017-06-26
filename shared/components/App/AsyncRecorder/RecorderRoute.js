import React from 'react';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import config from '../../../../config';
import Recorder from '../../../../client/components/Recorder';

import styles from './RecorderRoute.css';


class RecorderRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClient: false
    };
  }

  _renderLoading() {
    return (
      <div className={styles.loadingMessage}>
        !!Loading!!
      </div>
    );
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`recorder - ${config('appTitle')}`}</title>
        </Helmet>
        { 
          this.state.isClient 
            ? <Recorder /> 
            : this._renderLoading()
        }
      </div>
    );
  }
}

export default withStyles(styles)(RecorderRoute)