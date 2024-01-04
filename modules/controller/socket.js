// Controls all socket connections
const Conversation = require("./conversation.js");
const { chat } = Conversation;
const { conversation } = require("./../schema.js");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("prompt", async (msg) => {
      const opt = {
        userId: msg.sender,
        type: msg.type,
        conversationId: msg.conversation,
        message: msg.message,
      };
      console.log("wait1");
      const response = await chat(opt);
       
      console.log("done");
      if (response) { 
        socket.emit("response", {
          message: response,
        });
        await saveChat({
          sender: msg.sender,
          time: new Date(),
          message: msg.message,
        }, msg.conversation)
      await saveChat({
        sender: "bot",
        time: new Date(),
        message: response,
      }, msg.conversation)
      } else {
        socket.emit("error", {
          message: "There was an error"
        })
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
