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
import InstancePlaylist from '../../../../client/components/InstancePlaylist'

import config from '../../../../config'

import {
  setName as setTrakName,
  reset as resetTrak,
  setShouldFetchInstances
} from '../../../actions/trak'
import { setStagedSample, setStagedObjectUrl } from '../../../actions/recorder'

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
      stagedSample: defaultStagedSample
    }
  }

  _resetStagedSample = () => {
    this.setState({ stagedSample: defaultStagedSample })
  }

  _fetchInstances = () => {
    axios.get(`/api/sample-instances/${this.state.trakName}`)
      .then(({ data: instances }) => {
        this.setState({ instances })

        const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
        const PlaylistRenderer = getPlaylistRenderer()
        
        return PlaylistRenderer.createCurrentTrakPlayer(instances, () => { console.log('a load task has completed!')})
      })
      .then(currentTrakPlayer => {
        this.setState({
          currentTrakPlayer,
          activePlayer: currentTrakPlayer
        })
      })
  }

  render () {
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
                addItemToNavBar={this.props.addItemToNavBar}
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
                <title>{`${this.props.trakName} - recorder - ${config('appTitle')}`}</title>
              </Helmet>
              <Recorder {...props} addItemToNavBar={this.props.addItemToNavBar} />
            </React.Fragment>
          )} />
          {
            this.props.objectUrl && ([
              <Route key={0} path={`${this.props.match.url}/cleanup`} render={props => (
                <React.Fragment>
                  <Helmet>
                    <title>{`${this.props.trakName} - cleanup - ${config('appTitle')}`}</title>
                  </Helmet>
                  <Cleanup {...props} addItemToNavBar={this.props.addItemToNavBar} />
                </React.Fragment>
              )} />,
              <Route key={1} path={`${this.props.match.url}/staging`} render={props => (
                <React.Fragment>
                  <Helmet>
                    <title>{`${this.props.trakName} - staging - ${config('appTitle')}`}</title>
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
              addItemToNavBar={this.props.addItemToNavBar}
              incrementPlaysCount={this.state.incrementPlaysCount}
              player={this.state.activePlayer}
              trakName={this.state.trakName}
            />
          )
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state),
    trakName: selectors.getTrakName(state)
  }
}

const mapActionsToProps = {
  setTrakName,
  resetTrak,
  setStagedSample,
  setStagedObjectUrl,
  setShouldFetchInstances
}

export { EditRoute }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(EditRoute)
