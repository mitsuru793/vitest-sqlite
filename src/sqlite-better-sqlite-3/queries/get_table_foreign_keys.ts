import { type } from "arktype";
import type { Database } from "better-sqlite3";
import { bindParse } from "~arktype-helper";

type ForeignKeyInfo = typeof ForeignKeyInfo.inferOut;

const ForeignKeyInfo = type({
  id: "number",
  seq: "number",
  table: "string > 0",
  from: "string > 0",
  to: "string > 0",
  on_update: "string > 0",
  on_delete: "string > 0",
  match: "string > 0",
});

const ForeignKeyInfoList = ForeignKeyInfo.array();

const parse = bindParse({ schema: ForeignKeyInfoList, name: "ForeignKeyInfoList" });

export const getTableForeignKeys =
  (db: Database) =>
  (table: string): ForeignKeyInfo[] => {
    const rows = db
      .prepare(`
        SELECT key_lists.*
        FROM sqlite_schema schema
        JOIN pragma_foreign_key_list(schema.name) key_lists
        WHERE schema.type = 'table'
          AND schema.name = ?;
      `)
      .all(table);
    const parsed = parse(rows);
    return parsed;
  };
