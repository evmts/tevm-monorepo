**@tevm/actions-types** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > GetAccountParams

# Type alias: GetAccountParams`<TThrowOnFail>`

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

> **address**: [`Address`](Address.md)

Address of account

### returnStorage

> **returnStorage**?: `boolean`

If true the handler will return the contract storage
It only returns storage that happens to be cached in the vm
In fork mode if storage hasn't yet been cached it will not be returned
This defaults to false
Be aware that this can be very expensive if a contract has a lot of storage

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

[params/GetAccountParams.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/GetAccountParams.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
