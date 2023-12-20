const dashboard = require("./controller/dashboard");
const { create, chat } = require("./controller/conversation");
const { showEngine } = require("./controller/engine");
(express = require("express")),
  (app = express()),
  ({ signin, signup, verify, logout } = require("./auth")),
  (maxAge = 200 * 5 * 30 * 2 * 30 * 2 * 5 * 10);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("chat.ejs");
});
app.get("/dashboard", verify, dashboard);
app.get("/chat/:id", verify, dashboard.chats);
app.get("/engines", verify, showEngine);
app.post("/signin", verify, signin);
app.post("/conversation", verify, create);
app.post("/signup", verify, signup);
app.use((req, res) => {
  console.log(req.path, req.method);
  res.status(404).json({ message: "You are not allowed here" });
});
module.exports = app;
