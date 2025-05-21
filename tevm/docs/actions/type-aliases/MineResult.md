[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / MineResult

# Type Alias: MineResult

> **MineResult** = \{ `blockHashes`: [`Hex`](../../index/type-aliases/Hex.md)[]; `errors?`: `undefined`; \} \| \{ `blockHashes?`: `undefined`; `errors`: [`TevmMineError`](TevmMineError.md)[]; \}

Defined in: packages/actions/types/Mine/MineResult.d.ts:6

Result of Mine Method

## Type declaration

\{ `blockHashes`: [`Hex`](../../index/type-aliases/Hex.md)[]; `errors?`: `undefined`; \}

### blockHashes

> **blockHashes**: [`Hex`](../../index/type-aliases/Hex.md)[]

Array of mined block hashes

### errors?

> `optional` **errors**: `undefined`

No errors occurred

\{ `blockHashes?`: `undefined`; `errors`: [`TevmMineError`](TevmMineError.md)[]; \}

### blockHashes?

> `optional` **blockHashes**: `undefined`

No block hashes available

### errors

> **errors**: [`TevmMineError`](TevmMineError.md)[]

Description of the exception, if any occurred
