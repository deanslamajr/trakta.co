'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'play_codes',
      {
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
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
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('play_codes')
  }
}
