/**
 * Creates a serial executor that ensures only one execution at a time,
 * but remembers if it should run again after the current execution finishes.
 */
export const serialExecute = <T extends any[], R>(fn: (...args: T) => Promise<R>): ((...args: T) => void) => {
	let isRunning = false
	let shouldRunAgain = false

	const execute = async (...args: T): Promise<void> => {
		if (isRunning) {
			shouldRunAgain = true
			return // Just set the flag and return immediately
		}

		isRunning = true

		try {
			await fn(...args)

			// Keep running while someone requested another run
			while (shouldRunAgain) {
				shouldRunAgain = false
				await fn(...args)
			}
		} finally {
			isRunning = false
		}
	}

	return execute
}
