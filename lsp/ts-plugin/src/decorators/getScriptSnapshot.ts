import { existsSync, writeFileSync } from 'node:fs'
import { bundler } from '@tevm/base-bundler'
import type { Cache } from '@tevm/bundler-cache'
import {minimatch} from 'minimatch'
// @ts-expect-error
import * as solc from 'solc'
import { createHostDecorator } from '../factories/index.js'
import { isSolidity } from '../utils/index.js'

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
				// resolve json as const
				for (const matcher of config.jsonAbiAsConst) {
					if (minimatch(filePath, matcher)) {
						const jsonString = fao.readFileSync(filePath, 'utf8')
						return ts.ScriptSnapshot.fromString(`export default ${jsonString} as const`)
					}
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
