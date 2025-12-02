import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["components/ui/**/*.tsx"],
      exclude: [
        "node_modules/",
        "vitest.setup.ts",
        "vitest.config.ts",
        "**/*.stories.tsx",
        "**/*.test.tsx",
        "**/*.config.{js,ts}",
        ".next/",
        "infrastructure/",
        "public/",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  css: {
    postcss: {}, // Empty PostCSS config to bypass Tailwind v4 plugin issues
  },
});
