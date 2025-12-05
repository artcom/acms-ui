import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    reactPlugin.configs.flat.recommended,
    reactHooksPlugin.configs.flat.recommended,
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            import: importPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx"],
                },
            },
        },
        rules: {
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "import/no-unresolved": "error",
        },
    },
    eslintConfigPrettier,
];
