const SignupRepository = require("../repositories/signup.repository");

class SignupService {
  constructor() {
    this.signupRepository = new SignupRepository();
  }

  createSignup = async (nickname, password) => {
    const maxUserId = await this.signupRepository.findSortUserId();
    const userId = maxUserId ? maxUserId.userId + 1 : 1;
    const createSignupData = await this.signupRepository.createSignup(
      nickname,
      password,
      userId
    );

    return createSignupData;
  };

  findOneUser = async (nickname) => {
    const findUser = await this.signupRepository.findOneUser(nickname);

    return findUser;
  };
}

module.exports = SignupService;
