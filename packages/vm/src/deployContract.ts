import { block } from './block.js'
import { buildTransaction } from './buildTransaction.js'
import { encodeDeployment } from './encodeDeployment.js'
import { getAccountNonce } from './getAccountNonce.js'
import { common } from './hardFork.js'
import { Transaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

export const deployContract = async (
	vm: VM,
	senderPrivateKey: Buffer,
	deploymentBytecode: Buffer,
): Promise<Address> => {
	// Contracts are deployed by sending their deployment bytecode to the address 0
	// The contract params should be abi-encoded and appended to the deployment bytecode.
	const data = encodeDeployment(deploymentBytecode.toString('hex'))
	const txData = {
		data,
		nonce: await getAccountNonce(vm, senderPrivateKey),
	}

	const tx = Transaction.fromTxData(buildTransaction(txData), { common }).sign(
		senderPrivateKey,
	)

	const deploymentResult = await vm.runTx({ tx, block })

	if (deploymentResult.execResult.exceptionError) {
		throw deploymentResult.execResult.exceptionError
	}

	const { createdAddress } = deploymentResult

	if (!createdAddress) {
		throw new Error('No created address')
	}

	return createdAddress
}
