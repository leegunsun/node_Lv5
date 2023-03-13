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

  // nickname인 값을 찾아서 리프레쉬 토큰을 업데이트 합니다.
  refreshToken = async (nickname, token) => {
    const UpdaterefreshToken = await User.findOneAndUpdate(
      {
        nickname: nickname,
      },
      { refreshToken: token }
    );

    return UpdaterefreshToken;
  };
}

module.exports = AuthRepository;
