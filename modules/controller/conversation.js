// Creates conversations
const request = require("request-promise");
const errorHandle = require("../partials/errorHandle");
const ImageGen = require("./gen_img");
const {
  conversation,
  user,
  engine
} = require("../schema.js");
module.exports.create = async (req, res) => {
  const {
    title
  } = req.body;
  if (title) {
    try {
      const $user = await user.findById(req.headers["x-user"]);
      if ($user) {
        const Conversation = new conversation({
          title: req.body.title,
        });
        Conversation.save().then((d) => {
          if (d != "")
            user
            .updateOne({
              _id: req.headers["x-user"],
            }, {
              $push: {
                conversations: d._id.toString(),
              },
            })
            .then(() =>
              res.json({
                message: d._id.toString(),
              })
            )
            .catch((e) => errorHandle(e, 500, res));
        });
      } else errorHandle("No User found", 403, res);
    } catch (e) {
      errorHandle(e, 500, res);
    }
  } else errorHandle("Please give a title", 403, res);
};
module.exports.chat = async ({
  userId,
  conversationId,
  type,
  message
}) => {
  // Runs the chat api algorithm
  if (type == "text") {
    return new Promise((resolve, reject) => {
      Text({
          userId,
          conversationId,
          type,
          message,
        })
        .then(($res) => {
          resolve($res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    }); // TextAi
  } else if (type == "image") {
    return new Promise((resolve, reject) => {
      ImageGen({
          userId,
          conversationId,
          type,
          message,
        })
        .then(($res) => {
          resolve($res);
        })
        .catch((err) => {
          console.log("Here" + err);
          reject(err);
        });
    });
  }
};

async function Text({
  userId,
  conversationId,
  type,
  message
}) {
  // Handles chat and other chat related functions
  return new Promise(async (resolve, reject) => {
    const User = await user.findById(userId);
    const Conversation = await conversation.findById(conversationId);
    const Engine = await engine.findOne({
      type,
    });
    if (User && Conversation && Engine) {
      const accessToken = Engine.key;

      const requestData = {
        model: Engine.model,
        messages: [{
          role: "user",
          content: message,
        }, ],
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
          console.log(error);
          reject(error);
        });
    } else {
      console.log(` ${User}  ${Conversation} ${Engine}`);
      reject("There is an error");
    }
  });
}