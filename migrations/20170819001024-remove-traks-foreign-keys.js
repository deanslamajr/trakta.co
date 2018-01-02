'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('sample_instances', 'trak_id', { transaction: t })
        .then(() => queryInterface.bulkDelete('traks', {}, { transaction: t }))
        .then(() => queryInterface.dropTable('traks', { transaction: t }
        ))
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable(
          'traks',
        {
          created_at: Sequelize.DATE,
          updated_at: Sequelize.DATE,
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
          },
          is_vacant: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false
          },
          contributions_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          skips_count: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
          },
          originators_player_id: {
            type: Sequelize.UUID,
            references: {
              model: 'players',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
          }
        },
          { transaction: t }
        )
        .then(() => queryInterface.bulkDelete('sample_instances', {}, { transaction: t }))
        .then(() => queryInterface.addColumn('sample_instances', 'trak_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'traks',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
          },
          { transaction: t }
        ))
    })
  }
}
