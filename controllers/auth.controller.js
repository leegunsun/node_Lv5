const AuthService = require("../services/auths.service");
const logger = require("../config/winston");
const Boom = require("boom");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // 리프레쉬 토큰 만들기
  // 1. 리프레쉬 토큰을 담기위해 스키마를 수정한다.
  // 2. 리프레쉬 토큰을 담을 새로운 쿠키를 만든다.
  // 3. 리프래쉬 토큰 재발급시 데이터 베이스를 수정 할 수 있어야 한다.
  // 4. 미들웨어를 수정한다.

  authLogin = async (req, res, next) => {
    const { nickname, password } = req.body;
    try {
      const token = await this.authService.login(nickname, password);
      const refreshToken = await this.authService.refreshToken(nickname);
      refreshToken;
      token;
      res.cookie("Authorization", `Bearer ${token}`);
      res.cookie("refreshToken", `Bearer ${refreshToken}`);
      res.status(200).json({ token });
      return;
    } catch (error) {
      if (Boom.isBoom(error)) {
        logger.log("error", `${error.message} / nickname : ${nickname}`);
        res
          .status(error.output.statusCode)
          .json({ errorMessage: error.output.payload.message });
      } else {
        logger.log("error", `${error.message} / nickname : ${nickname}`);
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
      }
    }
  };
}

module.exports = AuthController;
