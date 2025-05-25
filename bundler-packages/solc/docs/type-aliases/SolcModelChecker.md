[**@tevm/solc**](../README.md)

***

[@tevm/solc](../globals.md) / SolcModelChecker

# Type Alias: SolcModelChecker

> **SolcModelChecker** = `object`

Defined in: solcTypes.ts:165

## Properties

### contracts

> **contracts**: [`SolcModelCheckerContracts`](SolcModelCheckerContracts.md)

Defined in: solcTypes.ts:166

***

### divModNoSlacks?

> `optional` **divModNoSlacks**: `boolean`

Defined in: solcTypes.ts:173

***

### engine?

> `optional` **engine**: `"all"` \| `"bmc"` \| `"chc"` \| `"none"`

Defined in: solcTypes.ts:175

***

### extCalls

> **extCalls**: `"trusted"` \| `"untrusted"`

Defined in: solcTypes.ts:179

***

### invariants

> **invariants**: (`"contract"` \| `"reentrancy"`)[]

Defined in: solcTypes.ts:181

***

### showProved?

> `optional` **showProved**: `boolean`

Defined in: solcTypes.ts:183

***

### showUnproved?

> `optional` **showUnproved**: `boolean`

Defined in: solcTypes.ts:185

***

### showUnsupported?

> `optional` **showUnsupported**: `boolean`

Defined in: solcTypes.ts:187

***

### solvers

> **solvers**: (`"cvc4"` \| `"smtlib2"` \| `"z3"`)[]

Defined in: solcTypes.ts:190

***

### targets?

> `optional` **targets**: (`"underflow"` \| `"overflow"` \| `"assert"`)[]

Defined in: solcTypes.ts:196

***

### timeout?

> `optional` **timeout**: `boolean`

Defined in: solcTypes.ts:201
