import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const Player = sequelize.define('players',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    score: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
);

export default Player