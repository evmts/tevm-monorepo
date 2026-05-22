[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / ContractConstructorArgs

# Type Alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\> = [`AbiParametersToPrimitiveTypes`](../../index/type-aliases/AbiParametersToPrimitiveTypes.md)\<`Extract`\<`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? `abi` : [`Abi`](../../index/type-aliases/Abi.md)\[`number`\], \{ `type`: `"constructor"`; \}\>\[`"inputs"`\], `"inputs"`, `true`\> *extends* infer args ? \[`args`\] *extends* \[`never`\] ? readonly `unknown`[] : `args` : readonly `unknown`[]

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../index/type-aliases/Abi.md) |
