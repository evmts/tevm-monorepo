import type { TrpcApi } from './TrpcApi.js'

/**
 * The TRPC Router type for the EVMts server
 * Note: It is recomended to use @evmts/vm-client rather than this directly
 * as it's more typesafe via generics
 */
export type EvmtsTrpcRouter = TrpcApi['handler']
export { createEvmtsServer } from './createEvmtsServer.js'
