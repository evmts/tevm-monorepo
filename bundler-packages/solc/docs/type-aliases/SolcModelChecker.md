[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcModelChecker

# Type Alias: SolcModelChecker

> **SolcModelChecker**: `object`

Defined in: [solcTypes.ts:165](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/solc/src/solcTypes.ts#L165)

## Type declaration

### contracts

> **contracts**: [`SolcModelCheckerContracts`](SolcModelCheckerContracts.md)

### divModNoSlacks?

> `optional` **divModNoSlacks**: `boolean`

### engine?

> `optional` **engine**: `"all"` \| `"bmc"` \| `"chc"` \| `"none"`

### extCalls

> **extCalls**: `"trusted"` \| `"untrusted"`

### invariants

> **invariants**: (`"contract"` \| `"reentrancy"`)[]

### showProved?

> `optional` **showProved**: `boolean`

### showUnproved?

> `optional` **showUnproved**: `boolean`

### showUnsupported?

> `optional` **showUnsupported**: `boolean`

### solvers

> **solvers**: (`"cvc4"` \| `"smtlib2"` \| `"z3"`)[]

### targets?

> `optional` **targets**: (`"underflow"` \| `"overflow"` \| `"assert"`)[]

### timeout?

> `optional` **timeout**: `boolean`
