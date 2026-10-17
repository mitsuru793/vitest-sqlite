import type { MatcherState, MatcherResult } from "vitest";

import { TableRef, Where } from "../../domain/index.ts";
import { show } from "../_helper/index.ts";

export function toHaveRow(this: MatcherState, received: unknown, where: Where.Type): MatcherResult {
  const tableRef = TableRef.parse(received);

  const pass = tableRef.adapter.count(tableRef.name, where) > 0;
  return {
    pass,
    message: () =>
      pass
        ? `expected table "${tableRef.name}" not to have a row matching ${show(where)}`
        : `expected table "${tableRef.name}" to have a row matching ${show(where)}`,
  };
}
