import type { TrpcApi } from './TrpcApi.js'

/**
 * The TRPC Router type for the Tevm server
 * Note: It is recomended to use @tevm/vm-client rather than this directly
 * as it's more typesafe via generics
 */
export type TevmTrpcRouter = TrpcApi['handler']
export { createTevmServer } from './createTevmServer.js'
