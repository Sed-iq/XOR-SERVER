const Schema = require("./schema.js");

async function CR() {
  const eng = [
    {
      name: "Stable Diffusion",
      endpoint: "https://api.stability.ai",
      description: `TODO: Add later`,
      users: [],
      type: "image",
      model: "stable-diffusion-v1-6",
      key: "sk-LYTJu3AHFW9CZRwE7Sqm3d4NnnaowQz9QLIcj0pAjvnP81Ud",
    },
  ];
  Schema.engine
    .insertMany(eng)
    .then((data) => {
      console.log("done", data);
    })
    .catch((err) => console.log(err));
}

module.exports = CR;
