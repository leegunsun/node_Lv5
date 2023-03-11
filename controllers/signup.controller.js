const SignupService = require("../services/signup.service");

class SignupController {
  constructor() {
    this.signupService = new SignupService();
  }

  createSignup = async (req, res, next) => {
    const { nickname, password, confirm } = req.body;

    const nicknameRegex = /^[A-Za-z0-9]{3,}$/;
    const passwordLengthRegex = /^[A-Za-z0-9]{4,}$/;
    const passwordRegex = new RegExp(`^(?!.*${nickname}).+$`);

    try {
      if (nicknameRegex.test(nickname)) {
        const existsUsers = await this.signupService.findOneUser(nickname);

        // 이미 존재하는 닉네임
        if (existsUsers) {
          return res.status(412).json({
            errorMessage: "중복된 닉네임입니다.",
          });
        }

        //패스워드에 닉네임이 포함됨
        if (passwordLengthRegex.test(password)) {
          if (!passwordRegex.test(password)) {
            return res
              .status(412)
              .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
          }

          // 패스워드 확인이 실패함
          if (password !== confirm) {
            return res
              .status(412)
              .json({ errorMessage: "패스워드가 일치하지 않습니다." });
          }
          const createSignupData = await this.signupService.createSignup(
            nickname,
            password
          );
          res.status(201).json({ message: "회원 가입에 성공하였습니다." });
          return createSignupData;
        } else {
          //패스워드 요구 조건이 맞지않음
          return res
            .status(412)
            .json({ errorMessage: "패스워드 형식이 일치하지 않습니다." });
        }
      } else {
        // 닉네임이 요구 조건에 맞지 않음
        return res
          .status(412)
          .json({ errorMessage: "닉네임의 형식이 일치하지 않습니다." });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ errorMessage: "요청한 데이터 형식이 올바르지 않습니다." });
    }
  };
}

module.exports = SignupController;
