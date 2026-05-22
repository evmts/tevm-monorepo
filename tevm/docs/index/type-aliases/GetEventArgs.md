[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / GetEventArgs

# Type Alias: GetEventArgs\<abi, eventName, config, abiEvent, args\>

> **GetEventArgs**\<`abi`, `eventName`, `config`, `abiEvent`, `args`\> = `args` *extends* `Record`\<`PropertyKey`, `never`\> ? readonly `unknown`[] \| `Record`\<`string`, `unknown`\> : `args`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] | - |
| `eventName` *extends* `string` | - |
| `config` *extends* `EventParameterOptions` | `DefaultEventParameterOptions` |
| `abiEvent` *extends* [`AbiEvent`](AbiEvent.md) & `object` | `abi` *extends* [`Abi`](Abi.md) ? [`ExtractAbiEvent`](ExtractAbiEvent.md)\<`abi`, `eventName`\> : [`AbiEvent`](AbiEvent.md) & `object` |
| `args` | `AbiEventParametersToPrimitiveTypes`\<`abiEvent`\[`"inputs"`\], `config`\> |
