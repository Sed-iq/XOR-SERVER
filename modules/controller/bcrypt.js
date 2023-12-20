const errorHandle = require("../partials/errorHandle"),
  bcrypt = require("bcrypt");
module.exports.compare = (str, hash) => {
  if (str && hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(str, hash, (err, result) => {
        if (err) reject(result);
        else if (result == true) resolve(result);
        else reject(result);
      });
    });
  } else return false;
};
module.exports.hash = (payload) => {
  return new Promise(async (resolve, reject) => {
    if (payload) {
      const hash = await bcrypt.hash(payload, 10);
      resolve(hash);
    } else reject("No payload");
  });
};
