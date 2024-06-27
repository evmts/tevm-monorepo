import { DefensiveNullCheckError } from '@tevm/errors'

export function invariant(condition: any, error = new DefensiveNullCheckError()): asserts condition {
	if (!condition) {
		throw error
	}
}
