import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import SampleInstances from '../../../../../client/components/SampleInstances'
import InstancePlaylist from '../../../../../client/components/InstancePlaylist'

import { reset as resetSampleLoaderState } from '../../../../actions/samples'
import { fetchInstances } from '../../../../actions/trak'
import { setStagedSample, setStagedObjectUrl } from '../../../../actions/recorder'

import * as selectors from '../../../../reducers'

import ProgressRing from '../../AsyncProgressRing'

import styles from './styles.css'

class SlicesRoute extends React.Component {
  constructor (props) {
    super(props)

    this._showContribute = this._showContribute.bind(this)
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this)
  }

  _showContribute () {
    let urlWithoutTrailingSlash = this.props.match.url
    if (urlWithoutTrailingSlash.charAt(urlWithoutTrailingSlash.length - 1) === '/') {
      urlWithoutTrailingSlash = urlWithoutTrailingSlash.slice(0, -1)
    }

    this.props.history.push(`${urlWithoutTrailingSlash}/recorder`)
  }

  _renderLoadingComponent () {
    const progress = this.props.finishedTasks / this.props.totalTasks

    return (
      <div className={styles.spinner}>
        <ProgressRing radius={50} stroke={2} progress={progress} />
      </div>
    )
  }

  componentDidMount () {
    const trakNameFromUrl = this.props.match.path.split('/')[2]

    if (!trakNameFromUrl) {
      // @case - url navigation without trakName in path
      // @todo
      // fetch a random track??
      return this.props.history.push('/new')
    }

    // reset staging stuff
    this.props.setStagedObjectUrl(undefined)
    this.props.setStagedSample({
      startTime: 0,
      volume: 0,
      panning: 0,
      duration: 0,
      loopCount: 0,
      loopPadding: 0
    })

    if (this.props.shouldFetchInstances) {
      this.props.resetSampleLoaderState()
      this.props.fetchInstances()
    }

    this.props.addItemToNavBar({
      TOP_LEFT: { type: 'BACK', cb: () => this.props.history.push('/') },
      BOTTOM_RIGHT: { type: 'ADD', cb: this._showContribute }
    })
  }

  render () {
    const { instances } = this.props

    return (
      <div className={styles.container}>
        {
          // don't begin rendering InstancePlaylist and SampleInstances until instances exist
          // Those components won't function properly if they mount before instances exist
          instances && instances.length
            ? (
              <div className={styles.canvasContainer}>
                <div className={styles.label}>
                  <InstancePlaylist
                    addItemToNavBar={this.props.addItemToNavBar}
                    incrementPlaysCount
                  />
                </div>

                <SampleInstances />
              </div>
            )
            : null
        }
        { this.props.isLoading && this._renderLoadingComponent() }
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    shouldFetchInstances: selectors.getShouldFetchInstances(state),
    isLoading: selectors.isLoading(state),
    trackDimensions: selectors.getTrackDimensions(state),
    totalTasks: selectors.getTotalTasks(state),
    finishedTasks: selectors.getFinishedTasks(state),
    instances: selectors.getInstances(state),
    trakName: selectors.getTrakName(state)
  }
};

const mapActionsToProps = {
  resetSampleLoaderState,
  fetchInstances,
  setStagedSample,
  setStagedObjectUrl
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(SlicesRoute)

export { SlicesRoute }
