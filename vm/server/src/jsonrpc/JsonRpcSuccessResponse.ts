import type { PrimitiveType } from "./PrimitiveType.js";

export type JsonRpcSuccessResponse = {
  readonly jsonrpc: '2.0';
  readonly id?: string | number | null;
  readonly result: PrimitiveType | object | ReadonlyArray<PrimitiveType>;
  readonly method: string;
}
