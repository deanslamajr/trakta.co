import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router/Redirect'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import Staging from './AsyncStaging'
import Cleanup from './AsyncCleanup'
import Recorder from './AsyncRecorder'
import Slices from './AsyncSlices'

import config from '../../../../config'

import {
  setName as setTrakName,
  reset as resetTrak,
  setShouldFetchInstances
} from '../../../actions/trak'
import { setStagedSample, setStagedObjectUrl } from '../../../actions/recorder'
import { reset as resetSampleLoaderState } from '../../../actions/samples'

import * as selectors from '../../../reducers'

import styles from './styles.css'

class EditRoute extends React.Component {
  constructor (props) {
    super(props)

    const trakNameFromUrl = this.props.match.url.split('/')[2]
    this.props.setTrakName(trakNameFromUrl)
  }

  componentWillUnmount () {
    this.props.setShouldFetchInstances(true)
    this.props.setStagedObjectUrl(undefined)
    this.props.setStagedSample({
      startTime: 0,
      volume: 0,
      panning: 0,
      duration: 0,
      loopCount: 0,
      loopPadding: 0
    })
    this.props.resetTrak()

    const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
    const playlistRenderer = getPlaylistRenderer()
    playlistRenderer.clearPlayer()
  }

  render () {
    return (
      <div className={styles.container}>
        <Switch>
          <Redirect exact from='/e/new' to='/e/new/recorder' />
          <Route exact path={this.props.match.url} render={props => (
            <React.Fragment>
              <Helmet>
                <title>{`${this.props.trakName} - ${config('appTitle')}`}</title>
              </Helmet>
              <Slices {...props} addItemToNavBar={this.props.addItemToNavBar} />
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
  resetSampleLoaderState,
  setShouldFetchInstances
}

export { EditRoute }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(EditRoute)
