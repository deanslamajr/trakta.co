'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('traks', 'last_contribution_date',
      {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traks', 'last_contribution_date')
  }
}
