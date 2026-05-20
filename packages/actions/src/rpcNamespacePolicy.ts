/**
 * Tevm RPC extension namespace policy:
 * - `tevm_*` is canonical for Tevm-specific behavior.
 * - `zevm_*` aliases are opt-in and only added for low-risk compatibility.
 * - Aliases with materially different semantics are intentionally omitted.
 */
export const rpcNamespacePolicy = {
	canonicalNamespace: 'tevm_*',
	compatibilityAliases: ['zevm_lightSyncStatus'] as const,
	rejectedAliasFamilies: [
		{
			prefix: 'zevm_voltaire_*',
			reason: 'Voltaire primitives are outside Tevm RPC scope and semantics.',
		},
		{
			prefix: 'zevm_guillotineMini_*',
			reason: 'Guillotine Mini engine-swap methods do not map to Tevm runtime semantics.',
		},
	] as const,
} as const

