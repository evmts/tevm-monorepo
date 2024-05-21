[**@tevm/chains**](../README.md) • **Docs**

***

[@tevm/chains](../globals.md) / CommonOptions

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

[packages/chains/src/index.ts:20](https://github.com/evmts/tevm-monorepo/blob/main/packages/chains/src/index.ts#L20)
