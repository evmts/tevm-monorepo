import { resolveArtifacts } from '../solc'
import type { Logger } from '../types'
import { generateEvmtsBody } from './generateEvmtsBody'
import { ResolvedConfig } from '@evmts/config'

export const generateRuntime = async (
	module: string,
	basedir: string,
	contractFactory: string,
	config: ResolvedConfig,
	logger: Logger,
	moduleType: 'cjs' | 'mjs' | 'ts',
) => {
	const artifactsPromise = resolveArtifacts(module, basedir, logger, config)
	const { artifacts, modules } = await artifactsPromise
	if (artifacts) {
		const evmtsImports =
			moduleType !== 'cjs'
				? `import { ${contractFactory} } from '@evmts/core'`
				: `const { ${contractFactory} } = require('@evmts/core')`
		const evmtsBody = generateEvmtsBody(
			artifacts,
			contractFactory,
			config,
			moduleType,
		)
		return { modules, code: [evmtsImports, evmtsBody].join('\n') }
	}
	return { modules, code: '' }
}
