[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / GetAccountParams

# Type Alias: GetAccountParams\<TThrowOnFail\>

> **GetAccountParams**\<`TThrowOnFail`\>: [`BaseParams`](BaseParams.md)\<`TThrowOnFail`\> & `object`

Defined in: packages/actions/types/GetAccount/GetAccountParams.d.ts:10

Tevm params to get an account

## Type declaration

### address

> `readonly` **address**: [`Address`](../../actions/type-aliases/Address.md)

Address of account

### blockTag?

> `readonly` `optional` **blockTag**: [`BlockParam`](BlockParam.md)

Block tag to fetch account from
- bigint for block number
- hex string for block hash
- 'latest', 'earliest', 'pending', 'forked' etc. tags

### returnStorage?

> `readonly` `optional` **returnStorage**: `boolean`

If true the handler will return the contract storage
It only returns storage that happens to be cached in the vm
In fork mode if storage hasn't yet been cached it will not be returned
This defaults to false
Be aware that this can be very expensive if a contract has a lot of storage

## Type Parameters

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Example

```ts
const getAccountParams: import('@tevm/api').GetAccountParams = {
  address: '0x...',
}
```
