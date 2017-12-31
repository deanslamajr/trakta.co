import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classnames from 'classnames';

import config from '../../../../config';

import * as selectors from '../../../reducers';

import styles from './styles.css';

class ContributeRoute extends React.Component {
  _navigateRecord() {
    this.props.history.push('/recorder');
  }

  componentWillMount () {
    // if trakName exists, we just created a new trakTaco and should redirect to that traktaco
    if (this.props.trakName) {
      this.props.history.replace(`/e/${this.props.trakName}`);
    }

    // clear navbar
    this.props.addItemToNavBar(null, null);
  }

  render() {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`Contribute - ${config('appTitle')}`}</title>
        </Helmet>

        <div className={styles.label}>
          <div className={classnames(styles.button, styles.recordButton)} onClick={this._navigateRecord.bind(this)}>FreeStyle</div>
            {/* <div className={classnames(styles.button, styles.uploadButton)} onClick={this._navigateRecord.bind(this)}>SongBuilder</div> */}
           <div className={classnames(styles.button, styles.recycleButton)} onClick={this._navigateRecord.bind(this)}>SingleRecording</div> 
          <div className={classnames(styles.button, styles.generateButton)} onClick={this._navigateRecord.bind(this)}>SongBuilder</div> 
          {/* <div className={classnames(styles.button, styles.duplicateButton)} onClick={this._navigateRecord.bind(this)}>SongBuilder</div>  */}
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return { trakName: selectors.getTrakName(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ContributeRoute);