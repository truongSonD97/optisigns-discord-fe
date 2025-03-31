import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend Next.js recommended configurations
const baseConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

// Add custom rule overrides
const customRules = {
  rules: {
    // Change unused variable errors to warnings, ignoring variables starting with _
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    // Allow explicit any with a warning instead of an error
    "@typescript-eslint/no-explicit-any": "warn",
    // Warn on missing dependencies in hooks (or adjust as needed)
    "react-hooks/exhaustive-deps": "warn",
    // Disable anonymous default export rule if you prefer
    "import/no-anonymous-default-export": "off",
  },
};

export default [...baseConfig, customRules];
