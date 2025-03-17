[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / MineResult

# Type Alias: MineResult

> **MineResult**: \{ `blockHashes`: [`Hex`](Hex.md)[]; `errors`: `undefined`; \} \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](TevmMineError.md)[]; \}

Defined in: packages/actions/dist/index.d.ts:2676

Result of Mine Method

## Type declaration

\{ `blockHashes`: [`Hex`](Hex.md)[]; `errors`: `undefined`; \}

### blockHashes

> **blockHashes**: [`Hex`](Hex.md)[]

Array of mined block hashes

### errors?

> `optional` **errors**: `undefined`

No errors occurred

\{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](TevmMineError.md)[]; \}

### blockHashes?

> `optional` **blockHashes**: `undefined`

No block hashes available

### errors

> **errors**: [`TevmMineError`](TevmMineError.md)[]

Description of the exception, if any occurred
