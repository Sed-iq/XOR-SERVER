const fetch = require("request-promise");
const fs = require("fs");
const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");
const Schema = require("../schema");

module.exports = ({
  userId,
  conversationId,
  type,
  message
}) => {
  // Generate function
  return new Promise(async (resolve, reject) => {
    try {
      const User = await Schema.user.findById(userId);
      const Conversation = await Schema.conversation.findById(conversationId);
      const Type = await Schema.engine.findOne({
        type,
      });
      if (User && Conversation && Type) {
        const engineId = Type.model;
        const apiHost = Type.endpoint;
        const apiKey = Type.key;

        const requestData = {
          text_prompts: [{
            text: message,
          }, ],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30,
          samples: 1,
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestData),
        };

        fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            requestOptions
          )
          .then(async ($) => {
            const response = JSON.parse($);
            response.artifacts.forEach((image, index) => {
              Upload(`data:image/png;base64,${image.base64}`)
                .then((url) => {
                  resolve(url);
                })
                .catch((err) => {
                  console.log(err);
                  reject(err);
                });
            });
          })
          .catch((error) => {
            // console.error(error);
            reject(error);
          });
      } else {
        throw null;
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

function Upload(bytecode) {
  // Bytecode should be in buffer
  return new Promise((resolve, reject) => {
    try {
      const save = cloudinary.uploader.upload_stream({
          folder: "xor",
        },
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result.secure_url);
          }
        }
      );
      streamifier.createReadStream(bytecode).pipe(save);
    } catch (error) {
      reject(error);
    }
  });
}