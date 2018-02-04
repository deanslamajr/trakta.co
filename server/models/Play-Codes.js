import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const PlayCodes = sequelize.define('play_codes',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    trak_name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
)

export default PlayCodes
