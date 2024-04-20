**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > BaseCallParams

# Type alias: BaseCallParams`<TThrowOnFail>`

> **BaseCallParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Properties shared accross call-like params

## Type declaration

### blobVersionedHashes

> **blobVersionedHashes**?: [`Hex`](Hex.md)[]

Versioned hashes for each blob in a blob transaction

### blockOverrideSet

> **blockOverrideSet**?: [`BlockOverrideSet`](BlockOverrideSet.md)

The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
This option cannot be used when `createTransaction` is set to `true`
Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.

### blockTag

> **blockTag**?: [`BlockParam`](BlockParam.md)

The block number or block tag to execute the call at. Defaults to `latest`

### caller

> **caller**?: [`Address`](Address.md)

The address that ran this code (`msg.sender`). Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### createTrace

> **createTrace**?: `boolean`

Whether to return a complete trace with the call

### createTransaction

> **createTransaction**?: `"on-success"` \| `"always"` \| `"never"` \| `boolean`

Whether or not to update the state or run call in a dry-run. Defaults to `never`
- `on-success`: Only update the state if the call is successful
- `always`: Always include tx even if it reverted
- `never`: Never include tx
- `true`: alias for `on-success`
- `false`: alias for `never`
Always will still not include the transaction if it's not valid to be included in
the chain such as the gas limit being too low.

### depth

> **depth**?: `number`

The call depth. Defaults to `0`

### from

> **from**?: [`Address`](Address.md)

The from address for the call. Defaults to the zero address.
It is also possible to set the `origin` and `caller` addresses seperately using
those options. Otherwise both are set to the `from` address

### gas

> **gas**?: `bigint`

The gas limit for the call.
Defaults to 0xffffff (16_777_215n)

### gasPrice

> **gasPrice**?: `bigint`

The gas price for the call.

### gasRefund

> **gasRefund**?: `bigint`

Refund counter. Defaults to `0`

### origin

> **origin**?: [`Address`](Address.md)

The address where the call originated from. Defaults to the zero address.
This defaults to `from` address if set otherwise it defaults to the zero address

### selfdestruct

> **selfdestruct**?: `Set`\<[`Address`](Address.md)\>

Addresses to selfdestruct. Defaults to the empty set.

### skipBalance

> **skipBalance**?: `boolean`

Set caller to msg.value of less than msg.value
Defaults to false exceipt for when running scripts
where it is set to true

### stateOverrideSet

> **stateOverrideSet**?: [`StateOverrideSet`](StateOverrideSet.md)

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

### to

> **to**?: [`Address`](Address.md)

The address of the account that is executing this code (`address(this)`). Defaults to the zero address.

### value

> **value**?: `bigint`

The value in ether that is being sent to `opts.address`. Defaults to `0`

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/BaseCallParams.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/BaseCallParams.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
