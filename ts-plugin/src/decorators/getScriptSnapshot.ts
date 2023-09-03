import { createHostDecorator } from '../factories'
import { isSolidity } from '../utils'
import { bundler } from '@evmts/bundler'
import { existsSync } from 'fs'

/**
 * Decorate `LangaugeServerHost.getScriptSnapshot` to return generated `.d.ts` file for `.sol` files
 * This will allow the language server to provide intellisense for `.sol` files
 * @see https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
 * TODO replace with modules for code reuse
 */
export const getScriptSnapshotDecorator = createHostDecorator(
	({ languageServiceHost }, ts, logger, config) => {
		return {
			getScriptSnapshot: (filePath) => {
				if (
					!isSolidity(filePath) ||
					!existsSync(filePath) ||
					existsSync(`${filePath}.d.ts`) ||
					existsSync(`${filePath}.ts`)
				) {
					return languageServiceHost.getScriptSnapshot(filePath)
				}
				try {
					const plugin = bundler(config, logger as any)
					const snapshot = plugin.resolveDtsSync(filePath, process.cwd(), false)
					return ts.ScriptSnapshot.fromString(snapshot.code)
				} catch (e) {
					logger.error(
						`@evmts/ts-plugin: getScriptSnapshotDecorator was unable to resolve dts for ${filePath}`,
					)
					logger.error(e as any)
					return ts.ScriptSnapshot.fromString('export {}')
				}
			},
		}
	},
)
