// Just returns user data
const errorHandle = require("../partials/errorHandle");
const { user, conversation } = require("../schema.js");
module.exports = async (req, res) => {
  try {
    const User = await user.findById(req.headers["x-user"]);
    const Conversations = await conversation.find({
      _id: User.conversations,
    });
    if (User != "") {
      const data = {
        id: User._id,
        name: User.fullname,
        conversations: conversation_format(Conversations),
      };
      res.json({
        message: data,
      });
    } else errorHandle("User not found", 404, res);
  } catch (error) {
    console.log(error);
    errorHandle("Error", 404, res);
  }
};
// Getting chats from a specific conversation
module.exports.chats = async (req, res) => {
  // Used to get chats data
  const { id } = req.params;
  try {
    const Conversation = await conversation.findById(id);
    if (Conversation) {
      const chats = Conversation.chats;
      res.json({
        message: {
          name: Conversation.title,
          chats: chats.reverse(),
        },
      });
    } else {
      throw "";
    }
  } catch (error) {
    console.log(error);
    errorHandle("Error", 404, res);
  }
};

function conversation_format(conversation) {
  return conversation
    .map((item) => {
      return {
        id: item._id,
        title: item.title,
        date: item.createdAt,
        chats: item.chats.reverse(),
      };
    })
    .reverse();
}
