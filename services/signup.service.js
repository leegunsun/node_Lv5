const SignupRepository = require("../repositories/signup.repository");
const Boom = require("boom");

class SignupService {
  constructor() {
    this.signupRepository = new SignupRepository();
  }

  findOneUser = async (nickname) => {
    const findUser = await this.signupRepository.findOneUser(nickname);

    return findUser;
  };

  createSignup = async (nickname, password, confirm) => {
    const nicknameRegex = /^[A-Za-z0-9]{3,}$/;
    const passwordLengthRegex = /^[A-Za-z0-9]{4,}$/;
    const passwordRegex = new RegExp(`^(?!.*${nickname}).+$`);
    const maxUserId = await this.signupRepository.findSortUserId();
    const userId = maxUserId ? maxUserId.userId + 1 : 1;

    if (nicknameRegex.test(nickname)) {
      const existsUsers = await this.signupRepository.findOneUser(nickname);

      // 이미 존재하는 닉네임
      if (existsUsers) {
        throw Boom.preconditionFailed("중복된 닉네임입니다.");
      }

      //패스워드에 닉네임이 포함됨
      if (passwordLengthRegex.test(password)) {
        if (!passwordRegex.test(password)) {
          throw Boom.preconditionFailed(
            "패스워드에 닉네임이 포함되어 있습니다."
          );
        }

        // 패스워드 확인이 실패함
        if (password !== confirm) {
          throw Boom.preconditionFailed("패스워드가 일치하지 않습니다.");
        }
        const createSignupData = await this.signupRepository.createSignup(
          nickname,
          password,
          userId
        );
        return createSignupData;
      } else {
        //패스워드 요구 조건이 맞지않음
        throw Boom.preconditionFailed("패스워드 형식이 일치하지 않습니다.");
      }
    } else {
      // 닉네임이 요구 조건에 맞지 않음
      throw Boom.preconditionFailed("닉네임의 형식이 일치하지 않습니다.");
    }
  };
}

module.exports = SignupService;
