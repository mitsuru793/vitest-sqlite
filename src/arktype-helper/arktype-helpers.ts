import { type } from "arktype";
import { SchemaParseError } from "./errors.ts";

export type Parse<T> = (value: unknown) => T;

type ParseConfig<S extends type.Any> = {
  schema: S;
  name: string;
};

export const bindParse =
  <S extends type.Any>({ schema, name }: ParseConfig<S>): Parse<S["infer"]> =>
  (value) => {
    const parsed = schema(value);
    if (parsed instanceof type.errors) {
      throw new SchemaParseError({ schema: name, value, cause: parsed });
    }

    return parsed;
  };
