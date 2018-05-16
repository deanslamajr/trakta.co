import Sequelize from 'sequelize'

import { sequelize } from '../adapters/db'

const Versions = sequelize.define('versions',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    version_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    filename: {
      type: Sequelize.STRING
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    // sequelize should not add an 's' to the end of this model to form the associated table's name
    freezeTableName: true,
    underscored: true
  }
)

Versions.getHighestVersionByTrakId = async function (trakId) {
  // get latest version of trak
  const [ latestVersion ] = await Versions.findAll({
    where: {
      trak_id: trakId,
      active: true // don't get an invalid/orphaned version
    },
    group: [ 'versions.id' ],
    limit: 1,
    order: sequelize.literal('max(version_number) DESC')
  })

  return latestVersion
}

export default Versions
