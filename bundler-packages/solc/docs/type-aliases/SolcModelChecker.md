**@tevm/solc** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/solc](../README.md) / SolcModelChecker

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

[solcTypes.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L165)
