import type { TevmClient } from '@tevm/client-types'

/**
 * @deprecated a new http client will be created in a future version. For now it's recommended to use viem
 */
export interface HttpClient extends TevmClient {
	url: string
	name: string
}
