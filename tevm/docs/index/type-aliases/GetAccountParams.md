**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > GetAccountParams

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

> **address**: [`Address`](../../actions-types/type-aliases/Address.md)

Address of account

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TThrowOnFail` extends `boolean` | `boolean` |

## Source

packages/actions-types/types/params/GetAccountParams.d.ts:10

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
