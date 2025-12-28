// @ts-check
import { defineConfig, globalIgnores } from "eslint/config";
// @ts-ignore
// @ts-ignore
import globals from "globals";
// @ts-ignore
import eslint from "@eslint/js";
// @ts-ignore
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
// @ts-ignore
import jsxA11y from "eslint-plugin-jsx-a11y";
// @ts-ignore
import tailwindPlugin from "eslint-plugin-tailwindcss";
// @ts-ignore
import pluginNext from "@next/eslint-plugin-next";
import testingLibrary from "eslint-plugin-testing-library";
import jestDom from "eslint-plugin-jest-dom";
// @ts-ignore
import vitest from "eslint-plugin-vitest";
import playwright from "eslint-plugin-playwright";
import checkFiles from "eslint-plugin-check-file";
// @ts-ignore
import nextVitals from "eslint-config-next/core-web-vitals";
// @ts-ignore
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "node_modules/*",
    "public/mockServiceWorker.js",
    "generators/*",
    "**/node_modules",
    "**/.next",
    "**/.sst",
    "**/.open-next",
    "**/*.{ico,css,json}",
    "src/lib/supabase/types.gen.ts",
  ]),
  // this makes next lint work https://github.com/vercel/next.js/issues/71763#issuecomment-2476838298
  {
    name: "ESLint Config - nextjs",
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      {
        plugins: {
          "react-hooks": reactHooksPlugin,
        },
        rules: reactHooksPlugin.configs.recommended.rules,
      },
      jsxA11y.flatConfigs.recommended,
      {
        plugins: {
          prettier: prettierPlugin,
        },
        rules: prettierConfig.rules,
      },
      tailwindPlugin.configs["flat/recommended"],
      {
        plugins: {
          "@next/next": pluginNext,
        },
        rules: {
          ...pluginNext.configs.recommended.rules,
          ...pluginNext.configs["core-web-vitals"].rules,
        },
      },
    ],
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {},
      },
    },
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "import/no-unresolved": ["error", { ignore: ["server-only"] }],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // disables cross-feature imports:
            // eg. src/features/discussions should not import from src/features/comments, etc.
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
            },
            // enforce unidirectional codebase:
            // e.g. src/app can import from src/features but not the other way around
            {
              target: "./src/features",
              from: "./src/app",
            },

            // e.g src/features and src/app can import from these shared modules but not the other way around
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
      "import/no-cycle": "error",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    extends: [
      testingLibrary.configs["flat/react"],
      jestDom.configs["flat/recommended"],
      vitest.configs.env,
      vitest.configs.recommended,
    ],
  },
  {
    files: ["**/*.spec.{ts,tsx}"],
    ...playwright.configs["flat/recommended"],
  },
  {
    files: ["src/**/*.*"],
    plugins: { "check-file": checkFiles },
    rules: {
      "check-file/no-index": "error",
      "check-file/filename-naming-convention": [
        "error",
        { "**/*.{ts,tsx}": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/!(app)/**": "KEBAB_CASE",
          "src/app/**/": "NEXT_JS_APP_ROUTER_CASE",
        },
      ],
    },
  },
]);

export default eslintConfig;
