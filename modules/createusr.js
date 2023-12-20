const Schema = require("./schema");

async function CR() {
  const eng = [
    {
      name: "DeepAi",
      endpoint: "https://api.deepai.org/api/text-generator",
      description: ``,
      users: [],
      key: "api-key:7c8fd0ea-d2e1-4577-80c5-cfed1176d3a4",
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
