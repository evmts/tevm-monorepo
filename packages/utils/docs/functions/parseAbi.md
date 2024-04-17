**@tevm/utils** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/utils](../README.md) / parseAbi

# Function: parseAbi()

> **parseAbi**\<`TSignatures`\>(`signatures`): [`ParseAbi`](../type-aliases/ParseAbi.md)\<`TSignatures`\>

Parses human-readable ABI into JSON [Abi](../type-aliases/Abi.md)

## Type parameters

• **TSignatures** extends readonly `string`[]

## Parameters

• **signatures**: `TSignatures`\[`"length"`\] extends `0` ? [`"Error: At least one signature required"`] : `Signatures`\<`TSignatures`\> extends `TSignatures` ? `TSignatures` : `Signatures`\<`TSignatures`\>

Human-Readable ABI

## Returns

[`ParseAbi`](../type-aliases/ParseAbi.md)\<`TSignatures`\>

Parsed [Abi](../type-aliases/Abi.md)

## Example

```ts
const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

## Source

node\_modules/.pnpm/abitype@1.0.2\_typescript@5.4.5/node\_modules/abitype/dist/types/human-readable/parseAbi.d.ts:37
