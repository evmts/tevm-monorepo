import type { SolcLanguage } from '@tevm/solc'

export interface CompileSourceWithShadowOptions<TSourceLanguage extends SolcLanguage = SolcLanguage> {
	/**
	 * Language of the source code, which can be Solidity/Yul as well as AST
	 */
	sourceLanguage?: TSourceLanguage | undefined
	/**
	 * Language of the shadow method(s) to inject into a contract; this should be either Solidity or Yul
	 */
	shadowLanguage?: Omit<SolcLanguage, 'SolidityAST'> | undefined
	/**
	 * Path of the contract to inject the shadow method(s) into
	 *
	 * This is irrelevant if not using an AST source (which is the only source that can result in multiple contracts files)
	 *
	 * If the source compilation results in exactly one file, this can be omitted, otherwise it's mandatory
	 */
	injectIntoContractPath?: TSourceLanguage extends 'SolidityAST' ? string | undefined : never
	/**
	 * Name of the contract to inject the shadow method(s) into
	 *
	 * This can be omitted if the source compilation results in exactly one contract, otherwise it's mandatory
	 */
	injectIntoContractName?: string | undefined
}
