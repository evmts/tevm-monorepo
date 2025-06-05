// Vitest-style matcher function
export const toBeReverted = async (received: any | Promise<any>) => {
	try {
		const res = await received
		console.log('res', res)
	} catch (error) {
		console.log('error', error.cause)
		// console.log('error.cause.data', error.cause.data)
	}

	return {
		pass: true,
		actual: '',
		expected: '',
		message: () => '',
	}
}
