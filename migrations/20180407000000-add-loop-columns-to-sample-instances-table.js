'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.addColumn('sample_instances', 'loop_count',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        { transaction: t }
      )
      .then(() => {
        return queryInterface.addColumn('sample_instances', 'loop_padding',
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
      queryInterface.removeColumn('sample_instances', 'loop_padding', { transaction: t })
        .then(() => queryInterface.removeColumn('sample_instances', 'loop_count', { transaction: t }))
    ))
  }
}
