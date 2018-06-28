'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('traks', 'start_time', { transaction: t })
        .then(() => queryInterface.removeColumn('sample_instances', 'loop_padding', { transaction: t }))
        .then(() => queryInterface.removeColumn('sample_instances', 'loop_count', { transaction: t }))
        .then(() => queryInterface.removeColumn('sample_instances', 'panning', { transaction: t }))
        .then(() => queryInterface.removeColumn('sample_instances', 'volume', { transaction: t }))
        .then(() => queryInterface.removeColumn('sample_instances', 'start_time', { transaction: t }))
        .then(() => queryInterface.addColumn('sample_instances', 'sequencer_csv',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '1'
          },
          { transaction: t }
        ))
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('sample_instances', 'sequencer_csv', { transaction: t })
        .then(() => queryInterface.addColumn('sample_instances', 'start_time',
          {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
          },
          { transaction: t }
        ))
        .then(() => queryInterface.addColumn('sample_instances', 'volume',
          {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: -6.0
          },
          { transaction: t }
        ))
        .then(() => queryInterface.addColumn('sample_instances', 'panning',
          {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
          },
          { transaction: t }
        ))
        .then(() => queryInterface.addColumn('sample_instances', 'loop_count',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '1'
          },
          { transaction: t }
        ))
        .then(() => queryInterface.addColumn('sample_instances', 'loop_padding',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '1'
          },
          { transaction: t }
        ))
        .then(() => queryInterface.addColumn('traks', 'start_time',
          {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0.0
          },
          { transaction: t }
        ))
    })
  }
}
