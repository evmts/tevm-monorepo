// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes 
// import type { Address } from 'abitype'

/**
 * @internal
 * Most general RPC schema type.
 */
export type RpcSchema = readonly {
  Method: string
  Parameters?: unknown
  ReturnType: unknown
}[]
