import { BaseError, RevertError } from '@tevm/errors'
import type { AbiError } from 'abitype'
import {
	type Client,
	ContractFunctionRevertedError,
	type DecodeErrorResultReturnType,
	decodeAbiParameters,
	type Hex,
	isHex,
	type TransactionReceipt,
	BaseError as ViemBaseError,
} from 'viem'
import { estimateGas, getTransaction, getTransactionReceipt } from 'viem/actions'
import type { ContainsTransactionAny } from '../../common/types.js'

export const handleTransaction = async (
	tx: ContainsTransactionAny | Promise<ContainsTransactionAny>,
	opts: { client?: Client | undefined },
) => {
	const { client } = opts
	try {
		const res = tx instanceof Promise ? await tx : tx

		// We can throw directly if it's the result of a tevm call that didn't throw
		if (typeof res === 'object' && 'errors' in res) throw res.errors[0]

		// If it didn't, we'll need a client
		if (!client)
			throw new Error(
				"You need to pass a client if the result of the promise is a transaction hash, receipt or call result that didn't throw",
			)

		const txReceipt =
			typeof res === 'object' && 'status' in res
				? (res as TransactionReceipt)
				: typeof res === 'string' && isHex(res)
					? await getTransactionReceipt(client, { hash: res })
					: undefined
		if (txReceipt) await maybeThrowErrorFromTxReceipt(client, txReceipt)

		return {
			isRevert: false,
			isError: false,
			revertReason: undefined,
			error: undefined,
		}
	} catch (error) {
		// Bubble the error up to the test if it's missing a client
		if (error instanceof Error && error.message.includes('You need to pass a client')) throw error
		return {
			...parseError(error),
			error,
		}
	}
}

const parseError = (error: unknown) => {
	const isRevert = (error instanceof BaseError || error instanceof ViemBaseError) && error.message.includes('revert')

	// Return early if it's not a revert
	if (!isRevert) {
		return {
			isRevert: false,
			isError: true,
			revertReason: undefined,
		}
	}

	let decodedRevertData: DecodeErrorResultReturnType | undefined
	let rawRevertData: Hex | undefined

	// Get the decoded data directly if it's available
	const revertData = extractRevertData(error)
	if (isHex(revertData)) {
		rawRevertData = revertData
	} else {
		decodedRevertData = revertData
	}

	const { revertString, revertReason } = extractRevertStringAndReason(rawRevertData, decodedRevertData)

	return {
		isRevert: true,
		isError: false,
		rawRevertData,
		decodedRevertData,
		revertString,
		revertReason,
	}
}

const maybeThrowErrorFromTxReceipt = async (client: Client, txReceipt: TransactionReceipt) => {
	if (txReceipt.status === 'success') return
	const tx = await getTransaction(client, { hash: txReceipt.transactionHash })
	await estimateGas(client, { account: tx.from, to: tx.to, data: tx.input, value: tx.value })

	// TODO: we should use that for better accuracy (fork the block to reexecute the tx) but rn this errors with:
	// State root for 0x... does not exist
	// const forkClient = createClient({
	//   transport: createTevmTransport({
	//     fork: {
	//       transport: client
	//     }
	//   })
	// })
	// const callTraceResult = await forkClient.transport.tevm.request({
	//   method: "debug_traceTransaction",
	//   params: [{ transactionHash: txReceipt.transactionHash }],
	// });

	// // Then something like
	// if (callTraceResult.trace.failed) {
	//   throw callTraceResult.execResult.exceptionError // add callTraceResult.trace.returnValue so we can decode
	// }
}

// End goal here is to extract either:
// - ContractFunctionRevertedError (.data): decoded data, e.g. from viem `writeContract` or tevm `contractHandler`
// - RevertError (.raw): raw data from tevm after we failed to decode it in `contractHandler`
// - Error (.data.data): raw data from tevm `callProcedure` that wasn't decoded (could be from viem `sendTransaction` or `estimateGas` as well)
const extractRevertData = (error: unknown): DecodeErrorResultReturnType | Hex | undefined => {
	if (!error) return undefined

	const isRevertError = (err: unknown): boolean => {
		return (
			(err instanceof ViemBaseError || err instanceof BaseError) &&
			err.message.includes('execution reverted') &&
			('data' in err || 'raw' in err)
		)
	}

	const revertError = (
		isRevertError(error)
			? error
			: error instanceof ViemBaseError || error instanceof BaseError
				? error.walk?.(isRevertError) || error.walk?.()
				: {}
	) as ContractFunctionRevertedError | RevertError | { data: { data: Hex } } | undefined

	if (!revertError) return undefined

	const revertData = ('data' in revertError && !!revertError.data ? revertError.data : revertError) as
		| DecodeErrorResultReturnType
		| { data: Hex }
	return ('data' in revertData ? revertData.data : revertData) ?? ('raw' in revertError ? revertError.raw : undefined)
}

const REVERT_STRING_SELECTOR = '0x08c379a0'

const extractRevertStringAndReason = (rawData?: Hex, decodedData?: DecodeErrorResultReturnType) => {
	const revertString = decodeRevertString(rawData, decodedData)
	if (revertString) return { revertString, revertReason: `revert: ${revertString}` }

	const revertReason = formatNonStringRevertReason(rawData, decodedData)
	if (revertReason) return { revertString: undefined, revertReason }

	return { revertString: undefined, revertReason: undefined }
}

const decodeRevertString = (rawData?: Hex, decodedData?: DecodeErrorResultReturnType) => {
	if (decodedData && decodedData.errorName === 'Error') return decodedData.args?.[0] as string
	if (rawData && rawData !== '0x' && rawData.startsWith(REVERT_STRING_SELECTOR)) {
		const rawDataString = `0x${rawData.slice(REVERT_STRING_SELECTOR.length)}` as Hex
		return decodeAbiParameters([{ type: 'string' }], rawDataString)[0]
	}

	return undefined
}

const formatNonStringRevertReason = (rawData?: Hex, decodedData?: DecodeErrorResultReturnType) => {
	if (decodedData) {
		// if (decodedData.errorName === 'Error') return `revert: ${decodedData.args?.[0]}`
		const prefix = `custom error: ${decodedData.errorName}`
		const argTypes = (decodedData.abiItem as AbiError).inputs.map((i) => i.type).join(', ')
		if (!decodedData.args) return `${prefix}(${argTypes})`

		const argValues = Array.isArray(decodedData.args)
			? decodedData.args.map((v) => (typeof v === 'bigint' ? v.toString() : JSON.stringify(v))).join(', ')
			: String(decodedData.args)
		return `${prefix}(${argTypes})\n${Array.from({ length: prefix.length })
			.map(() => ' ')
			.join('')}(${argValues})`
	}

	if (!rawData || rawData === '0x') return undefined
	return `custom error: ${rawData.slice(0, 10)}`
}
