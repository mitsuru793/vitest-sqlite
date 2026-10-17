import type { Database } from "better-sqlite3";

import type { DbAdapter } from "~sqlite";

export const bindTableExists =
  (db: Database): DbAdapter.Type["tableExists"] =>
  (table) => {
    const row = db
      .prepare("SELECT 1 FROM sqlite_master WHERE type IN ('table','view') AND name = ?")
      .get(table);
    return row !== undefined;
  };
