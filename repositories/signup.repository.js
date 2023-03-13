const User = require("../schemas/user");
const crypto = require("crypto");
const Boom = require("boom");

class SignupRepository {
  findSortUserId = async () => {
    const findOneUser = await User.findOne().sort("-userId").exec();

    return findOneUser;
  };

  findOneUser = async (nickname) => {
    const findOneUser = await User.findOne({
      nickname,
    });
    return findOneUser;
  };

  createSignup = async (nickname, password, userId) => {
    const createHashedPassword = (password) => {
      crypto.randomBytes(32, (err, buf) => {
        if (err) {
          throw err;
        }
        const salt = buf.toString("base64");
        crypto.pbkdf2(
          password,
          salt,
          1000,
          32,
          "sha512",
          (err, hashedPassword) => {
            if (err) {
              throw err;
            }
            const pbkdf2Key = hashedPassword.toString("base64");
            const createUser = new User({
              nickname,
              hashedPassword: pbkdf2Key,
              salt,
              userId,
            });

            return createUser.save();
          }
        );
      });
    };
    return createHashedPassword(password);
  };
}

module.exports = SignupRepository;
