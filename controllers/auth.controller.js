const AuthService = require("../services/auths.service");
const jwt = require("jsonwebtoken");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  authLogin = async (req, res, next) => {
    const { nickname, password } = req.body;
    try {
      const findAuth = await this.authService.findAuth(nickname);

      if (!findAuth || password !== findAuth.password) {
        return res
          .status(412)
          .json({ errorMessage: "닉네임 또는 패스워드를 확인해주세요." });
      }

      const token = jwt.sign(
        { userId: findAuth.userId },
        "customized-secret-key"
      );

      res.cookie("Authorization", `Bearer ${token}`);
      res.status(200).json({ token });
    } catch (error) {
      console.log(error.message);
      return res.status(error.status).json({ errorMessage: error.message });
    }
  };
}

module.exports = AuthController;
