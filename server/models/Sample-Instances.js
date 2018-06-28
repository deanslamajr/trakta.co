import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const SampleInstances = sequelize.define('sample_instances',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    sequencer_csv: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '1'
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
)

export default SampleInstances
