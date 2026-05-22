[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / rpcNamespacePolicy

# Variable: rpcNamespacePolicy

> `const` **rpcNamespacePolicy**: `object`

Defined in: [packages/actions/src/rpcNamespacePolicy.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/rpcNamespacePolicy.ts#L7)

Tevm RPC extension namespace policy:
- `tevm_*` is canonical for Tevm-specific behavior.
- `zevm_*` aliases are opt-in and only added for low-risk compatibility.
- Aliases with materially different semantics are intentionally omitted.

## Type Declaration

### canonicalNamespace

> `readonly` **canonicalNamespace**: `"tevm_*"` = `'tevm_*'`

### compatibilityAliases

> `readonly` **compatibilityAliases**: readonly \[`"zevm_lightSyncStatus"`\]

### rejectedAliasFamilies

> `readonly` **rejectedAliasFamilies**: readonly \[\{ `prefix`: `"zevm_voltaire_*"`; `reason`: `"Voltaire primitives are outside Tevm RPC scope and semantics."`; \}, \{ `prefix`: `"zevm_guillotineMini_*"`; `reason`: `"Guillotine Mini engine-swap methods do not map to Tevm runtime semantics."`; \}\]
