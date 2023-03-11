const User = require("../schemas/user");

class SignupRepository {
  findSortUserId = async () => {
    const findOneUser = await User.findOne().sort("-userId").exec();

    return findOneUser;
  };

  findOneUser = async (nickname) => {
    const findOneUser = await User.findOne({
      nickname,
    });
    return findOneUser;
  };

  createSignup = async (nickname, password, userId) => {
    const createUser = new User({ nickname, password, userId });

    return await createUser.save();
  };
}

module.exports = SignupRepository;
