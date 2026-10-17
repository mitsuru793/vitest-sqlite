import type { Database } from "better-sqlite3";
import type { DbAdapter, Row } from "~sqlite";
import { quote } from "../../../sqlite/quote.ts";
import { buildWhere } from "../../../sqlite/domain/where.ts";

export const bindFindRows =
  (db: Database): DbAdapter.Type["findRows"] =>
  (table, where) => {
    const { clause, params } = buildWhere(where);
    return db.prepare(`SELECT * FROM ${quote(table)}${clause}`).all(...params) as Row.Type[];
  };
