const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");
const dotenv = require("dotenv");
const Boom = require("boom");

dotenv.config();

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const { refreshToken } = req.cookies;

  const [tokenType, token] = (Authorization ?? "").split(" ");
  const [refTokenType, refToken] = (refreshToken ?? "").split(" ");

  if (!refToken || !token || tokenType !== "Bearer") {
    return res.status(404).json({ errorMessage: "Token이 존재하지 않습니다." });
  }

  try {
    const isAccessTokenValidate = validateAccessToken(token);
    const isRefreshTokenValidate = validateRefreshToken(refToken);

    if (!isRefreshTokenValidate)
      return res
        .status(419)
        .json({ message: "Refresh Token이 만료되었습니다." });

    if (!isAccessTokenValidate) {
      const accessTokenId = await User.findOne({ refreshToken: refToken });
      if (!accessTokenId.refreshToken) {
        return res.status(419).json({
          message: "Refresh Token의 정보가 서버에 존재하지 않습니다.",
        });
      }

      const newAccessToken = jwt.sign(
        { userId: accessTokenId.userId },
        process.env.TOKEN_KEY,
        { expiresIn: "10s" }
      );

      res.cookie("Authorization", newAccessToken);
      return res.json({ message: "Access Token을 새롭게 발급하였습니다." });
    }

    // Access Token을 검증합니다.
    function validateAccessToken(token) {
      try {
        const { userId } = jwt.verify(token, process.env.TOKEN_KEY); // JWT를 검증합니다.
        console.log(userId);
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

    const { userId } = jwt.verify(token, process.env.TOKEN_KEY, {
      expiresIn: "10s",
    });
    console.log(userId);
    const user = await User.findOne({ userId });

    res.locals.user = user;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    return;
  }
};
