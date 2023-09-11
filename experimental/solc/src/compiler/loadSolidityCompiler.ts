import type { SolidityCompiler } from './types'

/**
 * If no version is specified, we use 0.8.13
 */
export async function getSolidityCompiler(
	version = '0.8.13',
): Promise<SolidityCompiler> {
	try {
		const { default: solc } = await import(
			`https://esm.sh/solc@${version}?bundle`
		)
		return solc
	} catch (error) {
		console.log('[getSolidityCompiler]', error)
		throw new Error(
			`Failed to fetch compiler ${version} - ${
				error instanceof Error ? error.message : ''
			}`,
		)
	}
}
