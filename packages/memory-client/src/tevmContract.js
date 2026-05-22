import { contractHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmContract` action. Higher-level wrapper around `tevmCall` that handles ABI
 * encoding/decoding and decodes revert messages, with full TypeScript inference from the ABI.
 *
 * @type {import('./TevmContractType.js').TevmContract}
 *
 * @example
 * ```typescript
 * import { tevmContract } from 'tevm/actions'
 * import { createClient, parseAbi } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const balance = await tevmContract(client, {
 *   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
 *   address: '0x4200000000000000000000000000000000000042',
 *   functionName: 'balanceOf',
 *   args: ['0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'],
 * })
 * ```
 *
 * @see [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options.
 * @see [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values.
 * @throws Will throw if the contract call reverts (error contains decoded revert reason when available).
 */
export const tevmContract = async (client, params) => {
	// TODO this shouldn't need to be any any
	return contractHandler(client.transport.tevm)(/** @type {any}*/ (params))
}
