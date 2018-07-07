import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import SampleInstances from '../../../../../client/components/SampleInstances'
import InstancePlaylist from '../../../../../client/components/InstancePlaylist'

import { setStagedSample, setStagedObjectUrl } from '../../../../actions/recorder'

import * as selectors from '../../../../reducers'

import ProgressRing from '../../AsyncProgressRing'

import styles from './styles.css'

class SlicesRoute extends React.Component {
  _navigateToList = () => {
    this.props.history.push('/')
  }

  _navigateToContribute = () => {
    let urlWithoutTrailingSlash = this.props.match.url
    if (urlWithoutTrailingSlash.charAt(urlWithoutTrailingSlash.length - 1) === '/') {
      urlWithoutTrailingSlash = urlWithoutTrailingSlash.slice(0, -1)
    }

    this.props.history.push(`${urlWithoutTrailingSlash}/recorder`)
  }

  _renderLoadingComponent = () => {
    const progress = this.props.finishedTasks / this.props.totalTasks

    return (
      <div className={styles.spinner}>
        <ProgressRing radius={50} stroke={2} progress={progress} />
      </div>
    )
  }

  componentDidMount () {
    /** @case - url navigation without trakName in path */
    if (!this.props.trakName) {
      return this.props.history.push('/new')
    }

    this.props.resetStagedSample()

    if (this.props.shouldFetchInstances) {
      this.props.fetchInstances()
    }

    this.props.addItemToNavBar({
      TOP_LEFT: { type: 'BACK', cb: this._navigateToList },
      BOTTOM_RIGHT: { type: 'ADD', cb: this._navigateToContribute }
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
                    instances={this.props.instances}
                    trackDimensions={this.props.trackDimensions}

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

SlicesRoute.propTypes = {
  addItemToNavBar: PropTypes.func.required,
  fetchInstances: PropTypes.func.required,
  history: PropTypes.func.required,
  shouldFetchInstances: PropTypes.bool.required,
  trakName: PropTypes.string,
}

function mapStateToProps (state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    totalTasks: selectors.getTotalTasks(state),
    finishedTasks: selectors.getFinishedTasks(state),
    instances: selectors.getInstances(state),
    trackDimensions: selectors.getTrackDimensions(state)
  }
};

const mapActionsToProps = {
  setStagedSample,
  setStagedObjectUrl
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(SlicesRoute)

export { SlicesRoute }
