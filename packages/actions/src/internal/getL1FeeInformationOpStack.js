import { createAddress } from '@tevm/address'
import { bytesToHex, decodeFunctionResult, encodeFunctionData, hexToBytes, parseAbi, serializeTransaction } from '@tevm/utils'

const abi = parseAbi([
	'function getL1GasUsed(bytes memory _data) public view returns (uint256)',
	'function getL1Fee(bytes memory _data) external view returns (uint256)',
	'function l1BaseFee() public view returns (uint256)',
	'function blobBaseFee() public view returns (uint256)',
])
/**
 * Gets the fee information for op stack chains for the l1 data fee
 * @param {Uint8Array} data
 * @param {import('@tevm/vm').Vm} vm
 * @returns {Promise<{l1BlobFee: bigint, l1GasUsed: bigint, l1Fee: bigint, l1BaseFee: bigint}>}
 */
export const getL1FeeInformationOpStack = async (data, vm) => {
	/**
	 * @type {import('@tevm/common').Common}
	 */
	const opstackChain = /** @type {any}*/ (vm.common)
	const serializedTx = serializeTransaction({
		chainId: opstackChain.id,
		data: bytesToHex(data ?? new Uint8Array()),
		type: 'eip1559',
	})
	const gasPriceOracle = /** @type {{address: string} | undefined} */ (opstackChain.contracts?.['gasPriceOracle'])
	const gasPriceOracleAddress = gasPriceOracle?.address ?? '0x420000000000000000000000000000000000000F'
	const to = createAddress(gasPriceOracleAddress)
	const [l1GasUsed, l1Fee, l1BlobFee, l1BaseFee] = await Promise.all([
		vm.evm.runCall({
			to,
			data: hexToBytes(
				encodeFunctionData({
					functionName: 'getL1GasUsed',
					args: [serializedTx],
					abi,
				}),
			),
		}),
		vm.evm.runCall({
			to,
			data: hexToBytes(
				encodeFunctionData({
					functionName: 'getL1Fee',
					args: [serializedTx],
					abi,
				}),
			),
		}),
		vm.evm.runCall({
			to,
			data: hexToBytes(
				encodeFunctionData({
					functionName: 'blobBaseFee',
					args: [],
					abi,
				}),
			),
		}),
		vm.evm.runCall({
			to,
			data: hexToBytes(
				encodeFunctionData({
					functionName: 'l1BaseFee',
					args: [],
					abi,
				}),
			),
		}),
	])
	return {
		l1GasUsed: decodeFunctionResult({
			abi,
			functionName: 'getL1GasUsed',
			data: bytesToHex(l1GasUsed.execResult.returnValue),
		}),
		l1Fee: decodeFunctionResult({
			abi,
			functionName: 'getL1Fee',
			data: bytesToHex(l1Fee.execResult.returnValue),
		}),
		l1BlobFee: decodeFunctionResult({
			abi,
			functionName: 'blobBaseFee',
			data: bytesToHex(l1BlobFee.execResult.returnValue),
		}),
		l1BaseFee: decodeFunctionResult({
			abi,
			functionName: 'l1BaseFee',
			data: bytesToHex(l1BaseFee.execResult.returnValue),
		}),
	}
}
