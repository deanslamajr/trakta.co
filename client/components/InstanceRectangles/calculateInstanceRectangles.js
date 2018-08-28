import React from 'react'

import { unitLength, unitDuration } from '../../lib/units'
import getColorFromString from '../../../shared/lib/getColorFromString'

import colors from '../../../shared/styles/colors.css'

const padding = 1

function convertSampleTimesToPixels ({ sampleDuration, id, sequencerCsv }) {
  // convert from csv positions to viewport scale

  const sequencerPositionsArray = sequencerCsv.split(',')
  const scaledSequencerPositions = sequencerPositionsArray.map(position => {
    /**
     * Account for 1 px border of sequencer items
     * 1px for top border on of first item
     * 2px for each set of four sequencer items
     **/
    const setOfFourIndex = Math.floor(position / 4)
    const sequencerItemBorderSpacing = 1 + (setOfFourIndex * 2)
    return (position * unitLength) + sequencerItemBorderSpacing
  })

  const sampleUnitCount = sampleDuration / unitDuration
  const scaledSampleDuration = sampleUnitCount * unitLength
  const scaledDurationFirstStartToLastEnd = (scaledSequencerPositions[scaledSequencerPositions.length - 1] + scaledSampleDuration) - scaledSequencerPositions[0]

  return {
    id,
    scaledDurationFirstStartToLastEnd,
    scaledSampleDuration,
    scaledSequencerPositions
  }
}

/**
 * Group rectangles into rows to ensure there are no collisions between rectangles on the same row
 * @param {Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>} rectangles
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>>} array of rows
 */
function arrangeRectanglesIntoColumns (rectangles) {
  let rectanglesCopy = Array.from(rectangles)
  rectanglesCopy.sort((a, b) => a.scaledSequencerPositions[0] - b.scaledSequencerPositions[0])

  const arrangedColumns = []

  while (rectanglesCopy.length) {
    const tempArray = []
    let currentInstance = rectanglesCopy.splice(0, 1)[0]
    const column = [currentInstance]

    while (rectanglesCopy.length) {
      const nextInstance = rectanglesCopy.splice(0, 1)[0]
      if (nextInstance.scaledSequencerPositions[0] >= currentInstance.scaledSequencerPositions[0] + currentInstance.scaledDuration) {
        column.push(nextInstance)
        currentInstance = nextInstance
      } else {
        tempArray.push(nextInstance)
      }
    }

    arrangedColumns.push(column)
    rectanglesCopy = Array.from(tempArray)
  }

  return arrangedColumns
}

function generateRectangles (columnsOfRectangles, viewportWidth) {
  const columnsCount = columnsOfRectangles.length
  const totalPaddingWidth = (columnsCount + 1) * padding
  const viewportWidthWithoutPadding = viewportWidth - totalPaddingWidth
  const columnWidth = viewportWidthWithoutPadding / columnsCount

  return columnsOfRectangles.reduce((rectangles, columnOfRectangles, index) => {
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
                strokeWidth='1px'
                strokeLinecap='round'
              />
            ))
          }

        </React.Fragment>
      )
    })

    return [...rectangles, ...newRectangles]
  }, [])
}

/**
 * generate the instructions to draw the instances that should appear on the given track viewport
 * @param {Number} trackWindowStart
 * @param {Number} trackWindowLength
 * @param {Array<Object<start_time: Number, duration: Number, id: String>>} instances
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: String>>>} data to draw game board
 */
function calculateInstanceRectangles (samples, viewportWidth) {
  const rectangles = samples.map(sample => convertSampleTimesToPixels(sample))
  const columnsOfRectangles = arrangeRectanglesIntoColumns(rectangles)
  return generateRectangles(columnsOfRectangles, viewportWidth)
}

export default calculateInstanceRectangles
