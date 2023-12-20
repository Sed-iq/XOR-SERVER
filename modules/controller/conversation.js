// Creates conversations
const errorHandle = require("../partials/errorHandle");
const { conversation, user } = require("../schema");
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
