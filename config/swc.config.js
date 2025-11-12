const { env } = require("shakapacker")

const customConfig = {
  options: {
    jsc: {
      parser: {
        jsx: true, // Needed for jest
      },
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
