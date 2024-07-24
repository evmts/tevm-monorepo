/**
 * @param {string} importPath
 */
export const parseImportPath = (importPath) => {
	try {
		const url = new URL(importPath)

		// Ensure the protocol is correct
		if (url.protocol !== 'ethereum:') {
			return undefined
		}

		const network = url.hostname // e.g., 'mainnet'
		const address = url.pathname.slice(1) // e.g., '0x292349234923492349234959'

		// Validate the contract address
		if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			return undefined
		}

		const rpcUrl = url.searchParams.get('rpc') // Optional, e.g., 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'

		return { network, address, rpcUrl }
	} catch (e) {
		// If there's any error (e.g., invalid URL), return undefined
		return undefined
	}
}
