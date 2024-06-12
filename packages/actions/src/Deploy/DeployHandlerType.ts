import type { Abi, ContractConstructorArgs } from '@tevm/utils'
import type { DeployParams } from './DeployParams.js'
import type { DeployResult } from './DeployResult.js'

export type DeployHandler = <
	TThrowOnFail extends boolean = boolean,
	TAbi extends Abi | readonly unknown[] = Abi,
	THasConstructor = TAbi extends Abi
		? Abi extends TAbi
			? true
			: [Extract<TAbi[number], { type: 'constructor' }>] extends [never]
				? false
				: true
		: true,
	TAllArgs = ContractConstructorArgs<TAbi>,
>(
	action: DeployParams<TThrowOnFail, TAbi, THasConstructor, TAllArgs>,
) => Promise<DeployResult>
