'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.User, {
        foreignKey: 'updatedBy'
      })
      History.belongsTo(models.Job, {
        foreignKey: 'entityId'
      })
    }
  };
  History.init({
    entityId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};