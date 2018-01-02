'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable(
        'players',
        {
          created_at: Sequelize.DATE,
          updated_at: Sequelize.DATE,
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
          },
          score: {
            type: Sequelize.INTEGER,
            allowNull: false
          }
        },
        { transaction: t })
        .then(() => queryInterface.createTable(
          'samples',
          {
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
              allowNull: false
            },
            url: {
              type: Sequelize.STRING,
              allowNull: false
            },
            player_id: {
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
        ))
        .then(() => queryInterface.createTable(
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
        ))
        .then(() => queryInterface.createTable(
          'sample_instances',
          {
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
              allowNull: false
            },
            player_id: {
              type: Sequelize.UUID,
              references: {
                model: 'players',
                key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
            },
            trak_id: {
              type: Sequelize.UUID,
              references: {
                model: 'traks',
                key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
            },
            sample_id: {
              type: Sequelize.UUID,
              references: {
                model: 'samples',
                key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
            },
            start_time: {
              type: Sequelize.INTEGER,
              allowNull: false
            },
            volume: {
              type: Sequelize.INTEGER,
              allowNull: false
            },
            panning: {
              type: Sequelize.INTEGER,
              allowNull: false
            }
          },
          { transaction: t, underscored: true }
        ))
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.dropTable('sample_instances')
        .then(() => queryInterface.dropTable('samples'))
        .then(() => queryInterface.dropTable('traks'))
        .then(() => queryInterface.dropTable('players'))
    })
  }
}
