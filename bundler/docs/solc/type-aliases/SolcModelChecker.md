**@tevm/bundler** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [solc](../README.md) > SolcModelChecker

# Type alias: SolcModelChecker

> **SolcModelChecker**: `object`

## Type declaration

### contracts

> **contracts**: [`SolcModelCheckerContracts`](SolcModelCheckerContracts.md)

### divModNoSlacks

> **divModNoSlacks**?: `boolean`

### engine

> **engine**?: `"all"` \| `"bmc"` \| `"chc"` \| `"none"`

### extCalls

> **extCalls**: `"trusted"` \| `"untrusted"`

### invariants

> **invariants**: (`"contract"` \| `"reentrancy"`)[]

### showProved

> **showProved**?: `boolean`

### showUnproved

> **showUnproved**?: `boolean`

### showUnsupported

> **showUnsupported**?: `boolean`

### solvers

> **solvers**: (`"cvc4"` \| `"smtlib2"` \| `"z3"`)[]

### targets

> **targets**?: (`"underflow"` \| `"overflow"` \| `"assert"`)[]

### timeout

> **timeout**?: `boolean`

## Source

bundler-packages/solc/types/src/solcTypes.d.ts:45

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
