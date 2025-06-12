# Implement Comprehensive Tracing

You are implementing Comprehensive Tracing for the Tevm EVM written in Zig. Your goal is to implement comprehensive execution tracing and debugging tools following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_comprehensive_tracing` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_comprehensive_tracing feat_implement_comprehensive_tracing`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement comprehensive execution tracing for debugging and monitoring EVM execution. This enables step-by-step tracking of opcodes, stack, memory, and state changes.

## ELI5

Think of comprehensive tracing as having a detailed security camera system and activity log for everything that happens when a smart contract runs. Just like how a security system records who enters a building, when they entered, what rooms they visited, and what they did there, EVM tracing records every single step a smart contract takes during execution. The enhanced version is like upgrading from basic security cameras to a forensic investigation suite: it doesn't just record what happened, but also tracks the "why" behind each action, monitors resource usage (like gas consumption), provides slow-motion replay capabilities for debugging, and can even predict potential issues before they become problems. This is essential for developers who need to understand why their smart contract failed, optimize performance, or prove that their code is working correctly - it's like having a flight recorder for blockchain transactions.

## Implementation Requirements

### Core Functionality
1. **Opcode Tracing**: Track every executed opcode with context
2. **Stack Monitoring**: Record stack state at each step
3. **Memory Tracking**: Monitor memory reads and writes
4. **State Changes**: Track storage and account modifications
5. **Gas Accounting**: Detailed gas consumption per operation

## Critical Constraints
❌ NEVER commit until all tests pass with `zig build test-all`
❌ DO NOT merge without review
✅ MUST follow Zig style conventions (snake_case, no inline keyword)
✅ MUST validate against Ethereum specifications exactly
✅ MUST maintain compatibility with existing implementations
✅ MUST handle all edge cases and error conditions

## Success Criteria
✅ All tests pass with `zig build test-all`
✅ Implementation matches Ethereum specification exactly
✅ Input validation handles all edge cases
✅ Output format matches reference implementations
✅ Performance meets or exceeds benchmarks
✅ Gas costs are calculated correctly


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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/tracing/comprehensive_tracing_test.zig`)
```zig
// Test basic tracing functionality
test "execution_tracer basic functionality with known scenarios"
test "execution_tracer handles edge cases correctly"
test "execution_tracer validates input parameters"
test "execution_tracer produces correct output format"
test "opcode_tracer tracks opcodes correctly"
test "stack_tracer monitors stack changes"
test "memory_tracer tracks memory operations"
test "state_tracer records state modifications"
```

#### 2. **Integration Tests**
```zig
test "tracing_system integrates with EVM execution context"
test "tracing_system works with existing EVM systems"
test "tracing_system maintains compatibility with hardforks"
test "tracing_system handles system-level interactions"
test "tracing_output integrates with debugging tools"
test "trace_collection preserves execution semantics"
test "trace_filtering works with complex scenarios"
test "trace_export handles large trace datasets"
```

#### 3. **Functional Tests**
```zig
test "tracing_system end-to-end functionality works correctly"
test "tracing_system handles realistic usage scenarios"
test "tracing_system maintains behavior under load"
test "tracing_system processes complex inputs correctly"
test "eip3155_tracing produces specification-compliant output"
test "geth_style_tracing matches reference implementation"
test "custom_tracing supports user-defined tracers"
test "structured_logs maintain correct format"
```

#### 4. **Performance Tests**
```zig
test "tracing_system meets performance requirements"
test "tracing_system memory usage within bounds"
test "tracing_system scalability with large traces"
test "tracing_system benchmark against baseline"
test "trace_compression reduces memory footprint"
test "trace_buffering improves throughput"
test "selective_tracing minimizes overhead"
test "trace_streaming handles real-time output"
```

#### 5. **Error Handling Tests**
```zig
test "tracing_system error propagation works correctly"
test "tracing_system proper error types and messages"
test "tracing_system graceful handling of invalid inputs"
test "tracing_system recovery from failure states"
test "trace_validation rejects malformed traces"
test "trace_collection handles memory exhaustion"
test "trace_export handles file system errors"
test "trace_import validates input format"
```

#### 6. **Compatibility Tests**
```zig
test "tracing_system maintains EVM specification compliance"
test "tracing_system cross-client behavior consistency"
test "tracing_system backward compatibility preserved"
test "tracing_system platform-specific behavior verified"
test "trace_format matches EIP-3155 specification"
test "trace_output compatible with debugging tools"
test "trace_semantics consistent across hardforks"
test "trace_data preserves execution accuracy"
```

### Test Development Priority
1. **Start with core functionality** - Ensure basic opcode and stack tracing works correctly
2. **Add integration tests** - Verify system-level interactions with EVM execution
3. **Implement performance tests** - Meet efficiency requirements for trace collection
4. **Add error handling tests** - Robust failure management for trace operations
5. **Test edge cases** - Handle boundary conditions like memory limits and deep traces
6. **Verify compatibility** - Ensure EIP-3155 compliance and cross-client consistency

### Test Data Sources
- **EIP-3155 specification requirements**: Trace format and content verification
- **Reference implementation data**: Cross-client compatibility testing
- **Performance benchmarks**: Trace collection efficiency baseline
- **Real-world transaction traces**: Production use case validation
- **Synthetic trace scenarios**: Edge condition and stress testing

### Continuous Testing
- Run `zig build test-all` after every code change
- Ensure 100% test coverage for all public APIs
- Validate performance benchmarks don't regress
- Test both debug and release builds
- Verify cross-platform compatibility

### Test-First Examples

**Before writing any implementation:**
```zig
test "execution_tracer basic functionality" {
    // This test MUST fail initially
    const allocator = testing.allocator;
    const context = test_utils.createTestEVMContext(allocator);
    defer context.deinit();
    
    var tracer = ExecutionTracer.init(allocator, TracingConfig.default());
    defer tracer.deinit();
    
    const opcode = 0x01; // ADD
    const gas_cost = 3;
    const stack_before = test_data.initial_stack;
    const stack_after = test_data.result_stack;
    
    try tracer.traceOpcode(context, opcode, gas_cost, stack_before, stack_after);
    const trace = tracer.getTrace();
    
    try testing.expectEqual(1, trace.steps.len);
    try testing.expectEqual(opcode, trace.steps[0].opcode);
    try testing.expectEqual(gas_cost, trace.steps[0].gas_cost);
}
```

**Only then implement:**
```zig
pub const ExecutionTracer = struct {
    pub fn traceOpcode(self: *ExecutionTracer, context: *EVMContext, opcode: u8, gas_cost: u64, stack_before: []const U256, stack_after: []const U256) !void {
        // Minimal implementation to make test pass
        return error.NotImplemented; // Initially
    }
};
```

### Critical Testing Requirements
- **Never commit until all tests pass** with `zig build test-all`
- **Test trace format compliance** - Ensure EIP-3155 specification adherence
- **Verify trace accuracy** - Traces must reflect actual execution accurately
- **Test cross-platform trace behavior** - Ensure consistent results across platforms
- **Validate integration points** - Test all external interfaces thoroughly

## References

- [EIP-3155: EVM trace specification](https://eips.ethereum.org/EIPS/eip-3155)
- [Geth debug tracing](https://geth.ethereum.org/docs/developers/evm-tracing)
- [OpenEthereum tracing](https://openethereum.github.io/JSONRPC-trace-module)

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/v0.11.0/include/evmone/tracing.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/bytes.hpp>
#include <evmc/evmc.h>
#include <evmc/utils.h>
#include <intx/intx.hpp>
#include <memory>
#include <ostream>
#include <string_view>

namespace evmone
{
using evmc::bytes_view;
class ExecutionState;

class Tracer
{
    friend class VM;  // Has access the m_next_tracer to traverse the list forward.
    std::unique_ptr<Tracer> m_next_tracer;

public:
    virtual ~Tracer() = default;

    void notify_execution_start(  // NOLINT(misc-no-recursion)
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept
    {
        on_execution_start(rev, msg, code);
        if (m_next_tracer)
            m_next_tracer->notify_execution_start(rev, msg, code);
    }

    void notify_execution_end(const evmc_result& result) noexcept  // NOLINT(misc-no-recursion)
    {
        on_execution_end(result);
        if (m_next_tracer)
            m_next_tracer->notify_execution_end(result);
    }

    void notify_instruction_start(  // NOLINT(misc-no-recursion)
        uint32_t pc, intx::uint256* stack_top, int stack_height, int64_t gas,
        const ExecutionState& state) noexcept
    {
        on_instruction_start(pc, stack_top, stack_height, gas, state);
        if (m_next_tracer)
            m_next_tracer->notify_instruction_start(pc, stack_top, stack_height, gas, state);
    }

private:
    virtual void on_execution_start(
        evmc_revision rev, const evmc_message& msg, bytes_view code) noexcept = 0;
    virtual void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept = 0;
    virtual void on_execution_end(const evmc_result& result) noexcept = 0;
};

/// Creates the "histogram" tracer which counts occurrences of individual opcodes during execution
/// and reports this data in CSV format.
///
/// @param out  Report output stream.
/// @return     Histogram tracer object.
EVMC_EXPORT std::unique_ptr<Tracer> create_histogram_tracer(std::ostream& out);

EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);

}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.11.0/lib/evmone/execution_state.hpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2019 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <evmc/evmc.hpp>
#include <intx/intx.hpp>
#include <exception>
#include <memory>
#include <string>
#include <vector>

namespace evmone
{
namespace advanced
{
struct AdvancedCodeAnalysis;
}
namespace baseline
{
class CodeAnalysis;
}

using evmc::bytes;
using evmc::bytes_view;
using intx::uint256;


/// Provides memory for EVM stack.
class StackSpace
{
    // ... implementation details ...
public:
    /// The maximum number of EVM stack items.
    static constexpr auto limit = 1024;
    // ...
};


/// The EVM memory.
class Memory
{
    // ... implementation details ...
public:
    uint8_t& operator[](size_t index) noexcept { return m_data[index]; }
    [[nodiscard]] const uint8_t* data() const noexcept { return m_data.get(); }
    [[nodiscard]] size_t size() const noexcept { return m_size; }
    void grow(size_t new_size) noexcept;
    void clear() noexcept { m_size = 0; }
};

/// Generic execution state for generic instructions implementations.
class ExecutionState
{
public:
    int64_t gas_refund = 0;
    Memory memory;
    const evmc_message* msg = nullptr;
    evmc::HostContext host;
    evmc_revision rev = {};
    bytes return_data;

    /// Reference to original EVM code container.
    bytes_view original_code;

    evmc_status_code status = EVMC_SUCCESS;
    size_t output_offset = 0;
    size_t output_size = 0;
    // ...
    StackSpace stack_space;

    ExecutionState(const evmc_message& message, evmc_revision revision,
        const evmc_host_interface& host_interface, evmc_host_context* host_ctx,
        bytes_view _code) noexcept
      : msg{&message}, host{host_interface, host_ctx}, rev{revision}, original_code{_code}
    {}

    // ...
    const evmc_tx_context& get_tx_context() noexcept;
    // ...
};
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.11.0/lib/evmone/tracing.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2021 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "tracing.hpp"
#include "execution_state.hpp"
#include "instructions_traits.hpp"
#include <evmc/hex.hpp>
#include <stack>

namespace evmone
{
namespace
{
// ...

class InstructionTracer : public Tracer
{
    struct Context
    {
        const int32_t depth;
        const uint8_t* const code;  ///< Reference to the code being executed.
        const int64_t start_gas;

        Context(int32_t d, const uint8_t* c, int64_t g) noexcept : depth{d}, code{c}, start_gas{g}
        {}
    };

    std::stack<Context> m_contexts;
    std::ostream& m_out;  ///< Output stream.

    void output_stack(const intx::uint256* stack_top, int stack_height)
    {
        m_out << R"(,"stack":[)";
        const auto stack_end = stack_top + 1;
        const auto stack_begin = stack_end - stack_height;
        for (auto it = stack_begin; it != stack_end; ++it)
        {
            if (it != stack_begin)
                m_out << ',';
            m_out << R"("0x)" << to_string(*it, 16) << '"';
        }
        m_out << ']';
    }

    void on_execution_start(
        evmc_revision /*rev*/, const evmc_message& msg, bytes_view code) noexcept override
    {
        m_contexts.emplace(msg.depth, code.data(), msg.gas);
    }

    void on_instruction_start(uint32_t pc, const intx::uint256* stack_top, int stack_height,
        int64_t gas, const ExecutionState& state) noexcept override
    {
        const auto& ctx = m_contexts.top();

        const auto opcode = ctx.code[pc];
        m_out << "{";
        m_out << R"("pc":)" << std::dec << pc;
        m_out << R"(,"op":)" << std::dec << int{opcode};
        m_out << R"(,"gas":"0x)" << std::hex << gas << '"';
        m_out << R"(,"gasCost":"0x)" << std::hex << instr::gas_costs[state.rev][opcode] << '"';

        // Full memory can be dumped as evmc::hex({state.memory.data(), state.memory.size()}),
        // but this should not be done by default. Adding --tracing=+memory option would be nice.
        m_out << R"(,"memSize":)" << std::dec << state.memory.size();

        output_stack(stack_top, stack_height);
        if (!state.return_data.empty())
            m_out << R"(,"returnData":"0x)" << evmc::hex(state.return_data) << '"';
        m_out << R"(,"depth":)" << std::dec << (ctx.depth + 1);
        m_out << R"(,"refund":)" << std::dec << state.gas_refund;
        m_out << R"(,"opName":")" << get_name(opcode) << '"';

        m_out << "}\n";
    }

    void on_execution_end(const evmc_result& /*result*/) noexcept override { m_contexts.pop(); }

public:
    explicit InstructionTracer(std::ostream& out) noexcept : m_out{out}
    {
        m_out << std::dec;  // Set number formatting to dec, JSON does not support other forms.
    }
};
}  // namespace

// ...

std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out)
{
    return std::make_unique<InstructionTracer>(out);
}
}  // namespace evmone
```
</file>
<file path="https://github.com/ethereum/evmone/blob/v0.11.0/lib/evmone/baseline_execution.cpp">
```cpp
// evmone: Fast Ethereum Virtual Machine implementation
// Copyright 2020 The evmone Authors.
// SPDX-License-Identifier: Apache-2.0

#include "baseline.hpp"
#include "baseline_instruction_table.hpp"
#include "eof.hpp"
#include "execution_state.hpp"
#include "instructions.hpp"
#include "vm.hpp"
#include <memory>

// ...

namespace evmone::baseline
{
namespace
{
// ...

template <bool TracingEnabled>
int64_t dispatch(const CostTable& cost_table, ExecutionState& state, int64_t gas,
    const uint8_t* code, Tracer* tracer = nullptr) noexcept
{
    const auto stack_bottom = state.stack_space.bottom();

    // Code iterator and stack top pointer for interpreter loop.
    Position position{code, stack_bottom};

    while (true)  // Guaranteed to terminate because padded code ends with STOP.
    {
        if constexpr (TracingEnabled)
        {
            const auto offset = static_cast<uint32_t>(position.code_it - code);
            const auto stack_height = static_cast<int>(position.stack_end - stack_bottom);
            if (offset < state.original_code.size())  // Skip STOP from code padding.
            {
                tracer->notify_instruction_start(
                    offset, position.stack_end - 1, stack_height, gas, state);
            }
        }

        const auto op = *position.code_it;
        switch (op)
        {
#define ON_OPCODE(OPCODE)                                                                     \
    case OPCODE:                                                                              \
        ASM_COMMENT(OPCODE);                                                                  \
        if (const auto next = invoke<OPCODE>(cost_table, stack_bottom, position, gas, state); \
            next.code_it == nullptr)                                                          \
        {                                                                                     \
            return gas;                                                                       \
        }                                                                                     \
        else                                                                                  \
        {                                                                                     \
            /* Update current position only when no error,                                    \
               this improves compiler optimization. */                                        \
            position = next;                                                                  \
        }                                                                                     \
        break;

            MAP_OPCODES
#undef ON_OPCODE

        default:
            state.status = EVMC_UNDEFINED_INSTRUCTION;
            return gas;
        }
    }
    intx::unreachable();
}
// ...
}  // namespace

evmc_result execute(VM& vm, const evmc_host_interface& host, evmc_host_context* ctx,
    evmc_revision rev, const evmc_message& msg, const CodeAnalysis& analysis) noexcept
{
    const auto code = analysis.executable_code();
    const auto code_begin = code.data();
    auto gas = msg.gas;

    auto& state = vm.get_execution_state(static_cast<size_t>(msg.depth));
    state.reset(msg, rev, host, ctx, analysis.raw_code());

    state.analysis.baseline = &analysis;  // Assign code analysis for instruction implementations.

    const auto& cost_table = get_baseline_cost_table(state.rev, analysis.eof_header().version);

    auto* tracer = vm.get_tracer();
    if (INTX_UNLIKELY(tracer != nullptr))
    {
        tracer->notify_execution_start(state.rev, *state.msg, code);
        gas = dispatch<true>(cost_table, state, gas, code_begin, tracer);
    }
    else
    {
// ...
        gas = dispatch<false>(cost_table, state, gas, code_begin);
    }

    const auto gas_left = (state.status == EVMC_SUCCESS || state.status == EVMC_REVERT) ? gas : 0;
    const auto gas_refund = (state.status == EVMC_SUCCESS) ? state.gas_refund : 0;

    assert(state.output_size != 0 || state.output_offset == 0);
    const auto result =
        (state.deploy_container.has_value() ?
                evmc::make_result(state.status, gas_left, gas_refund,
                    state.deploy_container->data(), state.deploy_container->size()) :
                evmc::make_result(state.status, gas_left, gas_refund,
                    state.output_size != 0 ? &state.memory[state.output_offset] : nullptr,
                    state.output_size));

    if (INTX_UNLIKELY(tracer != nullptr))
        tracer->notify_execution_end(result);

    return result;
}
// ...
}  // namespace evmone::baseline
```
</file>
</evmone>




## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
/// EVM hooks into execution.
///
/// This trait is used to enabled tracing of the EVM execution.
///
/// Object that is implemented this trait is used in `InspectorHandler` to trace the EVM execution.
/// And API that allow calling the inspector can be found in [`crate::InspectEvm`] and [`crate::InspectCommitEvm`].
#[auto_impl(&mut, Box)]
pub trait Inspector<CTX, INTR: InterpreterTypes = EthInterpreter> {
    /// Called before the interpreter is initialized.
    ///
    // If `interp.instruction_result` is set to anything other than [`interpreter::InstructionResult::Continue`]
    /// then the execution of the interpreter is skipped.
    #[inline]
    fn initialize_interp(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called on each step of the interpreter.
    ///
    /// Information about the current execution, including the memory, stack and more is available
    /// on `interp` (see [Interpreter]).
    ///
    /// # Example
    ///
    /// To get the current opcode, use `interp.current_opcode()`.
    #[inline]
    fn step(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called after `step` when the instruction has been executed.
    ///
    /// Setting `interp.instruction_result` to anything other than [`interpreter::InstructionResult::Continue`]
    /// alters the execution of the interpreter.
    #[inline]
    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        let _ = interp;
        let _ = context;
    }

    /// Called when a log is emitted.
    #[inline]
    fn log(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX, log: Log) {
        let _ = interp;
        let _ = context;
        let _ = log;
    }

    /// Called whenever a call to a contract is about to start.
    ///
    /// InstructionResulting anything other than [`interpreter::InstructionResult::Continue`] overrides the result of the call.
    #[inline]
    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        let _ = context;
        let _ = inputs;
        None
    }

    /// Called when a call to a contract has concluded.
    ///
    /// The returned [CallOutcome] is used as the result of the call.
    ///
    /// This allows the inspector to modify the given `result` before returning it.
    #[inline]
    fn call_end(&mut self, context: &mut CTX, inputs: &CallInputs, outcome: &mut CallOutcome) {
        let _ = context;
        let _ = inputs;
        let _ = outcome;
    }

    /// Called when a contract is about to be created.
    ///
    /// If this returns `Some` then the [CreateOutcome] is used to override the result of the creation.
    ///
    /// If this returns `None` then the creation proceeds as normal.
    #[inline]
    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        let _ = context;
        let _ = inputs;
        None
    }

    /// Called when a contract has been created.
    ///
    /// InstructionResulting anything other than the values passed to this function (`(ret, remaining_gas,
    /// address, out)`) will alter the result of the create.
    #[inline]
    fn create_end(
        &mut self,
        context: &mut CTX,
        inputs: &CreateInputs,
        outcome: &mut CreateOutcome,
    ) {
        let _ = context;
        let _ = inputs;
        let _ = outcome;
    }
...
    /// Called when a contract has been self-destructed with funds transferred to target.
    #[inline]
    fn selfdestruct(&mut self, contract: Address, target: Address, value: U256) {
        let _ = contract;
        let _ = target;
        let _ = value;
    }
}

/// Extends the journal with additional methods that are used by the inspector.
#[auto_impl(&mut, Box)]
pub trait JournalExt {
    /// Get all logs from the journal.
    fn logs(&self) -> &[Log];

    /// Get the journal entries that are created from last checkpoint.
    /// new checkpoint is created when sub call is made.
    fn journal(&self) -> &[JournalEntry];

    /// Return the current Journaled state.
    fn evm_state(&self) -> &EvmState;

    /// Return the mutable current Journaled state.
    fn evm_state_mut(&mut self) -> &mut EvmState;
}

impl<DB: Database> JournalExt for Journal<DB> {
    #[inline]
    fn logs(&self) -> &[Log] {
        &self.logs
    }

    #[inline]
    fn journal(&self) -> &[JournalEntry] {
        &self.journal
    }

    #[inline]
    fn evm_state(&self) -> &EvmState {
        &self.state
    }

    #[inline]
    fn evm_state_mut(&mut self) -> &mut EvmState {
        &mut self.state
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/handler.rs">
```rust
/// Run Interpreter loop with inspection support.
///
/// This function is used to inspect the Interpreter loop.
/// It will call [`Inspector::step`] and [`Inspector::step_end`] after each instruction.
/// And [`Inspector::log`],[`Inspector::selfdestruct`] for each log and selfdestruct instruction.
pub fn inspect_instructions<CTX, IT>(
    context: &mut CTX,
    interpreter: &mut Interpreter<IT>,
    mut inspector: impl Inspector<CTX, IT>,
    instructions: &InstructionTable<IT, CTX>,
) -> InterpreterAction
where
    CTX: ContextTr<Journal: JournalExt> + Host,
    IT: InterpreterTypes,
{
    interpreter.reset_control();

    let mut log_num = context.journal().logs().len();
    // Main loop
    while interpreter.control.instruction_result().is_continue() {
        // Get current opcode.
        let opcode = interpreter.bytecode.opcode();

        // Call Inspector step.
        inspector.step(interpreter, context);
        if interpreter.control.instruction_result() != InstructionResult::Continue {
            break;
        }

        // SAFETY: In analysis we are doing padding of bytecode so that we are sure that last
        // byte instruction is STOP so we are safe to just increment program_counter bcs on last instruction
        // it will do noop and just stop execution of this contract
        interpreter.bytecode.relative_jump(1);

        // Execute instruction.
        let instruction_context = InstructionContext {
            interpreter,
            host: context,
        };
        instructions[opcode as usize](instruction_context);

        // check if new log is added
        let new_log = context.journal().logs().len();
        if log_num < new_log {
            // as there is a change in log number this means new log is added
            let log = context.journal().logs().last().unwrap().clone();
            inspector.log(interpreter, context, log);
            log_num = new_log;
        }

        // Call step_end.
        inspector.step_end(interpreter, context);
    }
...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/eip3155.rs">
```rust
/// [EIP-3155](https://eips.ethereum.org/EIPS/eip-3155) tracer [Inspector].
pub struct TracerEip3155 {
    output: Box<dyn Write>,
    gas_inspector: GasInspector,
    /// Print summary of the execution.
    print_summary: bool,
    stack: Vec<U256>,
    pc: u64,
    section: Option<u64>,
    function_depth: Option<u64>,
    opcode: u8,
    gas: u64,
    refunded: i64,
    mem_size: usize,
    skip: bool,
    include_memory: bool,
    memory: Option<String>,
}

// # Output
// The CUT MUST output a `json` object for EACH operation.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Output<'a> {
    // Required fields:
    /// Program counter
    pc: u64,
    /// EOF code section
    #[serde(default, skip_serializing_if = "Option::is_none")]
    section: Option<u64>,
    /// OpCode
    op: u8,
    /// Gas left before executing this operation
    #[serde(serialize_with = "serde_hex_u64")]
    gas: u64,
    /// Gas cost of this operation
    #[serde(serialize_with = "serde_hex_u64")]
    gas_cost: u64,
    /// Array of all values on the stack
    stack: &'a [U256],
    /// Depth of the call stack
    depth: u64,
...
    /// Size of memory array
    #[serde(serialize_with = "serde_hex_u64")]
    mem_size: u64,

    // Optional fields:
    /// Name of the operation
    #[serde(default, skip_serializing_if = "Option::is_none")]
    op_name: Option<&'static str>,
    /// Description of an error (should contain revert reason if supported)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    error: Option<String>,
    /// Array of all allocated values
    #[serde(default, skip_serializing_if = "Option::is_none")]
    memory: Option<String>,
    /// Array of all stored values
    #[serde(default, skip_serializing_if = "Option::is_none")]
    storage: Option<HashMap<String, String>>,
...
}

impl<CTX, INTR> Inspector<CTX, INTR> for TracerEip3155
where
    CTX: ContextTr,
    INTR: InterpreterTypes<Stack: StackTr + CloneStack>,
{
...
    fn step(&mut self, interp: &mut Interpreter<INTR>, _: &mut CTX) {
        self.gas_inspector.step(interp.control.gas());
        self.stack.clear();
        interp.stack.clone_into(&mut self.stack);
        self.memory = if self.include_memory {
            Some(hex::encode_prefixed(
                interp.memory.slice(0..interp.memory.size()).as_ref(),
            ))
        } else {
            None
        };
        self.pc = interp.bytecode.pc() as u64;
        self.section = if interp.runtime_flag.is_eof() {
            Some(interp.sub_routine.routine_idx() as u64)
        } else {
            None
        };
...
        self.opcode = interp.bytecode.opcode();
        self.mem_size = interp.memory.size();
        self.gas = interp.control.gas().remaining();
        self.refunded = interp.control.gas().refunded();
    }

    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        self.gas_inspector.step_end(interp.control.gas_mut());
...
        let value = Output {
            pc: self.pc,
            section: self.section,
            op: self.opcode,
            gas: self.gas,
            gas_cost: self.gas_inspector.last_gas_cost(),
            stack: &self.stack,
            depth: context.journal().depth() as u64,
            function_depth: self.function_depth,
            return_data: "0x",
            refund: self.refunded as u64,
            mem_size: self.mem_size as u64,

            op_name: OpCode::new(self.opcode).map(|i| i.as_str()),
            error: (!interp.control.instruction_result().is_ok())
                .then(|| format!("{:?}", interp.control.instruction_result())),
            memory: self.memory.take(),
            storage: None,
            return_stack: None,
        };
        let _ = write_value(&mut self.output, &value);
    }
...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct Interpreter<WIRE: InterpreterTypes = EthInterpreter> {
    pub bytecode: WIRE::Bytecode,
    pub stack: WIRE::Stack,
    pub return_data: WIRE::ReturnData,
    pub memory: WIRE::Memory,
    pub input: WIRE::Input,
    pub sub_routine: WIRE::SubRoutineStack,
    pub control: WIRE::Control,
    pub runtime_flag: WIRE::RuntimeFlag,
    pub extend: WIRE::Extend,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/stack.rs">
```rust
/// EVM stack with [STACK_LIMIT] capacity of words.
#[derive(Debug, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize))]
pub struct Stack {
    /// The underlying data of the stack.
    data: Vec<U256>,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter/shared_memory.rs">
```rust
/// A sequential memory shared between calls, which uses
/// a `Vec` for internal representation.
/// A [SharedMemory] instance should always be obtained using
/// the `new` static method to ensure memory safety.
#[derive(Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct SharedMemory {
    /// The underlying buffer.
    buffer: Rc<RefCell<Vec<u8>>>,
    /// Memory checkpoints for each depth.
    /// Invariant: these are always in bounds of `data`.
    my_checkpoint: usize,
    /// Child checkpoint that we need to free context to.
    child_checkpoint: Option<usize>,
    /// Memory limit. See [`Cfg`](context_interface::Cfg).
    #[cfg(feature = "memory_limit")]
    memory_limit: u64,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
/// Represents the state of gas during execution.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Gas {
    /// The initial gas limit. This is constant throughout execution.
    limit: u64,
    /// The remaining gas.
    remaining: u64,
    /// Refunded gas. This is used only at the end of execution.
    refunded: i64,
    /// Memoisation of values for memory expansion cost.
    memory: MemoryGas,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/context/src/journal/entry.rs">
```rust
/// Journal entries that are used to track changes to the state and are used to revert it.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum JournalEntry {
    /// Used to mark account that is warm inside EVM in regard to EIP-2929 AccessList.
    /// Action: We will add Account to state.
    /// Revert: we will remove account from state.
    AccountWarmed {
        /// Address of warmed account.
        address: Address,
    },
    /// Mark account to be destroyed and journal balance to be reverted
    /// Action: Mark account and transfer the balance
    /// Revert: Unmark the account and transfer balance back
    AccountDestroyed {
        /// Balance of account got transferred to target.
        had_balance: U256,
        /// Address of account to be destroyed.
        address: Address,
        /// Address of account that received the balance.
        target: Address,
        /// Whether the account had already been destroyed before this journal entry.
        was_destroyed: bool,
    },
    /// Loading account does not mean that account will need to be added to MerkleTree (touched).
    /// Only when account is called (to execute contract or transfer balance) only then account is made touched.
    /// Action: Mark account touched
    /// Revert: Unmark account touched
    AccountTouched {
        /// Address of account that is touched.
        address: Address,
    },
    /// Balance changed
    /// Action: Balance changed
    /// Revert: Revert to previous balance
    BalanceChange {
        /// New balance of account.
        old_balance: U256,
        /// Address of account that had its balance changed.
        address: Address,
    },
    /// Transfer balance between two accounts
    /// Action: Transfer balance
    /// Revert: Transfer balance back
    BalanceTransfer {
        /// Balance that is transferred.
        balance: U256,
        /// Address of account that sent the balance.
        from: Address,
        /// Address of account that received the balance.
        to: Address,
    },
    /// Increment nonce
    /// Action: Increment nonce by one
    /// Revert: Decrement nonce by one
    NonceChange {
        /// Address of account that had its nonce changed.
        /// Nonce is incremented by one.
        address: Address,
    },
    /// Create account:
    /// Actions: Mark account as created
    /// Revert: Unmark account as created and reset nonce to zero.
    AccountCreated {
        /// Address of account that is created.
        /// On revert, this account will be set to empty.
        address: Address,
    },
    /// Entry used to track storage changes
    /// Action: Storage change
    /// Revert: Revert to previous value
    StorageChanged {
        /// Key of storage slot that is changed.
        key: StorageKey,
        /// Previous value of storage slot.
        had_value: StorageValue,
        /// Address of account that had its storage changed.
        address: Address,
    },
    /// Entry used to track storage warming introduced by EIP-2929.
    /// Action: Storage warmed
    /// Revert: Revert to cold state
    StorageWarmed {
        /// Key of storage slot that is warmed.
        key: StorageKey,
        /// Address of account that had its storage warmed. By SLOAD or SSTORE opcode.
        address: Address,
    },
    /// It is used to track an EIP-1153 transient storage change.
    /// Action: Transient storage changed.
    /// Revert: Revert to previous value.
    TransientStorageChange {
        /// Key of transient storage slot that is changed.
        key: StorageKey,
        /// Previous value of transient storage slot.
        had_value: StorageValue,
        /// Address of account that had its transient storage changed.
        address: Address,
    },
    /// Code changed
    /// Action: Account code changed
    /// Revert: Revert to previous bytecode.
    CodeChange {
        /// Address of account that had its code changed.
        address: Address,
    },
}
```
</file>
</revm>



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals a tracing mechanism based on emitting events at key points during EVM execution. A global tracer function, `evm_trace`, is called with different `TraceEvent` types. A concrete implementation of this tracer can be found in the `t8n` (transition tool) directory, which produces structured JSON logs.

To implement a comprehensive tracer, you will need to:
1.  Define a tracer function that conforms to the `EvmTracer` protocol.
2.  Register your tracer function using `set_evm_trace`.
3.  Process the different `TraceEvent` types to capture opcode, stack, memory, and state information.
4.  The `Evm` dataclass provides the full context at each step, including `pc`, `stack`, `memory`, `gas_left`, and `message` (which contains call context like `caller`, `target`, `value`).

The following files provide the most relevant context for this task.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
"""
Defines the functions required for creating EVM traces during execution.
"""
# ... (imports)

@dataclass
class TransactionStart:
    """
    Trace event that is triggered at the start of a transaction.
    """


@dataclass
class TransactionEnd:
    """
    Trace event that is triggered at the end of a transaction.
    """

    gas_used: int
    output: Bytes
    error: Optional[EthereumException]


@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum


@dataclass
class OpEnd:
    """
    Trace event that is triggered after executing an opcode.
    """


@dataclass
class OpException:
    """
    Trace event that is triggered when an opcode raises an exception.
    """

    error: Exception


@dataclass
class EvmStop:
    """
    Trace event that is triggered when the EVM stops.
    """

    op: enum.Enum


@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """

    gas_cost: int


TraceEvent = Union[
    TransactionStart,
    TransactionEnd,
    # ... (other events like PrecompileStart/End) ...
    OpStart,
    OpEnd,
    OpException,
    EvmStop,
    GasAndRefund,
]
"""
All possible types of events that an [`EvmTracer`] is expected to handle.
"""

class EvmTracer(Protocol):
    """
    [`Protocol`] that describes tracer functions.
    """

    def __call__(
        self,
        evm: object,
        event: TraceEvent,
        /,
        trace_memory: bool = False,
        trace_stack: bool = True,
        trace_return_data: bool = False,
    ) -> None:
        """
        Call `self` as a function, recording a trace event.
        """

# ...

_evm_trace: EvmTracer = discard_evm_trace
"""
Active [`EvmTracer`] that is used for generating traces.
"""

def set_evm_trace(tracer: EvmTracer) -> EvmTracer:
    """
    Change the active [`EvmTracer`] that is used for generating traces.
    """
    global _evm_trace
    old = _evm_trace
    _evm_trace = tracer
    return old


def evm_trace(
    evm: object,
    event: TraceEvent,
    /,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
) -> None:
    """
    Emit a trace to the active [`EvmTracer`].
    """
    global _evm_trace
    _evm_trace(
        evm,
        event,
        trace_memory=trace_memory,
        trace_stack=trace_stack,
        trace_return_data=trace_return_data,
    )
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/evm_trace.py">
```python
"""
The module implements the raw EVM tracer for t8n.
"""
# ... (imports)

@dataclass
class Trace:
    """
    The class implements the raw EVM trace.
    """

    pc: int
    op: Optional[Union[str, int]]
    gas: str
    gasCost: str
    memory: Optional[str]
    memSize: int
    stack: Optional[List[str]]
    returnData: Optional[str]
    depth: int
    refund: int
    opName: str
    gasCostTraced: bool = False
    errorTraced: bool = False
    precompile: bool = False
    error: Optional[str] = None


@dataclass
class FinalTrace:
    """
    The class implements final trace for a tx.
    """

    output: str
    gasUsed: str
    error: Optional[str] = None

# ... (Protocol definitions for Evm, Message, etc.) ...

def evm_trace(
    evm: Any,
    event: TraceEvent,
    trace_memory: bool = False,
    trace_stack: bool = True,
    trace_return_data: bool = False,
    output_basedir: str | TextIO = ".",
) -> None:
    """
    Create a trace of the event.
    """
    # ...
    traces = evm.message.tx_env.traces
    last_trace = None
    if traces:
        last_trace = traces[-1]
    # ...
    if isinstance(event, OpStart):
        op = event.op.value
        # ...
        new_trace = Trace(
            pc=int(evm.pc),
            op=op,
            gas=hex(evm.gas_left),
            gasCost="0x0",
            memory=memory,
            memSize=len_memory,
            stack=stack,
            returnData=return_data,
            depth=int(evm.message.depth) + 1,
            refund=refund_counter,
            opName=str(event.op).split(".")[-1],
        )
        traces.append(new_trace)
    # ...
    elif isinstance(event, GasAndRefund):
        if len(traces) == 0:
            return

        assert isinstance(last_trace, Trace)

        if not last_trace.gasCostTraced:
            last_trace.gasCost = hex(event.gas_cost)
            last_trace.refund = refund_counter
            last_trace.gasCostTraced = True
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
"""
A straightforward interpreter that executes EVM code.
"""
# ... (imports)

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    # ...
    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        # ... more fields
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/gas.py">
```python
"""
Ethereum Virtual Machine (EVM) Gas
"""
# ... (imports)

def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.
    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
```python
"""
Ethereum Virtual Machine (EVM)
"""
# ... (imports)

@dataclass
class TransactionEnvironment:
    """
    Items that are used by contract creation or message call.
    """

    origin: Address
    gas_price: Uint
    gas: Uint
    access_list_addresses: Set[Address]
    access_list_storage_keys: Set[Tuple[Address, Bytes32]]
    transient_storage: "TransientStorage"  # noqa: F821
    blob_versioned_hashes: Tuple[VersionedHash, ...]
    index_in_block: Optional[Uint]
    tx_hash: Optional[Hash32]
    traces: List[dict]


@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    block_env: "BlockEnvironment"
    tx_env: TransactionEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    should_transfer_value: bool
    is_static: bool
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
    parent_evm: Optional["Evm"]


@dataclass
class Evm:
    """The internal state of the virtual machine."""

    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/state.py">
```python
@dataclass
class State:
    """
    Contains all information that is preserved between transactions.
    """

    _main_trie: Trie[Address, Optional[Account]] = field(
        default_factory=lambda: Trie(secured=True, default=None)
    )
    _storage_tries: Dict[Address, Trie[Bytes32, U256]] = field(
        default_factory=dict
    )
    _snapshots: List[
        Tuple[
            Trie[Address, Optional[Account]],
            Dict[Address, Trie[Bytes32, U256]],
        ]
    ] = field(default_factory=list)
    created_accounts: Set[Address] = field(default_factory=set)


def begin_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Start a state transaction.
    """
    state._snapshots.append(
        (
            copy_trie(state._main_trie),
            {k: copy_trie(t) for (k, t) in state._storage_tries.items()},
        )
    )
    transient_storage._snapshots.append(
        {k: copy_trie(t) for (k, t) in transient_storage._tries.items()}
    )


def commit_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Commit a state transaction.
    """
    state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._snapshots.pop()


def rollback_transaction(
    state: State, transient_storage: TransientStorage
) -> None:
    """
    Rollback a state transaction, resetting the state to the point when the
    corresponding `start_transaction()` call was made.
    """
    state._main_trie, state._storage_tries = state._snapshots.pop()
    if not state._snapshots:
        state.created_accounts.clear()

    transient_storage._tries = transient_storage._snapshots.pop()
```
</file>
</execution-specs>
<prompt-corrections>
- The original prompt's reference to `geth`'s `hooks.go` is good, but the `execution-specs` codebase provides a more direct and relevant implementation pattern for Python. The extracted snippets from `ethereum/trace.py` and `ethereum_spec_tools/evm_tools/t8n/evm_trace.py` are closer to what a developer would need to implement this feature within the provided Zig codebase, as they showcase a similar event-driven architecture.
- The `OpContext` and `StateDB` interfaces from `geth` map conceptually to the `Evm` and `Message` dataclasses in `execution-specs`, which provide the necessary context (stack, memory, state access) for tracing.
- The various hook types in `geth` (`OpcodeHook`, `GasChangeHook`, etc.) correspond to the different `TraceEvent` types in `execution-specs` (`OpStart`, `GasAndRefund`, etc.). The core concept of emitting events at specific points in the execution is the same.
</prompt-corrections>

---

An analysis of the `execution-specs` codebase reveals a tracing mechanism that is highly relevant to implementing comprehensive EVM tracing. The core idea is to dispatch tracing events at key points in the execution cycle, such as before and after an opcode is executed, when gas is consumed, or when an exception occurs.

The most relevant files are `interpreter.py`, which shows where to place the tracing calls, and `trace.py`, which defines the structure of the trace events and the data they contain.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
# ./execution-specs/src/ethereum/london/vm/interpreter.py

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    # ... (initialization)

    evm = Evm(
        # ... (Evm fields initialization)
    )
    try:
        if evm.message.code_address in PRE_COMPILED_CONTRACTS:
            evm_trace(evm, PrecompileStart(evm.message.code_address))
            PRE_COMPILED_CONTRACTS[evm.message.code_address](evm)
            evm_trace(evm, PrecompileEnd())
            return evm

        # This is the main execution loop
        while evm.running and evm.pc < ulen(evm.code):
            try:
                op = Ops(evm.code[evm.pc])
            except ValueError:
                raise InvalidOpcode(evm.code[evm.pc])

            # Hook before executing the opcode
            evm_trace(evm, OpStart(op))
            op_implementation[op](evm)
            # Hook after executing the opcode
            evm_trace(evm, OpEnd())

        # Hook on normal stop
        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        # Hook on exceptional halt
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        # Hook on revert
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
# ./execution-specs/src/ethereum/trace.py
# Note: This is a simplified representation of the full trace module.

from dataclasses import dataclass
from typing import TYPE_CHECKING, List, Tuple, Union

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256

if TYPE_CHECKING:
    from ethereum.london.vm import Evm
    from ethereum.london.vm.instructions import Ops


@dataclass
class GasAndRefund:
    """Trace event for gas consumption and refunds."""
    gas_cost: int

@dataclass
class OpStart:
    """Trace event for the start of an opcode execution."""
    op: "Ops"

@dataclass
class OpEnd:
    """Trace event for the end of an opcode execution."""
    pass

@dataclass
class OpException:
    """Trace event for an exception during opcode execution."""
    error: Exception

@dataclass
class EvmStop:
    """Trace event for a normal EVM stop."""
    op: "Ops"

# ... other event types like PrecompileStart, PrecompileEnd, TransactionEnd

def evm_trace(
    evm: "Evm",
    event: Union[
        GasAndRefund,
        OpStart,
        OpEnd,
        OpException,
        EvmStop,
        # ... other events
    ],
) -> None:
    """
    Generates a structured trace for an EVM event.
    """
    if not evm.message.tx_env.traces:
        return

    # A simplified version of what geth's tracer might produce
    # This shows how to construct a structured log for each step
    if isinstance(event, OpStart):
        trace = {}
        trace["pc"] = int(evm.pc)
        trace["op"] = event.op.name
        trace["gas"] = hex(evm.gas_left)
        trace["gasCost"] = hex(0) # Calculated after the fact or via another event
        trace["depth"] = int(evm.message.depth)
        trace["stack"] = [hex(item) for item in evm.stack]
        
        # Memory can be large, so might be omitted or truncated in real tracers
        # For full tracing, it's included here.
        from binascii import hexlify
        trace["memory"] = hexlify(evm.memory).decode()

        evm.message.tx_env.traces[-1]["structLogs"].append(trace)

    elif isinstance(event, GasAndRefund):
        # Update gas cost of the last trace entry
        last_log = evm.message.tx_env.traces[-1]["structLogs"][-1]
        last_log["gasCost"] = hex(
            int(last_log["gasCost"], 16) + event.gas_cost
        )
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
# ./execution-specs/src/ethereum/london/vm/__init__.py

@dataclass
class BlockEnvironment:
    """
    Items external to the virtual machine itself, provided by the environment.
    """
    chain_id: U64
    state: State
    block_gas_limit: Uint
    block_hashes: List[Hash32]
    coinbase: Address
    number: Uint
    base_fee_per_gas: Uint
    time: U256
    difficulty: Uint


@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """
    block_env: BlockEnvironment
    caller: Address
    target: Union[Bytes0, Address]
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code_address: Optional[Address]
    code: Bytes
    depth: Uint
    # ... other fields


@dataclass
class Evm:
    """The internal state of the virtual machine."""
    pc: Uint
    stack: List[U256]
    memory: bytearray
    code: Bytes
    gas_left: Uint
    valid_jump_destinations: Set[Uint]
    logs: Tuple[Log, ...]
    refund_counter: int
    running: bool
    message: Message
    output: Bytes
    accounts_to_delete: Set[Address]
    touched_accounts: Set[Address]
    return_data: Bytes
    error: Optional[EthereumException]
    accessed_addresses: Set[Address]
    accessed_storage_keys: Set[Tuple[Address, Bytes32]]
```
</file>

<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/storage.py">
```python
# ./execution-specs/src/ethereum/london/vm/instructions/storage.py

def sload(evm: Evm) -> None:
    """
    Loads to the stack, the value corresponding to a certain key from the
    storage of the current account.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()

    # GAS
    if (evm.message.current_target, key) in evm.accessed_storage_keys:
        charge_gas(evm, GAS_WARM_ACCESS)
    else:
        evm.accessed_storage_keys.add((evm.message.current_target, key))
        charge_gas(evm, GAS_COLD_SLOAD)

    # OPERATION
    # A state-change hook could be placed here for reads
    value = get_storage(
        evm.message.block_env.state, evm.message.current_target, key
    )

    push(evm.stack, value)

    # ...

def sstore(evm: Evm) -> None:
    """
    Stores a value at a certain key in the current context's storage.
    """
    # STACK
    key = pop(evm.stack).to_be_bytes32()
    new_value = pop(evm.stack)
    
    # ... (gas calculation)

    # OPERATION
    # A state-change hook could be placed here for writes
    set_storage(state, evm.message.current_target, key, new_value)

    # ...
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt's reference to `geth` is excellent. The `execution-specs` provide a complementary, more direct implementation of the same core ideas. Key takeaways for the developer are:

1.  **Central `Evm` Object**: The `Evm` dataclass in `execution-specs` serves the same purpose as the combination of `VMContext` and `OpContext` in `geth`. It holds all the necessary state (stack, memory, pc, gas) and context (caller, address, value) for tracing at each step.

2.  **Event-Driven Tracing**: The `evm_trace` function is the equivalent of `geth`'s hooks. It's called from the main execution loop (`interpreter.py`) on `OpStart` and `OpEnd`, which directly maps to the `OpcodeHook` requirement. It is also called on exceptions (`OpException`), mapping to the `FaultHook` requirement.

3.  **Structured Logs**: The `trace.py` file demonstrates how to build a structured, machine-readable log for each step, including fields like `pc`, `op`, `gas`, `stack`, and `memory`, which fulfills a critical requirement of the prompt.

4.  **State Change Tracing**: While `geth` has hooks for state changes, the `execution-specs` trace at the opcode level. To trace state changes, the implementation should look at the functions that modify state, like `sstore` in `storage.py`, and add tracing calls there. The `SSTORE` operation is a prime candidate for a state change hook, where the address, key, and old/new values can be captured.

By combining the hook-based architecture from `geth` with the concrete data structures and event points from `execution-specs`, a robust and comprehensive tracing system can be built.



## GO-ETHEREUM Context

An excellent and well-structured prompt. The provided context from `go-ethereum/core/tracing/hooks.go` is a great starting point. To fully implement a comprehensive tracer, it's crucial to see how these hooks are called within the EVM interpreter and how a tracer consumes the hook data to produce structured output.

The following files from `go-ethereum` provide this critical implementation context:

1.  `core/vm/interpreter.go`: Shows the main EVM execution loop and where hooks like `CaptureState`, `CaptureEnter`, and `CaptureExit` are invoked.
2.  `eth/tracers/logger/struct_log.go`: Defines the `StructLog` data structure, a perfect example of a structured, machine-readable trace format for each EVM step.
3.  `eth/tracers/logger/logger.go`: Contains the `StructLogger`, a concrete tracer implementation that demonstrates how to capture EVM state (stack, memory, storage) via the `ScopeContext` and format it into `StructLog` entries.
4.  `core/state/hooked_statedb.go`: Illustrates how `StateDB` operations (e.g., `AddBalance`, `SetNonce`) are wrapped to emit state change events to the tracer.
5.  `core/tracing/journal.go`: Details the journaling mechanism that wraps a tracer's state-change hooks. This is essential for correctly handling state rollbacks when a call is reverted, ensuring the trace reflects the final state.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// errExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initial setup)

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		rData       []byte        // last call's return data
		callContext *callCtx
	)
	// Don't bother memory mapping for code less than 2KB.
	if len(contract.Code) > 2048 {
		in.code.Set(contract.Code)
	} else {
		in.code.Set(nil)
	}

	// The Interpreter main run loop. This loop will continue until execution of
	// the contract is completed or an error is returned.
	for {
		// ... (stack validation and gas checks)

		// Get the operation from the jump table and validate the stack.
		op = contract.GetOp(pc)
		cost, err = op.GasCost(in.evm, contract, stack, mem, op)
		if err != nil {
			return nil, err
		}

		if in.tracer != nil {
			in.tracer.CaptureState(pc, op, gas, cost, in.scope, rData, in.evm.depth, err)
		}
		// ... (opcode execution logic)
	}
...
}

// call can be used to call a contract, account or precompiled contract.
func (in *EVMInterpreter) call(contract *Contract, callee common.Address, op OpCode, gas, value *uint256.Int, args []byte, isstatic bool) (ret []byte, remainingGas uint64, err error) {
	in.evm.depth++
	defer func() { in.evm.depth-- }()
...
	if in.tracer != nil {
		in.tracer.CaptureEnter(op, contract.Address(), callee, args, gas, value.ToBig())
	}
	ret, remainingGas, err = in.evm.Call(contract, callee, args, gas, value.ToBig(), isstatic)
	if in.tracer != nil {
		in.tracer.CaptureExit(ret, remainingGas, err)
	}
	return ret, remainingGas, err
}

// create can be used to create a new contract.
func (in *EVMInterpreter) create(contract *Contract, op OpCode, gas, value *uint256.Int, args []byte, isCreate2 bool, salt common.Hash) (ret []byte, cretaddr common.Address, remainingGas uint64, err error) {
	in.evm.depth++
	defer func() { in.evm.depth-- }()
...
	if in.tracer != nil {
		in.tracer.CaptureEnter(op, contract.Address(), cretaddr, args, gas, value.ToBig())
	}
	if isCreate2 {
		ret, cretaddr, remainingGas, err = in.evm.Create2(contract, args, gas, value.ToBig(), salt)
	} else {
		ret, cretaddr, remainingGas, err = in.evm.Create(contract, args, gas, value.ToBig())
	}
	if in.tracer != nil {
		in.tracer.CaptureExit(ret, remainingGas, err)
	}
	return ret, cretaddr, remainingGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/struct_log.go">
```go
// Copyright 2017 The go-ethereum Authors
// This file is part of the go-ethereum library.
...

package logger

import (
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/ethereum/go-ethereum/core/vm"
)

// StructLog is emitted to the EVM logger on every step of the EVM.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        hexutil.Bytes               `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*math.HexOrDecimal256     `json:"stack,omitempty"`
	ReturnData    hexutil.Bytes               `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
	OpName        string                      `json:"opName"` // TODO: remove this and infer from opcode
	ErrorString   string                      `json:"error,omitempty"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a EVM state logger and implements Tracer.
//
// StructLogger can be used to capture execution traces of a transaction, and
// is useful for debugging. It is the default tracer used in Geth.
type StructLogger struct {
	cfg Config

	storage map[common.Address]map[common.Hash]common.Hash
	logs    []StructLog
	output  []byte
	err     error

	mem         *vm.Memory
	stack       *vm.Stack
	rStack      []*big.Int // a stack for recording the stack items, avoiding memory copy
	callStack   []common.Address
	initReverted bool
}
...
// CaptureState captures all structured logs by opcodes since the last capture.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// check if the tracer wants to be aborted
	if l.err != nil {
		return
	}
	// capture memory
	var memory []byte
	if !l.cfg.DisableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// capture stack
	var stack []*big.Int
	if !l.cfg.DisableStack {
		l.rStack = l.rStack[:0]
		for _, item := range scope.Stack.Data() {
			l.rStack = append(l.rStack, item.ToBig())
		}
		stack = l.rStack
	}
	// capture storage
	var storage map[common.Hash]common.Hash
	if !l.cfg.DisableStorage {
		// Only create a new map if the storage has changed
		if l.storage == nil {
			l.storage = make(map[common.Address]map[common.Hash]common.Hash)
		}
		addr := scope.Contract.Address()
		if _, ok := l.storage[addr]; !ok {
			l.storage[addr] = make(map[common.Hash]common.Hash)
		}
		scope.Contract.ForEachStorage(func(key, value common.Hash) bool {
			if l.storage[addr][key] != value {
				l.storage[addr][key] = value
			}
			return true
		})
		storage = l.storage[addr]
	}

	// create a log item
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    rData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: scope.Contract.Gas,
		Err:           err,
	}
	l.logs = append(l.logs, log)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/hooked_statedb.go">
```go
// HookedStateDB is a StateDB that calls hooks on state transitions.
type HookedStateDB struct {
	StateDB
	hooks *tracing.Hooks
}

// NewHookedState wraps a StateDB in a HookedStateDB.
func NewHookedState(db StateDB, hooks *tracing.Hooks) StateDB {
	hsdb := &HookedStateDB{
		StateDB: db,
		hooks:   hooks,
	}
	if hooks == nil || (hooks.OnBalanceChange == nil && hooks.OnNonceChange == nil && hooks.OnNonceChangeV2 == nil &&
		hooks.OnCodeChange == nil && hooks.OnStorageChange == nil) {
		return db
	}
	return hsdb
}

// AddBalance adds amount to the account associated with addr.
func (h *HookedStateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) {
	if amount.IsZero() {
		return
	}
	prev := h.StateDB.GetBalance(addr)
	h.StateDB.AddBalance(addr, amount, reason)
	if h.hooks.OnBalanceChange != nil {
		h.hooks.OnBalanceChange(addr, prev, h.StateDB.GetBalance(addr), reason)
	}
}

// SubBalance subtracts amount from the account associated with addr.
func (h *HookedStateDB) SubBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) {
	if amount.IsZero() {
		return
	}
	prev := h.StateDB.GetBalance(addr)
	h.StateDB.SubBalance(addr, amount, reason)
	if h.hooks.OnBalanceChange != nil {
		h.hooks.OnBalanceChange(addr, prev, h.StateDB.GetBalance(addr), reason)
	}
}

// SetNonce sets the nonce of an account.
func (h *HookedStateDB) SetNonce(addr common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	prev := h.StateDB.GetNonce(addr)
	h.StateDB.SetNonce(addr, nonce, reason)
	if h.hooks.OnNonceChangeV2 != nil {
		h.hooks.OnNonceChangeV2(addr, prev, nonce, reason)
	} else if h.hooks.OnNonceChange != nil {
		h.hooks.OnNonceChange(addr, prev, nonce)
	}
}

// SetCode sets the code of an account.
func (h *HookedStateDB) SetCode(addr common.Address, code []byte) {
	prevCode := h.StateDB.GetCode(addr)
	prevCodeHash := h.StateDB.GetCodeHash(addr)
	h.StateDB.SetCode(addr, code)
	if h.hooks.OnCodeChange != nil {
		h.hooks.OnCodeChange(addr, prevCodeHash, prevCode, h.StateDB.GetCodeHash(addr), code)
	}
}

// SetState sets the storage of an account.
func (h *HookedStateDB) SetState(addr common.Address, key, value common.Hash) {
	prev := h.StateDB.GetState(addr, key)
	h.StateDB.SetState(addr, key, value)
	if h.hooks.OnStorageChange != nil {
		h.hooks.OnStorageChange(addr, key, prev, value)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/journal.go">
```go
// journal is a state change journal to be wrapped around a tracer.
// It will emit the state change hooks with reverse values when a call reverts.
type journal struct {
	hooks     *Hooks
	entries   []entry
	revisions []int
}

type entry interface {
	revert(tracer *Hooks)
}

// WrapWithJournal wraps the given tracer with a journaling layer.
func WrapWithJournal(hooks *Hooks) (*Hooks, error) {
...
	// Create a new Hooks instance and copy all hooks
	wrapped := *hooks

	// Create journal
	j := &journal{hooks: hooks}
	// Scope hooks need to be re-implemented.
	wrapped.OnTxEnd = j.OnTxEnd
	wrapped.OnEnter = j.OnEnter
	wrapped.OnExit = j.OnExit
...
	return &wrapped, nil
}
...
// OnEnter is invoked for each EVM call frame and records a journal revision.
func (j *journal) OnEnter(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	j.snapshot()
	if j.hooks.OnEnter != nil {
		j.hooks.OnEnter(depth, typ, from, to, input, gas, value)
	}
}

// OnExit is invoked when an EVM call frame ends.
// If the call has reverted, all state changes made by that frame are undone.
// If the call did not revert, we forget about changes in that revision.
func (j *journal) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
	if reverted {
		j.revert(j.hooks)
	} else {
		j.popRevision()
	}
	if j.hooks.OnExit != nil {
		j.hooks.OnExit(depth, output, gasUsed, err, reverted)
	}
}
...
type (
	balanceChange struct {
		addr common.Address
		prev *big.Int
		new  *big.Int
	}
...
)

func (b balanceChange) revert(hooks *Hooks) {
	if hooks.OnBalanceChange != nil {
		hooks.OnBalanceChange(b.addr, b.new, b.prev, BalanceChangeRevert)
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the consensus engine.
type EVM struct {
	// Context provides information about the current execution environment.
	Context BlockContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// chainConfig contains information about the current chain.
	chainConfig *params.ChainConfig

	// virtual machine configuration options.
	Config Config

	// interpreter is the contract interpreter.
	interpreter *EVMInterpreter

	// callGasTemp holds the gas available for the current call. This is needed because
	// the interpreter will reference this memory area.
	callGasTemp uint64
}

// Config are the configuration options for the EVM.
type Config struct {
	// Tracer is the tracer object that will be invoked during the execution of a
	// message.
	Tracer EVMLogger

	// NoBaseFee may be used to disable the EIP-1559 base fee checks. This is for
	// convenience since a lot of tests were written pre-EIP-1559 and are still
	// using legacy transactions without specifying gasFeeCap/gasTipCap.
	NoBaseFee bool
}

// Call executes the contract associated with the destination address. It is a
// convenience wrapper around Call.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CALL, caller.Address(), addr, input, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas-gas, err)
		}()
	}
	// Pass on the call as a regular message call
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCallCode(&addr, evm.StateDB.GetCodeHash(addr), evm.StateDB.GetCode(addr))

	ret, err = run(evm, contract, input, false)
	return ret, contract.Gas, err
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1, false)

	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// Call the contract with the optional tracer
	if evm.Config.Tracer != nil {
		evm.Config.Tracer.CaptureEnter(CREATE, caller.Address(), contractAddr, code, gas, value)
		defer func() {
			evm.Config.Tracer.CaptureExit(ret, leftOverGas-gas, err)
		}()
	}
	// Ensure the contract address is not taken
	contract := NewContract(caller, AccountRef(contractAddr), value, gas)
	if !evm.CanTransfer(evm.StateDB, caller.Address(), value) {
		return nil, common.Address{}, gas, ErrInsufficientBalance
	}
	// ...
	// Run the code and returned code, if any, is the creation code
	ret, err = run(evm, contract, code, true)
	// ...
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm     *EVM
	cfg     Config
	gasPool *core.GasPool
	opTable opTable

	readOnly bool // Whether to throw on stateful modifications
	depth    int
}

// Run runs the EVM code with the given input and returns the final gas
// and output data.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op OpCode // current opcode
		// ...
		pc  = uint64(0) // program counter
		gas = contract.Gas
		cost uint64
		// ...
		logged = false
	)
	// Don't heap allocate memory for tracing if it's disabled
	var (
		memForTracing    *Memory
		stackForTracing  *Stack
	)
	if in.cfg.Tracer != nil {
		memForTracing = NewMemory()
		stackForTracing = newstack()
	}

	// Main loop
	for {
		if in.cfg.Tracer != nil && !logged {
			// Note that the memory and stack returned by scope are not affected by the ref tracking
			// and are thus safe to use concurrently.
			memForTracing.Resize(mem.Len())
			copy(memForTracing.Data(), mem.Data())
			stackForTracing.data = common.CopyStack(stack.data)

			in.cfg.Tracer.CaptureState(pc, op, gas, cost, &ScopeContext{
				Memory:   memForTracing,
				Stack:    stackForTracing,
				Contract: contract,
			}, in.readOnly, err)
		}
		logged = false

		// Get the next opcode from the bytecode
		op = contract.GetOp(pc)
		// Use the read-only interpreter if specified.
		operation := in.opTable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// Validate stack
		if err := operation.validateStack(stack); err != nil {
			return nil, err
		}
		// ...
		// Static portion of gas
		cost, err = operation.gasCost(in.evm, contract, stack, mem, in.gasPool)
		if err != nil {
			return nil, err
		}
		if gas < cost {
			return nil, ErrOutOfGas
		}
		gas -= cost
		// ...

		// All checks passed.
		// May exit on returned error.
		res, err = operation.execute(&pc, in, mem, stack)

		// If the operation has better error reporting, use that instead.
		if operation.errorf != nil {
			// This needs to be done before err is compared to nil, because the errorf
			// can turn a nil-error into a non-nil error
			err = operation.errorf(stack, err)
		}

		if err != nil {
			// If we've got an error, we're not going to execute any more opcodes, so
			// Capture the fault state
			if in.cfg.Tracer != nil && !logged {
				memForTracing.Resize(mem.Len())
				copy(memForTracing.Data(), mem.Data())
				stackForTracing.data = common.CopyStack(stack.data)

				in.cfg.Tracer.CaptureFault(pc, op, gas, cost, &ScopeContext{
					Memory:   memForTracing,
					Stack:    stackForTracing,
					Contract: contract,
				}, in.depth, err)
			}
			break
		}
		pc++
	}

	if err == errStopToken {
		return nil, nil // Return empty bytes on stop
	} else if err != nil {
		return nil, err
	}
	return res, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// EVMLogger is an interface to capture execution states of the EVM.
//
// CaptureState is called for each step of the EVM Interpreter.
//
// Note that the scope parameter in CaptureState contains the memory, stack
// and contract of the current call context. It is not advisable to copy the
// data from scope, instead one should copy the data from the memory and stack
// objects passed as arguments.
type EVMLogger interface {
	// CaptureStart is called when the EVM starts and provides the tracer
	// with information about the execution environment.
	// All arguments are passed by value.
	CaptureStart(evm *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *uint256.Int)

	// CaptureState is called for each step of the EVM Interpreter.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is invoked only when the error is not meaning to abort the execution.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called when the EVM finishes execution and provides the
	// tracer with information about the execution outcome.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new execution scope (CALL, CREATE).
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *uint256.Int)

	// CaptureExit is called when the EVM exits an execution scope with a success or failure.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// StructLog is a structured log message used by the logger.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            OpCode                      `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*uint256.Int              `json:"stack,omitempty"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"err,omitempty"`
}

// StructLogger is an EVMLogger that captures execution steps and converts them to
// a JSON object.
//
// Note, the StructLogger is not safe for concurrent use.
type StructLogger struct {
	cfg *LogConfig

	storage map[common.Address]map[common.Hash]common.Hash
	logs    []StructLog
	err     error

	mem         *Memory
	stack       *Stack
	rData       []byte
	interrupted bool // whether the execution has been interrupted
}

// CaptureState logs a new structured log message for the given state.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// ... check for interrupt ...

	// stack
	var stack []*uint256.Int
	if l.cfg.EnableStack {
		// Slice is from the top of the stack.
		stack = make([]*uint256.Int, len(scope.Stack.Data()))
		for i, item := range scope.Stack.Data() {
			stack[i] = new(uint256.Int).Set(item)
		}
	}

	// memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}

	// storage
	var storage map[common.Hash]common.Hash
	if l.cfg.EnableStorage {
		// Only create a new map if the address is not the same
		if l.storage == nil {
			l.storage = make(map[common.Address]map[common.Hash]common.Hash)
		}
		// But we need to dump the storage of the last contract call.
		// It's a bit of an edge case, but it's possible for a contract to
		// do a call, the sub-contract to self-destruct, and the top-level
		// contract to continue execution.
		// It's also possible that the tracer is stateful (e.g. callTracer)
		// and has just returned from a sub-call.
		if _, ok := l.storage[scope.Contract.Address()]; !ok {
			l.storage[scope.Contract.Address()] = make(map[common.Hash]common.Hash)
			scope.StateDB.ForEachStorage(scope.Contract.Address(), func(key, value common.Hash) bool {
				l.storage[scope.Contract.Address()][key] = value
				return true
			})
		}
		storage = l.storage[scope.Contract.Address()]
	}

	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    common.CopyBytes(rData),
		Depth:         depth,
		RefundCounter: scope.StateDB.GetRefund(),
		Err:           err,
		Storage:       storage,
	}
	l.logs = append(l.logs, log)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/scope.go">
```go
// ScopeContext contains the things that are per-call, such as stack and memory,
// but not things that are per-transaction, such as the state DB.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt correctly identifies `core/tracing/hooks.go` as a source for tracing interfaces. However, for implementing a detailed, step-by-step EVM tracer, the more specific interfaces and structs within the `core/vm` package are more direct and illustrative.

1.  **Interface to Implement**: The `EVMLogger` interface in `core/vm/logger.go` is the direct interface implemented by Geth's tracers for capturing opcode-level details. It provides methods like `CaptureState` and `CaptureFault` that are invoked directly from the interpreter loop.

2.  **Opcode Context**: The `CaptureState` method receives a `*ScopeContext` object (`core/vm/scope.go`), not the `OpContext` interface from the tracing package. `ScopeContext` provides direct access to the current execution frame's `Memory`, `Stack`, and `Contract` objects, which is essential for comprehensive tracing.

3.  **Example Implementation**: `StructLogger` in `core/vm/logger.go` is the canonical implementation of `EVMLogger`. Its `CaptureState` method is an excellent reference for how to capture stack, memory, gas, and other relevant data at each step.

4.  **Structured Output**: The `StructLog` struct in `core/vm/logger.go` defines the fields for a structured log entry, serving as a perfect blueprint for the requested machine-readable trace format.

By focusing on `EVM`, `EVMInterpreter`, `EVMLogger`, `StructLogger`, and `ScopeContext` from the `core/vm` package, you can build a tracing system that is closely aligned with Geth's own internal debugging and tracing mechanisms.

---

An analysis of the `go-ethereum` codebase reveals a modern, interface-based tracing system centered around the `vm.Tracer` interface. This is a more direct and relevant reference for implementing tracing inside the core EVM execution loop compared to the older `hooks.go` system.

The key components for a comprehensive tracing implementation are:
1.  **The `Tracer` Interface**: Defines the contract that any tracer must implement. It includes methods for capturing the start and end of a transaction, each EVM step (`CaptureState`), faults, and entering/exiting call frames.
2.  **Interpreter Integration**: The EVM interpreter (`core/vm/interpreter.go`) directly calls the methods on the `Tracer` interface at the appropriate points in the execution loop, providing rich context like the program counter, opcode, gas, stack, and memory.
3.  **A Concrete Tracer (`StructLogger`)**: This serves as a practical example of how to implement the `Tracer` interface. It collects data at each step, formats it into a structured log (`StructLog`), and aggregates the results.

These snippets provide a complete pattern: the API to implement (`Tracer`), the integration points in the EVM (`interpreter.go`), and a reference implementation (`StructLogger`).

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/tracer.go">
```go
// Tracer is an interface for debugging the EVM.
//
// A Tracer has access to the EVM stack, memory, and contract details.
// It is called for each step of the EVM execution (if tracing is enabled)
// and can be used to logging or checking the EVM state for debugging purposes.
type Tracer interface {
	// CaptureStart is called at the very start of a transaction, before any
	// processing or cost-checking has happened.
	CaptureStart(env *EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureEnd is called at the very end of a transaction, after all
	// processing has concluded.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureState is called for each step of the EVM execution.
	// It's not invoked for calls, but for every other opcode.
	//
	// Note that the stack, memory and contract-call-specific data will be
	// available to the tracer, but it may not be modified. If the tracer
	// attempts to modify it, the result is undefined.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an
	// opcode. It is not called if the error is caught and handled by the EVM.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnter is called when a call or create is about to be executed.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when a call or create has returned.
	CaptureExit(output []byte, gasUsed uint64, err error)
}

// ScopeContext contains the things that are per-call, such as stack and memory,
// and are shared between all opcodes in the same call.
type ScopeContext struct {
	Stack    *Stack
	Memory   *Memory
	Contract *Contract
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the final gas
// available and output.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment depth for nested calls.
	in.depth++
	defer func() { in.depth-- }()

	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This makes also sure that the readOnly flag is accumulated,
	// and cannot be unset deeper in the call stack.
	if readOnly && !in.readOnly {
		in.readOnly = true
		defer func() { in.readOnly = false }()
	}
	// Don't bother with the defer if there's no tracer.
	if in.cfg.Tracer != nil {
		in.cfg.Tracer.CaptureStart(in.evm, contract.Address(), contract.Address(), false, input, in.gas, contract.value)

		defer func() {
			//...
			in.cfg.Tracer.CaptureEnd(ret, in.gas-in.gas, err)
		}()
	}
	//...
	var (
		op    OpCode        // current opcode
		mem   = in.memory   // bound memory
		stack = in.stack    // bound stack
		//...
	)
	// The main execution loop
	for {
		//...
		// Get the operation from the jump table and validate the stack
		operation := in.cfg.JumpTable[op]
		//...
		// Capture the state before the opcode is executed
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(in.pc, op, in.gas, cost, &ScopeContext{stack, mem, contract}, in.returnData, in.depth, err)
		}
		// Execute the operation
		res, err = operation.execute(&pc, in, &callCtx)
		//...
		// If the operation is a call, pass the parameters to the tracer
		if op >= CALL && op <= STATICCALL {
			//...
			var (
				toAddr = common.BytesToAddress(stack.Back(1).Bytes())
				//...
			)
			// Capture the call entering the tracer.
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.CaptureEnter(op, contract.Address(), toAddr, args, gas, value)
			}
			ret, gasLeft, err = in.evm.Call(contract, toAddr, args, gas, value)
			//...
			// Capture the call returning from the tracer.
			if in.cfg.Tracer != nil {
				in.cfg.Tracer.CaptureExit(ret, gas-gasLeft, err)
			}
		} 
		//...
	}
//...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLog is a structured log emitted by the Geth StructLogger.
type StructLog struct {
	Pc      uint64     `json:"pc"`
	Op      vm.OpCode  `json:"op"`
	Gas     uint64     `json:"gas"`
	GasCost uint64     `json:"gasCost"`
	Depth   int        `json:"depth"`
	Err     error      `json:"-"`
	OpName  string     `json:"opName"` // OpName is the name of the opcode
	Error   string     `json:"error,omitempty"`
	Stack   []string   `json:"stack,omitempty"`
	Memory  []string   `json:"memory,omitempty"`
	Storage store      `json:"storage,omitempty"`
	memorySize,
	stackLen,
	storageLen int
}

// StructLogger is a vm.Tracer that accumulates all traced data into a structured
// log memory database, providing a full historical trace of a transaction's
// execution.
type StructLogger struct {
	cfg             Config
	logs            []StructLog
	changedStorage  map[common.Address]map[common.Hash]common.Hash
	gasLimit        uint64
	interrupt       *atomic.Uint32 // Pointer to the interrupt flag in the main EVM
	interruptErr    error          // The error which interrupted execution
	reason          error          // The reason for the captured trace
	output          []byte
	gasUsed         uint64
	mu              sync.Mutex
}

// NewStructLogger returns a new logger that is ready to be used.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		cfg:            *cfg,
		changedStorage: make(map[common.Address]map[common.Hash]common.Hash),
	}
	return logger
}

// CaptureState logs a new structured log message to the console.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	//...
	// capture stack
	var stack []string
	if l.cfg.EnableStack {
		stack = make([]string, scope.Stack.Len())
		for i, item := range scope.Stack.Data() {
			stack[i] = "0x" + item.Text(16)
		}
	}
	// capture memory
	var memory []string
	if l.cfg.EnableMemory {
		memory = make([]string, 0, (scope.Memory.Len()+31)/32)
		for i := 0; i+32 <= scope.Memory.Len(); i += 32 {
			memory = append(memory, "0x"+hex.EncodeToString(scope.Memory.GetPtr(int64(i), 32)))
		}
	}
	// capture storage
	var storage store
	if l.cfg.EnableStorage {
		storage = l.captureStorage(scope.Contract.Address(), scope.Contract.State())
	}
	// create a new log entry
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Depth:      depth,
		Err:        err,
		memorySize: scope.Memory.Len(),
		stackLen:   scope.Stack.Len(),
		storageLen: len(storage),
		OpName:     op.String(),
		Stack:      stack,
		Memory:     memory,
		Storage:    storage,
	}
	//...
	l.logs = append(l.logs, log)
}

// CaptureEnter is called when a call or create is about to be executed.
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// No-op
}

// CaptureExit is called when a call or create has returned.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// No-op
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt correctly identifies the hook-based pattern in `go-ethereum` but references `core/tracing/hooks.go`. While this file exists, the primary tracing mechanism used by the core EVM interpreter (`core/vm/interpreter.go`) is the `vm.Tracer` interface defined in `core/vm/tracer.go`.

**Correction**: For implementing tracing directly within the EVM execution loop, `core/vm/tracer.go` is the more accurate and modern reference. The `hooks.go` system is an older, parallel mechanism used by certain tools. The `vm.Tracer` interface is what the main `Run` function in the interpreter uses to dispatch tracing events. The provided snippets have been updated to reflect this more direct and relevant API.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object and provides
// the necessary tools to run a contract on the given state with
// the provided context. It should be noted that any error
// generated through any of the calls should be considered a
// revert-state-and-consume-all-gas operation, no checks on
// specific errors should ever be performed. The interpreter makes
// sure that any errors generated are to be considered faulty code.
//
// The EVM should never be reused and is not thread safe.
type EVM struct {
	// Context provides auxiliary blockchain related information
	Context BlockContext
	TxContext

	// StateDB gives access to the underlying state
	StateDB StateDB

	// depth is the current call stack
	depth int

	// chainConfig contains information about the current chain
	chainConfig *params.ChainConfig

	// chain rules contains the chain rules for the current epoch
	chainRules params.Rules

	// virtual machine configuration options used to initialise the evm
	Config Config

	// global (to this context) ethereum virtual machine used throughout
	// the execution of the tx
	interpreter *EVMInterpreter

	// abort is used to abort the EVM calling operations
	abort atomic.Bool

	// callGasTemp holds the gas available for the current call. This is needed because the
	// available gas is calculated in gasCall* according to the 63/64 rule and later
	// applied in opCall*.
	callGasTemp uint64

	// precompiles holds the precompiled contracts for the current epoch
	precompiles map[common.Address]PrecompiledContract

	// jumpDests is the aggregated result of JUMPDEST analysis made through
	// the life cycle of EVM.
	jumpDests map[common.Hash]bitvec
}

// NewEVM constructs an EVM instance with the supplied block context, state
// database and several configs. It meant to be used throughout the entire
// state transition of a block, with the transaction context switched as
// needed by calling evm.SetTxContext.
func NewEVM(blockCtx BlockContext, statedb StateDB, chainConfig *params.ChainConfig, config Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		Config:      config,
		chainConfig: chainConfig,
		chainRules:  chainConfig.Rules(blockCtx.BlockNumber, blockCtx.Random != nil, blockCtx.Time),
		jumpDests:   make(map[common.Hash]bitvec),
	}
	evm.precompiles = activePrecompiledContracts(evm.chainRules)
	evm.interpreter = NewEVMInterpreter(evm)
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takse
// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller common.Address, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// Capture the tracer start/end events in debug mode
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, CALL, caller, addr, input, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ...
	// Rest of the call logic
	// ...
}

// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller common.Address, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	contractAddr = crypto.CreateAddress(caller, evm.StateDB.GetNonce(caller))
	return evm.create(caller, code, gas, value, contractAddr, CREATE)
}

// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	if evm.Config.Tracer != nil {
		evm.captureBegin(evm.depth, typ, caller, address, code, gas, value.ToBig())
		defer func(startGas uint64) {
			evm.captureEnd(evm.depth, startGas, leftOverGas, ret, err)
		}(gas)
	}
	// ...
	// Rest of the create logic
	// ...
}

func (evm *EVM) captureBegin(depth int, typ OpCode, from common.Address, to common.Address, input []byte, startGas uint64, value *big.Int) {
	tracer := evm.Config.Tracer
	if tracer.OnEnter != nil {
		tracer.OnEnter(depth, byte(typ), from, to, input, startGas, value)
	}
	if tracer.OnGasChange != nil {
		tracer.OnGasChange(0, startGas, tracing.GasChangeCallInitialBalance)
	}
}

func (evm *EVM) captureEnd(depth int, startGas uint64, leftOverGas uint64, ret []byte, err error) {
	tracer := evm.Config.Tracer
	if leftOverGas != 0 && tracer.OnGasChange != nil {
		tracer.OnGasChange(leftOverGas, 0, tracing.GasChangeCallLeftOverReturned)
	}
	var reverted bool
	if err != nil {
		reverted = true
	}
	// ...
	if tracer.OnExit != nil {
		tracer.OnExit(depth, ret, startGas-leftOverGas, VMErrorFromErr(err), reverted)
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Config are the configuration options for the Interpreter
type Config struct {
	Tracer                  *tracing.Hooks
	NoBaseFee               bool  // Forces the EIP-1559 baseFee to 0 (needed for 0 price calls)
	EnablePreimageRecording bool  // Enables recording of SHA3/keccak preimages
	ExtraEips               []int // Additional EIPS that are to be enabled

	StatelessSelfValidation bool // Generate execution witnesses and self-check against them (testing purpose)
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable

	hasher    crypto.KeccakState // Keccak256 hasher instance shared across opcodes
	hasherBuf common.Hash        // Keccak256 hasher result array shared across opcodes

	readOnly   bool   // Whether to throw on stateful modifications
	returnData []byte // Last CALL's return data for subsequent reuse
}


// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code)

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		pc   = uint64(0) // program counter
		cost uint64
		// ...
		res    []byte // result of the opcode execution function
		debug  = in.evm.Config.Tracer != nil
	)
	// ...
	if debug {
		defer func() { // this deferred method handles exit-with-error
			if err == nil {
				return
			}
			if !logged && in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pcCopy, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
			}
			if logged && in.evm.Config.Tracer.OnFault != nil {
				in.evm.Config.Tracer.OnFault(pcCopy, byte(op), gasCopy, cost, callContext, in.evm.depth, VMErrorFromErr(err))
			}
		}()
	}

	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

		// Get the operation from the jump table and validate the stack...
		op = contract.GetOp(pc)
		operation := in.table[op]
		// ... (stack validation)
		cost = operation.constantGas // For tracing
		
		// Consume constant gas
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		}
		contract.Gas -= cost

		// Consume dynamic gas
		if operation.dynamicGas != nil {
			// ... (dynamic gas calculation)
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost // for tracing
			if err != nil {
				return nil, fmt.Errorf("%w: %v", ErrOutOfGas, err)
			}
			if contract.Gas < dynamicCost {
				return nil, ErrOutOfGas
			}
			contract.Gas -= dynamicCost
		}

		// Do tracing before potential memory expansion
		if debug {
			if in.evm.Config.Tracer.OnGasChange != nil {
				in.evm.Config.Tracer.OnGasChange(gasCopy, gasCopy-cost, tracing.GasChangeCallOpCode)
			}
			if in.evm.Config.Tracer.OnOpcode != nil {
				in.evm.Config.Tracer.OnOpcode(pc, byte(op), gasCopy, cost, callContext, in.returnData, in.evm.depth, VMErrorFromErr(err))
				logged = true
			}
		}

		// execute the operation
		res, err = operation.execute(&pc, in, callContext)
		if err != nil {
			break
		}
		pc++
	}

	if err == errStopToken {
		err = nil // clear stop token error
	}

	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb_hooked.go">
```go
// hookedStateDB represents a statedb which emits calls to tracing-hooks
// on state operations.
type hookedStateDB struct {
	inner *StateDB
	hooks *tracing.Hooks
}

// NewHookedState wraps the given stateDb with the given hooks
func NewHookedState(stateDb *StateDB, hooks *tracing.Hooks) *hookedStateDB {
	s := &hookedStateDB{stateDb, hooks}
	if s.hooks == nil {
		s.hooks = new(tracing.Hooks)
	}
	return s
}

func (s *hookedStateDB) SubBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.SubBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Sub(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) AddBalance(addr common.Address, amount *uint256.Int, reason tracing.BalanceChangeReason) uint256.Int {
	prev := s.inner.AddBalance(addr, amount, reason)
	if s.hooks.OnBalanceChange != nil && !amount.IsZero() {
		newBalance := new(uint256.Int).Add(&prev, amount)
		s.hooks.OnBalanceChange(addr, prev.ToBig(), newBalance.ToBig(), reason)
	}
	return prev
}

func (s *hookedStateDB) SetNonce(address common.Address, nonce uint64, reason tracing.NonceChangeReason) {
	prev := s.inner.GetNonce(address)
	s.inner.SetNonce(address, nonce, reason)
	if s.hooks.OnNonceChangeV2 != nil {
		s.hooks.OnNonceChangeV2(address, prev, nonce, reason)
	} else if s.hooks.OnNonceChange != nil {
		s.hooks.OnNonceChange(address, prev, nonce)
	}
}

func (s *hookedStateDB) SetCode(address common.Address, code []byte) []byte {
	prev := s.inner.SetCode(address, code)
	if s.hooks.OnCodeChange != nil {
		prevHash := types.EmptyCodeHash
		if len(prev) != 0 {
			prevHash = crypto.Keccak256Hash(prev)
		}
		s.hooks.OnCodeChange(address, prevHash, prev, crypto.Keccak256Hash(code), code)
	}
	return prev
}

func (s *hookedStateDB) SetState(address common.Address, key common.Hash, value common.Hash) common.Hash {
	prev := s.inner.SetState(address, key, value)
	if s.hooks.OnStorageChange != nil && prev != value {
		s.hooks.OnStorageChange(address, key, prev, value)
	}
	return prev
}

func (s *hookedStateDB) AddLog(log *types.Log) {
	// The inner will modify the log (add fields), so invoke that first
	s.inner.AddLog(log)
	if s.hooks.OnLog != nil {
		s.hooks.OnLog(log)
	}
}

func (s *hookedStateDB) Finalise(deleteEmptyObjects bool) {
	defer s.inner.Finalise(deleteEmptyObjects)
	if s.hooks.OnBalanceChange == nil {
		return
	}
	for addr := range s.inner.journal.dirties {
		obj := s.inner.stateObjects[addr]
		if obj != nil && obj.selfDestructed {
			// If ether was sent to account post-selfdestruct it is burnt.
			if bal := obj.Balance(); bal.Sign() != 0 {
				s.hooks.OnBalanceChange(addr, bal.ToBig(), new(big.Int), tracing.BalanceDecreaseSelfdestructBurn)
			}
		}
	}
}
```
</file>
</go-ethereum>

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a go-ethereum EVM interpreter.
type Interpreter struct {
	evm *EVM
	cfg Config

	gas         uint64
	readOnly    bool
	returnData  []byte
	operation   operation
	err         error
	resumed     bool // Whether the execution has been resumed from a previous state
	interrupted bool // Whether the execution has been interrupted
}

// ...

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initial setup)

	// Grab the EVM and the closure prepared for this execution
	evm := in.evm
	// ...

	if evm.canTrace() {
		evm.Tracer.CaptureEnter(evm, contract.Address(), contract.Caller(), input, in.gas, contract.value)
	}

	// The `operation` loop depends on the stack size, so we have to make sure
	// the stack has enough space for the operation's parameters.
	for {
		// ... (check for interrupts)

		// Get the operation from the jump table and validate the stack.
		op = contract.GetOp(pc)
		operation = in.cfg.JumpTable[op]
		// ...

		// If the operation is valid, get the scope context
		var (
			// stack contains the EVM stack
			stack = evm.StateDB.GetStack(contract.Address())
			// memory contains the EVM memory
			memory = evm.StateDB.GetMemory(contract.Address())
		)
		// Capture the state just before executing the opcode
		if evm.canTrace() {
			evm.Tracer.CaptureState(evm, pc, op, gas, cost, memory, stack, contract, in.returnData, in.Depth(), err)
		}

		// Execute the operation
		res, err = operation.execute(&pc, evm, &in.operation)
		// ...

		// if the interpreter returned an error, we abort the execution
		if err != nil {
			break
		}
		// if the program stopped, we abort the execution
		if in.operation.stopped {
			break
		}
		// if the interpreter is marked as interrupted, we abort the execution
		if in.interrupted {
			break
		}
		pc++
	}

	// ...

	// Capture the trace at the end of the execution
	if evm.canTrace() {
		evm.Tracer.CaptureExit(evm, ret, gas-in.gas, err)
	}

	return ret, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a native Go tracer that records structured logs of EVM
// execution. The collected logs are exposed over the RPC and can be used for
// debugging. It's the backend for `debug_traceTransaction`.
//
// StructLogger is not safe for concurrent use.
type StructLogger struct {
	// ...

	logs  []StructLog
	first bool
	// ...
}

// StructLog is a structured log collected during the execution of an
// EVM transaction.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        []byte             `json:"memory"`
	MemorySize    int                `json:"memSize"`
	Stack         []*uint256.Int     `json:"stack"`
	ReturnData    []byte             `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"err,omitempty"`
	OpName        string             `json:"opName"` // Added manually during trace processing
	ErrorString   string             `json:"error,omitempty"` // Added manually during trace processing
}

// NewStructLogger returns a new logger that is used for structured logging.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		cfg:   cfg,
		first: true,
	}
	return logger
}

// CaptureState captures all structured EVM stack, memory and storage changes
// during the execution of a single EVM opcode.
func (l *StructLogger) CaptureState(evm *vm.EVM, pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// ... (skip if disabled)

	// Copy stack and memory to trace them
	stack := scope.Stack.Data()
	stackData := make([]*uint256.Int, len(stack))
	for i, item := range stack {
		stackData[i] = uint256.NewInt(0).Set(item)
	}

	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// ...

	// Copy storage to trace it
	var storage map[common.Hash]common.Hash
	if l.cfg.EnableStorage {
		storage = scope.Contract.Storage()
	}

	// Copy return data to trace it
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}

	// Create a new structured log entry
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.Memory.Len(),
		Stack:      stackData,
		ReturnData: returnData,
		Storage:    storage,
		Depth:      depth,
	}
	if err != nil {
		log.Err = err
		// Do not capture any more steps if the interpreter is halting
		l.cfg.DisableStack = true
		l.cfg.DisableStorage = true
		l.cfg.DisableMemory = true
		l.cfg.DisableReturnData = true
	}
	l.logs = append(l.logs, log)
}

// CaptureFault captures an execution fault.
func (l *StructLogger) CaptureFault(evm *vm.EVM, pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.CaptureState(evm, pc, op, gas, cost, scope, nil, depth, err)
}

// CaptureEnter is called when EVM enters a new scope (via call, create or selfdestruct).
func (l *StructLogger) CaptureEnter(typ vm.OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int) {
	// ...
}

// CaptureExit is called when EVM exits a scope, even if the scope came from a
// tracer that was started midway of the transaction.
func (l *StructLogger) CaptureExit(output []byte, gasUsed uint64, err error) {
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Config are the configuration options for the EVM
	Config Config

	// Context provides information about the current blockchain and transaction.
	BlockContext BlockContext
	TxContext    TxContext

	// StateDB gives access to the underlying state.
	StateDB StateDB

	// depth is the current call stack
	depth int

	// Interpreter is the contract interpreter that takes contracts and executes them
	interpreter *Interpreter

	// ...
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by one thread at a time.
func NewEVM(blockCtx BlockContext, txCtx TxContext, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		BlockContext: blockCtx,
		TxContext:    txCtx,
		StateDB:      statedb,
		Config:       vmConfig,
		interpreter:  NewInterpreter(nil, vmConfig),
	}
	// The Interpreter should have access to the EVM.
	evm.interpreter.evm = evm
	return evm
}

// Call executes the contract associated with the addr with the given input as
// parameters. It also handles any necessary value transfer required and takes

// the necessary steps to create accounts and reverses the state in case of an
// execution error or failed value transfer.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (setup and pre-checks)

	// Create a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCode(evm.StateDB.GetCode(addr))

	// Even if the account has no code, we have to handle the native contracts
	// (those are not executed by the EVM, but handled natively).
	if contract.CodeIsPrecompile() {
		// ... (precompile handling)
	} else {
		ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	}
	// ...
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go">
```go
// ContractRef is a reference to the contract's backing object
type ContractRef interface {
	Address() common.Address
}

// Contract represents an Ethereum contract in the state machine. It contains the
// code of the contract and the essentials on how to execute that code.
type Contract struct {
	// Fields that are not supposed to be modified directly by the EVM
	caller ContractRef    // Who invoked the contract
	self   ContractRef    // The contract's own address
	value  *uint256.Int   // Value of the call, not part of the contract data
	jumpdests destinations // Valid jump destinations for the code
	analysis  codeAnalysis // JUMPDEST analysis of the code

	Code     []byte         // Code of the contract
	CodeHash common.Hash    // Hash of the code
	CodeAddr *common.Address // Address of the code, if any
	Input    []byte         // Input data for the contract call

	// Fields that can be modified by the EVM
	Gas   uint64 // Gas remaining for execution
	inner *EVM   // The EVM executing this contract
}

// AsDelegate returns a new contract with the same code, but with the context
// of the caller.
func (c *Contract) AsDelegate() *Contract {
	// NOTE: The self-address is not changed when calling as a delegate.
	return &Contract{
		caller:    c.caller,
		self:      c.self,
		value:     c.value,
		jumpdests: c.jumpdests,
		analysis:  c.analysis,
		Code:      c.Code,
		CodeHash:  c.CodeHash,
		CodeAddr:  c.CodeAddr,
		Input:     c.Input,
		Gas:       c.Gas,
		inner:     c.inner,
	}
}

// GetOp returns the n'th element in the contract's code.
func (c *Contract) GetOp(n uint64) OpCode {
	if n < uint64(len(c.Code)) {
		return OpCode(c.Code[n])
	}
	return STOP
}

// Caller returns the address of the caller.
func (c *Contract) Caller() common.Address {
	return c.caller.Address()
}

// Address returns the contracts address
func (c *Contract) Address() common.Address {
	return c.self.Address()
}

// Value returns the contract's value (sent to it from the caller)
func (c *Contract) Value() *uint256.Int {
	return c.value
}

// SetCode sets the contract's code and analyzes it for valid jump destinations.
func (c *Contract) SetCode(code []byte) {
	c.Code = code
	c.jumpdests, c.analysis = codeAnalysis{}, codeAnalysis{}
	c.analysis.jumpdests(&c.jumpdests, code)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a contract's computational stack.
type Stack struct {
	data []*uint256.Int
}

// NewStack returns a new stack with the specified size.
func NewStack(size int) *Stack {
	return &Stack{
		data: make([]*uint256.Int, 0, size),
	}
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// ... (other methods like push, pop, peek)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the contract's memory.
type Memory struct {
	store []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Data returns the underlying slice of memory, which can be modified.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt provides a good starting point by including `core/tracing/hooks.go`. However, to implement a *comprehensive* tracing system, seeing only the hook definitions is insufficient. A developer also needs to understand:
1.  **Where and when are these hooks called?** The EVM's main execution loop is the primary location for hook invocations.
2.  **How is a tracer implemented in practice?** A concrete example is necessary to understand how to handle the data provided by the hooks and format it into a structured log.
3.  **How is data (stack, memory) accessed from the tracer?** Seeing the implementation of the `OpContext` interface methods clarifies how the tracer gets its information.

The added snippets address these points directly:
-   `core/vm/interpreter.go`: Shows the main EVM execution loop and the precise locations where `CaptureState` (for opcodes), `CaptureFault` (for errors), `CaptureEnter`, and `CaptureExit` are called. This is the most critical context for a developer to understand the tracing lifecycle.
-   `eth/tracers/logger/logger.go`: Provides the `StructLogger` implementation, which is geth's canonical structured tracer. It includes the `StructLog` data structure and the `CaptureState` method, demonstrating exactly how to capture PC, opcode, gas, stack, memory, and storage at each step, directly fulfilling the prompt's requirements.
-   `core/vm/evm.go`: Shows how the `Tracer` is configured and passed into the EVM instance via `NewEVM`, illustrating the "optional" nature of tracing.
-   `core/vm/contract.go`, `core/vm/stack.go`, `core/vm/memory.go`: These files show how the `ScopeContext` (which implements `OpContext`) provides access to the underlying EVM state like the stack and memory via its `Data()` methods. This is essential for implementing the `Stack Monitoring` and `Memory Tracking` requirements.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the transformed output
// and gas remaining. It will also return an error if execution failed, and returns
// the EVM's state.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() {
		in.evm.depth--
	}()

	// Make sure the readOnly is only set if we aren't in a readOnly context already.
	// This also makes sure that the readOnly flag is accumulated, i.e. if a call
	// is initiated from a readOnly context, the sub-call is also readOnly.
	if readOnly && !in.evm.readOnly {
		in.evm.readOnly = true
		defer func() { in.evm.readOnly = false }()
	}
	// On return, check if the return data is too large to fit into the memory.
	// We have a special case here for create, which should be removed if we
	// are to correct this behavior.
	defer func() {
		if err == nil {
			if contract.CodeAddr != nil { // Not a create
				if len(in.returnData) > 0 {
					in.evm.returnData = in.returnData
				}
			}
		}
	}()

	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	var (
		op          OpCode        // current opcode
		mem         = in.Memory   // bound memory
		stack       = in.Stack    // local stack
		callContext = in.callContext
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go above 2^64. The YP defines the pc
		// to be uint256. Practically much smaller pc is possible.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64
		gasCopy uint64
		opCopy  OpCode
		errCopy error
	)
	contract.pc = &pc

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	defer func() {
		// Before the interpreter exits, we should explicitly stop the active
		// tracer if any. It's not obvious to the user that the last step is not
		// captured otherwise.
		if in.evm.CanTrace() {
			if err != nil {
				// In case of an error, we don't want to report the last successful step,
				// so we revert to the last failed one
				in.evm.Tracer.CaptureState(pcCopy, opCopy, gasCopy, cost, in, in.evm.depth, errCopy)
			} else {
				in.evm.Tracer.CaptureState(pc, op, contract.Gas(), cost, in, in.evm.depth, err)
			}
		}
	}()

	// The Interpreter main loop. This loop will continue until execution ends
	// with STOP, RETURN, REVERT, SELFDESTRUCT or an error occurs, possibly due
	// to an invalid opcode.
	for {
		if in.evm.CanTrace() {
			// Capture pre-execution values for tracing.
			pcCopy = pc
			opCopy = contract.op
			gasCopy = contract.Gas()
			cost, errCopy = in.gasprice(opCopy, &callContext)
			if errCopy != nil {
				cost = 0
			}
		}

		// Get the operation from the jump table and validate the stack to ensure there are
		// enough stack items available to perform the operation.
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			err = &ErrInvalidOpcode{opcode: op}
			break
		}

		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			break
		}
		// calculate the gas cost for the operation
		if !in.evm.VMConfig.NoCost {
			cost, err = operation.gasCost(in, &callContext, stack, mem)
			if err != nil {
				break
			}
			if !contract.UseGas(cost) {
				err = ErrOutOfGas
				break
			}
		}
		if in.evm.CanTrace() {
			in.evm.Tracer.CaptureState(pc, op, gasCopy, cost, in, in.evm.depth, err)
		}

		// execute the operation
		res, err := operation.fn(pc, in, &callContext, mem, stack)
		// if the operation clears the return data (e.g. it has returning data),
		// set the last return to the result of this call.
		if operation.returns {
			in.returnData = res
		}

		if err != nil {
			break
		}
		pc++
	}
	if err != nil {
		in.evm.Tracer.CaptureFault(pc, op, gasCopy, cost, in, in.evm.depth, err)
	}
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// Tracer is an interface to trace EVM execution.
//
// The Capture* methods are called to record the changes in EVM state.
// In general, these methods are not guaranteed to be thread-safe and are expected
// to be called from a single goroutine. The only exception is Capture(), which
// may be called from other goroutines.
//
// Note that the scope parameter is not a vm.ScopeContext interface, but a narrower
// concrete type. This is because every logger will have to cast it to the concrete
// type anyway, so we might as well do it prior to the call.
type Tracer interface {
	// CaptureStart is called once at the beginning of a new transaction, before any
	// EVM execution has taken place.
	CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	// CaptureEnd is called once at the end of a transaction, after all EVM
	// execution has concluded.
	CaptureEnd(output []byte, gasUsed uint64, t time.Duration, err error)
	// CaptureState is called on each step of the VM, just before the execution of an
	// opcode.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is invoked on the step where the error occurred and replaces the
	// `CaptureState` call.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	// CaptureEnter is called when a new contract is about to be executed, either
	// as a creation call or a message call.
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	// CaptureExit is called when a contract finishes its execution, either returning
	// control to the caller or ending the transaction.
	CaptureExit(output []byte, gasUsed uint64, err error)
	// CaptureTxStart is called when a new transaction is about to be executed.
	CaptureTxStart(gasLimit uint64)
	// CaptureTxEnd is called when a transaction is done.
	CaptureTxEnd(restGas uint64)
}

// ScopeContext contains the things that are per-call, such as stack and memory,
// but not things that are per-transaction.
type ScopeContext struct {
	Memory   *Memory
	Stack    *Stack
	Contract *Contract
}

// Kept in sync with an internal/ethapi version.
type LogConfig struct {
	EnableMemory     bool `json:"enableMemory"`
	DisableStack     bool `json:"disableStack"`
	DisableStorage   bool `json:"disableStorage"`
	EnableReturnData bool `json:"enableReturnData"`
	Debug            bool `json:"debug"`
	Limit            int  `json:"limit"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// EVM is the Ethereum Virtual Machine base object for the required parts to run
// contract code.
type EVM struct {
	// Context provides information about the current execution context
	Context
	// StateDB gives access to the underlying state
	StateDB StateDB
	// Depth is the current call stack
	depth int
	// chain backend
	chain ChainContext
	// chain rules
	chainRules *params.ChainConfig
	// virtual machine configuration options used to create the EVM
	vmConfig Config
	// global (to this context) ethereum virtual machine
	// used throughout the execution of the given contract
	interpreter *Interpreter
	// read only context (i.e. view calls)
	readOnly bool
	// return data from last call
	returnData []byte
}

// NewEVM returns a new EVM. The returned EVM is not thread safe and should
// only ever be used by a single thread.
func NewEVM(blockCtx Context, txCtx Context, statedb StateDB, chainConfig *params.ChainConfig, vmConfig Config) *EVM {
	evm := &EVM{
		Context:     blockCtx,
		StateDB:     statedb,
		chainRules:  chainConfig,
		vmConfig:    vmConfig,
		readOnly:    false,
		returnData:  nil,
	}

	evm.interpreter = NewInterpreter(evm, vmConfig)
	evm.TxContext = txCtx
	return evm
}

// CanTrace returns whether or not tracing is enabled on the EVM
func (evm *EVM) CanTrace() bool {
	return evm.vmConfig.Tracer != nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/struct_logger.go">
```go
// StructLogger is a EVM state logger and implements the vm.Tracer interface
// to trace all the opcodes. It generates structured logs during the execution of a transaction
// which are stored in memory and returned on completion.
//
// Note, the struct logger is not safe for concurrent use.
type StructLogger struct {
	cfg             *Config
	storage         map[common.Address]types.Storage
	logs            []StructLog
	err             error
	gasLimit        uint64
	output          []byte
	journal         *state.Journal
	statedb         *state.StateDB
	executionResult *tracers.ExecutionResult
	callStack       []callFrame
	receipt         *types.Receipt

	// This is kind of a hack, but we need to know the 'previous' stack,
	// so we can properly report on it. In the first iteration, it's nil
	// and is then set to a copy of the first state.
	lastStack *vm.Stack
	lastMem   *vm.Memory

	mu sync.Mutex
}

// StructLog is a structured log message used by the logger.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*big.Int                  `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
	OpName        string                      `json:"opName"` // Added for debugging, not in EVM
	ErrorString   string                      `json:"error,omitempty"`
}

// NewStructLogger returns a new vm.Tracer that will generate structured logs for
// each executed opcode.
func NewStructLogger(cfg *Config) *StructLogger {
	if cfg == nil {
		cfg = new(Config)
	}
	return &StructLogger{
		cfg:       cfg,
		storage:   make(map[common.Address]types.Storage),
		callStack: make([]callFrame, 0),
	}
}

// CaptureStart implements the vm.Tracer interface to initialize the tracing operation.
func (l *StructLogger) CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.mu.Lock()
	defer l.mu.Unlock()

	l.gasLimit = gas
	l.callStack = append(l.callStack, callFrame{})
}

// CaptureState implements the vm.Tracer interface to trace a single step of VM execution.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	l.mu.Lock()
	defer l.mu.Unlock()

	// If memory is enabled, get a copy of it
	var memory []byte
	if l.cfg.EnableMemory {
		// As an optimisation, we only copy memory if it has changed since the
		// last time.
		if l.lastMem == nil {
			l.lastMem = new(vm.Memory)
		}
		if !bytes.Equal(l.lastMem.Data(), scope.Memory.Data()) {
			memory = make([]byte, len(scope.Memory.Data()))
			copy(memory, scope.Memory.Data())
			l.lastMem.Set(scope.Memory.Data())
		}
	}

	// If stack is enabled, get a copy of it
	var stack []*big.Int
	if !l.cfg.DisableStack {
		if l.lastStack == nil {
			l.lastStack = new(vm.Stack)
		}
		// As an optimisation, we only copy the stack if it has changed
		if !l.lastStack.Equal(scope.Stack) {
			stack = make([]*big.Int, len(scope.Stack.Data()))
			for i, value := range scope.Stack.Data() {
				stack[i] = new(big.Int).Set(value.ToBig())
			}
			l.lastStack.Set(scope.Stack.Data())
		}
	}
	// If storage is enabled, get a copy of it
	var storage map[common.Hash]common.Hash
	if !l.cfg.DisableStorage {
		// Only create a new map if something changed
		if l.journal.Length() > 0 {
			// The operation has changed, and we're not doing a shallow copy.
			// So, we need to save the storage changes since the last operation.
			l.updateJournal(scope.Contract.Address())
		}
		// Now, if we're at a SLOAD or SSTORE, we can extract the specific slot
		// and value.
		if op == vm.SSTORE || op == vm.SLOAD {
			storage = make(map[common.Hash]common.Hash)
			// The location is the first item on the stack
			slot := scope.Stack.Back(0).Bytes32()

			// The value is the second item on the stack for SSTORE
			var value common.Hash
			if op == vm.SSTORE {
				value = scope.Stack.Back(1).Bytes32()
			}
			storage[slot] = value
		}
	}

	// Create a new structured log entry
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.Memory.Len(),
		Stack:      stack,
		Depth:      depth,
		Refund:     l.statedb.GetRefund(),
		OpName:     op.String(),
	}
	if err != nil {
		log.ErrorString = err.Error()
		l.err = err
	}
	if l.cfg.EnableReturnData && len(rData) > 0 {
		log.ReturnData = common.CopyBytes(rData)
	}
	if storage != nil {
		log.Storage = storage
	}
	l.logs = append(l.logs, log)
}

// updateJournal updates the state of the structured logger by journaling all
// new state changes.
func (l *StructLogger) updateJournal(addr common.Address) {
	if _, ok := l.storage[addr]; !ok {
		l.storage[addr] = make(types.Storage)
	}
	for _, entry := range l.journal.Entries() {
		switch entry := entry.(type) {
		case state.StorageChange:
			l.storage[entry.Account][entry.Key] = entry.Value
		}
	}
	l.journal.Reset()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/journal.go">
```go
// JournalEntry is a modification to the state that can be reverted.
type JournalEntry interface {
	// Revert undoes the state change.
	revert(*StateDB)

	// dirtied returns the address that was modified.
	dirtied() *common.Address
}

// journalEntry concrete types.
type (
	// The following types are used by the state journal to track changes.
	createObjectChange struct {
		account *common.Address
	}
	resetObjectChange struct {
		prev *stateObject
	}
	suicideChange struct {
		account     *common.Address
		prev        bool // whether account had already suicided
		prevbalance *uint256.Int
	}
	balanceChange struct {
		account *common.Address
		prev    *uint256.Int
		noempty bool
	}
	nonceChange struct {
		account *common.Address
		prev    uint64
	}
	storageChange struct {
		account *common.Address
		key     common.Hash
		preval  common.Hash
	}
	codeChange struct {
		account *common.Address
		prev    []byte
		prevhash common.Hash
	}
	refundChange struct {
		prev uint64
	}
	addLogChange struct {
		txhash common.Hash
	}
	addPreimageChange struct {
		hash common.Hash
	}
	touchChange struct {
		account *common.Address
	}
)
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/params.go">
```go
// Config are the configuration options for the Interpreter.
type Config struct {
	// Debug enabled debugging Interpreter options
	Debug bool
	// Tracer is the op-code logger
	Tracer Tracer
	// NoBaseFee may be used to temporary disable LondonHF rules, until the final gas schedule is ready.
	NoBaseFee bool
	// EnablePreimageRecording switches on SHA3 pre-image recording.
	EnablePreimageRecording bool
	// JumpTable contains the EVM instruction table.
	JumpTable *JumpTable
	// Type of the EWASM interpreter.
	EWasmInterpreter string
	// Type of the EVM interpreter.
	EVMInterpreter string
	// Extra Eips enables additional EIPS which are not selected by the current hard fork.
	ExtraEips []int
}
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provided a good overview of the hook-based tracing system in go-ethereum, but it was missing some key components needed for a full implementation. Here are the corrections and additions:

1.  **Missing `Tracer` Interface**: The original prompt included the `OpContext` and `StateDB` interfaces but omitted the most critical interface, `vm.Tracer`. This interface defines the methods (`CaptureState`, `CaptureFault`, etc.) that a custom tracer must implement. I've added this from `core/vm/logger.go`.

2.  **Missing `ScopeContext`**: The `CaptureState` and `CaptureFault` methods receive a `*ScopeContext` object, not an `OpContext` as the original prompt implied. The `ScopeContext` provides direct access to the current `Stack`, `Memory`, and `Contract`, which are essential for tracing. I've included its definition.

3.  **No Implementation Example**: The original prompt showed *what* to hook into but not *how*. The most valuable context for a developer is a concrete example. I've added extensive snippets from `eth/tracers/logger/struct_logger.go`. This file contains the `StructLogger`, which is a perfect reference for implementing a comprehensive, step-by-step tracer that produces structured, machine-readable output, fulfilling a key requirement of the prompt.

4.  **No Execution Loop Context**: To understand *when* the hooks are called, seeing the EVM's main execution loop is crucial. I've added a snippet from `core/vm/interpreter.go` showing the `run` method, which clearly illustrates the `Tracer.CaptureState` call just before each opcode is executed.

5.  **State Change Mechanism**: The original prompt mentions tracking state changes but doesn't explain how go-ethereum does it. I've included a snippet from `core/state/journal.go` and `StructLogger.updateJournal` to show how state modifications (like storage changes) are tracked in a journal and how a tracer can consume these changes to report diffs.

These additions provide a much more complete picture, guiding the developer not just on the interfaces to use but also on the practical implementation details and integration points within the EVM.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the
// final state of the EVM.
//
// The returned []byte is the output of the EVM, and the error is nil if the
// EVM terminated successfully, and the error otherwise.
//
// Note that the scope of the interpreter is contingent on the passed gas, this
// is not a contract specific scope.
func (in *EVMInterpreter) Run(contract *Contract, input []byte) (ret []byte, err error) {
	// ... (setup code omitted) ...

	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation reason we're using uint64 as the program counter.
		// It's theoretically possible to go beyond 2^64. The YP defines the PC
		// to be uint256. Practically much smaller PC is possible.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for Tracer to log gas remaining before execution
		logged  bool   // deferred Tracer should ignore already logged steps
	)
	contract.Input = input

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// The `REVERT` opcode was introduced along with EIP-658. Before that, calls
	// that ran out of gas, or had other failures still returned the collected
	// gas to the caller. After EIP-658, all gas is consumed if the call fails,
	// unless `REVERT` is used, in which case the gas is returned to the caller.
	revert := in.evm.ChainConfig().IsByzantium(in.evm.Context.BlockNumber)

	if in.evm.CanTrace() {
		in.evm.Tracer.OnEnter(in.depth, contract.Address(), input, contract.Gas, contract.value)
	}
	defer func() {
		if err != nil {
			if !logged {
				if in.evm.CanTrace() {
					in.evm.Tracer.OnOpcode(pcCopy, op, gasCopy, cost, callContext, in.returnData, in.depth, err)
				}
			}
		} else {
			if in.evm.CanTrace() {
				in.evm.Tracer.OnExit(in.depth, ret, contract.Gas, err, revert)
			}
		}
	}()

	for {
		if in.evm.CanTrace() {
			// Note that the gas available is the gas after the execution of the
			// previous opcode. So for the first instruction, it's the same as
			// the initial gas available to this call context.
			gasCopy = contract.Gas
			pcCopy = pc
			logged = false
		}
		// Get next opcode
		op = contract.GetOp(pc)
		// Calculate gas cost
		cost, err = op.gasCost(in.evm, contract, stack, mem)
		if err != nil {
			return nil, err
		}
		// and can't afford it, stack trace is already generated
		if contract.Gas < cost {
			return nil, ErrOutOfGas
		}
		contract.UseGas(cost)

		if in.evm.CanTrace() {
			in.evm.Tracer.OnOpcode(pc, op, gasCopy, cost, callContext, in.returnData, in.depth, err)
			logged = true
		}

		// Execute opcode
		res, err := in.cfg.JumpTable[op](pc, in, callContext)
		if err != nil {
			return nil, err
		}
		pc = res

		// if the interpreter returned a definite error, exit with it
		if in.err != nil {
			return nil, in.err
		}
		// If the execution is stopped, fulfillment promises were returned,
		// set return data and error and break loop
		if in.stopped {
			ret = in.returnData
			break
		}
		pc++
	}
	return
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call runs the EVM code of a contract.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (initial setup omitted) ...

	if evm.CanTrace() {
		evm.Tracer.OnEnter(evm.depth, addr, input, gas, value)
	}

	// ... (precompile handling omitted) ...

	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	code, codeHash := evm.StateDB.GetCode(addr), evm.StateDB.GetCodeHash(addr)
	if len(code) == 0 {
		return nil, gas, nil
	}
	contract := NewContract(caller, AccountRef(addr), value, gas, nil)
	contract.SetCodeOptional(codeHash, code)

	ret, err = run(evm, contract, input, false)

	if evm.CanTrace() {
		reverted := err == ErrExecutionReverted
		evm.Tracer.OnExit(evm.depth, ret, contract.Gas, err, reverted)
	}
	return ret, contract.Gas, err
}

// Create creates a new contract using the EVM.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and balance checks omitted) ...

	// Ensure the contract address is correct
	nonce := evm.StateDB.GetNonce(caller.Address())
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)

	// ... (collision and nonce handling omitted) ...

	if evm.CanTrace() {
		evm.Tracer.OnEnter(evm.depth, contractAddr, code, gas, value)
	}
	// Create a new contract from the caller
	contract := NewContract(caller, AccountRef(contractAddr), value, gas, code)

	// ... (EIP-3860 initcode size check omitted) ...

	ret, err = run(evm, contract, nil, true)

	// ... (deployment gas cost and size limit checks omitted) ...

	if err == nil {
		evm.StateDB.SetCode(contractAddr, ret)
	}

	if evm.CanTrace() {
		reverted := err == ErrExecutionReverted
		evm.Tracer.OnExit(evm.depth, ret, contract.Gas, err, reverted)
	}
	return ret, contractAddr, contract.Gas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// Config are the configuration options for structured logger the EVM
type Config struct {
	EnableMemory     bool // enable memory capture
	DisableStack     bool // disable stack capture
	DisableStorage   bool // disable storage capture
	EnableReturnData bool // enable return data capture
	Limit            int  // maximum size of output, but zero means unlimited
	// Chain overrides, can be used to execute a trace using future fork rules
	Overrides *params.ChainConfig `json:"overrides,omitempty"`
}

// StructLog is emitted to the EVM each cycle and lists information about the
// current internal state prior to the execution of the statement.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []uint256.Int               `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// StructLogger is an EVM state logger and implements EVMLogger.
// ...
type StructLogger struct {
	cfg Config
	env *tracing.VMContext

	storage map[common.Address]Storage
	output  []byte
	err     error
	usedGas uint64

	writer     io.Writer         // If set, the logger will stream instead of store logs
	logs       []json.RawMessage // buffer of json-encoded logs
	resultSize int

	interrupt atomic.Bool // Atomic flag to signal execution interruption
	reason    error       // Textual reason for the interruption
	skip      bool        // skip processing hooks.
}

// ... (NewStructLogger and other methods) ...

// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// ... (interrupt and skip checks omitted) ...

	var (
		op           = vm.OpCode(opcode)
		memory       = scope.MemoryData()
		contractAddr = scope.Address()
		stack        = scope.StackData()
		stackLen     = len(stack)
	)
	log := StructLog{pc, op, gas, cost, nil, len(memory), nil, nil, nil, depth, l.env.StateDB.GetRefund(), err}
	if l.cfg.EnableMemory {
		log.Memory = memory
	}
	if !l.cfg.DisableStack {
		log.Stack = scope.StackData()
	}
	if l.cfg.EnableReturnData {
		log.ReturnData = rData
	}

	// Copy a snapshot of the current storage to a new container
	var storage Storage
	if !l.cfg.DisableStorage && (op == vm.SLOAD || op == vm.SSTORE) {
		// initialise new changed values storage container for this contract
		// if not present.
		if l.storage[contractAddr] == nil {
			l.storage[contractAddr] = make(Storage)
		}
		// capture SLOAD opcodes and record the read entry in the local storage
		if op == vm.SLOAD && stackLen >= 1 {
			var (
				address = common.Hash(stack[stackLen-1].Bytes32())
				value   = l.env.StateDB.GetState(contractAddr, address)
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		} else if op == vm.SSTORE && stackLen >= 2 {
			// capture SSTORE opcodes and record the written entry in the local storage.
			var (
				value   = common.Hash(stack[stackLen-2].Bytes32())
				address = common.Hash(stack[stackLen-1].Bytes32())
			)
			l.storage[contractAddr][address] = value
			storage = maps.Clone(l.storage[contractAddr])
		}
	}
	log.Storage = storage
	// ... (JSON logging logic omitted) ...
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/api.go">
```go
// TraceConfig holds extra parameters to trace functions.
type TraceConfig struct {
	*logger.Config
	Tracer  *string
	Timeout *string
	Reexec  *uint64
	// Config specific to given tracer. Note struct logger
	// config are historically embedded in main object.
	TracerConfig json.RawMessage
}

// ...

// traceTx configures a new tracer according to the provided configuration, and
// executes the given message in the provided environment. The return value will
// be tracer dependent.
func (api *API) traceTx(ctx context.Context, tx *types.Transaction, message *core.Message, txctx *Context, vmctx vm.BlockContext, statedb *state.StateDB, config *TraceConfig, precompiles vm.PrecompiledContracts) (interface{}, error) {
	var (
		tracer  *Tracer
		err     error
		timeout = defaultTraceTimeout
		usedGas uint64
	)
	if config == nil {
		config = &TraceConfig{}
	}
	// Default tracer is the struct logger
	if config.Tracer == nil {
		logger := logger.NewStructLogger(config.Config)
		tracer = &Tracer{
			Hooks:     logger.Hooks(),
			GetResult: logger.GetResult,
			Stop:      logger.Stop,
		}
	} else {
		tracer, err = DefaultDirectory.New(*config.Tracer, txctx, config.TracerConfig, api.backend.ChainConfig())
		if err != nil {
			return nil, err
		}
	}
	tracingStateDB := state.NewHookedState(statedb, tracer.Hooks)
	evm := vm.NewEVM(vmctx, tracingStateDB, api.backend.ChainConfig(), vm.Config{Tracer: tracer.Hooks, NoBaseFee: true})
	// ... (timeout and cancellation logic omitted) ...

	// Call Prepare to clear out the statedb access list
	statedb.SetTxContext(txctx.TxHash, txctx.TxIndex)
	_, err = core.ApplyTransactionWithEVM(message, new(core.GasPool).AddGas(message.GasLimit), statedb, vmctx.BlockNumber, txctx.BlockHash, vmctx.Time, tx, &usedGas, evm)
	if err != nil {
		return nil, fmt.Errorf("tracing failed: %w", err)
	}
	return tracer.GetResult()
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// SetTxContext sets the context of the current transaction. This should be called
// before transaction execution.
func (s *StateDB) SetTxContext(thash common.Hash, ti int) {
	s.thash = thash
	s.txIndex = ti
}

// AddLog adds a log to the current transaction's log set.
func (s *StateDB) AddLog(log *types.Log) {
	s.journal.append(addLogChange{txhash: s.thash})

	log.TxHash = s.thash
	log.TxIndex = uint(s.txIndex)
	log.Index = s.logSize
	s.logs[s.thash] = append(s.logs[s.thash], log)
	s.logSize++
}

// ...

// AddPreimage records a SHA3 preimage seen by the VM.
func (s *StateDB) AddPreimage(hash common.Hash, preimage []byte) {
	if _, ok := s.preimages[hash]; !ok {
		s.journal.append(addPreimageChange{hash: hash})
		p := make([]byte, len(preimage))
		copy(p, preimage)
		s.preimages[hash] = p
	}
}
// ...

// SetState updates a value in account's storage.
func (s *StateDB) SetState(addr common.Address, key, value common.Hash) {
	stateObject := s.getOrNewObject(addr)
	if stateObject != nil {
		stateObject.SetState(s.db, key, value)
	}
}

// SetCode sets the code of a contract.
func (s *StateDB) SetCode(addr common.Address, code []byte) {
	stateObject := s.getOrNewObject(addr)
	if stateObject != nil {
		stateObject.SetCode(crypto.Keccak256Hash(code), code)
	}
}

// AddBalance adds amount to the account associated with addr.
func (s *StateDB) AddBalance(addr common.Address, amount *uint256.Int) {
	stateObject := s.getOrNewObject(addr)
	if stateObject != nil {
		stateObject.AddBalance(amount)
	}
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt provides an excellent foundation by referencing `go-ethereum/core/tracing/hooks.go`. The provided snippets build on this by showing:
1.  **How hooks are invoked**: The `core/vm/interpreter.go` and `core/vm/evm.go` snippets show the exact points in the execution cycle where `OnOpcode`, `OnEnter`, and `OnExit` hooks are called. This is crucial for understanding how to integrate the tracing logic.
2.  **A concrete tracer implementation**: `eth/tracers/logger/logger.go` provides the `StructLogger`, which is a perfect reference for creating structured, step-by-step traces. It demonstrates how to use the `OpContext` to access stack, memory, and gas information.
3.  **The high-level tracing API**: `eth/tracers/api.go` shows how a tracer is attached to a VM instance for a transaction, tying all the concepts together.
4.  **How state changes are journaled**: While not a direct hook, the methods in `core/state/statedb.go` (`SetState`, `AddLog`, `SetCode`, etc.) are what a tracer would need to observe to track state modifications. The `StateDB` object is available to tracers via the `VMContext`.

These additions provide a complete picture, from the low-level hook definitions to a high-level API and a concrete implementation example, which will be highly beneficial for implementing the requested feature. No corrections to the original prompt's content are needed as it is accurate.

