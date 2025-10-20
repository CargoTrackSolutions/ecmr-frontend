import { defineConfig, globalIgnores } from "eslint/config";
import licenseHeader from "eslint-plugin-license-header";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["projects/**/*"]), {
    plugins: {
        "license-header": licenseHeader,
    },
}, {
    files: ["**/*.ts"],

    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
    ),

    rules: {
        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
        }],

        "@angular-eslint/component-selector": ["error", {
            type: "element",
            prefix: "app",
            style: "kebab-case",
        }],

        "license-header/header": ["error", "./resources/license-header.js"],
    },
}, {
    files: ["**/*.html"],

    extends: compat.extends(
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility",
    ),

    rules: {},
}]);