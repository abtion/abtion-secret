import { defineConfig, globalIgnores } from "eslint/config"
import react from "eslint-plugin-react"
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(["**/coverage", "public/packs*", "**/node_modules"]),
  {
    extends: compat.extends("eslint:recommended", "prettier"),

    plugins: {
      react,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },

      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],
      "react/jsx-uses-vars": "warn",
      "react/jsx-uses-react": "warn",

      // Don't allow console.log
      "no-console": ["error"],
    },
  },
])
