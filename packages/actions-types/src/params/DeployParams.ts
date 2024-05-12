import type { Abi, ContractConstructorArgs, EncodeDeployDataParameters } from '@tevm/utils'
import type { Hex } from '../common/index.js'
import type { BaseCallParams } from './BaseCallParams.js'

/**
 * Wraps tevm_call to deploy a contract
 * Unlike most call actions `createTransaction` defaults to true
 */
export type DeployParams<
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
> = Omit<BaseCallParams<TThrowOnFail>, 'to'> & {
	/**
	 * An optional CREATE2 salt.
	 */
	salt?: Hex
} & EncodeDeployDataParameters<TAbi, THasConstructor, TAllArgs>
