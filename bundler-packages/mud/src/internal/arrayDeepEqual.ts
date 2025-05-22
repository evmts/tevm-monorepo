import { deepEqual } from './deepEqual.js'

export const isArrayEqual = (a: readonly unknown[] | undefined, b: readonly unknown[] | undefined): boolean => {
	if (a === b) return true
	if (a === undefined && b === undefined) return true
	if (a === undefined || b === undefined) return false
	if (a.length !== b.length) return false
	for (let i = a.length - 1; i >= 0; i--) {
		if (!deepEqual(a[i], b[i])) return false
	}
	return true
}
