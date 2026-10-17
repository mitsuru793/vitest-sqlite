import { ErrorFactory } from "@praha/error-factory";

export class SchemaParseError extends ErrorFactory({
  name: "SchemaParseError",
  message: ({ schema, value }) => `failed to parse value of ${schema}: ${JSON.stringify(value)}`,
  fields: ErrorFactory.fields<{
    schema: string;
    value: unknown;
  }>(),
}) {}
