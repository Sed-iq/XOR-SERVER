const Schema = require("./schema");

async function CR() {
  const eng = [
    {
      name: "Perplexity Ai",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      description: `TODO: Add later`,
      users: [],
      model: "perplexity/pplx-70b-chat",
      key: "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",
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
