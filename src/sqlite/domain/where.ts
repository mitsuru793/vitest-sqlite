import { type } from "arktype";
import { quote } from "../quote.ts";
import { RowValue } from "./row.ts";

type Where = typeof Where.inferOut;

/** Row filter: an object of column = value (null means IS NULL), or a raw SQL WHERE clause. */
export type Type = Where;

type SqlWhere = { sql: string; params?: unknown[] };

const RowWhere = type({
  "[string]": RowValue,
});

const SqlWhere = type({
  sql: "string",
  "params?": "unknown[]",
});

const Where = type(RowWhere).or(SqlWhere);

export const schema = Where;

export function buildWhere(where?: Where): { clause: string; params: unknown[] } {
  if (!where) {
    return { clause: "", params: [] };
  }

  if (SqlWhere.allows(where)) {
    return {
      clause: ` WHERE (${where.sql})`,
      params: (where.params as unknown[]) ?? [],
    };
  }

  // where is row-based object
  const rowWhereList = Object.entries(where);
  if (rowWhereList.length === 0) {
    return { clause: "", params: [] };
  }

  const parts: string[] = [];
  const params: unknown[] = [];
  for (const [col, value] of rowWhereList) {
    if (value === null) {
      parts.push(`${quote(col)} IS NULL`);
    } else {
      parts.push(`${quote(col)} = ?`);
      // Convert boolean values to numbers for SQLite compatibility
      params.push(typeof value === "boolean" ? Number(value) : value);
    }
  }
  return { clause: ` WHERE ${parts.join(" AND ")}`, params };
}
