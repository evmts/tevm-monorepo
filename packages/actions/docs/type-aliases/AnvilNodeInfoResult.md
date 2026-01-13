[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / AnvilNodeInfoResult

# Type Alias: AnvilNodeInfoResult

> **AnvilNodeInfoResult** = `object`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L56)

## Properties

### chainId

> **chainId**: `number`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:64](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L64)

The chain ID

***

### currentBlockNumber

> **currentBlockNumber**: `number`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:58](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L58)

The current environment (production, staging, etc.)

***

### currentBlockTimestamp

> **currentBlockTimestamp**: `number`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:60](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L60)

The current block timestamp

***

### forkUrl?

> `optional` **forkUrl**: `string`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:62](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L62)

Whether the node is in fork mode

***

### hardfork

> **hardfork**: `string`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:66](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L66)

The hardfork

***

### miningMode

> **miningMode**: `"auto"` \| `"manual"` \| `"interval"`

Defined in: [packages/actions/src/anvil/AnvilResult.ts:68](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/anvil/AnvilResult.ts#L68)

The mining configuration
