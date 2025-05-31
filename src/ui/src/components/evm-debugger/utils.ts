import { EvmState } from './types'

export async function loadBytecode(bytecodeHex: string): Promise<void> {
	try {
		console.log('load_bytecode', { bytecodeHex })
	} catch (err) {
		throw new Error(`Failed to load bytecode: ${err}`)
	}
}

export async function resetEvm(): Promise<EvmState> {
	try {
		console.log('reset_evm')
		return await getEvmState()
	} catch (err) {
		throw new Error(`Failed to reset EVM: ${err}`)
	}
}

export async function stepEvm(): Promise<EvmState> {
	try {
		console.log('step_evm')
		return {
			pc: 2,
			logs: [],
			depth: 0,
			stack: [],
			memory: '0x0',
			opcode: '0x0',
			gasLeft: 420,
			storage: {},
			returnData: '0x0',
		}
	} catch (err) {
		throw new Error(`Failed to step: ${err}`)
	}
}

export async function toggleRunPause(): Promise<EvmState> {
	try {
		console.log('toggle_run_pause')
		return {
			pc: 2,
			logs: [],
			depth: 0,
			stack: [],
			memory: '0x0',
			opcode: '0x0',
			gasLeft: 420,
			storage: {},
			returnData: '0x0',
		}
	} catch (err) {
		throw new Error(`Failed to toggle run/pause: ${err}`)
	}
}

export async function getEvmState(): Promise<EvmState> {
	try {
		console.log('get_evm_state')
		return {
			pc: 2,
			logs: [],
			depth: 0,
			stack: [],
			memory: '0x0',
			opcode: '0x0',
			gasLeft: 420,
			storage: {},
			returnData: '0x0',
		}
	} catch (err) {
		throw new Error(`Failed to get state: ${err}`)
	}
}

export const copyToClipboard = (text: string): void => {
	navigator.clipboard.writeText(text)
}
