import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Helmet from 'react-helmet'

import Sequencer from './Sequencer'
import { NavButton } from '../../../shared/components/App/AsyncNavBar/AsyncNavBar'
import InstanceRectangles from '../InstanceRectangles'

import config from '../../../config'

import styles from './index.css'

function getMainEditUrl (url) {
  return url.replace('/sequencer', '')
}

class SequencerContainer extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    history: PropTypes.object,
    createPlayerFromSequencer: PropTypes.func,
    createPlayerFromSequencerItemSelect: PropTypes.func,
    saveRecording: PropTypes.func,
    selectedSequencerItems: PropTypes.object,
    setCurrentPlayerActive: PropTypes.func,
    setPlayerAnimations: PropTypes.func,
    showNavbarItems: PropTypes.bool,
    trakName: PropTypes.string
  }

  componentDidMount () {
    this.props.createPlayerFromSequencer()
  }

  render () {
    const mainEditUrl = getMainEditUrl(this.props.match.url)

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${this.props.trakName} - sequencer - ${config('appTitle')}`}</title>
        </Helmet>

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

        <InstanceRectangles
          instances={this.props.instances}
          setPlayerAnimations={this.props.setPlayerAnimations}
        />
      </div>
    )
  }
}

export { SequencerContainer }

export default withStyles(styles)(SequencerContainer)
