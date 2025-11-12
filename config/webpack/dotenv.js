const dotenv = require("dotenv")

const dotenvFiles = [
  `.env.${process.env.NODE_ENV}.local`,
  ".env.local",
  `.env.${process.env.NODE_ENV}`,
  ".env",
]

dotenv.config({ path: dotenvFiles, quiet: true })
