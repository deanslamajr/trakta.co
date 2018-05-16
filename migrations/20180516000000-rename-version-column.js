'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.renameColumn('versions', 'version', 'version_number', { transaction: t })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return queryInterface.renameColumn('versions', 'version_number', 'version', { transaction: t })
    })
  }
}
