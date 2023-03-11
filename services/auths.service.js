const AuthRepository = require("../repositories/auths.repository");
const jwt = require("jsonwebtoken");
const Boom = require("boom");

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  login = async (nickname, password) => {
    const findAuth = await this.authRepository.findOneUser(nickname);

    if (!findAuth || password !== findAuth.password) {
      throw Boom.preconditionFailed("닉네임 또는 패스워드를 확인해주세요.");
    }

    const token = jwt.sign(
      { userId: findAuth.userId },
      "customized-secret-key"
    );

    return token;
  };
}

module.exports = AuthService;
