/* eslint-env jest */

import {
  calculateInstanceRectangles,
  generateRectangles,
  arrangeRectanglesIntoRows } from './calculateInstanceRectangles'

const windowStartAtOrigin = 0
const unitLengthWindow = 1

/**
 *
 *
 * calculateInstanceRectangles
 *
 *
 *
 */

describe('calculateInstanceRectangles', () => {
  describe('if given no instances', () => {
    it('should return an empty array', () => {
      const mockInstances = []

      const actual = calculateInstanceRectangles(windowStartAtOrigin, unitLengthWindow, mockInstances)

      expect(actual).toEqual([])
    })
  })

  describe('if there are no collisions among the instances', () => {
    it('should return a single row of rectangles', () => {
      const mockInstances = [
        {
          id: '1',
          start_time: 0,
          duration: 0.1
        },
        {
          id: '2',
          start_time: 0.2,
          duration: 0.1
        },
        {
          id: '3',
          start_time: 0.4,
          duration: 0.1
        },
        {
          id: '4',
          start_time: 0.6,
          duration: 0.1
        }
      ]

      const expected = [
        [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0.2,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0.4,
            scaledDuration: 0.1
          },
          {
            id: '4',
            scaledStartPos: 0.6,
            scaledDuration: 0.1
          }
        ]
      ]

      const actual = calculateInstanceRectangles(windowStartAtOrigin, unitLengthWindow, mockInstances)

      expect(actual).toEqual(expected)
    })
  })

  describe('if there are no collisions among the instances, and the window is much larger than origin', () => {
    it('should return a single row of rectangles', () => {
      const largeWindowLength = 10

      const mockInstances = [
        {
          id: '1',
          start_time: 0,
          duration: 0.1 * largeWindowLength
        },
        {
          id: '2',
          start_time: 0.2 * largeWindowLength,
          duration: 0.1 * largeWindowLength
        },
        {
          id: '3',
          start_time: 0.4 * largeWindowLength,
          duration: 0.1 * largeWindowLength
        },
        {
          id: '4',
          start_time: 0.6 * largeWindowLength,
          duration: 0.1 * largeWindowLength
        }
      ]

      const expected = [
        [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0.2,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0.4,
            scaledDuration: 0.1
          },
          {
            id: '4',
            scaledStartPos: 0.6,
            scaledDuration: 0.1
          }
        ]
      ]

      const actual = calculateInstanceRectangles(windowStartAtOrigin, largeWindowLength, mockInstances)

      expect(actual).toEqual(expected)
    })
  })

  describe('if there are collisions among the instances', () => {
    describe('if there are two instances involved', () => {
      it('should return 2 row of rectangles', () => {
        const mockInstances = [
          {
            id: '1',
            start_time: 0,
            duration: 0.1
          },
          {
            id: '2',
            start_time: 0,
            duration: 0.1
          },
          {
            id: '3',
            start_time: 0.4,
            duration: 0.1
          },
          {
            id: '4',
            start_time: 0.6,
            duration: 0.1
          }
        ]

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.1
            },
            {
              id: '3',
              scaledStartPos: 0.4,
              scaledDuration: 0.1
            },
            {
              id: '4',
              scaledStartPos: 0.6,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ]
        ]

        const actual = calculateInstanceRectangles(windowStartAtOrigin, unitLengthWindow, mockInstances)

        expect(actual).toEqual(expected)
      })
    })

    describe('if there are 4 instances involved', () => {
      it('should return 4 row of rectangles', () => {
        const mockInstances = [
          {
            id: '1',
            start_time: 0,
            duration: 0.1
          },
          {
            id: '2',
            start_time: 0,
            duration: 0.1
          },
          {
            id: '3',
            start_time: 0,
            duration: 0.1
          },
          {
            id: '4',
            start_time: 0,
            duration: 0.1
          }
        ]

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '3',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '4',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ]
        ]

        const actual = calculateInstanceRectangles(windowStartAtOrigin, unitLengthWindow, mockInstances)

        expect(expected).toEqual(actual)
      })
    })
  })
})

/**
 *
 *
 * generateRectangles
 *
 *
 *
 */

describe('generateRectangles', () => {
  describe('if four of the exact same instance are given', () => {
    it('should return 4 of the exact same rectangle', () => {
      const mockInstances = [
        {
          id: '1',
          start_time: 0,
          duration: 0.1
        },
        {
          id: '2',
          start_time: 0,
          duration: 0.1
        },
        {
          id: '3',
          start_time: 0,
          duration: 0.1
        },
        {
          id: '4',
          start_time: 0,
          duration: 0.1
        }
      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0,
          scaledDuration: 0.1
        },
        {
          id: '2',
          scaledStartPos: 0,
          scaledDuration: 0.1
        },
        {
          id: '3',
          scaledStartPos: 0,
          scaledDuration: 0.1
        },
        {
          id: '4',
          scaledStartPos: 0,
          scaledDuration: 0.1
        }
      ]

      const actual = generateRectangles(windowStartAtOrigin, unitLengthWindow, mockInstances)

      expect(actual).toEqual(expected)
    })
  })

  describe('if instances are completely within the track window', () => {
    it('should correctly generate `startPos` and `duration` for the instance', () => {
      const trackWindowStart = 0
      const trackWindowLength = 2

      const mockInstances = [
        {
          id: '1',
          start_time: 0,
          duration: 2
        },
        {
          id: '2',
          start_time: 1,
          duration: 1
        },
        {
          id: '3',
          start_time: 1.5,
          duration: 0.5
        }

      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0,
          scaledDuration: 1
        },
        {
          id: '2',
          scaledStartPos: 0.5,
          scaledDuration: 0.5
        },
        {
          id: '3',
          scaledStartPos: 0.75,
          scaledDuration: 0.25
        }
      ]

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })

    it('should correctly generate `startPos` and `duration` for the instance for large track window length values', () => {
      const trackWindowStart = 0
      const trackWindowLength = 1000

      const mockInstances = [
        {
          id: '1',
          start_time: 0,
          duration: 1000
        },
        {
          id: '2',
          start_time: 500,
          duration: 100
        },
        {
          id: '3',
          start_time: 500,
          duration: 500
        }

      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0,
          scaledDuration: 1
        },
        {
          id: '2',
          scaledStartPos: 0.5,
          scaledDuration: 0.1
        },
        {
          id: '3',
          scaledStartPos: 0.5,
          scaledDuration: 0.5
        }
      ]

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  describe('if an instance`s `start_time` is less than `trackWindowStart`', () => {
    it('should generate the `startPos` to be equal to `trackWindowStart`', () => {
      const trackWindowStart = 0
      const trackWindowLength = 2

      const mockInstances = [
        {
          id: '1',
          start_time: -1,
          duration: 2
        },
        {
          id: '2',
          start_time: -1,
          duration: 3
        }
      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0,
          scaledDuration: 0.5
        },
        {
          id: '2',
          scaledStartPos: 0,
          scaledDuration: 1
        }
      ]

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  describe('if an instance`s end occurs before `trackWindowStart`', () => {
    it('should not generate a rectangle for the instance', () => {
      const trackWindowStart = 1000
      const trackWindowLength = 20

      const mockInstances = [
        {
          id: '1',
          start_time: 100,
          duration: 20
        },
        {
          id: '2',
          start_time: 0,
          duration: 999
        },
        {
          id: '3',
          start_time: 999,
          duration: 0.999
        }
      ]

      const expected = []

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  describe('if an instance`s `start_time` occurs after the track window`s duration', () => {
    it('should not generate a rectangle for the instance', () => {
      const trackWindowStart = 1000
      const trackWindowLength = 20

      const mockInstances = [
        {
          id: '1',
          start_time: 1020,
          duration: 20
        },
        {
          id: '2',
          start_time: 2000,
          duration: 999
        },
        {
          id: '3',
          start_time: 1020,
          duration: 1
        }
      ]

      const expected = []

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  describe('if an instance`s duration has it`s end occur after the track window`s duration', () => {
    it('should generate the `endPos` to be equal to `trackWindowStart` + `trackWindowLength`', () => {
      const trackWindowStart = 100
      const trackWindowLength = 100

      const mockInstances = [
        {
          id: '1',
          start_time: 150,
          duration: 1000
        },
        {
          id: '2',
          start_time: 175,
          duration: 50
        },
        {
          id: '3',
          start_time: 150,
          duration: 60
        }
      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0.5,
          scaledDuration: 0.5
        },
        {
          id: '2',
          scaledStartPos: 0.75,
          scaledDuration: 0.25
        },
        {
          id: '3',
          scaledStartPos: 0.5,
          scaledDuration: 0.5
        }
      ]

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  describe('if an instance`s `start_time` is less than or equal to `trackWindowStart` AND an instance`s duration has it`s end occur at or after the track window`s duration', () => {
    it('should generate rectangle equal to the trackWindow`s `trackWindowStart` and `trackWindowLength`', () => {
      const trackWindowStart = 100
      const trackWindowLength = 100

      const mockInstances = [
        {
          id: '1',
          start_time: 50,
          duration: 1000
        },
        {
          id: '2',
          start_time: 0,
          duration: 200
        },
        {
          id: '3',
          start_time: 100,
          duration: 100
        },
        {
          id: '4',
          start_time: 100,
          duration: 2000
        }
      ]

      const expected = [
        {
          id: '1',
          scaledStartPos: 0,
          scaledDuration: 1
        },
        {
          id: '2',
          scaledStartPos: 0,
          scaledDuration: 1
        },
        {
          id: '3',
          scaledStartPos: 0,
          scaledDuration: 1
        },
        {
          id: '4',
          scaledStartPos: 0,
          scaledDuration: 1
        }
      ]

      const result = generateRectangles(trackWindowStart, trackWindowLength, mockInstances)

      expect(result).toEqual(expected)
    })
  })

  /**
 *
 *
 * arrangeRectanglesIntoRows
 *
 *
 *
 */

  describe('arrangeRectanglesIntoRows', () => {
    describe('if no instances are passed', () => {
      it('should return no rows', () => {
        const mockInstances = []

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = []

        expect(actual).toEqual(expected)
      })
    })

    describe('if there is a single collision between 4 rectangles', () => {
      it('should return 4 rows', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '4',
            scaledStartPos: 0,
            scaledDuration: 0.1
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '3',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '4',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if there are no collisions between passed instances', () => {
      it('should return a single row', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0.4,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0.6,
            scaledDuration: 0.1
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.1
            },
            {
              id: '2',
              scaledStartPos: 0.4,
              scaledDuration: 0.1
            },
            {
              id: '3',
              scaledStartPos: 0.6,
              scaledDuration: 0.1
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if there are no collisions between passed instances, but they are not sorted by startposition', () => {
      it('should return a single row', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0.6,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0.4,
            scaledDuration: 0.1
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '2',
              scaledStartPos: 0,
              scaledDuration: 0.1
            },
            {
              id: '3',
              scaledStartPos: 0.4,
              scaledDuration: 0.1
            },
            {
              id: '1',
              scaledStartPos: 0.6,
              scaledDuration: 0.1
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if all instances have the same start_time', () => {
      it('should return as many rows as there are samples', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '2',
            scaledStartPos: 0,
            scaledDuration: 0.1
          },
          {
            id: '3',
            scaledStartPos: 0,
            scaledDuration: 0.1
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ],
          [
            {
              id: '3',
              scaledStartPos: 0,
              scaledDuration: 0.1
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if all instances collide', () => {
      it('should return as many rows as there are samples', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.6
          },
          {
            id: '2',
            scaledStartPos: 0.1,
            scaledDuration: 0.3
          },
          {
            id: '3',
            scaledStartPos: 0.2,
            scaledDuration: 0.6
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.6
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0.1,
              scaledDuration: 0.3
            }
          ],
          [
            {
              id: '3',
              scaledStartPos: 0.2,
              scaledDuration: 0.6
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if all instances collide, but are not sorted by scaledStartPos', () => {
      it('should return as many rows as there are samples', () => {
        const mockInstances = [
          {
            id: '2',
            scaledStartPos: 0.1,
            scaledDuration: 0.3
          },
          {
            id: '3',
            scaledStartPos: 0.2,
            scaledDuration: 0.6
          },
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.6
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.6
            }
          ],
          [
            {
              id: '2',
              scaledStartPos: 0.1,
              scaledDuration: 0.3
            }
          ],
          [
            {
              id: '3',
              scaledStartPos: 0.2,
              scaledDuration: 0.6
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if given instances where there are some collisions between instances', () => {
      it('should return the proper number of rows to ensure there are no collisions between samples on the same row', () => {
        const mockInstances = [
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.2
          },
          {
            id: '2',
            scaledStartPos: 0.3,
            scaledDuration: 0.2
          },
          {
            id: '3',
            scaledStartPos: 0.6,
            scaledDuration: 0.2
          },
          {
            id: '4',
            scaledStartPos: 0.1,
            scaledDuration: 0.6
          },
          {
            id: '5',
            scaledStartPos: 0.8,
            scaledDuration: 0.2
          },
          {
            id: '6',
            scaledStartPos: 0,
            scaledDuration: 0.2
          },
          {
            id: '7',
            scaledStartPos: 0,
            scaledDuration: 0.2
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.2
            },
            {
              id: '2',
              scaledStartPos: 0.3,
              scaledDuration: 0.2
            },
            {
              id: '3',
              scaledStartPos: 0.6,
              scaledDuration: 0.2
            },
            {
              id: '5',
              scaledStartPos: 0.8,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '6',
              scaledStartPos: 0,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '7',
              scaledStartPos: 0,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '4',
              scaledStartPos: 0.1,
              scaledDuration: 0.6
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })

    describe('if given unsorted instances where there are some collisions between instances', () => {
      it('should return the proper number of rows to ensure there are no collisions between samples on the same row', () => {
        const mockInstances = [
          {
            id: '5',
            scaledStartPos: 0.8,
            scaledDuration: 0.2
          },
          {
            id: '4',
            scaledStartPos: 0.1,
            scaledDuration: 0.6
          },
          {
            id: '6',
            scaledStartPos: 0,
            scaledDuration: 0.2
          },
          {
            id: '7',
            scaledStartPos: 0,
            scaledDuration: 0.2
          },
          {
            id: '2',
            scaledStartPos: 0.3,
            scaledDuration: 0.2
          },
          {
            id: '3',
            scaledStartPos: 0.6,
            scaledDuration: 0.2
          },
          {
            id: '1',
            scaledStartPos: 0,
            scaledDuration: 0.2
          }
        ]

        const actual = arrangeRectanglesIntoRows(mockInstances)

        const expected = [
          [
            {
              id: '6',
              scaledStartPos: 0,
              scaledDuration: 0.2
            },
            {
              id: '2',
              scaledStartPos: 0.3,
              scaledDuration: 0.2
            },
            {
              id: '3',
              scaledStartPos: 0.6,
              scaledDuration: 0.2
            },
            {
              id: '5',
              scaledStartPos: 0.8,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '7',
              scaledStartPos: 0,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '1',
              scaledStartPos: 0,
              scaledDuration: 0.2
            }
          ],
          [
            {
              id: '4',
              scaledStartPos: 0.1,
              scaledDuration: 0.6
            }
          ]
        ]

        expect(actual).toEqual(expected)
      })
    })
  })
})
