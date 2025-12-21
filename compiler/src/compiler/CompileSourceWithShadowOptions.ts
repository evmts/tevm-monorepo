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
	 * If the source compilation results in exactly one file, this can be omitted, otherwise it's mandatory
	 */
	injectIntoContractPath?: string | undefined
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
	 * TODO: anything other than 'safe' or 'replace' is a bit tricky:
	 * - 'safe': we simply compile the source with the injected shadow code and if there is a conflict the compilation will error
	 * - 'replace': we simply mark the source functions as virtual and tell the consumer to mark the function as override if it will conflict and needs to replace
	 * - 'insertAtBeginning'/'insertAtEnd': this is more tricky because we need to compile shadow code inside (or inheriting from) the target contract if we want the shadow code
	 * to be able to access its code, but in such case the insertion code will completely replace the existing code and might erase some code that will make compilation fail
	 *
	 * default: 'safe'
	 */
	shadowMergeStrategy?: 'safe' | 'replace' /* | 'insertAtBeginning' | 'insertAtEnd' */ | undefined
}
