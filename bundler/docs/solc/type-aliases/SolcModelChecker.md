**@tevm/bundler** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/bundler](../../README.md) / [solc](../README.md) / SolcModelChecker

# Type alias: SolcModelChecker

> **SolcModelChecker**: `object`

## Type declaration

### contracts

> **contracts**: [`SolcModelCheckerContracts`](SolcModelCheckerContracts.md)

### divModNoSlacks?

> **`optional`** **divModNoSlacks**: `boolean`

### engine?

> **`optional`** **engine**: `"all"` \| `"bmc"` \| `"chc"` \| `"none"`

### extCalls

> **extCalls**: `"trusted"` \| `"untrusted"`

### invariants

> **invariants**: (`"contract"` \| `"reentrancy"`)[]

### showProved?

> **`optional`** **showProved**: `boolean`

### showUnproved?

> **`optional`** **showUnproved**: `boolean`

### showUnsupported?

> **`optional`** **showUnsupported**: `boolean`

### solvers

> **solvers**: (`"cvc4"` \| `"smtlib2"` \| `"z3"`)[]

### targets?

> **`optional`** **targets**: (`"underflow"` \| `"overflow"` \| `"assert"`)[]

### timeout?

> **`optional`** **timeout**: `boolean`

## Source

bundler-packages/solc/types/src/solcTypes.d.ts:45
