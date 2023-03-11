const User = require("../schemas/user.js");

class AuthRepository {
  findOneUser = async (nickname) => {
    const findOneUser = await User.findOne({
      nickname,
    });
    return findOneUser;
  };
}

module.exports = AuthRepository;
