import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import SampleInstances from '../../../../../client/components/SampleInstances'

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
    return (
      <div className={styles.container}>
        <SampleInstances />
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

export default withStyles(styles)(SlicesRoute)

export { SlicesRoute }
