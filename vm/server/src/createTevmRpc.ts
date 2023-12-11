import { Tevm } from '@tevm/vm'
import { TevmRpc } from './TevmRpc'

export const createTevmRpc = (vm: Tevm): TevmRpc => {
	return {
		tevm_call: async (request) => {
			return {
				jsonrpc: '2.0',
				id: request.id,
				result: await vm.runCall(request.params),
				method: 'tevm_call',
			}
		},
		tevm_contractCall: async (request) => {
			return {
				jsonrpc: '2.0',
				id: request.id,
				result: await vm.runContractCall(request.params as any),
				method: 'tevm_contractCall',
			} as any
		},
		tevm_script: async (request) => {
			return {
				jsonrpc: '2.0',
				id: request.id,
				result: await vm.runScript(request.params as any),
				method: 'tevm_script',
			} as any
		},
		tevm_putAccount: async (request) => {
			return {
				jsonrpc: '2.0',
				id: request.id,
				result: await vm.putAccount(request.params),
				method: 'tevm_putAccount',
			}
		},
		tevm_putContractCode: async (request) => {
			return {
				jsonrpc: '2.0',
				id: request.id,
				result: await vm.putContractCode(request.params),
				method: 'tevm_putContractCode',
			}
		},
	}
}
