import type { SolcLanguage } from '@tevm/solc'

export interface CompileSourceWithShadowOptions<TSourceLanguage extends SolcLanguage = SolcLanguage> {
	/**
	 * Language of the source code, which can be Solidity/Yul as well as AST
	 *
	 * default: Solidity
	 */
	sourceLanguage?: TSourceLanguage | undefined
	/**
	 * Language of the shadow method(s) to inject into a contract; this should be either Solidity or Yul
	 *
	 * default: Solidity
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
	/**
	 * Strategy to use when merging shadow methods (function, fallback, receive, modifier, constructor) into the target
	 * contract in case of name conflicts
	 *
	 * Anything else colliding will error (state variable, error, event)
	 *
	 * This is more of a feature than a safety measure, as only the default 'safe' will prevent accidental conflicts,
	 * but any other explicit choice's purpose is to manipulate an existing method by design
	 *
	 * - 'safe': throw an error on conflict
	 * - 'replace': replace the existing method with the shadow one
	 * - 'insertAtBeginning': insert the body of the shadow method at the beginning of the existing one's body
	 * - 'insertAtEnd': insert the body of the shadow method at the end of the existing one's body
	 *
	 * default: 'safe'
	 */
	shadowMergeStrategy?: 'safe' | 'replace' | 'insertAtBeginning' | 'insertAtEnd' | undefined
}
