import { createAddress, createContractAddress } from '@tevm/address'
import { InternalError, InternalEvmError, InvalidBytecodeError } from '@tevm/errors'
import { prefundedAccounts } from '@tevm/node'
import { createImpersonatedTx } from '@tevm/tx'
import { getAddress, hexToBytes } from '@tevm/utils'
import { runTx } from '@tevm/vm'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'

/**
 * @internal
 * Creates a script with a randomly generated address
 * @param {import('@tevm/node').TevmNode} client
 * @param {import('@tevm/utils').Hex} [code]
 * @param {import('@tevm/utils').Hex} [deployedBytecode]
 * @param {import('@tevm/utils').Address} [to]
 * @returns {Promise<{errors?: never, address: import('@tevm/utils').Address} | {address?: never, errors: Array<Error>}>}
 */
export const createScript = async (client, code, deployedBytecode, to) => {
	const scriptAddress =
		to ??
		(() => {
			const randomBigInt = BigInt(Math.floor(Math.random() * 1_000_000_000_000_000))
			return getAddress(createContractAddress(createAddress(`0x${'6969'.repeat(10)}`), randomBigInt).toString())
		})()
	const vm = await client.getVm()

	if (deployedBytecode) {
		const setAccountRes = await setAccountHandler(client)({
			address: scriptAddress,
			deployedBytecode,
			throwOnFail: false,
		})
		if (setAccountRes.errors) {
			return {
				errors: setAccountRes.errors,
			}
		}
		return {
			address: scriptAddress,
		}
	}

	if (!code) {
		return {
			errors: [new InternalError('Cannot create script without code or deployedBytecode')],
		}
	}

	const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
	const priorityFee = 0n

	const sender = createAddress(/** @type {import('@tevm/utils').Address}*/ (prefundedAccounts[0]))

	let _maxFeePerGas = parentBlock.header.calcNextBaseFee() + priorityFee
	const baseFeePerGas = parentBlock.header.baseFeePerGas ?? 0n
	if (_maxFeePerGas < baseFeePerGas) {
		_maxFeePerGas = baseFeePerGas
	}
	// TODO tons of dupe
	const dataFee = (() => {
		let out = 0n
		for (const entry of hexToBytes(code) ?? []) {
			out += vm.common.vmConfig.param('gasPrices', entry === 0 ? 'txDataZero' : 'txDataNonZero')
		}
		return out
	})()
	const baseFee = (() => {
		let out = dataFee
		const txFee = vm.common.vmConfig.param('gasPrices', 'tx')
		if (txFee) {
			out += txFee
		}
		if (vm.common.vmConfig.gteHardfork('homestead')) {
			const txCreationFee = vm.common.vmConfig.param('gasPrices', 'txCreation')
			if (txCreationFee) {
				out += txCreationFee
			}
		}
		return out
	})()
	const minimumGasLimit = baseFee + BigInt(0xffffffff)
	const gasLimitWithExecutionBuffer = (minimumGasLimit * 11n) / 10n
	try {
		const res = await runTx(vm)({
			block: parentBlock,
			tx: createImpersonatedTx({
				maxFeePerGas: _maxFeePerGas,
				maxPriorityFeePerGas: 0n,
				gasLimit: gasLimitWithExecutionBuffer,
				data: code,
				impersonatedAddress: sender,
			}),
			skipNonce: true,
			skipBalance: true,
			skipBlockGasLimitValidation: true,
			skipHardForkValidation: true,
		})
		if (res.execResult.exceptionError?.error) {
			client.logger.error('Failed to create script because deployment of script bytecode failed')
			throw new InvalidBytecodeError(res.execResult.exceptionError.error, {
				cause: /** @type {any}*/ (res.execResult.exceptionError),
			})
		}
		const deployedAddress = res.createdAddress
		if (!deployedAddress) {
			return {
				errors: [new InternalEvmError('Failed to create script')],
			}
		}
		const account = await getAccountHandler(client)({
			throwOnFail: false,
			address: /** @type {import('@tevm/utils').Address}*/ (deployedAddress.toString()),
			returnStorage: true,
		})
		if (account.errors) {
			return {
				errors: account.errors,
			}
		}
		const setAccountRes = await setAccountHandler(client)({
			...account,
			address: scriptAddress,
			throwOnFail: false,
			stateDiff: account.storage ?? {},
			deployedBytecode: account.deployedBytecode,
		})
		if (setAccountRes.errors) {
			return {
				errors: setAccountRes.errors,
			}
		}
		await vm.stateManager.deleteAccount(deployedAddress)
		return {
			address: to ?? scriptAddress,
		}
	} catch (e) {
		return {
			errors: [/** @type any*/ (e)],
		}
	}
}
