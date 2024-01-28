**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > JsonRpcReturnTypeFromMethod

# Type alias: JsonRpcReturnTypeFromMethod`<TMethod>`

> **JsonRpcReturnTypeFromMethod**\<`TMethod`\>: `EthReturnType` & `TevmReturnType` & `AnvilReturnType` & `DebugReturnType`[`TMethod`]

Utility type to get the return type given a method name

## Example

```typescript
type BlockNumberReturnType = JsonRpcReturnTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof `EthReturnType` \| keyof `TevmReturnType` \| keyof `AnvilReturnType` \| keyof `DebugReturnType` |

## Source

packages/procedures-types/types/tevm-request-handler/JsonRpcReturnTypeFromMethod.d.ts:12

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
