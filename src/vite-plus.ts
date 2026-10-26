import { expect } from "vite-plus/test";
import * as matchers from "./sqlite/matchers/index.ts";

import type { DbAdapterMatchers, TableRefMatchers } from "./vitest.ts";

expect.extend(matchers);

declare module "vite-plus/test" {
  interface Matchers<R, T> extends DbAdapterMatchers<R, T>, TableRefMatchers<R, T> {}
}
