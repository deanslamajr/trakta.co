'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      // add 'contribution_count' column to 'traks' table
      return queryInterface.addColumn('traks', 'contribution_count',
        {
          type: Sequelize.INTEGER,
          defaultValue: 1,
          allowNull: false
        },
        { transaction: t }
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('traks', 'contribution_count')
  }
}
