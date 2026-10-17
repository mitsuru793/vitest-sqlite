import type { Database } from "better-sqlite3";

import type { DbAdapter } from "~sqlite";

import { bindTableExists } from "./operates/table_exists.ts";
import { bindGetColumns } from "./operates/get_columns.ts";
import { bindCount } from "./operates/count.ts";
import { bindFindRows } from "./operates/find_rows.ts";

export function create(db: Database): DbAdapter.Type {
  const tableExists = bindTableExists(db);
  const getColumns = bindGetColumns(db);
  const count = bindCount(db);
  const findRows = bindFindRows(db);

  return {
    tableExists,
    getColumns,
    count,
    findRows,
  };
}
