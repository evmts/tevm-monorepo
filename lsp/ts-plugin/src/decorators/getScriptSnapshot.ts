import { existsSync, writeFileSync } from 'node:fs'
import { bundler } from '@tevm/base-bundler'
import type { Cache } from '@tevm/bundler-cache'
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
				if (
					!isSolidity(filePath) ||
					!existsSync(filePath) ||
					existsSync(`${filePath}.d.ts`) ||
					existsSync(`${filePath}.ts`)
				) {
					return languageServiceHost.getScriptSnapshot(filePath)
				}
				try {
					const plugin = bundler(config, logger as any, fao, solc, solcCache)
					const resolveBytecode = filePath.endsWith('.s.sol')
					const snapshot = plugin.resolveDtsSync(filePath, process.cwd(), false, resolveBytecode)
					if (config.debug) {
						writeFileSync(
							`${filePath}.debug.d.ts`,
							`// Debug: the following snapshot is what tevm resolves ${filePath} to\n${snapshot.code}`,
						)
					}
					return ts.ScriptSnapshot.fromString(snapshot.code)
				} catch (e) {
					logger.error(`@tevm/ts-plugin: getScriptSnapshotDecorator was unable to resolve dts for ${filePath}`)
					logger.error(e as any)
					return ts.ScriptSnapshot.fromString('export {}')
				}
			},
		}
	})
