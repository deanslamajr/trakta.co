'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.bulkDelete('samples', {}, { transaction: t })
        .then(() => {
          // add `duration` column to `samples` table
          return queryInterface.addColumn(
            'samples',
            'duration',
            {
              type: Sequelize.DOUBLE,
              allowNull: false
            },
            { transaction: t }
          )
        })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('samples', 'duration', { transaction: t })
    })
  }
}
