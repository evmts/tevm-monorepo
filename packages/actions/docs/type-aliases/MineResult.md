[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / MineResult

# Type Alias: MineResult

> **MineResult**: \{ `blockHashes`: `Hex`[]; `errors`: `undefined`; \} \| \{ `blockHashes`: `undefined`; `errors`: [`TevmMineError`](TevmMineError.md)[]; \}

Defined in: [packages/actions/src/Mine/MineResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/MineResult.ts#L7)

Result of Mine Method

## Type declaration

\{ `blockHashes`: `Hex`[]; `errors`: `undefined`; \}

### blockHashes

> **blockHashes**: `Hex`[]

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
