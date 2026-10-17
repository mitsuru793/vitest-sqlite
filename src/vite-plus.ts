import "vite-plus/test";

import type { DbAdapterMatchers, TableRefMatchers } from "./vitest.ts";

declare module "vite-plus/test" {
  interface Matchers<R, T> extends DbAdapterMatchers<R, T>, TableRefMatchers<R, T> {}
}
