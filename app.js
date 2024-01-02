const socket = require("./modules/controller/socket");
const CR = require("./modules/createusr");

const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  dotenv = require("dotenv").config(),
  router = require("./modules/routes"),
  http = require("http"),
  server = http.createServer(app),
  io = require("socket.io")(server);
app.use(router);
mongoose
  .connect(process.env.DB)
  .then(() =>
    server.listen(
      process.env.PORT,
      console.log(`Running on port: ${process.env.PORT}`)
    )
  )
  .catch((e) => console.error(e));
socket(io);
