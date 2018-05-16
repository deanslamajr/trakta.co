import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

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

        <audio src={url} controls loop />
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    trakFilename: getTrakFilename(state)
  }
};

const mapActionsToProps = {}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(PlayerRoute)

export { PlayerRoute }
