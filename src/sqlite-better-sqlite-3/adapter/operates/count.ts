import type { Database } from "better-sqlite3";

import type { DbAdapter } from "~sqlite";

import { quote } from "../../../sqlite/quote.ts";
import { buildWhere } from "../../../sqlite/domain/where.ts";

export const bindCount =
  (db: Database): DbAdapter.Type["count"] =>
  (table, where) => {
    const { clause, params } = buildWhere(where);
    const row = db.prepare(`SELECT COUNT(*) AS c FROM ${quote(table)}${clause}`).get(...params) as {
      c: number;
    };
    return row.c;
  };
