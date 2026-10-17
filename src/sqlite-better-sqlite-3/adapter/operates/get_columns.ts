import type { Database } from "better-sqlite3";

import { type DbAdapter, quote } from "~sqlite";
import { getTableForeignKey } from "../../queries/index.ts";

export const bindGetColumns =
  (db: Database): DbAdapter.Type["getColumns"] =>
  (table) => {
    const rows = db.prepare(`PRAGMA table_info(${quote(table)})`).all() as Array<{
      name: string;
      type: string;
      notnull: number;
      pk: number;
    }>;
    const fkInfoList = getTableForeignKey(db)(table);

    return rows.map((r) => {
      const foreignKey = fkInfoList.find((fk) => fk.from === r.name);
      return {
        name: r.name,
        type: r.type,
        notNull: r.notnull === 1,
        primaryKey: r.pk > 0,
        foreignKey: foreignKey
          ? {
              table: foreignKey.table,
              column: foreignKey.to,
            }
          : false,
      };
    });
  };
