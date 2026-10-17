import type { MatcherState, MatcherResult } from "vitest";

import { DbAdapter } from "../../domain/index.ts";

export function toHaveTable(this: MatcherState, received: unknown, name: string): MatcherResult {
  const db = DbAdapter.parse(received);

  const pass = db.tableExists(name);
  return {
    pass,
    message: () =>
      pass ? `expected table "${name}" not to exist` : `expected table "${name}" to exist`,
  };
}
