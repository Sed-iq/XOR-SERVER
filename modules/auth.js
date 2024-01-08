const errorHandle = require("./partials/errorHandle");
const bcrypt = require("./controller/bcrypt");
const jwt = require("./controller/jwt");
const { user } = require("./schema.js");
module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const usr = await user.findOne({
        email: req.body.email,
      });
      if (usr) {
        bcrypt
          .compare(password, usr.password)
          .then((data) => {
            if (data) {
              jwt
                .sign(usr._id)
                .then((token) => {
                  res.json({
                    message: "Logged in ",
                    token,
                  });
                })
                .catch((e) => {
                  console.log(e);
                  errorHandle("Error loggin in", 500, res);
                });
            } else errorHandle("Wrong password", 404, res);
          })
          .catch((err) => {
            console.log(err);
            errorHandle("Wrong password", 401, res);
          });
      } else errorHandle("User not found", 404, res);
    } else errorHandle("Please input email and password", 401, res);
  } catch (e) {
    console.log(e);
    errorHandle("Error signing in please try again", 404, res);
  }
};

module.exports.verify = async (req, res, go) => {
  const user_data = req.headers["x-token"]; // Takes token data
  const { id } = req.params;
  if (
    req.url == "/dashboard" ||
    req.url == "/conversation" ||
    req.url == `/chat/${id}`
  ) {
    // Accepted log in routes
    if (user_data) {
      jwt
        .decode(user_data)
        .then(async (payload) => {
          try {
            const $user = await user.findById(payload.id);
            if ($user) {
              // Decodes user information and puts it in the header
              req.headers["x-user"] = payload.id;
              go();
            } else throw false;
          } catch (e) {
            console.log(e);
            errorHandle(
              "You need to be logged in to perform this action",
              401,
              res
            );
          }
        })
        .catch((e) => {
          console.log(e);
          errorHandle(
            "You need to be logged in to perform this action",
            401,
            res
          );
        });
    } else {
      console.log(user_data);
      errorHandle("You need to be logged in to perform this action", 401, res);
    }
  } else if (req.url == "/signin" || req.url == "/signup") {
    if (user_data) {
      jwt
        .decode(user_data)
        .then((payload) => {
          res.json({
            message: "You are already logged in ",
          });
          // User is already logged in
        })
        .catch((e) => go());
    } else go();
  } else {
    errorHandle("You need to logged in to perform this action", 401, res);
  }
};
module.exports.signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password)
    errorHandle("Please fill in required fields", 403, res);
  else {
    try {
      // Fields are inputted correctly
      const $ = await user.findOne({
        email,
      });
      if ($) {
        errorHandle(
          "User with this email already exists, please use another one",
          403,
          res
        );
      } else {
        const $password = await bcrypt.hash(password);
        const $user = new user({
          fullname: fullname,
          email: email,
          password: $password,
        });
        $user.save().then(async (data) => {
          if (data) {
            // Logging them in
            const token = await jwt.sign(data._id);
            res.json({
              message: "Signed up successfully!",
              token,
            });
          }
        });
      }
    } catch (err) {
      errorHandle(err, 500, res);
    }
  }
};
