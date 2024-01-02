// Creates conversations
const errorHandle = require("../partials/errorHandle");
const { conversation, user, engine } = require("../schema");
module.exports.create = async (req, res) => {
  const { title } = req.body;
  if (title)
    try {
      const $user = await user.findById(req.headers["x-user"]);
      if ($user) {
        const Conversation = new conversation({
          title: req.body.title,
        });
        Conversation.save().then((d) => {
          if (d != "")
            user
              .updateOne(
                { _id: req.headers["x-user"] },
                { $push: { conversations: d._id.toString() } }
              )
              .then((e) => res.json({ message: d._id.toString() }))
              .catch((e) => errorHandle(e, 500, res));
        });
      } else errorHandle("No User found", 403, res);
    } catch (e) {
      errorHandle(e, 500, res);
    }
  else errorHandle("Please give a title", 403, res);
};
module.exports.chat = async ({ userId, conversationId, $engine, message }) => {
  Request({ userId, conversationId, $engine, message })
    .then(($res) => {
      console.log($res);
      return $res;
    })
    .catch((err) => {
      console.log(err);
    });
};

async function Request({ userId, conversationId, $engine, message }) {
  // Handles chat and other chat related functions
  const errorHandle = require("../partials/errorHandle");
  const { conversation, user, engine } = require("../schema");
  const request = require("request-promise");
  return new Promise(async (resolve, reject) => {
    try {
      const Conversation = await conversation.findById(conversationId);
      const User = await user.findById(userId);
      const Engine = await engine.findOne({ name: $engine });
      if (User && Conversation && Engine) {
        const accessToken = Engine.key;

        const requestData = {
          model: Engine.model,
          messages: [{ role: "user", content: message }],
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestData),
        };

        fetch(Engine.endpoint, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("Response:", data.choices[0]);
          })
          .catch((error) => {
            console.error("Error:", error);
            reject(error);
          });

        //     const { endpoint, key, model } = Engine;
        //     console.log(key);
        //     fetch(endpoint, {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //         Autorization: `Bearer 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`,
        //       },
        //       body: JSON.stringify({
        //         messages: [
        //           {
        //             role: "user",
        //             model,
        //             content: message,
        // },
        //         ],
        //       }),
        //     })
        //       .then(async (data) => {
        //         if (data.status == 200) {
        //           const body = await data.json();
        //           console.log(body);
        //         } else {
        //           const body = await data.json();
        //           console.log(body);
        //         }
        //       })
        //       .catch((err) => {
        //         console.log("There is an error");
        //         reject(err);
        //       });
      } else {
        console.log(User);
        reject("Not found");
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
// function send(message) {
//   return new Promise((resolve, reject) => {
//     fetch("http://127.0.0.1:5001", {
//       method: "POST",
//       headers: { "Content-Type": "application/json", "x-api-key": "234543" },
//       body: JSON.stringify({ prompt: message }),
//     })
//       .catch((err) => {
//         reject(err);
//         console.log(err);
//       })
//       .then(async (data) => {
//         const $ = await data.json();
//         resolve($.message);
//       });
//   });
// }
