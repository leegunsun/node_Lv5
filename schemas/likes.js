const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

likesSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Likes", likesSchema);
