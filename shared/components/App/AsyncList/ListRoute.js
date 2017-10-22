import React from 'react';
import Helmet from 'react-helmet';
import { compose } from 'redux';
import { connect } from 'react-redux';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classnames from 'classnames';

import config from '../../../../config';

import { fetchAll as fetchTraks } from '../../../actions/traks';
import * as selectors from '../../../reducers';

import styles from './listRoute.css';

class ListRoute extends React.Component {
  constructor(props) {
    super(props)
    this._renderListItem = this._renderListItem.bind(this)
  }

  _navigateToTrak(trak) {
    this.props.history.push(`/e/${trak.name}`);
  }

  _renderListItem(trak) {
    return (
      <div
        key={trak.id}
        onClick={this._navigateToTrak.bind(this, trak)}>
        { trak.name }
      </div>
    )
  }

  _renderNoListItems() {
    return (
      <div>There don't appear to be any trak tacos meeting the current search criteria</div>
    )
  }

  componentDidMount() {
    this.props.fetchTraks()
  }

  render() {
    console.log('traks:')
    console.dir(this.props.traks)


    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`traktacos! - ${config('appTitle')}`}</title>
        </Helmet>

        <div className={styles.label}>
          {
            this.props.traks && this.props.traks.length
              ? this.props.traks.map(this._renderListItem)
              : this._renderNoListItems()
          }
        </div>

      </div>
    );
  }
}


const mapActionsToProps = {
  fetchTraks
};

function mapStateToProps(state) {
  return { traks: selectors.getTraks(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute);

export { ListRoute }