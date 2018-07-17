import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import { NavButton } from '../AsyncNavBar/AsyncNavBar'

import { getTrakFilename } from '../../../reducers'

import config from '../../../../config'

import styles from './styles.css'

class PlayerRoute extends React.Component {
  render () {
    const url = `${config('s3TrakBucket')}/${this.props.trakFilename}`

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`Player`}</title>
        </Helmet>

        <NavButton
          type={'BACK'}
          cb={() => this.props.history.push('/')}
          position={'TOP_LEFT'}
        />

        <audio className={styles.player} src={url} controls loop />
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    /** Fetched during server-side rendering */
    trakFilename: getTrakFilename(state)
  }
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PlayerRoute)

export { PlayerRoute }
