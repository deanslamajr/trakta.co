import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios'
import classnames from 'classnames'
import Tone from 'tone'

import InstancePlaylist from '../InstancePlaylist'
import SampleInstances from '../SampleInstances'
import { getTrakRenderer } from '../../lib/TrakRenderer'

import * as selectors from '../../../shared/reducers'

import { setStagedSample } from '../../../shared/actions/recorder'
import {
  setName as setTrakName,
  reset as resetTrak,
  updateDimensionsWithAdditionalSample as updateTrackDimensionsWithAdditionalSample } from '../../../shared/actions/trak'
import { reset as resetSampleLoaderState } from '../../../shared/actions/samples'

import styles from './staging.css'

function isNotANumber (unknown) {
  return isNaN(parseFloat(unknown))
}

function validateData (absoluteStartTime, duration, volume, panning, loopCount, loopPadding) {
  if (isNotANumber(absoluteStartTime) ||
    isNotANumber(duration) ||
    isNotANumber(volume) ||
    isNotANumber(panning) ||
    isNotANumber(loopCount) ||
    isNotANumber(loopPadding)
  ) {
    throw new Error('Malformed submit data')
  }
}

function getMainEditUrl (url) {
  return url.replace('/staging', '')
}

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.trakRenderer = getTrakRenderer()

    this.state = {
      isSaving: false,
      startTime: props.stagedSample.startTime,
      volume: props.stagedSample.volume,
      loopPadding: props.stagedSample.loopPadding,
      loopCount: props.stagedSample.loopCount
    }

    this._saveRecording = this._saveRecording.bind(this)
    this._renderTrackPlayer = this._renderTrackPlayer.bind(this)
    this._getBlobFromObjectUrl = this._getBlobFromObjectUrl.bind(this)
    this._updateTrack = this._updateTrack.bind(this)
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
    const {
      startTime: stagedSampleStartTime,
      volume,
      panning,
      duration,
      loopCount,
      loopPadding
    } = this.props.stagedSample

    // prevent page refresh
    event.preventDefault()

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

      // validate that data is properly formatted
      // @todo handle invalid data state gracefully
      validateData(stagedSampleStartTime, duration, volume, panning, loopCount, loopPadding)

      const trakName = this.props.trakName || this.props.match.url.split('/')[2]

      // @todo pass along some kind of token (cookie?) that the backend can verify that this POST has authority to make an update
      // e.g. user is actually looking at the page and is not a robot
      const queryString = `?trakName=${trakName}&startTime=${stagedSampleStartTime}&duration=${duration}&volume=${volume}&panning=${panning}&loopCount=${loopCount}&loopPadding=${loopPadding}`

      this._getBlobFromObjectUrl()
        .then((data) => axios.post(`/api/sample${queryString}`, data, config))
        .then(({ data }) => {
          const {
            trakName,
            versionId
          } = data

          this.props.setStagedSample({
            startTime: 0,
            volume: 0,
            panning: 0,
            duration: 0,
            loopCount: 0,
            loopPadding: 0
          })

          this.props.resetTrak()

          const isANewTrak = trakName !== this.props.trakName
          if (trakName && isANewTrak) {
            this.props.setTrakName(trakName)
          }

          // get new trak blob
          const blob = this.trakRenderer.getBlobFromBuffer()
          // POST to backend
          return axios.post(`/api/version/${versionId}`, blob, config)
        })
        /**
         * Mp3 Encoding results in Tone.Transport being unresponsive for an amount of time
         * proportional to the length of Mp3 encoding
         *
         * Consequently, don't proceed until Tone.Transport is responsive once again
         */
        .then(() => {
          return new Promise(resolve => {
            Tone.Transport.cancel()
            Tone.Transport.loop = true
            Tone.Transport.setLoopPoints(0, 0.5)

            Tone.Transport.schedule((time) => {
              Tone.Transport.stop()
              Tone.Transport.cancel()
              resolve()
            }, 0)

            Tone.Transport.start()
          })
        })
        .then(() => {
          // jump back to /e/:name
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

  _renderErrorComponent (clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames()}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    )
  }

  _renderTrackPlayer () {
    const { buffer } = this.state

    return (
      <div>
        <div className={styles.label}>
          {/* Play button  */}
          <InstancePlaylist
            addItemToNavBar={this.props.addItemToNavBar}
            renderErrorComponent={this._renderErrorComponent}
            buffer={buffer}
            />
        </div>

        <SampleInstances />

      </div>
    )
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
        this.props.setStagedSample({ duration, loopPadding: duration })

        this._updateTrack()

        this.setState({
          loopPadding: duration,
          buffer
        })
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
        <form className={styles.container} onSubmit={this._saveRecording}>
          {
            this.props.instances && this.props.instances.length
              ? (
                <span className={styles.inputContainer}>
                  <label htmlFor='startTime'>startTime</label>
                  <input
                    id='startTime'
                    type='number'
                    step='0.01'
                    value={this.state.startTime}
                    onChange={this._handleChange.bind(this, 'startTime')}
                    placeholder='startTime'
                    className={styles.formInput} />
                </span>
                )
              : null
          }

          <span className={styles.inputContainer}>
            <label htmlFor='volume'>volume (-infinity to +infinity)</label>
            <input id='volume'
              type='number'
              step='1'
              value={this.state.volume}
              onChange={this._handleChange.bind(this, 'volume')}
              placeholder='volume'
              className={styles.formInput} />
          </span>

          <span className={styles.inputContainer}>
            <label htmlFor='loopCount'># of loops</label>
            <input id='loopCount'
              type='number'
              step='1'
              value={this.state.loopCount}
              onChange={this._handleChange.bind(this, 'loopCount')}
              placeholder='# of loops'
              className={styles.formInput} />
          </span>

          <span className={styles.inputContainer}>
            <label htmlFor='loopPadding'>Space between loops</label>
            <input id='loopPadding'
              type='number'
              step='1'
              value={this.state.loopPadding}
              onChange={this._handleChange.bind(this, 'loopPadding')}
              placeholder='padding'
              className={styles.formInput} />
          </span>

          <div className={classnames({ [styles.loadSpinner]: this.state.isSaving })} />
        </form>

        {
          this.state.buffer
            ? this._renderTrackPlayer()
            : null
        }

      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedSample,
  updateTrackDimensionsWithAdditionalSample,
  resetSampleLoaderState,
  resetTrak,
  setTrakName
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
