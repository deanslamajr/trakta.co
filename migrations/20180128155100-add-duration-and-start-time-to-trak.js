'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('traks', 'duration',
        {
          type: Sequelize.DOUBLE,
          defaultValue: 0,
          allowNull: false
        },
        { transaction: t }
      )
      .then(() => {
        return queryInterface.addColumn('traks', 'start_time',
          {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
          },
          { transaction: t }
        )
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => (
      queryInterface.removeColumn('traks', 'duration', { transaction: t })
        .then(() => queryInterface.removeColumn('traks', 'start_time', { transaction: t }))
    ))
  }
}
