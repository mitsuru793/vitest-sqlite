import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: {
      vitest: "src/vitest.ts",
      "vite-plus": "src/vite-plus.ts",
      "better-sqlite3": "src/sqlite-better-sqlite-3/index.ts",
    },
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
    },
    dts: {
      generator: "tsgo",
      entry: [
        "src/index.ts",
        "src/sqlite-better-sqlite-3/index.ts",
        "src/vitest.ts",
        "src/vite-plus.ts",
      ],
      tsconfig: "tsconfig.build.json",
    },
    exports: true,
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  test: {
    alias: {
      "~arktype-helper": "./src/arktype-helper/index.ts",
      "~sqlite": "./src/sqlite/index.ts",
      "~sqlite-better-sqlite-3": "./src/sqlite-better-sqlite-3/index.ts",
      "~test": fileURLToPath(new URL("./test", import.meta.url)),
    },
  },
});
