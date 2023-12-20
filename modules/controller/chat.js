// Handles chat and other chat related functions
const errorHandle = require("../partials/errorHandle");
const { conversation, user, engine } = require("../schema");
const request = require("request-promise");
module.exports = async (userId, conversationId, $engine, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const Conversation = await conversation.findById(conversationId);
      const User = await user.findById(userId);
      const Engine = await engine.findOne({ name: $engine });
      if (User && Conversation && Engine) {
        const { endpoint, key } = Engine;
        request
          .post(endpoint, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": key,
            },
            body: JSON.stringify({
              prompt: message,
            }),
          })
          .then((data) => resolve(JSON.parse(data)))
          .catch((err) => {
            reject(err);
          });
      } else {
        console.log(User)
        reject("Not found");
      }
    } catch (err) {
      reject(err);
    }
  });
};
function send(message) {
  return new Promise((resolve, reject) => {
    fetch("http://127.0.0.1:5001", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": "234543" },
      body: JSON.stringify({ prompt: message }),
    })
      .catch((err) => {
        reject(err);
        console.log(err);
      })
      .then(async (data) => {
        const $ = await data.json();
        resolve($.message);
      });
  });
}
