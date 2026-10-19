import type { MatcherState, MatcherResult } from "vitest";

import { TableRef, SqliteColumnType } from "../../domain/index.ts";

export function toHaveColumn(
  this: MatcherState,
  received: unknown,
  name: string,
  opts: {
    type?: SqliteColumnType.Type;
    notNull?: boolean;
    foreignKey?: boolean | { table: string; column: string };
    unique?: boolean;
  } = {},
): MatcherResult {
  const tableRef = TableRef.parse(received);

  const targetColumn = tableRef.adapter.getColumns(tableRef.name).find((c) => c.name === name);
  let pass = targetColumn !== undefined;

  if (targetColumn) {
    if (opts.type !== undefined) {
      pass = targetColumn.type === opts.type;
    }

    if (opts.notNull !== undefined) {
      pass = targetColumn.notNull === opts.notNull;
    }

    if (opts.foreignKey !== undefined) {
      if (typeof opts.foreignKey === "boolean") {
        pass = !!targetColumn.foreignKey === opts.foreignKey;
      } else {
        pass =
          typeof targetColumn.foreignKey === "object" &&
          targetColumn.foreignKey.table === opts.foreignKey.table &&
          targetColumn.foreignKey.column === opts.foreignKey.column;
      }
    }

    if (opts.unique !== undefined) {
      pass = pass && targetColumn.unique === opts.unique;
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
