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
module.exports.chat = async (req, res) => {
  // Runs the chat api algorithm
  const {
    type
  } = req.body;
  const {
    prompt,
    conversationId
  } = req.body;
  if (type == "text" && prompt.toString().trim() && conversationId) {
    Text({
        userId: req.user,
        conversationId,
        type,
        message: prompt,
      })
      .then(async ($res) => {
        res.json({
          message: {
            type,
            msg: $res
          }
        });
        await saveChat({
            sender: conversationId,
            type,
            time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
            message: prompt,
          },
          conversationId
        );
        await saveChat({
            sender: "bot",
            type,
            time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,

            message: $res,
          },
          conversationId
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There seems to be an error"
        });
      });
  } else if (type == "image" && prompt.toString().trim() && conversationId) {
    ImageGen({
        userId: req.user,
        type,
        conversationId,
        message: prompt,
      })
      .then(async (image) => {
        res.json({
          message: {
            type,
            msg: image
          }
        });
        await saveChat({
            sender: conversationId,
            type,
            time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,
            message: prompt,
          },
          conversationId
        );
        await saveChat({
            sender: "bot",
            type,
            time: `${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()}`,

            message: image,
          },
          conversationId
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Error generating that image"
        });
      });
  } else {
    res
      .status(403)
      .json({
        message: "Prompt, type and conversation id needed"
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
          // console.log(data)
          resolve(data.choices[0].message.content);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    } else {
      console.log(` ${User} \n ${Conversation} \n ${Engine}`);
      reject("Either user conversation id or Engine is missing");
    }
  });
}

function saveChat({
  sender,
  time,
  type,
  message
}, conv_id) {
  return new Promise(async (resolve, reject) => {
    try {
      const Conversation = await conversation.findById(conv_id);
      if (Conversation) {
        const chats = Conversation.chats;
        chats.unshift({
          sender,
          type,
          time,
          message,
        });
        conversation
          .findByIdAndUpdate(Conversation._id, {
            chats: chats,
          })
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      } else reject("There seems to be an error");
    } catch (err) {
      reject(err);
    }
  });
}