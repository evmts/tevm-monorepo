[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / ParseAbi

# Type Alias: ParseAbi\<signatures\>

> **ParseAbi**\<`signatures`\> = `string`[] *extends* `signatures` ? [`Abi`](Abi.md) : `signatures` *extends* readonly `string`[] ? `signatures` *extends* `Signatures`\<`signatures`\> ? `ParseStructs`\<`signatures`\> *extends* infer structs ? `{ [key in keyof signatures]: signatures[key] extends string ? ParseSignature<signatures[key], structs> : never }` *extends* infer mapped ? `Filter`\<`mapped`, `never`\> *extends* infer result ? `result` *extends* readonly \[\] ? `never` : `result` : `never` : `never` : `never` : `never` : `never`

Parses human-readable ABI into JSON [Abi](Abi.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `signatures` *extends* readonly `string`[] | Human-readable ABI |

## Returns

Parsed [Abi](Abi.md)

## Example

```ts
type Result = ParseAbi<
  // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  [
    'function balanceOf(address owner) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 amount)',
  ]
>
```
