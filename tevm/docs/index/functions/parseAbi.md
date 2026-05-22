[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseAbi

# Function: parseAbi()

> **parseAbi**\<`signatures`\>(`signatures`): [`ParseAbi`](../type-aliases/ParseAbi.md)\<`signatures`\>

Parses human-readable ABI into JSON [Abi](../type-aliases/Abi.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `signatures` *extends* readonly `string`[] | Human-Readable ABI |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `signatures` | `signatures`\[`"length"`\] *extends* `0` ? \[`"Error: At least one signature required"`\] : `Signatures`\<`signatures`\> *extends* `signatures` ? `signatures` : `Signatures`\<`signatures`\> |

## Returns

[`ParseAbi`](../type-aliases/ParseAbi.md)\<`signatures`\>

Parsed [Abi](../type-aliases/Abi.md)

## Example

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```
