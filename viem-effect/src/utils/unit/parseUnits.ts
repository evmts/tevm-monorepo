import { Effect } from 'effect'

import { parseUnits as viemParseUnits, type ParseUnitsErrorType } from 'viem'

export function parseUnits(value: string, decimals: number) {
	try {
		return Effect.succeed(viemParseUnits(value, decimals))
	} catch (e) {
		return Effect.fail(e as ParseUnitsErrorType)
	}
}

