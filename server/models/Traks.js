import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const Traks = sequelize.define('traks',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    contribution_count: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
)

export default Traks
