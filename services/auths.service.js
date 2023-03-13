const AuthRepository = require("../repositories/auths.repository");
const jwt = require("jsonwebtoken");
const Boom = require("boom");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// 실패시 dotenv 확인해야함
class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  login = async (nickname, password) => {
    const findAuth = await this.authRepository.findOneUser(nickname);

    // findAuth.salt의 값을 받아와서 직접 입력한 키워드와 합치고 값을 비교해 본다.
    const createHashedPassword = (password, findAuth) => {
      const findAuth_salt = findAuth.salt;
      const findAuth_hashedPassword = findAuth.hashedPassword;

      function verify(password, findAuth_hashedPassword, salt) {
        const iterations = 1000;
        const keyLength = 32;
        const digest = "sha512";

        const hashedInputPassword = crypto
          .pbkdf2Sync(password, salt, iterations, keyLength, digest)
          .toString("base64");

        if (!findAuth || hashedInputPassword !== findAuth_hashedPassword) {
          throw Boom.preconditionFailed("닉네임 또는 패스워드를 확인해주세요.");
        }

        return findAuth_hashedPassword === hashedInputPassword;
      }

      verify(password, findAuth_hashedPassword, findAuth_salt);
    };

    createHashedPassword(password, findAuth);
    // 실패시 dotenv 확인해야함
    const token = jwt.sign({ userId: findAuth.userId }, process.env.TOKEN_KEY, {
      expiresIn: "10m",
    });

    return token;
  };

  // 클라이언트에게 리프레쉬 토큰을 발급해주고 서버에도 저장합니다.
  refreshToken = async (nickname) => {
    const token = jwt.sign({}, process.env.TOKEN_KEY, { expiresIn: "7d" });
    const addRefreshToken = await this.authRepository.refreshToken(
      nickname,
      token
    );
    addRefreshToken;
    return token;
  };
}

module.exports = AuthService;
