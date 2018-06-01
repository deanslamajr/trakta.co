import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router/Redirect'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'

import Staging from './AsyncStaging'
import Cleanup from './AsyncCleanup'
import Recorder from './AsyncRecorder'
import EditMain from './AsyncEditMain'

import * as selectors from '../../../reducers'

import styles from './styles.css'

class EditRoute extends React.Component {
  render () {
    return (
      <div className={styles.container}>
        <Switch>
          <Redirect exact from='/e/new' to='/e/new/recorder' />
          <Route exact path={this.props.match.url} render={props => (
            <EditMain {...props} addItemToNavBar={this.props.addItemToNavBar} />
              )}
          />
          <Route path={`${this.props.match.url}/recorder`} render={props => (
            <Recorder {...props} addItemToNavBar={this.props.addItemToNavBar} />
              )}
          />
          {
            this.props.objectUrl && ([
              <Route key={2} path={`${this.props.match.url}/staging`} render={props => (
                <Staging {...props} addItemToNavBar={this.props.addItemToNavBar} />
                  )}
              />,
              <Route key={3} path={`${this.props.match.url}/cleanup`} render={props => (
                <Cleanup {...props} addItemToNavBar={this.props.addItemToNavBar} />
                  )}
              />
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

export { EditRoute }

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(EditRoute)
