import type { TevmClient } from '@tevm/client-types'

/**
 * @deprecated a new http client will be created in a future version. For now it's recomended to use viem
 */
export type HttpClient = TevmClient & {
  /**
   * The url being used to connect to the remote Tevm backend
   */
  url: string
  /**
   * Name of the client
   */
  name: string
}
