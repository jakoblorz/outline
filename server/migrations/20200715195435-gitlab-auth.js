'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('teams', 'gitlabId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.addIndex('teams', ['gitlabId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('teams', 'gitlabId');
    await queryInterface.removeIndex('teams', ['gitlabId']);
  }
};
