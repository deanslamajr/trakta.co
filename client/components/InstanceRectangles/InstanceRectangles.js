import React from 'react'
import PropTypes from 'prop-types'
import viewportDimensions from 'viewport-dimensions'
import isequal from 'lodash.isequal'

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

  state = {
    svgRectangles: null
  }

  _getInstancesPlaybackAnimation = (trakHeight) => (playbackDurationSeconds, aniData, time) => {
    const animationInterval = 40
    const playbackDurationMilliseconds = playbackDurationSeconds * 1000
    const numberOfFrames = (playbackDurationMilliseconds / animationInterval)

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
      if (this.playIndicatorEl) {
        this.playIndicatorEl.setAttribute('stroke', 'black')
      }

      if (aniData.id) {
        clearInterval(aniData.id)
      }
      // draw first frame of animation
      drawPosition(this.playIndicatorEl)
      // setup interval for the other frames
      aniData.id = setInterval(() => drawPosition(this.playIndicatorEl), animationInterval)
    }, time)
  }

  _stopAnimation = (aniData) => {
    clearInterval(aniData.id)
    if (this.playIndicatorEl) {
      this.playIndicatorEl.setAttribute('stroke', 'transparent')
    }
    aniData.position = 0
  }

  _getAndSetPlayerAnimations = () => {
    const trakHeight = this.getTrakHeight()
    const playAnimation = this._getInstancesPlaybackAnimation(trakHeight)

    this.props.setPlayerAnimations(playAnimation, this._stopAnimation)
  }

  componentDidMount () {
    if (this.props.instances.length) {
      this._getAndSetPlayerAnimations()
      this.setSvgRectangles()
    }
  }

  componentDidUpdate (prevProps) {
    if (!isequal(this.props.instances, prevProps.instances) && this.props.instances.length) {
      this._getAndSetPlayerAnimations()
      this.setSvgRectangles()
    }
  }

  getTrakHeight = () => {
    const { instances } = this.props

    if (!instances.length) {
      return 0
    }

    const trakDuration = instances[0].trak.duration
    const pixelsPerSecond = (unitLength) / unitDuration

    return trakDuration * pixelsPerSecond
  }

  setSvgRectangles = () => {
    const viewportWidth = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300
  
    const samples = this.props.instances.map(instance => {
      return {
        sequencerCsv: instance.sequencer_csv,
        sampleDuration: instance.sample.duration,
        id: instance.id
      }
    })
    const svgRectangles = calculateInstanceRectangles(samples, viewportWidth)
    
    this.setState({ svgRectangles })
  }

  render () {
    const { svgRectangles } = this.state
  
    const viewportWidth = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300
  
    const trakHeight = this.getTrakHeight()

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
