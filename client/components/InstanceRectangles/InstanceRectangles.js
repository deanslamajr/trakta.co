import React from 'react'
import PropTypes from 'prop-types'
import viewportDimensions from 'viewport-dimensions'

import { unitLength, unitDuration } from '../../lib/units'

import calculateInstanceRectangles from './calculateInstanceRectangles'

class InstanceRectangles extends React.Component {
  static propTypes = {
    instances: PropTypes.arrayOf(PropTypes.shape({
      created_at: PropTypes.string,
      id: PropTypes.string,
      player_id: PropTypes.string,
      sample: PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string,
        duration: PropTypes.number,
        player_id: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string
      }),
      sample_id: PropTypes.string,
      sequencer_csv: PropTypes.string,
      setPlayerAnimations: PropTypes.func,
      trak: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        created_at: PropTypes.string,
        contribution_count: PropTypes.number,
        last_contribution_date: PropTypes.string,
        originators_player_id: PropTypes.string,
        duration: PropTypes.number,
        plays_count: PropTypes.number,
        updated_at: PropTypes.string
      }),
      trak_id: PropTypes.string,
      updated_at: PropTypes.string,
      version_id: PropTypes.string
    })),
    setPlayerAnimations: PropTypes.func
  }

  static defaultProps = {
    instances: []
  }

  _getInstancesPlaybackAnimation = (trakHeight) => (playbackDurationSeconds, aniData, time) => {
    const animationInterval = 20
    const playbackDurationMilliseconds = playbackDurationSeconds * 1000
    const numberOfFrames = (playbackDurationMilliseconds / animationInterval) + 1

    const displacementPerFrame = trakHeight / numberOfFrames
    aniData.position = 0

    function drawPosition (playIndicatorEl) {
      aniData.position = aniData.position <= trakHeight
        ? aniData.position + displacementPerFrame
        : trakHeight
  
      if (playIndicatorEl) {
        playIndicatorEl.setAttribute('y1', aniData.position)
        playIndicatorEl.setAttribute('y2', aniData.position)
      }
    }

    const Tone = require('tone')

    Tone.Draw.schedule(() => {
      this.playIndicatorEl.setAttribute('stroke', 'black')

      if (aniData.id) {
        clearInterval(aniData.id)
      }
      // draw first frame of animation
      drawPosition(this.playIndicatorEl)
      // setup interval for the other frames
      aniData.id = setInterval(() => drawPosition(this.playIndicatorEl), animationInterval)
    }, time)
  }

  tester = () => {
    const viewportWidth = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300

    this.playIndicatorEl.setAttribute('x1', 0)
    this.playIndicatorEl.setAttribute('x2', viewportWidth)
    this.playIndicatorEl.setAttribute('y1', 0)
    this.playIndicatorEl.setAttribute('y2', 0)
    this.playIndicatorEl.setAttribute('stroke', 'black')
  }

  _stopAnimation = (aniData) => {
    clearInterval(aniData.id)
    this.playIndicatorEl.setAttribute('stroke', 'transparent')
    aniData.position = 0
  }

  _getAndSetPlayerAnimations = () => {
    const {
      instances,
      setPlayerAnimations
    } = this.props

    const trakDuration = instances[0].trak.duration
    const pixelsPerSecond = (unitLength + 1) / unitDuration
    const trakHeight = trakDuration * pixelsPerSecond
    const playAnimation = this._getInstancesPlaybackAnimation(trakHeight)

    setPlayerAnimations(playAnimation, this._stopAnimation)
  }

  componentDidMount () {
    if (this.props.instances.length) {
      this._getAndSetPlayerAnimations()
    }
  }

  componentDidUpdate (prevProps) {
    if ((this.props.instances !== prevProps.instances) && this.props.instances.length) {
      this._getAndSetPlayerAnimations()
    }
  }

  render () {
    const { instances } = this.props

    if (instances.length === 0) {
      return null
    }
  
    const viewportWidth = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300
  
    const trakDuration = instances[0].trak.duration
  
    const pixelsPerSecond = (unitLength + 1) / unitDuration
    const trakHeight = trakDuration * pixelsPerSecond
  
    const samples = instances.map(instance => {
      return {
        sequencerCsv: instance.sequencer_csv,
        sampleDuration: instance.sample.duration,
        id: instance.id
      }
    })
    const svgRectangles = calculateInstanceRectangles(samples, viewportWidth)

    return (
      <svg style={{ display: 'block' }} width={viewportWidth} height={trakHeight}>
        { svgRectangles }
        <line
          x1='0'
          x2={viewportWidth}
          ref={ref => { this.playIndicatorEl = ref }}
        />
      </svg>
    )
  }
}

export default InstanceRectangles
