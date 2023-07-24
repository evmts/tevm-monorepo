import type { Logger } from '../types'
import type { ResolvedConfig } from '@evmts/config'
// TODO wrap this in a typesafe version
// @ts-ignore
import solc from 'solc'

export const checkSolcVersion = (
	config: ResolvedConfig,
	logger: Logger,
	version = solc.version,
) => {
	if (config.compiler.solcVersion !== version) {
		logger.warn(
			`The solc version in the config (${config.compiler.solcVersion}) does not match the solc version installed (${version}).
This may cause unexpected behavior.
Consider updating the version in package.json to "solc": "${config.compiler.solcVersion}"
or if this is the correct version updating the version in the evmts plugin config.`,
		)
	}
}
