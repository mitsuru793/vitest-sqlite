import { describe, expect } from "vitest";

import { table } from "~sqlite-better-sqlite-3";
import { dbTest } from "~test/text-contexts/better-sqlite-3.ts";

import { toHaveColumn } from "./to_have_column.ts";

expect.extend({ toHaveColumn });

describe("toHaveColumn", () => {
  dbTest.beforeEach(({ dbClient }) => {
    dbClient.exec("CREATE TABLE posts (title TEXT, views INTEGER)");
  });

  dbTest("error messages", ({ db }) => {
    expect(() => {
      expect(table(db, "posts")).not.toHaveColumn("title");
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" not to have column "title"]`,
    );

    expect(() => {
      expect(table(db, "posts")).not.toHaveColumn("title", { type: "TEXT" });
    }).toThrowErrorMatchingInlineSnapshot(
      `[Error: expected table "posts" not to have column "title" of type TEXT]`,
    );
  });

  dbTest("passes when the table has the requested column", ({ db }) => {
    expect(table(db, "posts")).toHaveColumn("title");
    expect(table(db, "posts")).toHaveColumn("title", { type: "TEXT" });
  });

  dbTest("fails when the table does not have the requested column", ({ db }) => {
    expect(table(db, "posts")).not.toHaveColumn("missing");
  });

  dbTest("checks column types correctly", ({ db, dbClient }) => {
    const COLUMN_TYPES = ["TEXT", "INTEGER", "REAL", "BLOB"] as const;

    dbClient.exec(`
      CREATE TABLE my_table (
        text_col TEXT,
        integer_col INTEGER,
        real_col REAL,
        blob_col BLOB,
        null_col NULL
      )`);

    expect(table(db, "my_table")).toHaveColumn("text_col", { type: "TEXT" });
    for (const type of COLUMN_TYPES) {
      if (type !== "TEXT") {
        expect(table(db, "my_table")).not.toHaveColumn("text_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("integer_col", { type: "INTEGER" });
    for (const type of COLUMN_TYPES) {
      if (type !== "INTEGER") {
        expect(table(db, "my_table")).not.toHaveColumn("integer_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("real_col", { type: "REAL" });
    for (const type of COLUMN_TYPES) {
      if (type !== "REAL") {
        expect(table(db, "my_table")).not.toHaveColumn("real_col", { type });
      }
    }

    expect(table(db, "my_table")).toHaveColumn("blob_col", { type: "BLOB" });
    for (const type of COLUMN_TYPES) {
      if (type !== "BLOB") {
        expect(table(db, "my_table")).not.toHaveColumn("blob_col", { type });
      }
    }
  });

  describe("NULL column type", () => {
    dbTest.beforeEach(({ dbClient }) => {
      dbClient.exec(`CREATE TABLE my_table (
        not_null_col TEXT NOT NULL,
        nullable_col TEXT
      )`);
    });

    dbTest("checks for NULL column type", ({ db }) => {
      const myTable = table(db, "my_table");

      expect(myTable).toHaveColumn("not_null_col", { notNull: true });
      expect(() => {
        expect(myTable).not.toHaveColumn("not_null_col", { notNull: true });
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: expected table "my_table" not to have column "not_null_col"]`,
      );

      expect(myTable).toHaveColumn("nullable_col", { notNull: false });
      expect(() => {
        expect(myTable).not.toHaveColumn("nullable_col", { notNull: false });
      }).toThrowErrorMatchingInlineSnapshot(
        `[Error: expected table "my_table" not to have column "nullable_col"]`,
      );
    });
  });

  describe("with options.foreignKey", () => {
    dbTest.beforeEach(({ dbClient }) => {
      dbClient.exec(`
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        );
        
        DROP TABLE IF EXISTS categories;
        CREATE TABLE categories (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL
        );

        DROP TABLE IF EXISTS posts;
        CREATE TABLE posts (
          id INTEGER PRIMARY KEY,
          author_id INTEGER,
          category_id INTEGER,
          title TEXT NOT NULL,
          FOREIGN KEY (author_id) REFERENCES users(id),
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );`);
    });

    dbTest("when passed object", ({ db }) => {
      expect(table(db, "posts")).toHaveColumn("author_id", {
        foreignKey: { table: "users", column: "id" },
      });
      expect(table(db, "posts")).toHaveColumn("category_id", {
        foreignKey: { table: "categories", column: "id" },
      });
    });

    dbTest("when passed boolean", ({ db }) => {
      expect(table(db, "posts")).toHaveColumn("author_id", {
        foreignKey: true,
      });
      expect(table(db, "posts")).toHaveColumn("category_id", {
        foreignKey: true,
      });

      expect(table(db, "posts")).toHaveColumn("title");
      expect(table(db, "posts")).toHaveColumn("title", {
        foreignKey: false,
      });
    });
  });
});
