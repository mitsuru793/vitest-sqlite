import type { MatcherState, MatcherResult } from "vitest";

import { TableRef, SqliteColumnType } from "../../domain/index.ts";
import { show } from "../_helper/index.ts";

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

  const actual = tableRef.adapter.getColumns(tableRef.name).find((c) => c.name === name);

  let pass = actual !== undefined;
  // only the first mismatching option is reported, in option-declaration order
  let mismatch: string | undefined;

  if (actual) {
    if (opts.type !== undefined && actual.type !== opts.type) {
      pass = false;
      mismatch ??= `expected column "${tableRef.name}.${name}" to be of type ${opts.type}, but it is ${actual.type}`;
    }

    if (opts.notNull !== undefined && actual.notNull !== opts.notNull) {
      pass = false;
      mismatch ??= `expected column "${tableRef.name}.${name}" to be ${opts.notNull ? "NOT NULL" : "nullable"}, but it is ${actual.notNull ? "NOT NULL" : "nullable"}`;
    }

    if (opts.foreignKey !== undefined) {
      const foreignKeyMatches =
        typeof opts.foreignKey === "boolean"
          ? !!actual.foreignKey === opts.foreignKey
          : typeof actual.foreignKey === "object" &&
            actual.foreignKey.table === opts.foreignKey.table &&
            actual.foreignKey.column === opts.foreignKey.column;

      if (!foreignKeyMatches) {
        pass = false;
        mismatch ??= `expected column "${tableRef.name}.${name}" to have foreign key ${show(opts.foreignKey)}, but it has ${show(actual.foreignKey)}`;
      }
    }

    if (opts.unique !== undefined && actual.unique !== opts.unique) {
      pass = false;
      mismatch ??= `expected column "${tableRef.name}.${name}" to be ${opts.unique ? "unique" : "not unique"}, but it is ${actual.unique ? "unique" : "not unique"}`;
    }
  }

  // build the message parts
  const type = opts.type ? ` of type ${opts.type}` : "";

  return {
    pass,
    message: () =>
      pass
        ? `expected table "${tableRef.name}" not to have column "${name}"${type}`
        : actual
          ? (mismatch ?? `expected table "${tableRef.name}" to have column "${name}"${type}`)
          : `expected table "${tableRef.name}" to have column "${name}"${type}`,
  };
}
