import { existsSync, writeFileSync } from 'node:fs'
import { bundler } from '@tevm/base-bundler'
import type { Cache } from '@tevm/bundler-cache'
// @ts-expect-error
import * as solc from 'solc'
import { createHostDecorator } from '../factories/index.js'
import { isSolidity } from '../utils/index.js'
import { resolveJsonAsConst } from '../utils/resolveJsonAsConst.js'

/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
 * TODO replace with modules for code reuse
 */
export const getScriptSnapshotDecorator = (solcCache: Cache) =>
	createHostDecorator(({ languageServiceHost }, ts, logger, config, fao) => {
		return {
			getScriptSnapshot: (filePath) => {
				if (filePath.endsWith('.json')) {
					return resolveJsonAsConst(config, filePath, fao, languageServiceHost, ts)
				}

				// Parse file path to extract query parameters
				const { fileName, queryParams } = (() => {
					if (isSolidity(filePath.split('?')[0])) {
						const [fileName, queryString] = filePath.split('?')
						return { fileName, queryParams: new URLSearchParams(queryString ?? '') }
					}
					return { fileName: filePath, queryParams: new URLSearchParams('') }
				})()

				if (
					!isSolidity(fileName) ||
					!existsSync(fileName) ||
					existsSync(`${fileName}.d.ts`) ||
					existsSync(`${fileName}.ts`)
				) {
					return languageServiceHost.getScriptSnapshot(filePath)
				}

				try {
					const plugin = bundler(config, logger as any, fao, solc, solcCache)

					// Check for explicit query parameters or fall back to naming convention
					const includeBytecode = queryParams.get('includeBytecode') === 'true' || fileName.endsWith('.s.sol')
					const includeAst = queryParams.get('includeAst') === 'true'

					const snapshot = plugin.resolveDtsSync(fileName, process.cwd(), includeAst, includeBytecode)

					if (config.debug) {
						writeFileSync(
							`${fileName}.debug.d.ts`,
							`// Debug: the following snapshot is what tevm resolves ${fileName} to\n${snapshot.code}`,
						)
					}
					return ts.ScriptSnapshot.fromString(snapshot.code)
				} catch (e) {
					logger.error(`@tevm/ts-plugin: getScriptSnapshotDecorator was unable to resolve dts for ${fileName}`)
					logger.error(e as any)
					return ts.ScriptSnapshot.fromString('export {}')
				}
			},
		}
	})
