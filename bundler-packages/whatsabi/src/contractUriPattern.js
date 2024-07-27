/**
 * Regular expression pattern for matching contract URIs.
 * Looks like evm://<chainId>/<address>?<query>
 * Valid query params (all optional)
 * - rpcUrl: string
 * - etherscanBaseUrl: string
 * - followProxies: boolean
 * - etherscanApiKey: string
 */
export const contractUriPattern = /^evm:\/\/(?<chainId>\d+)\/(?<address>0x[a-fA-F0-9]{40})(\?(?<query>.+))?$/
