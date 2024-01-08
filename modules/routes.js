const dashboard = require("./controller/dashboard");
const { create, chat } = require("./controller/conversation");
(express = require("express")),
  (app = express()),
  ({ signin, signup, verify, logout } = require("./auth")),
  (maxAge = 200 * 5 * 30 * 2 * 30 * 2 * 5 * 10);
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.get("/dashboard", verify, dashboard);
app.get("/chat/:id", verify, dashboard.chats);
app.post("/signin", verify, signin);
app.post("/conversation", verify, create);
app.post("/signup", verify, signup);
app.use((req, res) => {
  console.log(req.path, req.method);
  res.status(404).json({
    message: "You are not allowed here",
  });
});
module.exports = app;
