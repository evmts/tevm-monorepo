import { block } from './block.js'
import { createVm } from './createVm.js'
import { deployContract } from './deployContract.js'
import { insertAccount } from './insertAccount.js'
import { Address } from '@ethereumjs/util'
import type { JsonFragment } from '@ethersproject/abi'
import { Interface, defaultAbiCoder as AbiCoder } from '@ethersproject/abi'
import { generatePrivateKey } from 'viem/accounts'

type TODOInfer = any

export const run = async (
	script: {
		abi: JsonFragment[]
		bytecode: { object: string }
	},
	args: TODOInfer,
) => {
	const { abi, bytecode } = script
	const vm = await createVm()

	const privateKey = generatePrivateKey()

	const address = Address.fromPrivateKey(
		Buffer.from(privateKey.slice(2), 'hex'),
	)

	await insertAccount(vm, address)

	const contractAddress = await deployContract(
		vm,
		Buffer.from(privateKey.slice(2), 'hex'),
		Buffer.from(bytecode.object.slice(2), 'hex'),
	)

	const sigHash = new Interface(abi).getSighash('run')

	const encodeFunction = (params?: {
		types: string[]
		values: unknown[]
	}): string => {
		const parameters = params?.types ?? []
		const encodedArgs = AbiCoder.encode(parameters, params?.values ?? [])
		return sigHash + encodedArgs.slice(2)
	}

	const data = Buffer.from(
		encodeFunction({
			types: ['uint256', 'uint256'],
			values: args,
		}).slice(2),
		'hex',
	)

	const result = await vm.evm.runCall({
		to: contractAddress,
		caller: address,
		origin: address,
		data,
		block,
	})

	return result.execResult.returnValue
}
