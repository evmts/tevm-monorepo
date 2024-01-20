import { type Script } from '@tevm/contract'
import { type Address } from 'abitype'

/**
 * Params taken by the definePredeploy function
 */
export type CustomPredeploy<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
> = {
	address: Address
	contract: Script<TName, THumanReadableAbi>
}
