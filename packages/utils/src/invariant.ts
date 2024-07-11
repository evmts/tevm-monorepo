import { DefensiveNullCheckError } from '@tevm/errors'

export function invariant(condition: any, error: Error = new DefensiveNullCheckError()): asserts condition {
	if (!condition) {
		throw error
	}
}
