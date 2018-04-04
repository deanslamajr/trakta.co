import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios'
import classnames from 'classnames'
import Tone from 'tone'

import InstancePlaylist from '../InstancePlaylist'
import SampleInstances from '../SampleInstances'

import * as selectors from '../../../shared/reducers'

import { setStagedSample, setStagedObjectUrl } from '../../../shared/actions/recorder'
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

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isSaving: false
    }

    this._saveRecording = this._saveRecording.bind(this)
    this._renderTrackPlayer = this._renderTrackPlayer.bind(this)
    this._getBlobFromObjectUrl = this._getBlobFromObjectUrl.bind(this)
    this._updateTrack = this._updateTrack.bind(this)
  }

  _updateTrack (stagedSample) {
    const latestStagedSample = stagedSample || this.props.stagedSample

    /**
     * make it so that an array can be passed to this action creator
     *
     * generate array from two values: loopCount, loop separation
     */
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
      return
    }

    if (type === 'startTime' || type === 'loopPadding' || type === 'loopCount') {
      this.setState({
        updateTrack: true
      }, () => {
        this.props.setStagedSample({ [type]: parsedValue })
      })
    } else {
      this.props.setStagedSample({ [type]: parsedValue })
    }
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

    // show save animation
    this.setState({ isSaving: true })

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

    const trakName = this.props.trakName || ''

    // @todo pass along some kind of token (cookie?) that the backend can verify that this POST has authority to make an update
    // e.g. user is actually looking at the page and is not a robot
    const queryString = `?trakName=${trakName}&startTime=${stagedSampleStartTime}&duration=${duration}&volume=${volume}&panning=${panning}&loopCount=${loopCount}&loopPadding=${loopPadding}`

    this._getBlobFromObjectUrl()
      .then((data) => axios.post(`/api/sample${queryString}`, data, config))
      .then(response => {
        this.props.setStagedSample({
          startTime: 0,
          volume: 0,
          panning: 0,
          duration: 0,
          loopCount: 0,
          loopPadding: 0
        })

        this.props.resetSampleLoaderState()
        // reset staged ObjectUrl
        this.props.setStagedObjectUrl(undefined)

        const isANewTrak = response.data.trakName !== this.props.trakName
        if (response.data.trakName && isANewTrak) {
          this.props.setTrakName(response.data.trakName)
        }

        // jump back to /e/:name
        // doing it like this 'clears' the recording steps from the browser history
        this.props.history.go(-3)
      })
      .catch((err) => {
        // @todo log error
        // @todo handle this gracefully
        console.error(err)
        // this.props.failureCB
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
    new Tone.Buffer(this.props.objectUrl, // eslint-disable-line 
      // success
      buffer => {
        const duration = buffer.get().duration
        this.props.setStagedSample({ duration, loopPadding: duration })

        this._updateTrack()

        this.setState({ buffer })
        this.props.addItemToNavBar(undefined, (
          { type: 'CHECK', cb: this._saveRecording }
        ))
      },
      // error
      // @todo log, set error view state (w/ try again functionality)
      error => {
        console.error(error)
      }
    )
  }

  render () {
    const {
      startTime,
      volume,
      loopPadding,
      loopCount
    } = this.props.stagedSample

    return (
      <div>
        <form className={styles.container} onSubmit={this._saveRecording}>
          {
            this.props.instances && this.props.instances.length
              ? (
                <div>
                  <label htmlFor='startTime'>startTime</label>
                  <input
                    id='startTime'
                    type='number'
                    step='0.01'
                    value={startTime}
                    onChange={this._handleChange.bind(this, 'startTime')}
                    placeholder='startTime'
                    className={styles.formInput} />
                </div>
                )
              : null
          }

          <label htmlFor='volume'>volume (-infinity to +infinity)</label>
          <input id='volume'
            type='number'
            step='0.01'
            value={volume}
            onChange={this._handleChange.bind(this, 'volume')}
            placeholder='volume'
            className={styles.formInput} />

          <label htmlFor='loopCount'># of loops</label>
          <input id='loopCount'
            type='number'
            step='1'
            value={loopCount}
            onChange={this._handleChange.bind(this, 'loopCount')}
            placeholder='# of loops'
            className={styles.formInput} />

          <label htmlFor='loopPadding'>Space between loops</label>
          <input id='loopPadding'
            type='number'
            step='1'
            value={loopPadding}
            onChange={this._handleChange.bind(this, 'loopPadding')}
            placeholder='padding'
            className={styles.formInput} />

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
  setTrakName,
  setStagedObjectUrl
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
