import type { Artifacts } from '../solc/resolveArtifactsSync'
import type { Logger } from '../types'
import { generateEvmtsBody } from './generateEvmtsBody'
import type { ResolvedConfig } from '@evmts/config'

export const generateRuntimeSync = (
	artifacts: Artifacts,
	config: ResolvedConfig,
	moduleType: 'cjs' | 'mjs' | 'ts' | 'dts',
	logger: Logger,
): string => {
	if (!artifacts || Object.keys(artifacts).length === 0) {
		logger.warn('No artifacts found, skipping runtime generation')
		return ''
	}
	let evmtsImports: string
	if (moduleType === 'cjs') {
		evmtsImports = `const { evmtsContractFactory } = require('@evmts/core')`
	} else if (moduleType === 'dts') {
		evmtsImports = `import { EvmtsContract } from '@evmts/core'`
	} else if (moduleType === 'ts' || moduleType === 'mjs') {
		evmtsImports = `import { evmtsContractFactory } from '@evmts/core'`
	} else {
		throw new Error(`Unknown module type: ${moduleType}`)
	}
	const evmtsBody = generateEvmtsBody(artifacts, config, moduleType)
	return [evmtsImports, evmtsBody].join('\n')
}
