import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Standard fetch-in-effect pattern is acceptable; this rule causes hundreds of false positives
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      // Downgrade explicit-any from error to warning to allow gradual type migration
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
