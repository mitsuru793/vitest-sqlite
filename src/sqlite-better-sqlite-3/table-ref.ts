import type { DbAdapter, TableRef } from "~sqlite";

export function table(db: DbAdapter.Type, name: string): TableRef.Type {
  return { __dbTestingTable: true, adapter: db, name };
}
