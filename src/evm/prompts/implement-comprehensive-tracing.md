# Implement Comprehensive Tracing

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_comprehensive_tracing` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_comprehensive_tracing feat_implement_comprehensive_tracing`
3. **Work in isolation**: `cd g/feat_implement_comprehensive_tracing`
4. **Commit message**: `✨ feat: implement step-by-step execution monitoring and tracing`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement comprehensive execution tracing for debugging and monitoring EVM execution. This enables step-by-step tracking of opcodes, stack, memory, and state changes.

## ELI5

This is like installing a detailed flight recorder (black box) in an airplane that tracks every single action during flight. For the EVM, it records every instruction executed, what data was on the stack, what changed in memory, and how much gas was consumed at each step. When something goes wrong or you need to understand exactly what happened during execution, you can replay this detailed log to see the complete sequence of events, just like investigators use flight recorders to understand aircraft incidents.

## Implementation Requirements

### Core Functionality
1. **Opcode Tracing**: Track every executed opcode with context
2. **Stack Monitoring**: Record stack state at each step
3. **Memory Tracking**: Monitor memory reads and writes
4. **State Changes**: Track storage and account modifications
5. **Gas Accounting**: Detailed gas consumption per operation

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **Minimize performance impact** - Tracing should be optional
3. **Structured output** - Machine-readable trace format
4. **Complete coverage** - Trace all EVM operations
5. **Memory efficient** - Handle large traces without memory issues

## Reference Implementations

### geth

<explanation>
The go-ethereum tracing system demonstrates a comprehensive hook-based architecture with multiple tracing levels: transaction, message, opcode, and state changes. The key pattern is using function type definitions for hooks that provide context interfaces for accessing EVM state during execution.
</explanation>

**Context Interfaces** - `/go-ethereum/core/tracing/hooks.go` (lines 36-58):
```go
// OpContext provides the context at which the opcode is being
// executed in, including the memory, stack and various contract-level information.
type OpContext interface {
	MemoryData() []byte
	StackData() []uint256.Int
	Caller() common.Address
	Address() common.Address
	CallValue() *uint256.Int
	CallInput() []byte
	ContractCode() []byte
}

// StateDB gives tracers access to the whole state.
type StateDB interface {
	GetBalance(common.Address) *uint256.Int
	GetNonce(common.Address) uint64
	GetCode(common.Address) []byte
	GetCodeHash(common.Address) common.Hash
	GetState(common.Address, common.Hash) common.Hash
	GetTransientState(common.Address, common.Hash) common.Hash
	Exist(common.Address) bool
	GetRefund() uint64
}
```

**Tracing Hook Types** - `/go-ethereum/core/tracing/hooks.go` (lines 83-113):
```go
// TxStartHook is called before the execution of a transaction starts.
TxStartHook = func(vm *VMContext, tx *types.Transaction, from common.Address)

// TxEndHook is called after the execution of a transaction ends.
TxEndHook = func(receipt *types.Receipt, err error)

// EnterHook is invoked when the processing of a message starts.
EnterHook = func(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

// ExitHook is invoked when the processing of a message ends.
ExitHook = func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

// OpcodeHook is invoked just prior to the execution of an opcode.
OpcodeHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

// FaultHook is invoked when an error occurs during the execution of an opcode.
FaultHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)

// GasChangeHook is invoked when the gas changes.
GasChangeHook = func(old, new uint64, reason GasChangeReason)
```

**VM Context** - `/go-ethereum/core/tracing/hooks.go` (lines 60-68):
```go
// VMContext provides the context for the EVM execution.
type VMContext struct {
	Coinbase    common.Address
	BlockNumber *big.Int
	Time        uint64
	Random      *common.Hash
	BaseFee     *big.Int
	StateDB     StateDB
}
```

## References

- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155)
- [Geth debug tracing](https://geth.ethereum.org/docs/developers/evm-tracing)
- [OpenEthereum tracing](https://openethereum.github.io/JSONRPC-trace-module)