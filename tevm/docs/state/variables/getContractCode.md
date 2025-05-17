[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getContractCode

# Variable: getContractCode

> `const` **getContractCode**: [`StateAction`](../type-aliases/StateAction.md)\<`"getContractCode"`\>

Defined in: packages/state/dist/index.d.ts:419

Gets the code corresponding to the provided `address`.
Returns an empty `Uint8Array` if the account has no associated code.

When running in fork mode:
1. First checks main cache for the code
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the code
4. When fetched from remote, stores in both main and fork caches
