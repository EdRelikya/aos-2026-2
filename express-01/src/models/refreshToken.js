const getRefreshTokenModel = (sequelize, { DataTypes }) => {
  const RefreshToken = sequelize.define(
    "refreshToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    { tableName: "refresh_tokens" },
  );

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: "userId" });
  };

  return RefreshToken;
};

export default getRefreshTokenModel;