[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / AnvilNodeInfoResult

# Type Alias: AnvilNodeInfoResult

> **AnvilNodeInfoResult** = `object`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:30

## Properties

### chainId

> **chainId**: `number`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:38

The chain ID

***

### currentBlockNumber

> **currentBlockNumber**: `number`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:32

The current environment (production, staging, etc.)

***

### currentBlockTimestamp

> **currentBlockTimestamp**: `number`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:34

The current block timestamp

***

### forkUrl?

> `optional` **forkUrl**: `string`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:36

Whether the node is in fork mode

***

### hardfork

> **hardfork**: `string`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:40

The hardfork

***

### miningMode

> **miningMode**: `"auto"` \| `"manual"` \| `"interval"`

Defined in: packages/actions/types/anvil/AnvilResult.d.ts:42

The mining configuration
