import { Artifacts } from '../solc/resolveArtifactsSync'
import { Logger } from '../types'
import { generateEvmtsBody } from './generateEvmtsBody'
import { ResolvedConfig } from '@evmts/config'

// TODO make this actually async
export const generateRuntime = async (
	artifacts: Artifacts,
	config: ResolvedConfig,
	moduleType: 'cjs' | 'mjs' | 'ts',
	logger: Logger
): Promise<string> => {
	if (artifacts) {
		const evmtsImports =
			moduleType !== 'cjs'
				? `import { evmtsContractFactory } from '@evmts/core'`
				: `const { evmtsContractFactory } = require('@evmts/core')`
		const evmtsBody = generateEvmtsBody(
			artifacts,
			config,
			moduleType,
		)
		return [evmtsImports, evmtsBody].join('\n')
	}
	logger.warn('No artifacts found, skipping runtime generation')
	return ''
}
