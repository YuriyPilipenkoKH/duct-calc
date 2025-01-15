import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused variables if they start with `_`
      "@typescript-eslint/no-unused-vars": [
        "warn", // Set to "warn" to show warnings, or "off" to disable completely
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_", // Ignore unused variables starting with `_`
          argsIgnorePattern: "^_", // Ignore unused arguments starting with `_`
        },
      ],
      // Add any other rules as needed
    },
  },
  {
    // Parser and environment settings
    files: ["**/*.ts", "**/*.tsx"], // Apply to TypeScript files
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];

export default eslintConfig;
