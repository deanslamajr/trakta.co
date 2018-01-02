import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'
import { reset as resetSampleLoaderState } from '../../../actions/samples'
import { reset as resetTrakState } from '../../../actions/trak'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor (props) {
    super(props)
    this._renderListItem = this._renderListItem.bind(this)
  }

  _navigateToTrak (name) {
    this.props.history.push(`/e/${name}`)
  }

  _renderListItem (trak) {
    return (
      <div
        className={classnames(styles.card, styles.trak)}
        key={trak.id}
        onClick={this._navigateToTrak.bind(this, trak.name)}>
        { trak.name }
      </div>
    )
  }

  _renderNewTrakItem () {
    return (
      <div
        key='new-trak-item'
        className={classnames(styles.card, styles.new)}
        onClick={() => this.props.history.push(`/new`)}>
        New Trak
      </div>
    )
  }

  componentDidMount () {
    this.props.fetchTraks()
    this.props.resetSampleLoaderState()
    this.props.resetTrakState()
    this.props.addItemToNavBar(null, null)
  }

  render () {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`traktacos - ${config('appTitle')}`}</title>
        </Helmet>

        <div className={styles.label}>
          { this._renderNewTrakItem() }
          { this.props.traks.map(this._renderListItem) }
        </div>

      </div>
    )
  }
}

const mapActionsToProps = {
  fetchTraks,
  resetSampleLoaderState,
  resetTrakState
}

function mapStateToProps (state) {
  return { traks: selectors.getTraks(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute)

export { ListRoute }
