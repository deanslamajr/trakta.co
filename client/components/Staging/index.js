import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios'
import classnames from 'classnames'
import Tone from 'tone'

import Sequencer from './Sequencer'
import InstancePlaylist from '../InstancePlaylist'
import { getTrakRenderer } from '../../lib/TrakRenderer'
import { getPlaylistRenderer } from '../../lib/PlaylistRenderer'

import * as selectors from '../../../shared/reducers'

import { setStagedSample } from '../../../shared/actions/recorder'
import {
  setShouldFetchInstances,
  setName as setTrakName,
  updateDimensionsWithAdditionalSample as updateTrackDimensionsWithAdditionalSample } from '../../../shared/actions/trak'
import { reset as resetSampleLoaderState } from '../../../shared/actions/samples'

import styles from './staging.css'

function getMainEditUrl (url) {
  return url.replace('/staging', '')
}

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.trakRenderer = getTrakRenderer()
    this.playlistRenderer = getPlaylistRenderer()

    this.state = {
      isSaving: false,
      startTime: props.stagedSample.startTime,
      loopPadding: props.stagedSample.loopPadding,
      loopCount: props.stagedSample.loopCount,
      selectedItems: {}
    }

    this._saveRecording = this._saveRecording.bind(this)
    this._renderTrackPlayer = this._renderTrackPlayer.bind(this)
    this._getBlobFromObjectUrl = this._getBlobFromObjectUrl.bind(this)
    this._updateTrack = this._updateTrack.bind(this)
    this._onSequencerItemSelect = this._onSequencerItemSelect.bind(this)
  }

  _updateTrack (stagedSample) {
    const latestStagedSample = stagedSample || this.props.stagedSample

    this.props.updateTrackDimensionsWithAdditionalSample({
      // weird shape that mocks the shape returned from DB query for sampleInstances
      start_time: latestStagedSample.startTime,
      loop_count: latestStagedSample.loopCount,
      loop_padding: latestStagedSample.loopPadding,
      sample: { duration: latestStagedSample.duration }
    })
  }

  _handleChange (type, event) {
    let parsedValue = parseFloat(event.target.value)

    if (Number.isNaN(parsedValue)) {
      parsedValue = 0
    }

    let stateUpdate = {
      [type]: parsedValue
    }

    // changes that effect the drawing
    if (type === 'startTime' || type === 'loopPadding' || type === 'loopCount') {
      stateUpdate.updateTrack = true
    }

    this.setState(stateUpdate, () => this.props.setStagedSample({ [type]: parsedValue }))
  }

  _saveRecording (event) {
    // prevent page refresh
    event.preventDefault()

    const {
      buffer,
      selectedItems
    } = this.state

    const sampleDuration = buffer.get().duration

    this.props.addItemToNavBar(null)

    this.setState({
      isSaving: true, // show save animation
      buffer: undefined    // side effect: removes player
    },
    () => {
      const config = {
        onUploadProgress: (progressEvent) => {
          console.log(
            `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`
          )
        }
      }

      const trakName = this.props.trakName || this.props.match.url.split('/')[2]
      const sequencerCsv = Object.keys(selectedItems).filter(item => selectedItems[item]).join(',')

      // @todo pass along some kind of token (cookie?) that the backend can verify that this POST has authority to make an update
      // e.g. user is actually looking at the page and is not a robot
      const queryString = `?trakName=${trakName}&sampleDuration=${sampleDuration}&sequencerCsv=${sequencerCsv}&trakDuration=${this.playlistRenderer.getDuration()}`

      this._getBlobFromObjectUrl()
        .then((data) => axios.post(`/api/sample${queryString}`, data, config))
        .then(({ data }) => {
          const {
            trakName,
            versionId
          } = data

          this.props.setShouldFetchInstances(true)

          const isANewTrak = trakName !== this.props.trakName
          if (trakName && isANewTrak) {
            this.props.setTrakName(trakName)
          }

          // get new trak blob
          return this.trakRenderer.getBlobFromBuffer()
            .then(blob => {
              return axios.post(`/api/version/${versionId}`, blob, config)
            })
        })
        .then(() => {
          this.props.history.push(`/e/${this.props.trakName}`)
        })
        .catch((err) => {
          // @todo log error
          // @todo handle this gracefully
          console.error(err)
          // this.props.failureCB
        })
    })
  }

  /**
   * getting a blob from an objectUrl is tricky :)
   * this method contains the trick
   */
  _getBlobFromObjectUrl () {
    return axios.get(this.props.objectUrl, { responseType: 'blob' })
      .then(({ data }) => data)
  }

  _renderTrackPlayer () {
    const { buffer, selectedItems } = this.state

    const sequencerInstance = {
      times: selectedItems,
      buffer
    }

    return (
      <div>
        <div className={styles.label}>
          <InstancePlaylist
            instances={this.props.instances}
            trackDimensions={this.props.trackDimensions}

            addItemToNavBar={this.props.addItemToNavBar}
            sequencerInstance={sequencerInstance}
          />
        </div>

        <Sequencer
          onItemSelect={this._onSequencerItemSelect}
          selectedItems={selectedItems}
        />
      </div>
    )
  }

  _onSequencerItemSelect (itemId) {
    const currentSelectedState = Object.assign({}, this.state.selectedItems)
    currentSelectedState[itemId] = Boolean(!currentSelectedState[itemId])
    this.setState({ selectedItems: currentSelectedState })
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.updateTrack) {
      this._updateTrack(nextProps.stagedSample)

      this.setState({
        updateTrack: false
      })
    }
  }

  // initialize the buffer everytime the user navigates to this page
  componentDidMount () {
    this.props.addItemToNavBar(null)

    new Tone.Buffer(this.props.objectUrl, // eslint-disable-line 
      // success
      buffer => {
        const duration = buffer.get().duration
        const stagedSampleUpdate = { duration }
        const stateUpdate = { buffer }
        /**
         * If this is the first time we've seen this, initialize loopPadding to the length of the buffer
         */
        if (this.props.stagedSample.loopPadding === 0) {
          stagedSampleUpdate.loopPadding = duration
          stateUpdate.loopPadding = duration
        }
        this.props.setStagedSample(stagedSampleUpdate)

        this._updateTrack()

        this.setState(stateUpdate)

        const mainEditUrl = getMainEditUrl(this.props.match.url)
        this.props.addItemToNavBar({
          TOP_LEFT: { type: 'BACK', cb: () => this.props.history.push(`${mainEditUrl}/cleanup`) },
          BOTTOM_RIGHT: { type: 'CHECK', cb: this._saveRecording }
        })
      },
      // error
      // @todo log, set error view state (w/ try again functionality)
      error => {
        console.error(error)
      }
    )
  }

  render () {
    return (
      <div>
        {
          this.state.buffer
            ? this._renderTrackPlayer()
            : null
        }
        <div className={classnames({ [styles.loadSpinner]: this.state.isSaving })} />
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedSample,
  updateTrackDimensionsWithAdditionalSample,
  resetSampleLoaderState,
  setTrakName,
  setShouldFetchInstances
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state),
    stagedSample: selectors.getStagedSample(state),
    trackDimensions: selectors.getTrackDimensions(state),
    instances: selectors.getInstances(state),
    trakName: selectors.getTrakName(state)
  }
}

export { Staging }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Staging)
