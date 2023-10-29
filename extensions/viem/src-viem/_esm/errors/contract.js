import { parseAccount } from '../accounts/utils/parseAccount.js'
import { panicReasons } from '../constants/solidity.js'
import { decodeErrorResult } from '../utils/abi/decodeErrorResult.js'
import { formatAbiItem } from '../utils/abi/formatAbiItem.js'
import { formatAbiItemWithArgs } from '../utils/abi/formatAbiItemWithArgs.js'
import { getAbiItem } from '../utils/abi/getAbiItem.js'
import { formatEther } from '../utils/unit/formatEther.js'
import { formatGwei } from '../utils/unit/formatGwei.js'
import { AbiErrorSignatureNotFoundError } from './abi.js'
import { BaseError } from './base.js'
import { prettyPrint } from './transaction.js'
import { getContractAddress } from './utils.js'
export class CallExecutionError extends BaseError {
	constructor(
		cause,
		{
			account: account_,
			docsPath,
			chain,
			data,
			gas,
			gasPrice,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value,
		},
	) {
		const account = account_ ? parseAccount(account_) : undefined
		const prettyArgs = prettyPrint({
			from: account?.address,
			to,
			value:
				typeof value !== 'undefined' &&
				`${formatEther(value)} ${chain?.nativeCurrency.symbol || 'ETH'}`,
			data,
			gas,
			gasPrice:
				typeof gasPrice !== 'undefined' && `${formatGwei(gasPrice)} gwei`,
			maxFeePerGas:
				typeof maxFeePerGas !== 'undefined' &&
				`${formatGwei(maxFeePerGas)} gwei`,
			maxPriorityFeePerGas:
				typeof maxPriorityFeePerGas !== 'undefined' &&
				`${formatGwei(maxPriorityFeePerGas)} gwei`,
			nonce,
		})
		super(cause.shortMessage, {
			cause,
			docsPath,
			metaMessages: [
				...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
				'Raw Call Arguments:',
				prettyArgs,
			].filter(Boolean),
		})
		Object.defineProperty(this, 'cause', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'CallExecutionError',
		})
		this.cause = cause
	}
}
export class ContractFunctionExecutionError extends BaseError {
	constructor(
		cause,
		{ abi, args, contractAddress, docsPath, functionName, sender },
	) {
		const abiItem = getAbiItem({ abi, args, name: functionName })
		const formattedArgs = abiItem
			? formatAbiItemWithArgs({
					abiItem,
					args,
					includeFunctionName: false,
					includeName: false,
			  })
			: undefined
		const functionWithParams = abiItem
			? formatAbiItem(abiItem, { includeName: true })
			: undefined
		const prettyArgs = prettyPrint({
			address: contractAddress && getContractAddress(contractAddress),
			function: functionWithParams,
			args:
				formattedArgs &&
				formattedArgs !== '()' &&
				`${[...Array(functionName?.length ?? 0).keys()]
					.map(() => ' ')
					.join('')}${formattedArgs}`,
			sender,
		})
		super(
			cause.shortMessage ||
				`An unknown error occurred while executing the contract function "${functionName}".`,
			{
				cause,
				docsPath,
				metaMessages: [
					...(cause.metaMessages ? [...cause.metaMessages, ' '] : []),
					'Contract Call:',
					prettyArgs,
				].filter(Boolean),
			},
		)
		Object.defineProperty(this, 'abi', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'args', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'cause', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'contractAddress', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'formattedArgs', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'functionName', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'sender', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ContractFunctionExecutionError',
		})
		this.abi = abi
		this.args = args
		this.cause = cause
		this.contractAddress = contractAddress
		this.functionName = functionName
		this.sender = sender
	}
}
export class ContractFunctionRevertedError extends BaseError {
	constructor({ abi, data, functionName, message }) {
		let cause
		let decodedData = undefined
		let metaMessages
		let reason
		if (data && data !== '0x') {
			try {
				decodedData = decodeErrorResult({ abi, data })
				const { abiItem, errorName, args: errorArgs } = decodedData
				if (errorName === 'Error') {
					reason = errorArgs[0]
				} else if (errorName === 'Panic') {
					const [firstArg] = errorArgs
					reason = panicReasons[firstArg]
				} else {
					const errorWithParams = abiItem
						? formatAbiItem(abiItem, { includeName: true })
						: undefined
					const formattedArgs =
						abiItem && errorArgs
							? formatAbiItemWithArgs({
									abiItem,
									args: errorArgs,
									includeFunctionName: false,
									includeName: false,
							  })
							: undefined
					metaMessages = [
						errorWithParams ? `Error: ${errorWithParams}` : '',
						formattedArgs && formattedArgs !== '()'
							? `       ${[...Array(errorName?.length ?? 0).keys()]
									.map(() => ' ')
									.join('')}${formattedArgs}`
							: '',
					]
				}
			} catch (err) {
				cause = err
			}
		} else if (message) reason = message
		let signature
		if (cause instanceof AbiErrorSignatureNotFoundError) {
			signature = cause.signature
			metaMessages = [
				`Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
				'Make sure you are using the correct ABI and that the error exists on it.',
				`You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`,
			]
		}
		super(
			(reason && reason !== 'execution reverted') || signature
				? [
						`The contract function "${functionName}" reverted with the following ${
							signature ? 'signature' : 'reason'
						}:`,
						reason || signature,
				  ].join('\n')
				: `The contract function "${functionName}" reverted.`,
			{
				cause,
				metaMessages,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ContractFunctionRevertedError',
		})
		Object.defineProperty(this, 'data', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'reason', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		Object.defineProperty(this, 'signature', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		this.data = decodedData
		this.reason = reason
		this.signature = signature
	}
}
export class ContractFunctionZeroDataError extends BaseError {
	constructor({ functionName }) {
		super(`The contract function "${functionName}" returned no data ("0x").`, {
			metaMessages: [
				'This could be due to any of the following:',
				`  - The contract does not have the function "${functionName}",`,
				'  - The parameters passed to the contract function may be invalid, or',
				'  - The address is not a contract.',
			],
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ContractFunctionZeroDataError',
		})
	}
}
export class RawContractError extends BaseError {
	constructor({ data, message }) {
		super(message || '')
		Object.defineProperty(this, 'code', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 3,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'RawContractError',
		})
		Object.defineProperty(this, 'data', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		})
		this.data = data
	}
}
//# sourceMappingURL=contract.js.map
