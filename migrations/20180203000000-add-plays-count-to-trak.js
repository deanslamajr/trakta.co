'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traks', 'plays_count',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traks', 'plays_count')
  }
}
