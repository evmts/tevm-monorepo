import type { Cache } from '../createCache.js'
import type { FileAccessObject, Logger, ModuleInfo } from '../types.js'
import { compileContract } from './compileContracts.js'
import type {
	SolcContractOutput,
	SolcInputDescription,
	SolcOutput,
} from './solc.js'
import type { ResolvedCompilerConfig } from '@evmts/config'
import type { Node } from 'solidity-ast/node.js'

type Artifacts = Record<string, Pick<SolcContractOutput, 'abi' | 'userdoc'>>
/**
 * Currently unimplemented just uses resolveArtifactsSync
 */
export type ResolveArtifacts = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedCompilerConfig,
	includeAst: boolean,
	fao: FileAccessObject,
	cache?: Cache,
) => Promise<{
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}>

export const resolveArtifacts: ResolveArtifacts
