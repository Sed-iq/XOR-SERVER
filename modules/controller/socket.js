// Controls all socket connections
const Conversation = require("./conversation.js");
const { chat } = Conversation;
const { conversation } = require("./../schema.js");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("prompt", async (msg) => {
      const opt = {
        userId: msg.sender,
        conversationId: msg.conversation,
        $engine: msg.engine,
        message: msg.message,
      };
      console.log("wait1");
      const response = await chat(opt);
      console.log("wait");
      if (response) {
        socket.emit("response", {
          message: response,
        });
      } else {
        console.log("empty");
      }
    });
  });
};
function saveChat({ sender, time, message }, conv_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const Conversation = await conversation.findById(conv_id);
      if (Conversation) {
        const chats = Conversation.chats;
        chats.unshift({ sender, time, message });
        conversation
          .findByIdAndUpdate(Conversation._id, { chats: chats })
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      } else reject("There seems to be an error");
    } catch (err) {
      reject(err);
    }
  });
}
