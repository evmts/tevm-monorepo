import { Address } from '@ethereumjs/util'
import { bytesToHex, hexToBytes, numberToHex } from 'viem'

/**
 * Returns a trace of an eth_call within the context of the given block execution using the final state of the parent block
 * @param {object} options
 * @param {import('@ethereumjs/evm').EVM} options.evm
 * @returns {import('@tevm/api').DebugTraceCallHandler} an execution trace of an {@link eth_call} in the context of a given block execution
 * mirroring the output from {@link traceTransaction}
 */
export const traceCallHandler =
	({ evm: _evm }) =>
	async (params) => {
		const evm = /** @type {import('@ethereumjs/evm').EVMInterface}*/ (
			_evm.shallowCopy()
		)
		const {
			account,
			to,
			gas: gasLimit,
			gasPrice,
			value,
			data,
		} = params.transaction

		const trace = {
			gas: 0n,
			/**
			 * @type {import('viem').Hex}
			 */
			returnValue: '0x0',
			failed: false,
			/**
			 * @type {Array<import('@tevm/api').DebugTraceCallResult['structLogs'][number]>}
			 */
			structLogs: [],
		}
		evm.events?.on('step', async (step, next) => {
			trace.structLogs.push({
				pc: step.pc,
				op: step.opcode.name,
				gasCost: BigInt(step.opcode.fee) + (step.opcode.dynamicFee ?? 0n),
				gas: step.gasLeft,
				depth: step.depth,
				stack: step.stack.map((code) => numberToHex(code)),
			})
			next?.()
		})

		evm.events?.on('afterMessage', (data, next) => {
			if (
				data.execResult.exceptionError !== undefined &&
				trace.structLogs.length > 0
			) {
				// Mark last opcode trace as error if exception occurs
				const nextLog = trace.structLogs[trace.structLogs.length - 1]
				if (!nextLog) {
					throw new Error('No structLogs to mark as error')
				}
				// TODO fix this type
				Object.assign(nextLog, {
					error: data.execResult.exceptionError,
				})
			}
			next?.()
		})

		const res = await evm.runCall({
			...(account !== undefined
				? {
						origin: Address.fromString(
							typeof account === 'string' ? account : account.address,
						),
						caller: Address.fromString(
							typeof account === 'string' ? account : account.address,
						),
				  }
				: {}),
			...(data !== undefined ? { data: hexToBytes(data) } : {}),
			...(to ? { to: Address.fromString(to) } : {}),
			...(gasPrice ? { gasPrice } : {}),
			...(gasLimit ? { gasLimit } : {}),
			...(value ? { value } : {}),
		})
		trace.gas = res.execResult.executionGasUsed
		trace.failed = res.execResult.exceptionError !== undefined
		trace.returnValue = bytesToHex(res.execResult.returnValue)
		return trace
	}
