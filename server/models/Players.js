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
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
);

const ANONYMOUS_PLAYER_ID = '014f476a-6c9c-403c-9b43-c1448a4b29a6'

export {
  Player as default,
  ANONYMOUS_PLAYER_ID
}