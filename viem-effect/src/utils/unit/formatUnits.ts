import type { ErrorType } from '../../errors/utils.js'
import { Effect } from 'effect'
import { formatUnits as viemFormatUnits } from 'viem/utils'

export type FormatUnitsErrorType = ErrorType

export function formatUnits(value: bigint, decimals: number) {
	return Effect.succeed(viemFormatUnits(value, decimals))
}
