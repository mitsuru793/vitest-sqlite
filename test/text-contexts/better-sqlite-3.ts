import { test } from "vitest";
import Database from "better-sqlite3";
import { BetterSqlite3Adapter } from "~sqlite-better-sqlite-3";

type DbClient = Database.Database;

export const dbTest = test
  .extend("dbClient", ({ task: _task }, { onCleanup }): DbClient => {
    const dbClient = new Database(":memory:");
    onCleanup(() => {
      dbClient.close();
    });
    return dbClient;
  })
  .extend("db", ({ dbClient }) => {
    return BetterSqlite3Adapter.create(dbClient);
  });
