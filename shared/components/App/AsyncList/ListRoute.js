import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import ListItem from './ListItem'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'
import { reset as resetSampleLoaderState } from '../../../actions/samples'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor (props) {
    super(props)
    this._handleTrakSelect = this._handleTrakSelect.bind(this)
    this._fetchTraks = this._fetchTraks.bind(this)

    this.state = {
      selectedTrakId: null
    }
  }

  _handleTrakSelect (trakId) {
    this.props.addItemToNavBar({ TOP_RIGHT: { type: 'LOADING' }}, true)
    this.setState({ selectedTrakId: trakId })
  }

  _fetchTraks () {
    this.props.fetchTraks()
  }

  componentDidMount () {
    if (!this.props.hasFetched) {
      this._fetchTraks()
    }

    this.props.resetSampleLoaderState()
    this.props.addItemToNavBar({
      BOTTOM_LEFT: {
        type: 'REFRESH',
        cb: this._fetchTraks
      },
      BOTTOM_RIGHT: {
        type: 'ADD',
        cb: () => this.props.history.push(`/e/new/recorder`)
      }
    })
  }

  componentWillUnmount () {
    this.props.addItemToNavBar(null)

    if (window) {
      const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
      const playlistRenderer = getPlaylistRenderer()
      playlistRenderer.clearCache()
    }
  }

  render () {
    const { traks } = this.props

    const sortedTraks = traks.sort((a, b) => moment(a.last_contribution_date).isBefore(b.last_contribution_date)
      ? 1
      : -1
    )

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{config('appTitle')}</title>
        </Helmet>

        <div className={styles.label}>
          {sortedTraks.map(trak => (
            <ListItem
              key={trak.id}
              trak={trak}
              handleClick={this._handleTrakSelect}
              selectedTrakId={this.state.selectedTrakId}
            />
          ))}
        </div>
      </div>
    )
  }
}

const mapActionsToProps = {
  fetchTraks,
  resetSampleLoaderState
}

function mapStateToProps (state) {
  return {
    traks: selectors.getTraks(state),
    hasFetched: selectors.hasFetched(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute)

export { ListRoute }
