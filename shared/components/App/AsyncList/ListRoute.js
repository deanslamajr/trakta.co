import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import ListItem from './ListItem'
import InstancePlaylist from '../../../../client/components/InstancePlaylist'

import config from '../../../../config'

import {
  setShouldFetchInstances,
  fetched as setTrakInstanceArray,
  reset as resetTrak
} from '../../../actions/trak'
import { fetchAll as fetchTraks } from '../../../actions/traklist'
import { reset as resetSampleLoaderState } from '../../../actions/samples'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor (props) {
    super(props)
    this._handleTrakSelect = this._handleTrakSelect.bind(this)
    this._fetchTraks = this._fetchTraks.bind(this)
    this._resetTrak = this._resetTrak.bind(this)
    this._navigateToEdit = this._navigateToEdit.bind(this)
    this._navigateToNew = this._navigateToNew.bind(this)


    this.state = {
      selectedTrakId: null
    }
  }

  _navigateToEdit (trakName) {
    this._resetTrak()
    this.props.history.push(`/e/${trakName}`)
  }

  _navigateToNew () {
    this._resetTrak()
    this.props.history.push(`/e/new/recorder`)
  }

  _handleTrakSelect (trak) {
    this.props.addItemToNavBar({
      TOP_RIGHT: { type: 'LOADING' },
      TOP_LEFT: {
        type: 'EDIT',
        cb: () => this._navigateToEdit(trak.name)
      }
    }, true)
    this.setState({ selectedTrakId: trak.id })

    axios.get(`/api/trak/${trak.name}`)
      .then(({ data }) => {
        const { filename, duration } = data

        const trakInstanceInAnArray = [
          {
            sample: {
              url: filename,
              //url: 'b11b366d-1efe-43b8-8640-6a582c508745.mp3',
              /**
               * @todo investigate using a slidingArray to leverage the PlaylistRenderer cache for the last 5? traks selected
               */
              id: trak.id,
              duration
            },
            loop_count: 0,
            loop_padding: 0,
            start_time: 0
          }
        ]

        this.props.setTrakInstanceArray(trakInstanceInAnArray)
      })
  }

  _fetchTraks () {
    this.props.fetchTraks()
  }

  _resetTrak () {
    this.props.addItemToNavBar(null)
    this.props.resetTrak()
    this.props.setShouldFetchInstances(true)

    if (window) {
      const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
      const playlistRenderer = getPlaylistRenderer()
      playlistRenderer.clearCache()
    }
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
        cb: this._navigateToNew
      }
    })
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

        {this.props.instances && this.props.instances.length && (
          <InstancePlaylist
            addItemToNavBar={this.props.addItemToNavBar}
            renderErrorComponent={() => {}}
            incrementPlaysCount
            fetchTrak
          />
        )}
      </div>
    )
  }
}

const mapActionsToProps = {
  fetchTraks,
  setShouldFetchInstances,
  setTrakInstanceArray,
  resetSampleLoaderState,
  resetTrak
}

function mapStateToProps (state) {
  return {
    traks: selectors.getTraks(state),
    hasFetched: selectors.hasFetched(state),
    instances: selectors.getInstances(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute)

export { ListRoute }
