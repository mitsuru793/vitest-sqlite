import type { Database } from "better-sqlite3";

import type { DbAdapter } from "~sqlite";

import { quote } from "../../../sqlite/quote.ts";

export const bindGetColumns =
  (db: Database): DbAdapter.Type["getColumns"] =>
  (table) => {
    const rows = db.prepare(`PRAGMA table_info(${quote(table)})`).all() as Array<{
      name: string;
      type: string;
      notnull: number;
      pk: number;
    }>;
    return rows.map((r) => ({
      name: r.name,
      type: r.type,
      notNull: r.notnull === 1,
      primaryKey: r.pk > 0,
    }));
  };
