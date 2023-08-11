import type { ResolvedConfig } from '@evmts/config'

type BundlerResult = {
	code: string
	modules: Record<'string', ModuleInfo>
}

export type Bundler = (
	config: ResolvedConfig,
	logger: Logger,
) => {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * The configuration of the plugin.
	 */
	config: ResolvedConfig
	include?: string[]
	exclude?: string[]
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: (module: string, basedir: string) => BundlerResult
}

export type Logger = {
	info: (...messages: string[]) => void
	error: (...message: string[]) => void
	warn: (...message: string[]) => void
	log: (...message: string[]) => void
}
/**
 * Copied from rollup (kinda)
 * @see https://rollupjs.org/plugin-development/#this-getmoduleinfo
 */
export interface ModuleInfo {
	id: string // the id of the module, for convenience
	rawCode: string | null // the source code of the module, `null` if external or not yet available
	code: string | null // the code after transformed to correctly resolve remappings and node_module imports
	importedIds: string[] // the module ids statically imported by this module
	resolutions: ModuleInfo[] // how statically imported ids were resolved, for use with this.load
}

export type SolidityResolver = (
	config: ResolvedConfig,
	logger: Logger,
) => {
	/**
	 * The name of the plugin.
	 */
	name: string
	/**
	 * The configuration of the plugin.
	 */
	config: ResolvedConfig
	include?: string[]
	exclude?: string[]
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDts: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves .d.ts representation of the solidity module
	 */
	resolveDtsSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves typescript representation of the solidity module
	 */
	resolveTsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves cjs representation of the solidity module
	 */
	resolveCjsModuleSync: (module: string, basedir: string) => BundlerResult
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModule: (module: string, basedir: string) => Promise<BundlerResult>
	/**
	 * Resolves the esm representation of the solidity module
	 */
	resolveEsmModuleSync: (module: string, basedir: string) => BundlerResult
}

export interface CompilerOptions<Filename extends string> {
	language: string
	sources: Record<
		Filename,
		{
			keccak256?: string
			urls?: Array<string>
			ast?: {}
			content: string
		}
	>
	settings: {
		stopAfter?: string
		remappings?: Array<string>
		optimizer?: {
			enabled: boolean
			runs: number
			details?: {
				peephole: boolean
				inliner: boolean
				jumpdestRemover: boolean
				orderLiterals: boolean
				deduplicate: boolean
				cse: boolean
				constantOptimizer: boolean
				yul: boolean
				yulDetails: {
					stackAllocation: boolean
					optimizerSteps: string
				}
			}
		}
		evmVersion?:
			| 'homestead'
			| 'tangerineWhistle'
			| 'spuriousDragon'
			| 'byzantium'
			| 'constantinople'
			| 'shanghai'
		viaIR: boolean
		debug?: {
			revertStrings: string
			debugInfo: Array<string>
		}
		metadata: {
			appendCBOR: boolean
			useLiteralContent: boolean
			bytecodeHash: 'none' | 'ipfs' | 'bzzr1'
		}
		libraries?: {
			[contractName in string]: {
				[libraryName in string]: string
			}
		}
		outputSelection: {
			'*': {
				'*': Array<'*' | 'evm.bytecode.object'>
			}
			def?: { MyContract: Array<string> }
		}
		modelChecker?: {
			contracts: { [filename: string]: Array<string> }
			divModNoSlacks: boolean
			engine: string
			extCalls: string
			invariants: Array<string>
			showProved: boolean
			showUnproved: boolean
			showUnsupported: boolean
			solvers: Array<string>
			targets: Array<string>
			timeout: number
		}
	}
}

export interface CompileOutput<
	Filename extends string,
	ResponseInclude extends '*' | 'evm.bytecode.object' = 'evm.bytecode.object',
> {
	contracts: {
		[F in Filename]: {
			[contractName in string]: ResponseInclude extends 'BYTECODE'
				? {
						evm: {
							bytecode: {
								functionDebugData: {}
								generatedSources: Array<any>
								linkReferences: {}
								object: string
								opcodes: string
								sourceMap: string
							}
						}
				  }
				: {
						abi: Array<{
							stateMutability: string
							type: string
							inputs?: Array<{
								internalType: string
								name: string
								type: string
							}>
							name?: string
							outputs?: Array<{
								internalType: string
								name: string
								type: string
							}>
						}>
						devdoc: object
						evm: {
							bytecode: {
								functionDebugData: {}
								generatedSources: Array<any>
								linkReferences: {}
								object: string
								opcodes: string
								sourceMap: string
							}
							assembly: string
							deployedBytecode?: {
								functionDebugData: {}
								generatedSources: Array<{
									ast: {
										nodeType: string
										src: string
										statements: Array<{
											body: {
												nodeType: string
												src: string
												statements: Array<{
													expression?: {
														arguments: Array<{
															name?: string
															nodeType: string
															src: string
															arguments?: Array<{
																name?: string
																nodeType: string
																src: string
																kind?: string
																type?: string
																value?: string
															}>
															functionName?: {
																name: string
																nodeType: string
																src: string
															}
															hexValue?: string
															kind?: string
															type?: string
															value?: string
														}>
														functionName: {
															name: string
															nodeType: string
															src: string
														}
														nodeType: string
														src: string
													}
													nodeType: string
													src: string
													value?: {
														arguments?: Array<{
															name?: string
															nodeType: string
															src: string
															kind?: string
															type?: string
															value?: string
														}>
														functionName?: {
															name: string
															nodeType: string
															src: string
														}
														nodeType: string
														src: string
														name?: string
													}
													variableNames?: Array<{
														name: string
														nodeType: string
														src: string
													}>
													body?: {
														nodeType: string
														src: string
														statements: Array<{
															expression?: {
																arguments: Array<{
																	kind: string
																	nodeType: string
																	src: string
																	type: string
																	value: string
																}>
																functionName: {
																	name: string
																	nodeType: string
																	src: string
																}
																nodeType: string
																src: string
															}
															nodeType: string
															src: string
															value?: {
																arguments: Array<{
																	name: string
																	nodeType: string
																	src: string
																}>
																functionName: {
																	name: string
																	nodeType: string
																	src: string
																}
																nodeType: string
																src: string
															}
															variables?: Array<{
																name: string
																nodeType: string
																src: string
																type: string
															}>
															variableNames?: Array<{
																name: string
																nodeType: string
																src: string
															}>
														}>
													}
													condition?: {
														arguments: Array<{
															arguments?: Array<{
																name?: string
																nodeType: string
																src: string
																arguments?: Array<{
																	name?: string
																	nodeType: string
																	src: string
																	kind?: string
																	type?: string
																	value?: string
																}>
																functionName?: {
																	name: string
																	nodeType: string
																	src: string
																}
															}>
															functionName?: {
																name: string
																nodeType: string
																src: string
															}
															nodeType: string
															src: string
															name?: string
															kind?: string
															type?: string
															value?: string
														}>
														functionName: {
															name: string
															nodeType: string
															src: string
														}
														nodeType: string
														src: string
													}
													statements?: Array<{
														nodeType: string
														src: string
														value?: {
															kind?: string
															nodeType: string
															src: string
															type?: string
															value?: string
															arguments?: Array<{
																arguments?: Array<{
																	name?: string
																	nodeType: string
																	src: string
																	kind?: string
																	type?: string
																	value?: string
																}>
																functionName?: {
																	name: string
																	nodeType: string
																	src: string
																}
																nodeType: string
																src: string
																name?: string
															}>
															functionName?: {
																name: string
																nodeType: string
																src: string
															}
														}
														variables?: Array<{
															name: string
															nodeType: string
															src: string
															type: string
														}>
														body?: {
															nodeType: string
															src: string
															statements: Array<{
																expression: {
																	arguments: Array<any>
																	functionName: {
																		name: string
																		nodeType: string
																		src: string
																	}
																	nodeType: string
																	src: string
																}
																nodeType: string
																src: string
															}>
														}
														condition?: {
															arguments: Array<{
																name?: string
																nodeType: string
																src: string
																kind?: string
																type?: string
																value?: string
															}>
															functionName: {
																name: string
																nodeType: string
																src: string
															}
															nodeType: string
															src: string
														}
														variableNames?: Array<{
															name: string
															nodeType: string
															src: string
														}>
													}>
													variables?: Array<{
														name: string
														nodeType: string
														src: string
														type: string
													}>
													post?: {
														nodeType: string
														src: string
														statements: Array<{
															nodeType: string
															src: string
															value: {
																arguments: Array<{
																	name?: string
																	nodeType: string
																	src: string
																	kind?: string
																	type?: string
																	value?: string
																}>
																functionName: {
																	name: string
																	nodeType: string
																	src: string
																}
																nodeType: string
																src: string
															}
															variableNames: Array<{
																name: string
																nodeType: string
																src: string
															}>
														}>
													}
													pre?: {
														nodeType: string
														src: string
														statements: Array<{
															nodeType: string
															src: string
															value: {
																kind: string
																nodeType: string
																src: string
																type: string
																value: string
															}
															variables: Array<{
																name: string
																nodeType: string
																src: string
																type: string
															}>
														}>
													}
												}>
											}
											name: string
											nodeType: string
											parameters?: Array<{
												name: string
												nodeType: string
												src: string
												type: string
											}>
											returnVariables?: Array<{
												name: string
												nodeType: string
												src: string
												type: string
											}>
											src: string
										}>
									}
									contents: string
									id: number
									language: string
									name: string
								}>
								immutableReferences: {}
								linkReferences: {}
								object: string
								opcodes: string
								sourceMap: string
							}
							gasEstimates: {
								creation: {
									codeDepositCost: string
									executionCost: string
									totalCost: string
								}
								external: {}
							}
							legacyAssembly: {}
							methodIdentifiers: {
								[methodIdentifier: string]: string
							}
						}
						ewasm: {
							wasm: string
						}
						metadata: string
						storageLayout: {
							storage: Array<any>
							types: any
						}
						userdoc: {
							kind: string
							methods: {
								[M: string]: {
									notice: string
								}
							}
							version: number
						}
				  }
		}
	}
	sources: { [F in Filename]: { id: number } }
}

export interface SolidityBinaryVersions {
	builds: Array<{
		path: string
		version: string
		build: string
		longVersion: string
		keccak256: string
		sha256: string
		urls: Array<string>
		prerelease?: string
	}>
	releases: {
		[version: string]: string
	}
	latestRelease: string
}
