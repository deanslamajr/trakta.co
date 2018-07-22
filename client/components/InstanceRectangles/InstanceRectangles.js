import React from 'react'
import PropTypes from 'prop-types'
import viewportDimensions from 'viewport-dimensions'

import { unitLength, unitDuration } from '../../lib/units'
import getColorFromString from '../../../shared/lib/getColorFromString'
import calculateInstanceRectangles from './calculateInstanceRectangles'

import colors from '../../../shared/styles/colors.css'

const padding = 1

function drawRectangles (columnsOfRectangles, viewportWidth, trakHeight) {
  const columnsCount = columnsOfRectangles.length
  const totalPaddingWidth = (columnsCount + 1) * padding
  const viewportWidthWithoutPadding = viewportWidth - totalPaddingWidth
  const columnWidth = viewportWidthWithoutPadding / columnsCount

  const svgRectangles = columnsOfRectangles.reduce((rectangles, columnOfRectangles, index) => {
    const x = ((index + 1) * padding) + (index * columnWidth)
    const newRectangles = columnOfRectangles.map(({
      scaledSampleDuration,
      scaledSequencerPositions,
      scaledDurationFirstStartToLastEnd,
      id
    }) => {
      const rectColor = getColorFromString(id)
      const colorCode = colors[rectColor]
 
      return (
        <React.Fragment key={id}>
          <rect
            key={id}
            y={(scaledSequencerPositions[0])}
            x={x}
            width={columnWidth}
            height={scaledDurationFirstStartToLastEnd}
            fill='none'
            stroke={colorCode}
            strokeWidth='.15'
            strokeLinecap='round'
          />
          {
            scaledSequencerPositions.map(position => (
              <rect
                key={`${id}::${position}`}
                y={position}
                x={x}
                width={columnWidth}
                height={scaledSampleDuration}
                fill={colorCode}
                opacity='.25'
                stroke={colorCode}
                strokeWidth='.25'
                strokeLinecap='round'
              />
            ))
          }

        </React.Fragment>
      )
    })

    return [...rectangles, ...newRectangles]
  }, [])

  return (
    <svg style={{ display: 'block' }} width={viewportWidth} height={trakHeight}>
      { svgRectangles }
    </svg>
  )
}

const InstanceRectangles = ({ instances = [] }) => {
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

  const columnsOfRectangles = calculateInstanceRectangles(samples)

  return drawRectangles(columnsOfRectangles, viewportWidth, trakHeight)
}

InstanceRectangles.propTypes = {
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

export default InstanceRectangles
