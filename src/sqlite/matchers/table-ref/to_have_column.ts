import type { MatcherState, MatcherResult } from "vitest";

import { TableRef, SqliteColumnType } from "../../domain/index.ts";

export function toHaveColumn(
  this: MatcherState,
  received: unknown,
  name: string,
  opts: { type?: SqliteColumnType.Type } = {},
): MatcherResult {
  const tableRef = TableRef.parse(received);

  const targetColumn = tableRef.adapter.getColumns(tableRef.name).find((c) => c.name === name);
  let pass = targetColumn !== undefined;

  if (targetColumn) {
    if (opts.type) {
      pass = targetColumn.type === opts.type;
    }
  }

  // build the message parts
  const type = opts.type ? ` of type ${opts.type}` : "";
  const actual = tableRef.adapter.getColumns(tableRef.name).find((c) => c.name === name);

  return {
    pass,
    message: () =>
      pass
        ? `expected table "${tableRef.name}" not to have column "${name}"${type}`
        : actual
          ? `expected column "${tableRef.name}.${name}" to be ${opts.type}, but it is ${actual.type}`
          : `expected table "${tableRef.name}" to have column "${name}"${type}`,
  };
}
