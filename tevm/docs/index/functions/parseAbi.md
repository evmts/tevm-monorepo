[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseAbi

# Function: parseAbi()

> **parseAbi**\<`signatures`\>(`signatures`): [`ParseAbi`](../type-aliases/ParseAbi.md)\<`signatures`\>

Defined in: node\_modules/.pnpm/abitype@1.0.8\_typescript@5.8.3\_zod@3.24.3/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37

Parses human-readable ABI into JSON [Abi](../type-aliases/Abi.md)

## Type Parameters

### signatures

`signatures` *extends* readonly `string`[]

Human-Readable ABI

## Parameters

### signatures

`signatures`\[`"length"`\] *extends* `0` ? \[`"Error: At least one signature required"`\] : `Signatures`\<`signatures`\> *extends* `signatures` ? `signatures` : `Signatures`\<`signatures`\>

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
