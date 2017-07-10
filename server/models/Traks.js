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
    is_vacant: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    contributions_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    skips_count: {
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

export default Traks