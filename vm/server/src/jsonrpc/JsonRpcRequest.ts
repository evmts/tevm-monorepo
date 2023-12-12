import type { Id } from "./Id.js"

export type JsonRpcRequest = {
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params?: unknown
  readonly id?: Id
}

