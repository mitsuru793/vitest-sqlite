# vitest-sqlite

Vitest matchers and adapters for testing SQLite databases, with `better-sqlite3` support.

## Installation

Install the library and Vitest:

```sh
npm install --save-dev @mitsuru793/vitest-sqlite vitest
```

The `better-sqlite3` package is installed as a dependency of this library.

## Setup with Vitest

Import the Vitest integration once from a setup file:

```ts
// vitest.setup.ts
import "@mitsuru793/vitest-sqlite/vitest";
```

Register that file in your Vitest configuration:

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

The integration registers the matchers and adds their TypeScript types.

## Setup with Vite+

When running tests with Vite+, import the Vite+ integration instead:

```ts
// test/setup.ts
import "@mitsuru793/vitest-sqlite/vite-plus";
```

Add the setup file to the `test` configuration in `vite.config.ts`:

```ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.ts"],
  },
});
```

## Usage

Create a `better-sqlite3` database, wrap it in an adapter, and use `table()` to
create a reference for table-specific matchers:

```ts
import Database from "better-sqlite3";
import { expect, test } from "vitest";
import { BetterSqlite3Adapter, table } from "@mitsuru793/vitest-sqlite/better-sqlite3";

test("checks database tables and rows", () => {
  const client = new Database(":memory:");
  try {
    client.exec(`
      CREATE TABLE users (name TEXT, role TEXT);
      INSERT INTO users VALUES ('Ada', 'admin');
    `);

    const db = BetterSqlite3Adapter.create(client);
    const users = table(db, "users");

    expect(db).toHaveTable("users");
    expect(users).toHaveColumn("name", { type: "TEXT" });
    expect(users).toHaveRow({ name: "Ada", role: "admin" });
    expect(users).toHaveRowCount(1);
    expect(users).not.toBeEmptyTable();
  } finally {
    client.close();
  }
});
```

### Available matchers

- `expect(db).toHaveTable(name)` checks whether a table exists.
- `expect(tableRef).toHaveColumn(name, { type? })` checks for a column and,
  optionally, its SQLite type (`TEXT`, `INTEGER`, `REAL`, or `BLOB`).
- `expect(tableRef).toHaveRow(where)` checks whether at least one row matches.
- `expect(tableRef).toHaveRowCount(count, where?)` checks the matching row
  count, or the total count if `where` is omitted.
- `expect(tableRef).toBeEmptyTable()` checks that the table has no rows.

`where` can be an object of column values or a SQL condition with parameters:

```ts
expect(users).toHaveRow({ role: "admin" });
expect(users).toHaveRow({ sql: "name = ?", params: ["Ada"] });
```

The matcher types are receiver-specific: table matchers are available for
`TableRef` values created by `table()`, while `toHaveTable` is available for
`DbAdapter` values.

## Development

Install dependencies and run the checks, tests, or package build with Vite+:

```sh
vp install
vp check
vp test
vp run build
```
