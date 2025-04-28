import { Effect } from 'effect'

/**
 * Export the core types
 */
export type Withdrawal = {
  index: number;
  validatorIndex: number;
  address: string;
  amount: bigint;
}

/**
 * Error class for assert function
 */
export class AssertError extends Error {
	override name = 'AssertError'
	_tag = 'AssertError'
	constructor(cause: unknown) {
		super('Unexpected error asserting Withdrawal with ox', {
			cause: cause instanceof Error ? cause : undefined,
		})
	}
}

/**
 * Asserts if the given value is a valid Withdrawal
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
	return Effect.try({
		try: () => {
			if (!isWithdrawal(value)) {
				throw new Error('Invalid withdrawal')
			}
		},
		catch: (cause) => new AssertError(cause),
	})
}

/**
 * Checks if the given value is a valid Withdrawal
 */
export function isWithdrawal(value: unknown): boolean {
	const withdrawal = value as Withdrawal
	return (
		withdrawal !== null &&
		typeof withdrawal === 'object' &&
		typeof withdrawal.index === 'number' &&
		typeof withdrawal.validatorIndex === 'number' &&
		typeof withdrawal.address === 'string' &&
		typeof withdrawal.amount === 'bigint'
	)
}

/**
 * Validates a Withdrawal
 */
export function validate(value: unknown): boolean {
	return isWithdrawal(value)
}
