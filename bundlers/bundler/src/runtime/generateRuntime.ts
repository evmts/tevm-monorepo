import type { Artifacts } from '../solc/resolveArtifactsSync'
import type { Logger } from '../types'
import { generateEvmtsBody } from './generateEvmtsBody'

// TODO make this actually async
export const generateRuntime = async (
	artifacts: Artifacts,
	moduleType: 'cjs' | 'mjs' | 'ts',
	logger: Logger,
): Promise<string> => {
	if (artifacts) {
		const evmtsImports =
			moduleType !== 'cjs'
				? `import { evmtsContractFactory } from '@evmts/core'`
				: `const { evmtsContractFactory } = require('@evmts/core')`
		const evmtsBody = generateEvmtsBody(artifacts, moduleType)
		return [evmtsImports, evmtsBody].join('\n')
	}
	logger.warn('No artifacts found, skipping runtime generation')
	return ''
}
