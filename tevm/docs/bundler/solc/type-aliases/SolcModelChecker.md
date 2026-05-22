[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/solc](../README.md) / SolcModelChecker

# Type Alias: SolcModelChecker

> **SolcModelChecker** = `object`

## Properties

| Property | Type |
| ------ | ------ |
| <a id="contracts"></a> `contracts?` | [`SolcModelCheckerContracts`](SolcModelCheckerContracts.md) |
| <a id="divmodnoslacks"></a> `divModNoSlacks?` | `boolean` |
| <a id="engine"></a> `engine?` | `"all"` \| `"bmc"` \| `"chc"` \| `"none"` |
| <a id="extcalls"></a> `extCalls?` | `"trusted"` \| `"untrusted"` |
| <a id="invariants"></a> `invariants?` | (`"contract"` \| `"reentrancy"`)[] |
| <a id="showproved"></a> `showProved?` | `boolean` |
| <a id="showunproved"></a> `showUnproved?` | `boolean` |
| <a id="showunsupported"></a> `showUnsupported?` | `boolean` |
| <a id="solvers"></a> `solvers?` | (`"cvc4"` \| `"smtlib2"` \| `"z3"`)[] |
| <a id="targets"></a> `targets?` | (`"underflow"` \| `"overflow"` \| `"assert"`)[] |
| <a id="timeout"></a> `timeout?` | `boolean` |
