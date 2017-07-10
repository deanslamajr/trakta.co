import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const Samples = sequelize.define('samples',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
);

export default Samples