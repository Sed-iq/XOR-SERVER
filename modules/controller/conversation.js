// Creates conversations
const request = require("request-promise");
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
  return new Promise((resolve, reject) => {
    Request({ userId, conversationId, $engine, message })
      .then(($res) => {
        resolve($res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

async function Request({ userId, conversationId, $engine, message }) {
  // Handles chat and other chat related functions
  const { conversation, user, engine } = require("../schema");
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
        request
          .post(Engine.endpoint, requestOptions)
          .then((response) => {
            const data = JSON.parse(response);
            resolve(data.choices[0].message.content);
          })

          .catch((error) => {
            reject(error);
          });
      } else {
        console.log(User);
        throw "Not Found";
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
