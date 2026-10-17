import type { MatcherState, MatcherResult } from "vitest";

import { TableRef, type Where } from "../../domain/index.ts";
import { show } from "../_helper/show.ts";

export function toHaveRowCount(
  this: MatcherState,
  received: unknown,
  expected: number,
  where?: Where.Type,
): MatcherResult {
  const tableRef = TableRef.parse(received);

  const actual =
    where === undefined
      ? tableRef.adapter.count(tableRef.name)
      : tableRef.adapter.count(tableRef.name, where);

  const pass = actual === expected;
  return {
    pass,
    message: () =>
      pass
        ? `expected table "${tableRef.name}" not to have ${expected} rows matching ${show(where)}`
        : `expected table "${tableRef.name}" to have ${expected} rows matching ${show(where)}, but it has ${actual}`,
  };
}
