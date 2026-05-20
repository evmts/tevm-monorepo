import type { createHttpClient } from './createHttpClient.js'

/**
 * @deprecated a new http client will be created in a future version. For now it's recommended to use viem
 */
export type HttpClient = ReturnType<typeof createHttpClient>
