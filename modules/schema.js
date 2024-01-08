const mongoose = require("mongoose"),
  user = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    conversations: {
      type: Array,
    },
  }, {
    timestamps: true
  }),
  conversation = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    chats: {
      type: Array,
    },
  }, {
    timestamps: true
  }),
  engine = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    key: {
      // Secret key
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    users: {
      type: Array
    },
    model: {
      type: String,
      required: true,
    },
    image: {
      type: String
    },
    public_key: {
      type: String
    },
  });
module.exports.conversation = mongoose.model("conversation", conversation);
module.exports.user = mongoose.model("user", user);
module.exports.engine = mongoose.model("engine", engine);