const User = require("../schemas/user.js");

class AuthRepository {
  findOneUser = async (nickname) => {
    const findOneUser = await User.findOne({
      nickname,
    });
    return findOneUser;
  };

  findOneUserId = async (userId) => {
    const findOneUser = await User.findOne({
      userId,
    });
    return findOneUser;
  };
}

module.exports = AuthRepository;
