[**@tevm/actions-types**](../README.md) • **Docs**

***

[@tevm/actions-types](../globals.md) / GetAccountParams

# Type alias: GetAccountParams\<TThrowOnFail\>

> **GetAccountParams**\<`TThrowOnFail`\>: `BaseParams`\<`TThrowOnFail`\> & `object`

Tevm params to get an account

## Example

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```

## Type declaration

### address

> `readonly` **address**: [`Address`](Address.md)

Address of account

### returnStorage?

> `optional` `readonly` **returnStorage**: `boolean`

If true the handler will return the contract storage
It only returns storage that happens to be cached in the vm
In fork mode if storage hasn't yet been cached it will not be returned
This defaults to false
Be aware that this can be very expensive if a contract has a lot of storage

## Type parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[params/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/GetAccountParams.ts#L11)
