import type { MatcherResult, MatcherState } from "vitest";

import { TableRef } from "../../domain/index.ts";

export function toBeEmptyTable(this: MatcherState, received: unknown): MatcherResult {
  const tableRef = TableRef.parse(received);

  const actual = tableRef.adapter.count(tableRef.name);
  const pass = actual === 0;

  return {
    pass,
    message: () =>
      pass
        ? `expected table "${tableRef.name}" not to be empty`
        : `expected table "${tableRef.name}" to be empty, but it has ${actual} rows`,
  };
}
