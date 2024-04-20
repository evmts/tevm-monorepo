// @ts-expect-error
import { default as solc } from 'https://esm.sh/solc@0.8.13?bundle'
import type { SolidityCompiler } from './types'

/**
 * To run:
 *
 * ```bash
 * NODE_OPTIONS='--experimental-loader=./scripts/http-loader.mjs --experimental-network-imports --no-warnings --loader=tsx' node src/compiler/loadSolidityCompilerSync.ts
 * ```
 */
export function getSolidityCompilerSync(): SolidityCompiler {
	return solc
}
