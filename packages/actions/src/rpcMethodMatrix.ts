export type RpcMethodStatus = 'supported' | 'missing' | 'intentionally_unsupported' | 'blocked'

export type RpcMethodMatrixEntry = {
	method: string
	ownerPackage: '@tevm/actions' | '@tevm/decorators' | '@tevm/server'
	status: RpcMethodStatus
	notes?: string
	followUpTicket?: string
}

export const intentionallyUnsupportedRuntimeMethods = new Set(['tevm_contract', 'eth_sendUnsignedTransaction'])
const blockedMethodPrefixes = ['zevm_voltaire_', 'zevm_guillotineMini_'] as const
export const typedButMissingMethods = new Set<string>([])

export const blockedMethodGroups: readonly RpcMethodMatrixEntry[] = [
	{
		method: 'zevm_voltaire',
		ownerPackage: '@tevm/actions',
		status: 'blocked',
		notes: 'Voltaire primitives are out of scope for Tevm runtime parity.',
	},
	{
		method: 'zevm_guillotineMini',
		ownerPackage: '@tevm/actions',
		status: 'blocked',
		notes: 'Guillotine Mini engine swap work is out of scope.',
	},
]

export const buildRpcMethodMatrix = (
	runtimeMethods: readonly string[],
	typedMethods: readonly string[] = [],
): readonly RpcMethodMatrixEntry[] => {
	const methods = new Set([...runtimeMethods, ...typedMethods])
	const entries = Array.from(methods)
		.sort()
		.map((method) => {
			const isMissing = typedMethods.includes(method) && !runtimeMethods.includes(method)
			return {
				method,
				ownerPackage: '@tevm/actions' as const,
				status: isMissing
					? ('missing' as const)
					: intentionallyUnsupportedRuntimeMethods.has(method)
						? ('intentionally_unsupported' as const)
						: ('supported' as const),
				...(method === 'tevm_miner' ? { notes: 'Backward-compatible alias for canonical tevm_mine.' } : {}),
				...(typedButMissingMethods.has(method) ? { followUpTicket: '022-rpc-unimplemented-typed-methods.md' } : {}),
			}
		})
	return [...entries, ...blockedMethodGroups]
}

export const rpcMethodMatrix: readonly RpcMethodMatrixEntry[] = blockedMethodGroups

export const rpcMethodStatusByMethod = new Map<string, RpcMethodStatus>([
	...Array.from(intentionallyUnsupportedRuntimeMethods, (method): [string, RpcMethodStatus] => [
		method,
		'intentionally_unsupported',
	]),
	...Array.from(typedButMissingMethods, (method): [string, RpcMethodStatus] => [method, 'missing']),
])

export const isBlockedMethod = (method: string): boolean =>
	blockedMethodPrefixes.some((prefix) => method.startsWith(prefix))
