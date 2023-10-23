import type {
	SolcContractOutput,
	SolcInputDescription,
	SolcOutput,
} from './solc.js'
import { compileContractSync } from './solc/compileContractsSync.js'
import type {
	Artifacts,
	FileAccessObject,
	Logger,
	ModuleInfo,
} from './types.js'
import type { ResolvedCompilerConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node.js'

export type ResolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedCompilerConfig,
	includeAst: boolean,
	fao: FileAccessObject,
) => {
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}

export const resolveArtifactsSync: ResolveArtifactsSync
