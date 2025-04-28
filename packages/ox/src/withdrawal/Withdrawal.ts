import { Effect } from 'effect'
import Ox from 'ox'

/**
 * Export the core types
 */
export type Withdrawal = Ox.Withdrawal.Withdrawal

/**
 * Error class for assert function
 */
export class AssertError extends Error {
  override name = "AssertError"
  _tag = "AssertError"
  constructor(cause: unknown) {
    super("Unexpected error asserting Withdrawal with ox", {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Asserts if the given value is a valid Withdrawal
 */
export function assert(value: unknown): Effect.Effect<void, AssertError, never> {
  return Effect.try({
    try: () => Ox.Withdrawal.assert(value),
    catch: (cause) => new AssertError(cause),
  })
}

/**
 * Checks if the given value is a valid Withdrawal
 */
export function isWithdrawal(value: unknown): boolean {
  return Ox.Withdrawal.isWithdrawal(value)
}

/**
 * Validates a Withdrawal
 */
export function validate(value: unknown): boolean {
  return Ox.Withdrawal.validate(value)
}