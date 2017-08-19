'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      // change start_time datatype to DOUBLE
      return queryInterface.changeColumn(
        'sample_instances',
        'start_time',
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0.0
        }
      )
      // change volume datatype to DOUBLE
      .then(() => queryInterface.changeColumn(
        'sample_instances',
        'volume',
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: -6.0
        }
      ))
      // change panning datatype to DOUBLE
      .then(() => queryInterface.changeColumn(
        'sample_instances',
        'panning',
        {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 0.0
        }
      ));
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      // change start_time datatype to INTEGER
      return queryInterface.changeColumn(
        'sample_instances',
        'start_time',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      )
      // change volume datatype to INTEGER
      .then(() => queryInterface.changeColumn(
        'sample_instances',
        'volume',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ))
      // change panning datatype to INTEGER
      .then(() => queryInterface.changeColumn(
        'sample_instances',
        'panning',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ));
    });
  }
};