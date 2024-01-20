**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > JsonRpcRequestTypeFromMethod

# Type alias: JsonRpcRequestTypeFromMethod`<TMethod>`

> **JsonRpcRequestTypeFromMethod**\<`TMethod`\>: `EthRequestType` & `TevmRequestType` & `AnvilRequestType` & `DebugRequestType`[`TMethod`]

Utility type to get the request type given a method name

## Example

```typescript
type BlockNumberRequestType = JsonRpcRequestTypeFromMethod<'eth_blockNumber'>
```

## Type parameters

| Parameter |
| :------ |
| `TMethod` extends keyof `EthRequestType` \| keyof `TevmRequestType` \| keyof `AnvilRequestType` \| keyof `DebugRequestType` |

## Source

vm/api/types/TevmJsonRpcRequestHandler.d.ts:153

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
