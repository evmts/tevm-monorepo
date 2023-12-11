import type { Id } from "./Id";
import type { PrimitiveType } from "./PrimitiveType";

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
