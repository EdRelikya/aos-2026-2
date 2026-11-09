import argon2 from "argon2";

// Gera o hash antes de salvar, só quando a senha foi informada ou alterada
const hashPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await argon2.hash(user.password);
  }
};

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [7, 42],
        },
      },
    },
    {
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
      },
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  User.findByLogin = async (login) => {
    let user = await User.findOne({
      where: { username: login },
    });

    if (!user) {
      user = await User.findOne({
        where: { email: login },
      });
    }

    return user;
  };

  // Confere a senha digitada contra o hash guardado
  User.prototype.validatePassword = async function (password) {
    return await argon2.verify(this.password, password);
  };

  // Nunca devolve a senha (nem o hash) nas respostas da API
  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};

export default getUserModel;