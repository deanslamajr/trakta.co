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
    }))
  }

  static defaultProps = {
    instances: []
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
        <line ref={ref => { this.playIndicatorEl = ref }} />
      </svg>
    )
  }
}

export default InstanceRectangles
