import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Helmet from 'react-helmet'

import Sequencer from './Sequencer'
import { NavButton } from '../../../shared/components/App/AsyncNavBar/AsyncNavBar'
import InstanceRectangles from '../InstanceRectangles'

import config from '../../../config'

import styles from './staging.css'

function getMainEditUrl (url) {
  return url.replace('/staging', '')
}

class Staging extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    history: PropTypes.object,
    createPlayerFromSequencer: PropTypes.func,
    createPlayerFromSequencerItemSelect: PropTypes.func,
    saveRecording: PropTypes.func,
    selectedSequencerItems: PropTypes.object,
    setCurrentPlayerActive: PropTypes.func,
    showNavbarItems: PropTypes.bool,
    trakName: PropTypes.string
  }

  componentDidMount () {
    this.props.createPlayerFromSequencer()
  }

  render () {
    const mainEditUrl = getMainEditUrl(this.props.match.url)

    return (
      <div>
        <Helmet>
          <title>{`${this.props.trakName} - staging - ${config('appTitle')}`}</title>
        </Helmet>

        <InstanceRectangles instances={this.props.instances} />

        {
          this.props.showNavbarItems && (
            <React.Fragment>
              <Sequencer
                onItemSelect={this.props.createPlayerFromSequencerItemSelect}
                selectedItems={this.props.selectedSequencerItems}
              />
              <NavButton
                type={'BACK'}
                cb={() => this.props.history.push(`${mainEditUrl}/cleanup`)}
                position={'TOP_LEFT'}
              />
              <NavButton
                type={'CHECK'}
                cb={this.props.saveRecording}
                position={'BOTTOM_RIGHT'}
              />
            </React.Fragment>
          )
        }
      </div>
    )
  }
}

export { Staging }

export default withStyles(styles)(Staging)
