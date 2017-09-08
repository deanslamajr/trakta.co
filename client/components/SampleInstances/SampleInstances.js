import React from 'react';
import viewportDimensions from 'viewport-dimensions';

import calculateInstanceRectangles from './calculateInstanceRectangles';

const padding = 5;

function drawRectangles(rowsOfRectangles, viewportWidth, viewportHeight) {
  const rowsCount = rowsOfRectangles.length;
  const rowHeight = viewportHeight / rowsCount;

  return (
    <svg style={{ display: 'block' }} width={viewportWidth} height={viewportHeight}>
    {
      rowsOfRectangles.reduce((rectangles, rowOfRectangles, index) => {
        const newRectangles = rowOfRectangles.map(({ scaledStartPos, scaledDuration, id }) => (
          <rect
            key={id}
            x={(scaledStartPos * viewportWidth) + padding}
            y={(index * rowHeight) + padding}
            width={(scaledDuration * viewportWidth) - padding}
            height={rowHeight - padding}
            fill='#cfcfcf'
            stroke='black'
            strokeWidth='.15'
            strokeLinecap="round"
          />
        ))

        return [...rectangles, ...newRectangles]
      }, [])
    }
    </svg>
  );
}

const SampleInstances = ({ instances, windowStartTime, windowLength }) => {
  if (instances.length === 0) {
    return null;
  }

  const width = viewportDimensions 
    ? viewportDimensions.width() && viewportDimensions.width()
    : 300;
  const height = viewportDimensions
    ? viewportDimensions.height() && viewportDimensions.height()
    : 300;

  const samples = instances.map(
    instance => {
      return {
        start_time: instance.start_time,
        duration: instance.sample.duration,
        id: instance.id
      }
    }
  );

  const rowsOfRectangles = calculateInstanceRectangles(windowStartTime, windowLength, samples);

  return drawRectangles(rowsOfRectangles, width, height);
}

export default SampleInstances;