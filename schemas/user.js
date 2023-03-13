const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  userId: {
    type: Number,
    required: true,
  },
});

userSchema.set("toJSON", {
  // virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
module.exports = mongoose.model("User", userSchema);
