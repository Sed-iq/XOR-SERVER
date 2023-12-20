// Used to get details about the ai engines
const errorHandle = require("../partials/errorHandle");
const { engine } = require("./../schema");
module.exports.showEngine = async (req, res) => {
  try {
    const engines = await engine.find();
    if (engines == "") res.json({ message: [] });
    else {
      let _engines = engines.map((ai) => {
        return {
          id: ai._id,
          engine: ai.name,
          description: ai.description,
          users: ai.users.length,
        };
      });
      res.json({ message: _engines });
    }
  } catch (err) {
    console.log(err);
    errorHandle("An error has occurred.", 500, res);
  }
};
