const Schema = require("./schema");

async function CR() {
  const eng = [
    {
      name: "Perplexity Ai",
      endpoint: "https://openrouter.ai/api/v1",
      description: `TODO: Add later`,
      users: [],
      model: "perplexity/pplx-70b-chat",
      method: "openai",
      key: "0d21384ac854855aaf7ced7b367c4b3f7ffa610ed7a23194f652b8a6595e4a4d",
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
