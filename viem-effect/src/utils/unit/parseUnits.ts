import { Effect } from 'effect'

import { parseUnits as viemParseUnits, type ParseUnitsErrorType } from 'viem'

export function parseUnits<
	TArgs extends Parameters<typeof viemParseUnits>
>(...[value, decimals]: TArgs) {
	try {
		return Effect.succeed(viemParseUnits(value, decimals))
	} catch (e) {
		return Effect.fail(e as ParseUnitsErrorType)
	}
}

