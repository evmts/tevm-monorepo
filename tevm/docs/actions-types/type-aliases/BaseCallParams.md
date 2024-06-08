[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions-types](../README.md) / BaseCallParams

# Type alias: BaseCallParams\<TThrowOnFail\>

> **BaseCallParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Properties shared accross call-like params

## Type declaration

### blobVersionedHashes?

> `optional` `readonly` **blobVersionedHashes**: [`Hex`](Hex.md)[]

Versioned hashes for each blob in a blob transaction

### blockOverrideSet?

> `optional` `readonly` **blockOverrideSet**: [`BlockOverrideSet`](BlockOverrideSet.md)

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

### blockTag?

> `optional` `readonly` **blockTag**: [`BlockParam`](../../index/type-aliases/BlockParam.md)

The block number or block tag to execute the call at. Defaults to `latest`

### caller?

> `optional` `readonly` **caller**: [`Address`](Address.md)

The address that ran this code (`msg.sender`). Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### createAccessList?

> `optional` `readonly` **createAccessList**: `boolean`

Whether to return an access list
Defaults to `false`

### createTrace?

> `optional` `readonly` **createTrace**: `boolean`

Whether to return a complete trace with the call
Defaults to `false`

### createTransaction?

> `optional` `readonly` **createTransaction**: `"on-success"` \| `"always"` \| `"never"` \| `boolean`

Whether or not to update the state or run call in a dry-run. Defaults to `never`
- `on-success`: Only update the state if the call is successful
- `always`: Always include tx even if it reverted
- `never`: Never include tx
- `true`: alias for `on-success`
- `false`: alias for `never`
Always will still not include the transaction if it's not valid to be included in
the chain such as the gas limit being too low.

### depth?

> `optional` `readonly` **depth**: `number`

The call depth. Defaults to `0`

### from?

> `optional` `readonly` **from**: [`Address`](Address.md)

The from address for the call. Defaults to the zero address.
It is also possible to set the `origin` and `caller` addresses seperately using
those options. Otherwise both are set to the `from` address

### gas?

> `optional` `readonly` **gas**: `bigint`

The gas limit for the call.
Defaults to 0xffffff (16_777_215n)

### gasPrice?

> `optional` `readonly` **gasPrice**: `bigint`

The gas price for the call.

### gasRefund?

> `optional` `readonly` **gasRefund**: `bigint`

Refund counter. Defaults to `0`

### origin?

> `optional` `readonly` **origin**: [`Address`](Address.md)

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### selfdestruct?

> `optional` `readonly` **selfdestruct**: `Set`\<[`Address`](Address.md)\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance?

> `optional` `readonly` **skipBalance**: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### stateOverrideSet?

> `optional` `readonly` **stateOverrideSet**: [`StateOverrideSet`](StateOverrideSet.md)

The state override set is an optional address-to-state mapping, where each entry specifies some state to be ephemerally overridden prior to executing the call. Each address maps to an object containing:
This option cannot be used when `createTransaction` is set to `true`

The goal of the state override set is manyfold:

It can be used by DApps to reduce the amount of contract code needed to be deployed on chain. Code that simply returns internal state or does pre-defined validations can be kept off chain and fed to the node on-demand.
It can be used for smart contract analysis by extending the code deployed on chain with custom methods and invoking them. This avoids having to download and reconstruct the entire state in a sandbox to run custom code against.
It can be used to debug smart contracts in an already deployed large suite of contracts by selectively overriding some code or state and seeing how execution changes. Specialized tooling will probably be necessary.

#### Example

```ts
{
  "0xd9c9cd5f6779558b6e0ed4e6acf6b1947e7fa1f3": {
    "balance": "0xde0b6b3a7640000"
  },
  "0xebe8efa441b9302a0d7eaecc277c09d20d684540": {
    "code": "0x...",
    "state": {
      "0x...": "0x..."
    }
  }
}
```

### to?

> `optional` `readonly` **to**: [`Address`](Address.md)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

### value?

> `optional` `readonly` **value**: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

packages/actions-types/types/params/BaseCallParams.d.ts:6
