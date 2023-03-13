const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");
const dotenv = require("dotenv");
const Boom = require("boom");
const logger = require("../config/winston");

dotenv.config();

module.exports = async (req, res, next) => {
  const { Authorization, refreshToken } = req.cookies;

  const [tokenType, token] = (Authorization ?? "").split(" ");
  const [refTokenType, refToken] = (refreshToken ?? "").split(" ");

  if (!refToken || !token || tokenType !== "Bearer") {
    throw Boom.notFound("로그인이 필요한 기능입니다.");
  }

  if (!refToken) throw Boom.badRequest("Refresh Token이 존재하지 않습니다.");

  if (!token) throw Boom.badRequest("Access Token이 존재하지 않습니다.");

  try {
    const isAccessTokenValidate = validateAccessToken(token);
    const isRefreshTokenValidate = validateRefreshToken(refToken);

    if (!isRefreshTokenValidate)
      throw Boom.unauthorized("Refresh Token이 만료되었습니다.");

    if (!isAccessTokenValidate) {
      const accessTokenId = await User.findOne({ refreshToken: refToken });
      if (!accessTokenId.refreshToken) {
        throw Boom.unauthorized(
          "Refresh Token의 정보가 서버에 존재하지 않습니다."
        );
      }

      const newAccessToken = jwt.sign(
        { userId: accessTokenId.userId },
        process.env.TOKEN_KEY,
        { expiresIn: "10m" }
      );

      res.cookie("Authorization", `Bearer ${newAccessToken}`);
      // res.json({ message: "Access Token을 새롭게 발급하였습니다." });
    }
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY, {
      expiresIn: "10m",
    });

    const user = await User.findOne({ userId });

    res.locals.user = user;

    next();
  } catch (error) {
    if (Boom.isBoom(error)) {
      logger.log("error", `${error.message} `);
      res
        .status(error.output.statusCode)
        .json({ errorMessage: error.output.payload.message });
    } else {
      logger.log("error", `${error.message} `);
      res
        .status(403)
        .json({ message: "전달된 쿠키에서 오류가 발생하였습니다." });
    }
    return;
  }
};

// Access Token을 검증합니다.
function validateAccessToken(token) {
  try {
    jwt.verify(token, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Refresh Token을 검증합니다.
function validateRefreshToken(refToken) {
  try {
    jwt.verify(refToken, process.env.TOKEN_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}
