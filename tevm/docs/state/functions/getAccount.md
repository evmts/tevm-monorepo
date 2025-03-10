[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [state](../README.md) / getAccount

# Function: getAccount()

> **getAccount**(`baseState`, `skipFetchingFromFork`?): (`address`) => `Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>

Defined in: packages/state/dist/index.d.ts:278

Gets the account corresponding to the provided `address`.
Returns undefined if account does not exist.

When running in fork mode:
1. First checks main cache for the account
2. Then checks fork cache if main cache misses
3. Finally fetches from remote provider if neither cache has the account
4. When fetched from remote, stores in both main and fork caches

## Parameters

### baseState

[`BaseState`](../type-aliases/BaseState.md)

### skipFetchingFromFork?

`boolean`

## Returns

`Function`

### Parameters

#### address

[`EthjsAddress`](../../utils/classes/EthjsAddress.md)

### Returns

`Promise`\<`undefined` \| [`EthjsAccount`](../../utils/classes/EthjsAccount.md)\>
