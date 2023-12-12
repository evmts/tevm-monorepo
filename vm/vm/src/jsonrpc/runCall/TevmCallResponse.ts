import type { RunCallResponse } from "../../actions/runCall/RunCallResponse.js";

export type TevmCallResponse = {
  jsonrpc: '2.0',
  method: 'tevm_call',
  result: RunCallResponse,
  id?: string | number | null,
}
