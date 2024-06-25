[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / GetAccountParams

# Type Alias: GetAccountParams\<TThrowOnFail\>

> **GetAccountParams**\<`TThrowOnFail`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

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

> `readonly` `optional` **returnStorage**: `boolean`

If true the handler will return the contract storage
It only returns storage that happens to be cached in the vm
In fork mode if storage hasn't yet been cached it will not be returned
This defaults to false
Be aware that this can be very expensive if a contract has a lot of storage

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/GetAccount/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/GetAccountParams.ts#L11)
