const AuthRepository = require("../repositories/auths.repository");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  findAuth = async (nickname) => {
    // if (nickname == "qwer") {
    //   const error = new Error("에러입니다.");
    //   error.status = 400;
    //   throw error;
    // }
    const user = await this.authRepository.findOneUser(nickname);
    console.log(user);
    return user;
  };
}

module.exports = AuthService;
