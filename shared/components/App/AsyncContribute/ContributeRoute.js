import React from 'react';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classnames from 'classnames';

import config from '../../../../config';

import styles from './styles.css';

class ContributeRoute extends React.Component {
  _navigateRecord() {
    this.props.history.push('/recorder');
  }

  render() {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`Contribute - ${config('appTitle')}`}</title>
        </Helmet>

        <div className={styles.label}>
          <div className={classnames(styles.button, styles.recordButton)} onClick={this._navigateRecord.bind(this)}>Record</div>
          <div className={classnames(styles.button, styles.uploadButton)} onClick={this._navigateRecord.bind(this)}>Upload</div>
          <div className={classnames(styles.button, styles.recycleButton)} onClick={this._navigateRecord.bind(this)}>Recycle</div>
          <div className={classnames(styles.button, styles.generateButton)} onClick={this._navigateRecord.bind(this)}>Generate</div>
          <div className={classnames(styles.button, styles.duplicateButton)} onClick={this._navigateRecord.bind(this)}>Duplicate</div>
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(ContributeRoute);