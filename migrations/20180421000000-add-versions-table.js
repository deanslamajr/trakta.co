'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.createTable(
        'versions',
        {
          created_at: Sequelize.DATE,
          updated_at: Sequelize.DATE,
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
          },
          version: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          filename: {
            type: Sequelize.STRING
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          trak_id: {
            type: Sequelize.UUID,
            references: {
              model: 'traks',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
          }
        },
        { transaction: t }
      )
      .then(() => {
        return queryInterface.addColumn('sample_instances', 'version_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'versions',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
          },
          { transaction: t }
        )
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.removeColumn('sample_instances', 'version_id', { transaction: t })
        .then(() => queryInterface.dropTable('versions', { transaction: t }))
    })
  }
}
