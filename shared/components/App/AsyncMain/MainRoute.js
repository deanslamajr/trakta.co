import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import config from '../../../../config'

import * as selectors from '../../../reducers'

import { fetchInstances, setName as setTrakName } from '../../../actions/trak'
import { reset as resetSampleLoaderState } from '../../../actions/samples'
import { setStagedSample, setStagedObjectUrl } from '../../../actions/recorder'

import SampleInstances from '../../../../client/components/SampleInstances'
import InstancePlaylist from '../../../../client/components/InstancePlaylist'

import ProgressRing from '../AsyncProgressRing'

import styles from './styles.css'

class MainRoute extends React.Component {
  constructor (props) {
    super(props)

    this._showContribute = this._showContribute.bind(this)
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this)
    this._renderErrorComponent = this._renderErrorComponent.bind(this)
  }

  _showContribute () {
    // @todo have this show a menu of contribution options, which would include <Recorder> among others
    this.props.resetSampleLoaderState()

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

  _renderErrorComponent (clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames(styles.error, styles.button, styles.centerButton)}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    )
  }

  componentDidMount () {
    const trakNameFromUrl = this.props.match.path.split('/')[2]

    if (trakNameFromUrl) {
      this.props.resetSampleLoaderState()
      this.props.setStagedObjectUrl(undefined)
      this.props.setStagedSample({
        startTime: 0,
        volume: 0,
        panning: 0,
        duration: 0,
        loopCount: 0,
        loopPadding: 0
      })
      // @todo handle the case where a non existant trakName is passed

      // verify that we have updated the store to the correct trakName
      if (this.props.trakName !== trakNameFromUrl) {
        this.props.setTrakName(trakNameFromUrl)
      }
      this.props.fetchInstances()
    } else {
      // @case - url navigation without trakName in path
      // @todo
      // fetch a random track??
      return this.props.history.push('/new')
    }

    this.props.addItemToNavBar({
      TOP_LEFT: { type: 'BACK', cb: () => this.props.history.push('/') },
      TOP_RIGHT: { type: 'ADD', cb: this._showContribute }
    })
  }

  componentWillUnmount () {
    this.props.setStagedObjectUrl(undefined)
  }

  render () {
    const { instances } = this.props
    const currentTrakName = this.props.trakName || ''

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${currentTrakName} - ${config('appTitle')}`}</title>
        </Helmet>

        {
          // don't begin rendering InstancePlaylist and SampleInstances until instances exist
          // Those components won't function properly if they mount before instances exist
          instances && instances.length
            ? (
              <div className={styles.canvasContainer}>
                <div className={styles.label}>
                  <InstancePlaylist
                    addItemToNavBar={this.props.addItemToNavBar}
                    renderErrorComponent={this._renderErrorComponent}
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
    isLoading: selectors.isLoading(state),
    trackDimensions: selectors.getTrackDimensions(state),
    totalTasks: selectors.getTotalTasks(state),
    finishedTasks: selectors.getFinishedTasks(state),
    instances: selectors.getInstances(state),
    trakName: selectors.getTrakName(state)
  }
};

const mapActionsToProps = {
  fetchInstances,
  setTrakName,
  resetSampleLoaderState,
  setStagedSample,
  setStagedObjectUrl
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(MainRoute)

export { MainRoute }
