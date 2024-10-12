import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  {
    project: ["./tsconfig,json"],
  },
  ...prettier,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
