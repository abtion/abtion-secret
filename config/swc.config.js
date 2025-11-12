const { env } = require("shakapacker")

const customConfig = {
  options: {
    jsc: {
      transform: {
        react: {
          development: env.isDevelopment,
          runtime: "automatic",
        },
      },
    },
  },
}

module.exports = customConfig
