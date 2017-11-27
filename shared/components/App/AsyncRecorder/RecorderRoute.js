import React from 'react';
import Helmet from 'react-helmet';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Redirect from 'react-router/Redirect';

import config from '../../../../config';

import Recorder from '../../../../client/components/Recorder';
import Staging from './AsyncStaging';
import Cleanup from './AsyncCleanup';

import * as selectors from '../../../reducers';

import styles from './styles.css';


class RecorderRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClient: false
    };
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    const currentTrakName = this.props.trakName || '';

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${currentTrakName}::recorder - ${config('appTitle')}`}</title>
        </Helmet>

        {
          this.state.isClient
            ? (
              <Switch>
                <Route 
                  exact 
                  path={this.props.match.url}
                  component={Recorder} />

                { // If a recording does not exist, we shouldn't be able to route to /staging
                  this.props.objectUrl
                    ? (
                      [
                        <Route key={1} path={`${this.props.match.url}/staging`} component={Staging} />,
                        <Route key={2} path={`${this.props.match.url}/cleanup`} component={Cleanup} />
                      ]
                    )
                    : <Redirect to={{ pathname: `${this.props.match.url}` }}/>
                }
              </Switch>
            )
            : (
              <div className={styles.loadingMessage}>
                !!Loading!!
              </div>
            )
        }
        
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state),
    trakName: selectors.getTrakName(state)
  }
}

export { RecorderRoute }

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(RecorderRoute);