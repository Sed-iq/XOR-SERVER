// Controls all socket connections
const Conversation = require("./conversation.js");
const { chat } = Conversation;
const { conversation } = require("../schema.js");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("We have a connection!");
    socket.on("disconnect", () => {
      console.log("We lost it !");
    });
    socket.on("prompt", async (msg) => {
      const opt = {
        userId: msg.sender,
        type: msg.type,
        conversationId: msg.conversationId,
        message: msg.message,
      };
      // Used to check if the user's msg has reached
      try {
        const response = await chat(opt);
        if (response) {
          socket.emit("response", {
            message: response,
            type: msg.type,
          });

          await saveChat(
            {
              sender: msg.sender,
              type: msg.type,
              time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,

              message: msg.message,
            },
            msg.conversationId
          );
          await saveChat(
            {
              sender: "bot",
              type: msg.type,
              time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
              message: response,
            },
            msg.conversationId
          );
        } else {
          throw "";
        }
      } catch (e) {
        // statements
        console.log(e);
        socket.emit("error", {
          message: "There was an error",
        });
      }
    });
  });
};
