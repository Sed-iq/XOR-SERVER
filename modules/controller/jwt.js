const jwt = require("jsonwebtoken");
const maxAge = 200 * 5 * 30 * 2 * 30 * 2 * 5 * 10;

module.exports.sign = (string) => {
  console.log("here");
  console.log(string.toString());
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign({ id: string }, process.env.SESSION_SECRET, {
        expiresIn: maxAge,
      });
      resolve(token);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports.decode = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
        if (err) reject(err);
        else if (decoded) resolve(decoded);
        else reject(null);
      });
    } catch (e) {
      reject(e);
    }
  });
};
