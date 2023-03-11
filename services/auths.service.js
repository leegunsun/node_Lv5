const AuthRepository = require("../repositories/auths.repository");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  findAuth = async (nickname) => {
    const user = await this.authRepository.findOneUser(nickname);

    return user;
  };
}

module.exports = AuthService;
