const AuthService = require("../services/auths.service");
const logger = require("../config/winston");
const Boom = require("boom");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  authLogin = async (req, res, next) => {
    const { nickname, password } = req.body;
    try {
      const token = await this.authService.login(nickname, password);
      token;
      res.cookie("Authorization", `Bearer ${token}`);
      res.status(200).json({ token });
      return;
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", error.message);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", error.message);
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
        console.error(error.message);
      }
    }
  };
}

module.exports = AuthController;
