import type {
	SolcContractOutput,
	SolcInputDescription,
	SolcOutput,
} from './solcTypes.js'
import type { ResolvedCompilerConfig } from '@tevm/config'
import type { ModuleInfo } from '@tevm/resolutions'
import type { Node } from 'solidity-ast/node.js'

export type ResolveArtifacts = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedCompilerConfig,
	includeAst: boolean,
	includeBytecode: boolean,
	fao: FileAccessObject,
	solc: any,
) => Promise<{
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}>

export type ResolveArtifactsSync = (
	solFile: string,
	basedir: string,
	logger: Logger,
	config: ResolvedCompilerConfig,
	includeAst: boolean,
	includeBytecode: boolean,
	fao: FileAccessObject,
	solc: any,
) => {
	artifacts: Artifacts
	modules: Record<'string', ModuleInfo>
	asts: Record<string, Node> | undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}

export type FileAccessObject = {
	readFile: (path: string, encoding: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding: BufferEncoding) => string
	existsSync: (path: string) => boolean
}

export type Logger = {
	info: (...messages: string[]) => void
	error: (...message: string[]) => void
	warn: (...message: string[]) => void
	log: (...message: string[]) => void
}

export type { ModuleInfo }

export type CompiledContracts<TIncludeAsts extends boolean = boolean> = {
	artifacts: SolcOutput['contracts'][string] | undefined
	modules: Record<'string', ModuleInfo>
	asts: TIncludeAsts extends true ? Record<string, Node> : undefined
	solcInput: SolcInputDescription
	solcOutput: SolcOutput
}

export type Artifacts = Record<
	string,
	Pick<SolcContractOutput, 'abi' | 'userdoc' | 'evm'>
>
