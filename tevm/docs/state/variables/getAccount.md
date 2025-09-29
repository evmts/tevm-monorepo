[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getAccount

# Variable: getAccount

> `const` **getAccount**: [`StateAction`](../type-aliases/StateAction.md)\<`"getAccount"`\>

<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:408
=======
<<<<<<< HEAD
Defined in: packages/state/dist/index.d.ts:411
=======
Defined in: packages/state/dist/index.d.ts:408
>>>>>>> ceeee8122 (docs: generate docs)
>>>>>>> db7d1ce3d (docs: generate docs)

Gets the account corresponding to the provided `address`.
Returns undefined if account does not exist.

When running in fork mode:
1. First checks main cache for the account
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the account
4. When fetched from remote, stores in both main and fork caches
