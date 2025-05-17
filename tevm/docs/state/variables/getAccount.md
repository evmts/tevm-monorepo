[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getAccount

# Variable: getAccount

> `const` **getAccount**: [`StateAction`](../type-aliases/StateAction.md)\<`"getAccount"`\>

Defined in: packages/state/dist/index.d.ts:390

Gets the account corresponding to the provided `address`.
Returns undefined if account does not exist.

When running in fork mode:
1. First checks main cache for the account
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the account
4. When fetched from remote, stores in both main and fork caches
