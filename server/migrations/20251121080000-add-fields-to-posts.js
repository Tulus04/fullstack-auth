'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'category', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'General'
    });
    
    await queryInterface.addColumn('Posts', 'tags', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Posts', 'status', {
      type: Sequelize.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft'
    });
    
    await queryInterface.addColumn('Posts', 'author', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Anonymous'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'category');
    await queryInterface.removeColumn('Posts', 'tags');
    await queryInterface.removeColumn('Posts', 'status');
    await queryInterface.removeColumn('Posts', 'author');
  }
};
