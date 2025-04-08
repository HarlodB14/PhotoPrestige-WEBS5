import {defineConfig} from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
    // Base JavaScript configuration
    js.configs.recommended,

    {
        // Apply to all JS files
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node, // Node.js globale files (process, __dirname, etc.)
                ...globals.browser
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "commonjs" // Use "module" if using ESM imports
            }
        },
        rules: {
            "no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^(_|err|error)",
                    caughtErrorsIgnorePattern: "^(_|err|error)",
                    destructuredArrayIgnorePattern: "^_"
                }
            ],
            "no-console": "warn"
        }
    },

    {
        files: ["Services/Authentication/**/*.js"],
        rules: {
            "no-undef": "off"
        }
    }
]);