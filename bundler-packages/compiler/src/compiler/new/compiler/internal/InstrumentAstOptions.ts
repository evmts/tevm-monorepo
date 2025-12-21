export interface InstrumentAstOptions {
	/**
	 * Expose internal and private functions as public
	 *
	 * default: false
	 */
	exposeInternalFunctions?: boolean | undefined
	/**
	 * Expose internal and private variables as public
	 *
	 * default: false
	 */
	exposeInternalVariables?: boolean | undefined
	/**
	 * Mark functions as virtual to allow shadowing the implementation (overriding methods or modifying their body)
	 *
	 * default: false
	 */
	markFunctionsAsVirtual?: boolean | undefined
	/**
	 * Filter the contract to instrument
	 *
	 * default: undefined
	 */
	contractFilter?: string | undefined
}
