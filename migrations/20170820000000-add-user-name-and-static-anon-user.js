'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      // add 'name' column to 'players' table
      return queryInterface.addColumn('players', 'name',
        { type: Sequelize.STRING },
        { transaction: t }
      )
      // add 'anonymous' user to 'users' table
      .then(() => {
        return queryInterface.sequelize.query("INSERT INTO players (created_at, updated_at, id, name, score) VALUES (current_timestamp, current_timestamp, '014f476a6c9c403c9b43c1448a4b29a6', 'Anonymous', 0)",
          { transaction: t })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      // remove all rows from 'players' table
      return queryInterface.bulkDelete('players', {}, { transaction: t })
      // remove 'name' column from 'users' table
        .then(() => queryInterface.removeColumn('players', 'name', { transaction: t }))
    })
  }
}
