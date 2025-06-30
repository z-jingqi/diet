import SchemaBuilder from "@pothos/core";
import { Kind } from "graphql";
import type { GraphQLContext } from "./context";

// 为 Pothos 定义上下文类型
export interface PothosTypes {
  Context: GraphQLContext;
  Scalars: {
    DateTime: {
      Input: Date | string;
      Output: string;
    };
  };
}

// 创建 SchemaBuilder 实例
export const builder = new SchemaBuilder<PothosTypes>({});

// ----------------------
// Global DateTime scalar (ISO-8601 string)
// ----------------------

export const DateTimeScalar = builder.scalarType("DateTime", {
  serialize: (value: unknown) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === "string") {
      return new Date(value).toISOString();
    }
    throw new Error("Invalid DateTime value");
  },
  parseValue: (value: unknown) => {
    if (typeof value === "string" || value instanceof Date) {
      return new Date(value as string);
    }
    throw new Error("DateTime must be a string or Date");
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new Error("DateTime must be string literal");
  },
});
