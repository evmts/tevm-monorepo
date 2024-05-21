[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [chains](../README.md) / CommonOptions

# Type alias: CommonOptions

> **CommonOptions**: `object`

## Type declaration

### eips

> **eips**: `ReadonlyArray`\<`number`\>

EIPs enabled. Note some EIPS are always enabled by default such as EIP-1559

### hardfork

> **hardfork**: `Hardfork`

The ethereum hardfork running on the chain
In future we will take hardfork by blockNumber so the hardfork eips can change based on the block height.

## Source

packages/chains/types/index.d.ts:4
