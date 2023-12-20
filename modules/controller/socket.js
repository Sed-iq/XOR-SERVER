// Controls all socket connections
const chat = require("./chat.js");
const { conversation } = require("./../schema.js");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("prompt", async (msg) => {
      chat(msg.sender, msg.conversation, msg.engine, msg.message)
        .then(async (data) => {
          try {
            const userSave = await saveChat(
              {
                sender: msg.sender,
                message: msg.message,
                time: msg.time,
              },
              msg.conversation
            );
            if (userSave) {
              let response = {
                sender: "bot", // Replace with ai name,
                message: data.message.trim(),
                time: new Date().toLocaleDateString(),
              }; // Ai response
              saveChat(response, msg.conversation);
              socket.emit("response", response);
            }
          } catch (err) {
            console.log(err);
            socket.emit("error", "There seems to be an error");
          }
        })
        .catch((err) => {
          console.log(err);
          socket.emit("error", "There seems to be an error");
        });
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
