export const deepEqual = (actual: unknown, expected: unknown): boolean => {
	if (Object.is(actual, expected)) return true
	if (typeof actual !== 'object' || actual === null || typeof expected !== 'object' || expected === null) return false

	if (Array.isArray(actual) || Array.isArray(expected)) {
		if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) return false
		return actual.every((value, index) => deepEqual(value, expected[index]))
	}

	const actualObject = actual as Record<string, unknown>
	const expectedObject = expected as Record<string, unknown>
	const actualKeys = Object.keys(actualObject)
	const expectedKeys = Object.keys(expectedObject)
	if (actualKeys.length !== expectedKeys.length) return false

	return actualKeys.every((key) => key in expectedObject && deepEqual(actualObject[key], expectedObject[key]))
}
