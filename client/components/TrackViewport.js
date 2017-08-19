import React from 'react';
import viewportDimensions from 'viewport-dimensions';

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
            x={scaledStartPos * viewportWidth}
            y={index * rowHeight}
            width={scaledDuration * viewportWidth}
            height={rowHeight}
            fill={'#000000'}
          />
        ))

        return [...rectangles, ...newRectangles]
      }, [])
    }
    </svg>
  );
}

const TrackViewport = ({ rowsOfRectangles }) => {
  const width = viewportDimensions 
    ? viewportDimensions.width() && viewportDimensions.width()
    : 300;
  const height = viewportDimensions
    ? viewportDimensions.height() && viewportDimensions.height()
    : 300;

  return drawRectangles(rowsOfRectangles, width, height);
}

export default TrackViewport;