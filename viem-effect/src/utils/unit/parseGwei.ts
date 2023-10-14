import { Effect } from 'effect'

import { parseGwei as viemParseGwei, type ParseGweiErrorType } from 'viem'

export function parseGwei<
	TArgs extends Parameters<typeof viemParseGwei>
>(...[ether, unit]: TArgs) {
	try {
		return Effect.succeed(viemParseGwei(ether, unit))
	} catch (e) {
		return Effect.fail(e as ParseGweiErrorType)
	}
}
