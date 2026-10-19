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

    const uniqueInfoList = db
      .prepare(`
      SELECT
        iList.name AS index_name,
        iList.origin,
        iList.partial,
        iInfo.seqno,
        iInfo.name AS column_name
      FROM pragma_index_list(?) AS iList
        JOIN pragma_index_info(iList.name) AS iInfo
      WHERE iList."unique" = 1
        AND iList.partial = 0
      ORDER BY iList.name, iInfo.seqno;
    `)
      .bind(table)
      .all() as Array<{
      index_name: string;
      origin: string;
      partial: number;
      seqno: number;
      column_name: string;
    }>;

    return rows.map((row) => {
      const foreignKey = fkInfoList.find((fk) => fk.from === row.name);
      const unique = uniqueInfoList.some((info) => info.column_name === row.name);
      return {
        name: row.name,
        type: row.type,
        notNull: row.notnull === 1,
        primaryKey: row.pk > 0,
        foreignKey: foreignKey
          ? {
              table: foreignKey.table,
              column: foreignKey.to,
            }
          : false,
        unique,
      };
    });
  };
