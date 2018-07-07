import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import WaveformData from 'waveform-data'

import {
  setCleanup,
  setStagedSample } from '../../../shared/actions/recorder'
import * as selectors from '../../../shared/reducers'

import { getSampleCreator } from '../../lib/SampleCreator'

import styles from './Recorder.css'

function clearCanvas (ctx) {
  requestAnimationFrame(() => { // eslint-disable-line
    const canvasWidth = ctx.canvas.width
    const canvasHeight = ctx.canvas.height

    ctx.beginPath()
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.closePath()
  })
}

function getMainEditUrl (url, isGoingBack) {
  // if this is new trak creation, go back to main list
  if (isGoingBack && url.split('/')[2] === 'new') {
    return '/'
  }

  let urlWithoutTrailingSlash = url
  if (urlWithoutTrailingSlash.charAt(urlWithoutTrailingSlash.length - 1) === '/') {
    urlWithoutTrailingSlash = urlWithoutTrailingSlash.slice(0, -1)
  }

  return urlWithoutTrailingSlash.replace('/recorder', '')
}

class Recorder extends React.Component {
  static propTypes = {
    addItemToNavBar: PropTypes.func,
    fetchInstances: PropTypes.func,
    shouldFetchInstances: PropTypes.bool
  }

  constructor (props) {
    super(props)

    this.prompts = {
      START: this._renderSTART.bind(this),
      STOP: this._renderSTOP.bind(this),
      USER_MEDIA_DENIED: this._renderUSER_MEDIA_DENIED.bind(this)
    }

    this.state = {
      isRecording: false,
      disableRecording: true,
      currentPrompt: this.prompts.START,
      drawWave: false,
      duration: undefined
    }

    try {
      this.sampleCreator = getSampleCreator()
    } catch (error) {
      // Tone.UserMedia is not supported
      // @todo catch this earlier
    }
  }

  _beginDrawingWaves = () => {
    this.canvasContext = this.canvas.getContext('2d')

    // @todo have these resize with window resize
    this.canvasContext.canvas.width = this.canvas.width
    this.canvasContext.canvas.height = this.canvas.height

    // draw waves
    this.setState({ drawWave: true })

    this._drawWave()
  }

  _drawWave = () => {
    const canvasWidth = this.canvasContext.canvas.width
    const canvasHeight = this.canvasContext.canvas.height

    let x
    let y
    let isWhite = false

    if (this.state.drawWave) {
      requestAnimationFrame(this._drawWave) // eslint-disable-line
    }

    // draw the waveform
    const values = this.sampleCreator.getValues()

    this.canvasContext.beginPath()
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
    this.canvasContext.lineJoin = 'round'
    if (this.state.isRecording) {
      this.canvasContext.lineWidth = 5
      this.canvasContext.strokeStyle = 'red'
    } else {
      this.canvasContext.lineWidth = 2
      this.canvasContext.strokeStyle = '#CCCCCC'
    }
    this.canvasContext.moveTo((values[0] / 255) * canvasWidth, canvasHeight)

    const now = Date.now()

    for (let i = values.length; i > 0; i--) {
      if (this.state.isRecording) {
        if ((1 - i / values.length) > ((now - this.state.recordingStartTime) / 10000) && !isWhite) {
          isWhite = true
          this.canvasContext.stroke()
          this.canvasContext.closePath()
          this.canvasContext.lineWidth = 2
          this.canvasContext.strokeStyle = '#CCCCCC'
          this.canvasContext.beginPath()
          this.canvasContext.moveTo(x, y)
          this.canvasContext.lineJoin = 'round'
        }
      }
      const val = values[i] / (this.sampleCreator.resolution - 1)
      x = val * canvasWidth
      y = (i / (this.sampleCreator.resolution - 1)) * canvasHeight
      this.canvasContext.lineTo(x, y)
    }

    this.canvasContext.stroke()
    this.canvasContext.closePath()
  }

  _drawSample = (buffer) => {
    const waveFormData = WaveformData.create(buffer)
    waveFormData.offset(0, buffer.byteLength / 4)

    const ctx = this.canvasContext

    const canvasHeight = ctx.canvas.height

    const interpolateHeight = (totalHeight) => {
      const amplitude = 256
      return (size) => totalHeight - ((size + 128) * totalHeight) / amplitude
    }
    const y = interpolateHeight(canvasHeight)

    ctx.beginPath()

    // from 0 to 100
    waveFormData.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5))

    // then looping back from 100 to 0
    waveFormData.max.reverse().forEach((val, x) => {
      ctx.lineTo((waveFormData.offset_length - x) + 0.5, y(val) + 0.5)
    })

    ctx.closePath()
    ctx.stroke()
  }

  _renderSTART () {
    return (
      <div>
        {
          this.state.disableRecording
            ? <div>Waiting on encoder to initialize</div>
            : <div className={styles.blueMask} />
        }
      </div>
    )
  }

  _startRecording = () => {
    this.sampleCreator.startRecording()

    this.props.addItemToNavBar({
      BOTTOM_RIGHT: {
        type: 'CHECK',
        cb: this._stopRecording
      }
    }, true)

    this.setState({
      recordingStartTime: Date.now(),
      isRecording: true,
      currentPrompt: this.prompts.STOP
    })
  }

  _renderSTOP () {
    return (<div className={styles.redMask} />)
  }

  _navigateToCleanup () {
    const mainEditUrl = getMainEditUrl(this.props.match.url)
    this.props.history.push(`${mainEditUrl}/cleanup`)
  }

  _stopRecording = () => {
    this.setState({
      isRecording: false,
      drawWave: false
    })

    clearCanvas(this.canvasContext)

    this.sampleCreator.stopAndFinishRecording()
      .then(objectUrl => {
        this.props.setStagedSample({
          startTime: 0,
          volume: 0,
          panning: 0,
          duration: 0,
          loopCount: 0,
          loopPadding: 0
        })
    
        const initialStartValue = Math.ceil(0.2 * (this.sampleCreator.getDataBufferLength()))
        const initialEndValue = Math.ceil(0.8 * (this.sampleCreator.getDataBufferLength()))
        this.props.setCleanup({
          leftSliderValue: initialStartValue,
          rightSliderValue: initialEndValue,
          clipStart: initialStartValue,
          clipEnd: initialEndValue
        })
    
        this._navigateToCleanup()
      })
  }

  _renderUSER_MEDIA_DENIED () { // eslint-disable-line
    return (
      <div>Welp, you blew it!</div>
    )
  }

  componentDidMount () {
    const height = this.container
        ? this.container.parentNode.clientHeight
        : 0
    const width = this.container
        ? this.container.parentNode.clientWidth
        : 0

    if (this.props.shouldFetchInstances) {
      this.props.fetchInstances()
    }

    this.setState({
      canvasWidth: width,
      canvasHeight: height
    }, () => {
      // if this component has unmounted by now (e.g. pressing back button quickly, go(-3) at end of creation)
      // don't do this stuff
      if (this.canvas) {
        this.sampleCreator.openMic()
          .then(() => {
            // if this component has unmounted by now (e.g. pressing back button quickly, go(-3) at end of creation)
            // don't do this stuff
            if (this.canvas) {
              const mainEditUrl = getMainEditUrl(this.props.match.url, true)
              // @todo if trakName = new, set back action to '/'
              this.props.addItemToNavBar({
                TOP_LEFT: { type: 'BACK', cb: () => this.props.history.push(mainEditUrl) },
                BOTTOM_RIGHT: { type: 'RECORD', cb: this._startRecording }
              })
              // overlay 'start recording' mask
              this.setState({ disableRecording: false })
              this._beginDrawingWaves()
            }
          })
          .catch(err => {
            console.error(err)
            // @todo log and metric
            this.setState({ currentPrompt: this.prompts.USER_MEDIA_DENIED })
          })
      }
    })
  }

  render () {
    return (
      // @todo replace with imported css
      <div ref={(container) => { this.container = container }}>
        {
          this.sampleCreator
            ? (
              <div>
                {this.state.currentPrompt()}
              </div>
            )
            : (
              <div className={styles.notSupportedMessage}>
                WebAudio is not supported by this browser.
                <br />
                Please upgrade this browser's version or switch to a browser that supports this technology.
                <br />
                i.e. internet explorer, safari, and all iOS-based browsers will not be able to run this application
              </div>
            )
        }

        <canvas
          className={styles.container}
          width={this.state.canvasWidth || 0}
          height={this.state.canvasHeight || 0}
          ref={(canvas) => { this.canvas = canvas }}
        />
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedSample,
  setCleanup,
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state),
    instances: selectors.getInstances(state),
    trackDimensions: selectors.getTrackDimensions(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Recorder)
