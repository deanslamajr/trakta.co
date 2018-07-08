import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router/Redirect'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import axios from 'axios'

import Staging from './AsyncStaging'
import Cleanup from './AsyncCleanup'
import Recorder from './AsyncRecorder'
import Slices from './AsyncSlices'
import ProgressRing from '../AsyncProgressRing'
import InstancePlaylist from '../../../../client/components/InstancePlaylist'

import config from '../../../../config'

import * as selectors from '../../../reducers'

import styles from './styles.css'

const defaultStagedSample = {
  startTime: 0,
  volume: 0,
  panning: 0,
  duration: 0,
  loopCount: 0,
  loopPadding: 0
}

class EditRoute extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      incrementPlaysCount: true,
      trakName: this.props.match.url.split('/')[2],
      shouldFetchInstances: true,
      spinnerTasks: {
        count: 0,
        completedCount: 0
      },
      stagedSample: defaultStagedSample
    }
  }

  _resetStagedSample = () => {
    this.setState({ stagedSample: defaultStagedSample })
  }

  _fetchInstances = () => {
    this._addSpinnerTask()
    axios.get(`/api/sample-instances/${this.state.trakName}`)
      .then(({ data: instances }) => {
        this.setState({ instances })
        this._addSpinnerTask(instances.length * 2) /** x2 to account for the rendering task taking ~50% of the total time */
        this._completeSpinnerTask()

        const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
        const PlaylistRenderer = getPlaylistRenderer()
        
        return PlaylistRenderer.createCurrentTrakPlayer(instances, this._completeSpinnerTask)
      })
      .then(currentTrakPlayer => {
        this.setState({
          currentTrakPlayer,
          activePlayer: currentTrakPlayer,
          shouldFetchInstances: false
        })
      })
  }

  _renderLoadingComponent = (progress) => {
    return (
      <div className={styles.spinner}>
        <ProgressRing radius={50} stroke={2} progress={progress} />
      </div>
    )
  }

  _addSpinnerTask = (count = 1) => {
    this.setState(({ spinnerTasks: previousSpinnerTasks }) => {
      const updatedSpinnerTasks = Object.assign({}, previousSpinnerTasks, {
        count: previousSpinnerTasks.count + count
      })
      
      return { spinnerTasks: updatedSpinnerTasks }
    })
  }

  _completeSpinnerTask = (count = 1) => {
    this.setState(({ spinnerTasks: previousSpinnerTasks }) => {
      const updatedSpinnerTasks = Object.assign({}, previousSpinnerTasks, {
        completedCount: previousSpinnerTasks.completedCount + count
      })
      
      return { spinnerTasks: updatedSpinnerTasks }
    })
  }

  _setShouldFetchInstances = (shouldFetchInstances) => {
    this.setState({ shouldFetchInstances })
  }

  render () {
    const {
      spinnerTasks
    } = this.state

    const loadingProgress = spinnerTasks.count
      ? spinnerTasks.completedCount / spinnerTasks.count
      : 0
    const showLoadSpinner = 0 < loadingProgress && loadingProgress < 1

    return (
      <div className={styles.container}>
        <Switch>
          <Redirect exact from='/e/new' to='/e/new/recorder' />
          <Route exact path={this.props.match.url} render={props => (
            <React.Fragment>
              <Helmet>
                <title>{`${this.state.trakName} - ${config('appTitle')}`}</title>
              </Helmet>

              <Slices
                {...props}
                fetchInstances={this._fetchInstances}
                resetStagedSample={this._resetStagedSample}
                shouldFetchInstances={this.state.shouldFetchInstances}
                trakName={this.state.trakName}
              />
            </React.Fragment>
          )} />
          <Route path={`${this.props.match.url}/recorder`} render={props => (
            <React.Fragment>
              <Helmet>
                <title>{`${this.state.trakName} - recorder - ${config('appTitle')}`}</title>
              </Helmet>

              <Recorder
                {...props}
                fetchInstances={this._fetchInstances}
                shouldFetchInstances={this.state.shouldFetchInstances}
              />
            </React.Fragment>
          )} />
          {
            this.props.objectUrl && ([
              <Route key={0} path={`${this.props.match.url}/cleanup`} render={props => (
                <React.Fragment>
                  <Helmet>
                    <title>{`${this.state.trakName} - cleanup - ${config('appTitle')}`}</title>
                  </Helmet>
                  <Cleanup {...props} addItemToNavBar={this.props.addItemToNavBar} />
                </React.Fragment>
              )} />,
              <Route key={1} path={`${this.props.match.url}/staging`} render={props => (
                <React.Fragment>
                  <Helmet>
                    <title>{`${this.state.trakName} - staging - ${config('appTitle')}`}</title>
                  </Helmet>
                  <Staging {...props} addItemToNavBar={this.props.addItemToNavBar} />
                </React.Fragment>
              )} />
            ])
          }
          <Redirect to={{ pathname: this.props.match.url }} />
        </Switch>

        {
          this.state.activePlayer && (
            <InstancePlaylist
              incrementPlaysCount={this.state.incrementPlaysCount}
              player={this.state.activePlayer}
              trakName={this.state.trakName}
            />
          )
        }
        {
          showLoadSpinner && this._renderLoadingComponent(loadingProgress)
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state)
  }
}

export { EditRoute }

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(EditRoute)
