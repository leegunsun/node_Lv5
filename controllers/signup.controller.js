const SignupService = require("../services/signup.service");
const logger = require("../config/winston");
const Boom = require("boom");

class SignupController {
  constructor() {
    this.signupService = new SignupService();
  }

  createSignup = async (req, res, next) => {
    const { nickname, password, confirm } = req.body;

    try {
      const createSignupData = await this.signupService.createSignup(
        nickname,
        password,
        confirm
      );
      res.status(201).json({ message: "회원 가입에 성공하였습니다." });
      return createSignupData;
    } catch (error) {
      if (Boom.isBoom(error)) {
        const errorOutput = error.output;
        // Boom 오류 객체인 경우, 에러 메시지와 함께 HTTP 응답을 보냅니다.
        logger.log("error", error.message);
        res
          .status(errorOutput.statusCode)
          .json({ errorMessage: errorOutput.payload.message });
      } else {
        // 그 외의 일반적인 에러인 경우, 500 상태 코드와 함께 에러 메시지를 보냅니다.
        logger.log("error", error.message);
        res
          .status(500)
          .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
      }
    }
  };
}

module.exports = SignupController;
