/**
 * Base type for any prompt step
 */
export type Step = {
	type: string
	prompt: string
	stateKey: string
}
