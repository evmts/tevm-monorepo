// Previously imported Effect and BaseErrorEffect, but now unused

/**
 * Type alias for Ox WebCryptoP256
 */
export type WebCryptoP256Effect = any

// This function is available for future use
// Currently unused after removing service layer
/*
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}
*/
