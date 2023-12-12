import type { Id } from "./Id.js";
import type { PrimitiveType } from "./PrimitiveType.js";

export type JsonRpcErrorResponse = {
  readonly error: {
    readonly code: number;
    readonly message: string;
    readonly data?: PrimitiveType | object | ReadonlyArray<PrimitiveType>
  };
  readonly id: Id;
  readonly jsonrpc: '2.0';
  readonly method: string;
}
