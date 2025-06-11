# Implement EIP-3155 Tracing

You are implementing EIP-3155 Tracing for the Tevm EVM written in Zig. Your goal is to implement EIP-3155 execution tracing for debugging support following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_eip` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_eip feat_implement_eip`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement EIP-3155 standard execution trace format for the EVM. This provides a standardized way to trace EVM execution, enabling debugging, analysis, and compatibility with Ethereum ecosystem tools that expect this trace format.

## ELI5

Think of this as installing a "black box" flight recorder in an airplane that captures every detail of what happens during flight. EIP-3155 tracing records every single step our EVM takes when executing smart contract code - what instruction it ran, how much gas it used, what was in memory and on the stack, and what went wrong if something failed. This detailed "flight log" is invaluable for debugging problems, understanding performance issues, and ensuring our EVM works correctly with existing Ethereum development tools that expect this standardized trace format.

## EIP-3155 Specification

### Trace Output Format
```json
{
  "pc": 0,
  "op": "PUSH1",
  "gas": "0x2540be3ff",
  "gasCost": "0x3",
  "memory": "0x",
  "memSize": 0,
  "stack": ["0x40"],
  "returnData": "0x",
  "depth": 1,
  "refund": 0,
  "opName": "PUSH1",
  "error": ""
}
```

### Required Fields
- **pc**: Program counter (integer)
- **op**: Opcode name (string)
- **gas**: Gas remaining before execution (hex string)
- **gasCost**: Gas consumed by operation (hex string)
- **memory**: Current memory contents (hex string)
- **memSize**: Memory size in bytes (integer)
- **stack**: Stack contents, top element last (array of hex strings)
- **returnData**: Return data from last call (hex string)
- **depth**: Call depth (integer)
- **refund**: Gas refund amount (integer)
- **opName**: Human readable opcode name (string)
- **error**: Error message if operation failed (string)

## Implementation Requirements

### Core Functionality
1. **Trace Collection**: Capture execution state at each opcode
2. **JSON Serialization**: Output traces in standard JSON format
3. **Memory Tracking**: Track memory changes and expansion
4. **Stack Monitoring**: Monitor stack operations and contents
5. **Gas Accounting**: Track gas consumption and refunds
6. **Error Reporting**: Capture and report execution errors

### Files to Create/Modify
- `/src/evm/tracing/eip3155_tracer.zig` - New EIP-3155 tracer implementation
- `/src/evm/tracing/trace_output.zig` - Trace output formatting
- `/src/evm/vm.zig` - Add tracing hooks to VM execution
- `/src/evm/frame.zig` - Add trace data collection
- `/test/evm/tracing/eip3155_test.zig` - Comprehensive tests

### Trace Integration Points
```zig
// Add to VM execution loop
pub fn execute_with_tracing(vm: *VM, tracer: *EIP3155Tracer) !ExecutionResult {
    while (vm.frame.pc < vm.frame.code.len) {
        // Capture pre-execution state
        tracer.capture_pre_execution(vm);
        
        // Execute opcode
        const result = vm.execute_next_opcode();
        
        // Capture post-execution state
        tracer.capture_post_execution(vm, result);
        
        if (result.should_stop) break;
    }
}
```

## Success Criteria

1. **EIP-3155 Compliance**: Fully implements EIP-3155 trace format specification
2. **Complete Coverage**: Traces all opcodes and execution states
3. **Accurate Data**: Correctly captures gas, memory, stack, and execution state
4. **JSON Compatibility**: Outputs valid JSON compatible with ecosystem tools
5. **Performance**: Minimal impact on execution performance when disabled
6. **Integration**: Works with existing VM and frame architecture

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



## EVMONE Context

An analysis of the `evmone` codebase reveals a robust tracing system that can serve as an excellent reference for implementing EIP-3155 tracing. The key components are the `Tracer` interface, the `InstructionTracer` implementation which builds a JSON-like trace, and its integration into the main execution loop.

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.hpp">
```cpp
// lib/evmone/tracing.hpp

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
// ...
EVMC_EXPORT std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out);
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/tracing.cpp">
```cpp
// lib/evmone/tracing.cpp

class InstructionTracer : public Tracer
{
    // ...
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
    // ...
};
// ...
std::unique_ptr<Tracer> create_instruction_tracer(std::ostream& out)
{
    return std::make_unique<InstructionTracer>(out);
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// lib/evmone/execution_state.hpp

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
    union
    {
        const baseline::CodeAnalysis* baseline = nullptr;
        const advanced::AdvancedCodeAnalysis* advanced;
    } analysis{};

    std::vector<const uint8_t*> call_stack;

    /// Stack space allocation.
    StackSpace stack_space;
    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/baseline_execution.cpp">
```cpp
// lib/evmone/baseline_execution.cpp

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
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
// lib/evmone/instructions_traits.hpp

/// The EVM instruction traits.
struct Traits
{
    /// The instruction name;
    const char* name = nullptr;

    // ... other fields
};

/// The global, EVM revision independent, table of traits of all known EVM instructions.
constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};

    table[OP_STOP] = {"STOP", 0, true, 0, 0, EVMC_FRONTIER, REV_EOF1};
    table[OP_ADD] = {"ADD", 0, false, 2, -1, EVMC_FRONTIER, REV_EOF1};
    // ...
    return table;
}();
```
</file>
</evmone>
## Prompt Corrections
The provided `evmone` tracer implementation offers a solid foundation but has some key differences from the EIP-3155 specification and the prompt's requirements. These should be considered during implementation:

1.  **`gasCost` Calculation**: The prompt requires the *total* gas consumed by an operation, including dynamic costs like memory expansion. The `evmone` tracer hook, `on_instruction_start`, is called *before* the instruction executes and can only report the *base* gas cost (`instr::gas_costs`). The prompt's proposed design of `capture_pre_execution` and `capture_post_execution` hooks is better suited to calculate the total `gasCost` by taking the difference in remaining gas (`gas_before - gas_after`).

2.  **Error Reporting**: The `error` field in the trace is for reporting operation failures. Since `evmone`'s tracer hook is pre-execution, it cannot know if the instruction will fail. The `post_execution` hook is the correct place to capture any `ExecutionError` from the opcode's result and include it in the trace.

3.  **Opcode Representation (`op` vs. `opName`)**: The prompt's example JSON shows `op` and `opName` as identical string values (e.g., "PUSH1"). The official EIP-3155 specification, however, defines `op` as the numeric opcode and `opName` as the human-readable string. The `evmone` `InstructionTracer` follows the latter, more standard approach. It is recommended to follow the official specification for better tooling compatibility.



## REVM Context

Excellent. I will review the `revm` codebase to find the most relevant code for implementing EIP-3155 tracing and format it as requested.

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/eip3155.rs">
```rust
//! [EIP-3155](https://eips.ethereum.org/EIPS/eip-3155) tracer [Inspector].

// ... (imports)

/// [EIP-3155](https://eips.ethereum.org/EIPS/eip-3155) tracer [Inspector].
pub struct TracerEip3155 {
    output: Box<dyn Write>,
    gas_inspector: GasInspector,
    // ... (other fields)
    stack: Vec<U256>,
    pc: u64,
    opcode: u8,
    gas: u64,
    refunded: i64,
    mem_size: usize,
    // ... (other fields)
}

// # Output
// The CUT MUST output a `json` object for EACH operation.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Output<'a> {
    // Required fields:
    /// Program counter
    pc: u64,
    // ...
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
    // ...
    /// Data returned by the function call
    return_data: &'static str,
    /// Amount of **global** gas refunded
    #[serde(serialize_with = "serde_hex_u64")]
    refund: u64,
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
    // ...
}

// ...

impl<CTX, INTR> Inspector<CTX, INTR> for TracerEip3155
where
    CTX: ContextTr,
    INTR: InterpreterTypes<Stack: StackTr + CloneStack>,
{
    // ...

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
        // ...
        self.opcode = interp.bytecode.opcode();
        self.mem_size = interp.memory.size();
        self.gas = interp.control.gas().remaining();
        self.refunded = interp.control.gas().refunded();
    }

    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        self.gas_inspector.step_end(interp.control.gas_mut());
        if self.skip {
            self.skip = false;
            return;
        }

        let value = Output {
            pc: self.pc,
            // ...
            op: self.opcode,
            gas: self.gas,
            gas_cost: self.gas_inspector.last_gas_cost(),
            stack: &self.stack,
            depth: context.journal().depth() as u64,
            // ...
            refund: self.refunded as u64,
            mem_size: self.mem_size as u64,
            op_name: OpCode::new(self.opcode).map(|i| i.as_str()),
            error: (!interp.control.instruction_result().is_ok())
                .then(|| format!("{:?}", interp.control.instruction_result())),
            memory: self.memory.take(),
            // ...
        };
        let _ = write_value(&mut self.output, &value);
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/inspector/src/inspector.rs">
```rust
//! EVM hooks into execution.

// ...

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
    /// If `interp.instruction_result` is set to anything other than [`interpreter::InstructionResult::Continue`]
    /// then the execution of the interpreter is skipped.
    #[inline]
    fn initialize_interp(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        // ...
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
        // ...
    }

    /// Called after `step` when the instruction has been executed.
    ///
    /// Setting `interp.instruction_result` to anything other than [`interpreter::InstructionResult::Continue`]
    /// alters the execution of the interpreter.
    #[inline]
    fn step_end(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX) {
        // ...
    }

    /// Called when a log is emitted.
    #[inline]
    fn log(&mut self, interp: &mut Interpreter<INTR>, context: &mut CTX, log: Log) {
        // ...
    }

    /// Called whenever a call to a contract is about to start.
    ///
    /// InstructionResulting anything other than [`interpreter::InstructionResult::Continue`] overrides the result of the call.
    #[inline]
    fn call(&mut self, context: &mut CTX, inputs: &mut CallInputs) -> Option<CallOutcome> {
        // ...
        None
    }

    /// Called when a call to a contract has concluded.
    ///
    /// The returned [CallOutcome] is used as the result of the call.
    ///
    /// This allows the inspector to modify the given `result` before returning it.
    #[inline]
    fn call_end(&mut self, context: &mut CTX, inputs: &CallInputs, outcome: &mut CallOutcome) {
        // ...
    }

    /// Called when a contract is about to be created.
    ///
    /// If this returns `Some` then the [CreateOutcome] is used to override the result of the creation.
    ///
    /// If this returns `None` then the creation proceeds as normal.
    #[inline]
    fn create(&mut self, context: &mut CTX, inputs: &mut CreateInputs) -> Option<CreateOutcome> {
        // ...
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
        // ...
    }
    
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/interpreter.rs">
```rust
//! Main interpreter structure that contains all components defines in [`InterpreterTypes`].

// ... (imports)

/// Main interpreter structure that contains all components defines in [`InterpreterTypes`].s
#[derive(Debug, Clone)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
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

// ...

/// The result of an interpreter operation.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "serde", derive(::serde::Serialize, ::serde::Deserialize))]
pub struct InterpreterResult {
    /// The result of the instruction execution.
    pub result: InstructionResult,
    /// The output of the instruction execution.
    pub output: Bytes,
    /// The gas usage information.
    pub gas: Gas,
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/instruction_result.rs">
```rust
//! Result of an instruction execution.
// ... (imports)

#[repr(u8)]
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub enum InstructionResult {
    // Success Codes
    #[default]
    /// Execution should continue to the next one.
    Continue = 0x00,
    /// Encountered a `STOP` opcode
    Stop,
    /// Return from the current call.
    Return,
    /// Self-destruct the current contract.
    SelfDestruct,
    /// Return a contract (used in contract creation).
    ReturnContract,

    // Revert Codes
    /// Revert the transaction.
    Revert = 0x10,
    // ...

    // Error Codes
    /// Out of gas error.
    OutOfGas = 0x50,
    /// Out of gas error encountered during memory expansion.
    MemoryOOG,
    // ...
    /// Unknown or invalid opcode.
    OpcodeNotFound,
    /// Invalid `CALL` with value transfer in static context.
    CallNotAllowedInsideStatic,
    /// Invalid state modification in static call.
    StateChangeDuringStaticCall,
    /// An undefined bytecode value encountered during execution.
    InvalidFEOpcode,
    /// Invalid jump destination. Dynamic jumps points to invalid not jumpdest opcode.
    InvalidJump,
    /// The feature or opcode is not activated in this version of the EVM.
    NotActivated,
    /// Attempting to pop a value from an empty stack.
    StackUnderflow,
    /// Attempting to push a value onto a full stack.
    StackOverflow,
    /// Invalid memory or storage offset.
    OutOfOffset,
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/gas.rs">
```rust
//! EVM gas calculation utilities.

// ...

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

impl Gas {
    // ...
    /// Returns the total amount of gas that was refunded.
    #[inline]
    pub const fn refunded(&self) -> i64 {
        self.refunded
    }

    /// Returns the total amount of gas spent.
    #[inline]
    pub const fn spent(&self) -> u64 {
        self.limit - self.remaining
    }

    /// Returns the amount of gas remaining.
    #[inline]
    pub const fn remaining(&self) -> u64 {
        self.remaining
    }
    // ...
    /// Records a refund value.
    #[inline]
    pub fn record_refund(&mut self, refund: i64) {
        self.refunded += refund;
    }
    // ...
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/opcode.rs">
```rust
//! EVM opcode definitions and utilities. It contains opcode information and utilities to work with opcodes.
// ...
impl OpCode {
    // ...
    /// Returns the opcode as a string. This is the inverse of [`parse`](Self::parse).
    #[doc(alias = "name")]
    #[inline]
    pub const fn as_str(self) -> &'static str {
        self.info().name()
    }
}
// ...
/// Information about opcode, such as name, and stack inputs and outputs
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct OpCodeInfo {
    // ...
    name_ptr: NonNull<u8>,
    name_len: u8,
    // ...
}
// ...
impl OpCodeInfo {
    /// Returns the opcode name.
    #[inline]
    pub const fn name(&self) -> &'static str {
        // SAFETY: `self.name_*` can only be initialized with a valid `&'static str`.
        unsafe {
            let slice = std::slice::from_raw_parts(self.name_ptr.as_ptr(), self.name_len as usize);
            core::str::from_utf8_unchecked(slice)
        }
    }
    // ...
}

/// Maps each opcode to its info.
pub static OPCODE_INFO: [Option<OpCodeInfo>; 256] = {
    // ... (macro generates this table)
};
```
</file>
</revm>

## Prompt Corrections
The original prompt is very well-structured. Based on the `revm` implementation, here are a few minor corrections and suggestions to align it more closely with a production-grade implementation:

1.  **Tracing Hook Granularity**: The prompt suggests `capture_pre_execution` and `capture_post_execution` hooks. A more robust and flexible pattern, as seen in `revm`, is to use `step` and `step_end` hooks.
    *   **`step(vm)`**: Called *before* an opcode is executed. This is the ideal place to capture the "before" state: `pc`, `op`, `gas`, `memory`, `stack`, `depth`.
    *   **`step_end(vm, result)`**: Called *after* the opcode has executed. This is the ideal place to calculate `gasCost` (by comparing gas before and after) and to capture any `error` from the execution result.

    This separation makes the logic cleaner and ensures you can accurately calculate the cost of the operation itself.

2.  **`gasCost` Calculation**: The `gasCost` is not directly available before execution. It should be calculated in the `step_end` hook by taking the difference between the gas available before the `step` and the gas remaining after. The `revm` `GasInspector` is a perfect example of this pattern.

3.  **`opName` Source**: The `op` and `opName` fields are identical. A good implementation detail from `revm` is having a static `OPCODE_INFO` table that maps the `u8` opcode to its string name and other properties. This avoids redundant logic and is highly efficient.

Here is a revised integration snippet incorporating these ideas:

```zig
// In the EVM execution loop
pub fn execute_with_tracing(vm: *VM, tracer: *EIP3155Tracer) !ExecutionResult {
    while (vm.frame.pc < vm.frame.code.len) {
        // Capture pre-execution state. The tracer should store the initial gas.
        tracer.step(vm);
        
        // Execute the next opcode
        const result = vm.execute_next_opcode();
        
        // Pass the result to the post-execution hook to capture gas cost and errors
        tracer.step_end(vm, result);
        
        if (result.should_stop) break;
    }
}

// In the tracer
pub fn step(tracer: *Tracer, vm: *VM) void {
    // Capture pc, op, stack, memory, depth, etc.
    // Store vm.gas_remaining to calculate cost later.
    tracer.last_gas = vm.gas_remaining;
}

pub fn step_end(tracer: *Tracer, vm: *VM, result: *OpResult) void {
    const gas_cost = tracer.last_gas - vm.gas_remaining;
    // Capture gas_cost, error (from result), and finalize the trace record.
}
```



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals how tracing is implemented. The core mechanism is event-driven, using a configurable `evm_trace` function that gets called at different points in the execution loop (e.g., before an opcode starts, after it ends, when gas is charged). This approach is more flexible than simple pre/post hooks, as it allows for capturing details like gas cost which might be calculated at various points within an opcode's execution.

The most relevant files are:
- `src/ethereum/trace.py`: Defines the different trace events that can be emitted.
- `src/ethereum_spec_tools/evm_tools/t8n/evm_trace.py`: Provides a concrete implementation of a tracer that formats these events into a JSON structure, closely matching the EIP-3155 requirements.
- `src/ethereum/shanghai/vm/interpreter.py`: Shows the main execution loop and where the `evm_trace` hooks are placed.
- `src/ethereum/shanghai/vm/__init__.py`: Defines the `Evm` and `Message` data structures, which contain the state that needs to be captured at each step (pc, stack, memory, gas, depth, etc.).
- `src/ethereum/shanghai/vm/instructions/__init__.py`: Provides the mapping from opcode byte values to their human-readable names.

These snippets provide a clear blueprint for implementing EIP-3155 tracing by showing what data to capture, when to capture it, and how to structure it.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum_spec_tools/evm_tools/t8n/evm_trace.py">
```python
# This file provides a concrete tracer implementation that closely matches
# the requirements of EIP-3155. It defines a `Trace` dataclass that mirrors
# the JSON output format and an `evm_trace` function that populates this
# dataclass based on events from the EVM.

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
    # ...

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
    # ... (setup code)

    if isinstance(event, TransactionStart):
        pass
    elif isinstance(event, TransactionEnd):
        final_trace = FinalTrace(event.gas_used, event.output, event.error)
        traces.append(final_trace)
        # ... (output handling)
    # ...
    elif isinstance(event, OpStart):
        op = event.op.value
        if op == "InvalidOpcode":
            op = "Invalid"
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
    elif isinstance(event, OpEnd):
        assert isinstance(last_trace, Trace)

        last_trace.gasCostTraced = True
        last_trace.errorTraced = True
    elif isinstance(event, OpException):
        # ... (error handling logic) ...
        elif not last_trace.errorTraced:
            # If the error for the last trace is not covered
            # the exception is attributed to the last trace.
            last_trace.error = type(event.error).__name__
            last_trace.errorTraced = True
    # ...
    elif isinstance(event, GasAndRefund):
        if len(traces) == 0:
            # In contract creation transactions, there may not be any traces
            return

        assert isinstance(last_trace, Trace)

        if not last_trace.gasCostTraced:
            last_trace.gasCost = hex(event.gas_cost)
            last_trace.refund = refund_counter
            last_trace.gasCostTraced = True
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/trace.py">
```python
# This file defines the event-driven tracing mechanism. The EVM emits different
# `TraceEvent`s during execution, which a tracer function can then consume.
# This model is more powerful than simple pre/post hooks.

@dataclass
class OpStart:
    """
    Trace event that is triggered before executing an opcode.
    """

    op: enum.Enum
    """
    Opcode that is about to be executed.
    """

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
    """
    Exception that was raised.
    """

@dataclass
class GasAndRefund:
    """
    Trace event that is triggered when gas is deducted.
    """

    gas_cost: int
    """
    Amount of gas charged or refunded.
    """


TraceEvent = Union[
    TransactionStart,
    TransactionEnd,
    PrecompileStart,
    PrecompileEnd,
    OpStart,
    OpEnd,
    OpException,
    EvmStop,
    GasAndRefund,
]

# The global tracer function can be swapped out.
_evm_trace: EvmTracer = discard_evm_trace

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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/interpreter.py">
```python
# This file shows the main execution loop of the EVM and where the
# `evm_trace` function is called, providing a model for where to place the
# tracing hooks in the Zig implementation.

def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.
    """
    # ... (initialization)

    evm = Evm(
        # ... (EVM state setup)
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

            # Pre-execution trace hook
            evm_trace(evm, OpStart(op))
            
            # Opcode execution
            op_implementation[op](evm)

            # Post-execution trace hook
            evm_trace(evm, OpEnd())

        evm_trace(evm, EvmStop(Ops.STOP))

    except ExceptionalHalt as error:
        # Error trace hook
        evm_trace(evm, OpException(error))
        evm.gas_left = Uint(0)
        evm.output = b""
        evm.error = error
    except Revert as error:
        # Revert trace hook
        evm_trace(evm, OpException(error))
        evm.error = error
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/__init__.py">
```python
# This file defines the `Evm` and `Message` dataclasses, which are crucial
# for understanding what state needs to be captured at each step of the trace.

@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """
    # ...
    depth: Uint
    # ...
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
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/shanghai/vm/instructions/__init__.py">
```python
# This file provides the `Ops` enum, which maps opcode byte values to their
# human-readable names. This is necessary for the `op` and `opName` fields
# in the EIP-3155 trace.

class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """
    # ...
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ...
    PUSH1 = 0x60
    # ...
    STOP = 0x00
    # ...

# The `op_implementation` dictionary maps the enum to the Python function
# that implements the opcode's logic.
op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    # ...
}
```
</file>
</execution-specs>

## Prompt Corrections
The original prompt's suggested implementation in `execute_with_tracing` is a good starting point, but slightly simplified compared to the `execution-specs` implementation.

**Key Correction**: Instead of a simple pre/post capture, the `execution-specs` use an event-driven approach. The most important difference is how `gasCost` is captured. The `gasCost` for an operation is not always known at the start and can be calculated in parts (e.g., base cost + memory expansion cost).

A more accurate implementation flow would be:
1. **Before opcode execution** (`OpStart` event): Capture `pc`, `op`, `gas` (before cost), `memory`, `stack`, `depth`, and `returnData`. The `gasCost` is initially unknown.
2. **During opcode execution**: When gas is consumed, a `GasAndRefund` event is fired. The tracer should capture this `gasCost` and associate it with the current step. It also captures the latest `refund` counter value at this point.
3. **After opcode execution** (`OpEnd` or `OpException` event): Capture any `error` that occurred.

This event-driven model ensures all components of the `gasCost` (static, dynamic, memory expansion) are accurately captured as they happen. The Zig implementation should model this by having the `tracer.capture_pre_execution` hook, but also having a way for `consume_gas` functions to report their costs back to the tracer for the current step.

---

An excellent and well-detailed prompt. Implementing EIP-3155 tracing requires deep integration with the EVM's core execution loop and state components. The following code snippets from the `execution-specs` codebase provide a clear reference for how these components are structured and interact, which will be crucial for capturing the required trace data at each step.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/interpreter.py">
```python
def execute_code(message: Message) -> Evm:
    """
    Executes bytecode present in the `message`.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: `ethereum.vm.EVM`
        Items containing execution specific objects
    """
    code = message.code
    valid_jump_destinations = get_valid_jump_destinations(code)

    evm = Evm(
        pc=Uint(0),
        stack=[],
        memory=bytearray(),
        code=code,
        gas_left=message.gas,
        valid_jump_destinations=valid_jump_destinations,
        logs=(),
        refund_counter=0,
        running=True,
        message=message,
        output=b"",
        accounts_to_delete=set(),
        touched_accounts=set(),
        return_data=b"",
        error=None,
        accessed_addresses=message.accessed_addresses,
        accessed_storage_keys=message.accessed_storage_keys,
    )
    try:
        # ... precompile handling ...

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
**Relevance**: This is the main execution loop. Your implementation will need to hook into a similar loop in `vm.zig`. The `evm_trace(evm, OpStart(op))` and `evm_trace(evm, OpEnd())` calls are analogous to your `tracer.capture_pre_execution` and `tracer.capture_post_execution` calls. The `Evm` object passed to these calls contains all the state needed for a trace step.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/__init__.py">
```python
@dataclass
class Message:
    """
    Items that are used by contract creation or message call.
    """

    # ... other fields ...
    caller: Address
    current_target: Address
    gas: Uint
    value: U256
    data: Bytes
    code: Bytes
    depth: Uint
    is_static: bool
    # ... other fields ...


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
**Relevance**: The `Evm` dataclass is the equivalent of your `Frame` and `Vm` structs combined. It holds all the necessary state for one step of execution, which you need to capture for your trace. Specifically, you will need to access fields like `pc`, `stack`, `memory`, `gas_left`, `refund_counter`, `return_data`, and `error`. The `Message` struct contains the call depth (`depth`).

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/gas.py">
```python
def charge_gas(evm: Evm, amount: Uint) -> None:
    """
    Subtracts `amount` from `evm.gas_left`.

    Parameters
    ----------
    evm :
        The current EVM.
    amount :
        The amount of gas the current operation requires.

    """
    evm_trace(evm, GasAndRefund(int(amount)))

    if evm.gas_left < amount:
        raise OutOfGasError
    else:
        evm.gas_left -= amount

def calculate_memory_gas_cost(size_in_bytes: Uint) -> Uint:
    """
    Calculates the gas cost for allocating memory
    to the smallest multiple of 32 bytes,
    such that the allocated size is at least as big as the given size.

    Parameters
    ----------
    size_in_bytes :
        The size of the data in bytes.

    Returns
    -------
    total_gas_cost : `ethereum.base_types.Uint`
        The gas cost for storing data in memory.
    """
    size_in_words = ceil32(size_in_bytes) // Uint(32)
    linear_cost = size_in_words * GAS_MEMORY
    quadratic_cost = size_in_words ** Uint(2) // Uint(512)
    total_gas_cost = linear_cost + quadratic_cost
    try:
        return total_gas_cost
    except ValueError:
        raise OutOfGasError
```
**Relevance**: Your tracer needs to report `gas` (before op) and `gasCost` (consumed by op). The `charge_gas` function shows how gas is deducted from `evm.gas_left`. The `gasCost` will be the sum of constant gas for the opcode and any dynamic gas, such as the memory expansion cost calculated by `calculate_memory_gas_cost`. You will need to capture `gas_left` before and after the operation to determine the `gasCost`.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # Arithmetic Ops
    ADD = 0x01
    MUL = 0x02
    SUB = 0x03
    # ... more opcodes

op_implementation: Dict[Ops, Callable] = {
    Ops.STOP: control_flow_instructions.stop,
    Ops.ADD: arithmetic_instructions.add,
    Ops.MUL: arithmetic_instructions.mul,
    # ... more implementations
}
```
**Relevance**: This enum and dictionary map opcode bytes to their string names (`opName`). Your implementation will need a similar mapping to populate the `op` and `opName` fields in the trace output. Your `jump_table/operation_config.zig` file seems to be the direct equivalent.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/instructions/environment.py">
```python
def returndatasize(evm: Evm) -> None:
    """
    Pushes the size of the return data buffer onto the stack.
    ...
    """
    # ...
    push(evm.stack, U256(len(evm.return_data)))
    # ...

def returndatacopy(evm: Evm) -> None:
    """
    Copies data from the return data buffer code to memory
    ...
    """
    # ...
    value = evm.return_data[
        return_data_start_position : return_data_start_position + size
    ]
    memory_write(evm.memory, memory_start_index, value)
    # ...
```
**Relevance**: These opcodes demonstrate how `return_data` is handled. The `evm.return_data` field holds the output from the *most recent sub-call*, which is exactly what EIP-3155 requires for the `returnData` field in each trace step. Your `Frame` or `Vm` struct should have an equivalent field to capture this.

</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/london/vm/exceptions.py">
```python
class ExceptionalHalt(EthereumException):
    """
    Indicates that the EVM has experienced an exceptional halt. This causes
    execution to immediately end with all gas being consumed.
    """

class Revert(EthereumException):
    """
    Raised by the `REVERT` opcode.

    Unlike other EVM exceptions this does not result in the consumption of all
    gas.
    """

class StackUnderflowError(ExceptionalHalt):
    """
    Occurs when a pop is executed on an empty stack.
    """

class OutOfGasError(ExceptionalHalt):
    """
    Occurs when an operation costs more than the amount of gas left in the
    frame.
    """
# ... and many more
```
**Relevance**: The `error` field in the trace needs to be populated when an operation fails. This file shows the various exception types that can occur. Your `execution/execution_error.zig` file is the equivalent, and you will need to catch these errors and map their string representations into the trace.

</file>
</execution-specs>
<prompt-corrections>
- The EIP-3155 specification for `op` is `Opcode name (string)`. Your example JSON shows `op: "PUSH1"` and `opName: "PUSH1"`. Many tools, like Geth's tracer, use `op` for the numeric opcode (e.g., `96` for `PUSH1`) and `opName` for the string mnemonic. To maximize compatibility, you might consider using the numeric value for `op` and the string for `opName`. If you stick to the provided JSON format, ensure both are the string name.
- The `execute_with_tracing` example in the prompt is a good conceptual model. In practice, the tracing logic should be integrated directly into your existing `Vm.interpret_with_context` loop, capturing state before and after the `self.table.execute(...)` call. The state required for each step (PC, stack, memory) is primarily in the `Frame` struct, not just the top-level `Vm` struct.
- The prompt specifies a `refund` field. This corresponds to the `refund_counter` in the `Evm` object of the specs (and likely `contract.gas_refund` in your implementation). This counter accumulates refunds from `SSTORE` and `SELFDESTRUCT` and should be captured at each step.
</prompt-corrections>



## GO-ETHEREUM Context

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLog is a structured log message used in the EVM tracer.
type StructLog struct {
	Pc            uint64             `json:"pc"`
	Op            vm.OpCode          `json:"op"`
	Gas           uint64             `json:"gas"`
	GasCost       uint64             `json:"gasCost"`
	Memory        []byte             `json:"memory,omitempty"`
	MemorySize    int                `json:"memSize"`
	Stack         []*uint256.Int     `json:"stack,omitempty"`
	ReturnData    []byte             `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth         int                `json:"depth"`
	RefundCounter uint64             `json:"refund"`
	Err           error              `json:"-"`
	ErrString     string             `json:"error,omitempty"`
}

// OpCode is a copy of vm.OpCode for marshaling purposes.
type OpCode byte

// MarshalText implements encoding.TextMarshaler.
func (op OpCode) MarshalText() ([]byte, error) {
	return []byte(vm.OpCode(op).String()), nil
}

// MarshalJSON implements json.Marshaler.
func (l *StructLog) MarshalJSON() ([]byte, error) {
	type NoMethod StructLog
	return json.Marshal(&struct {
		*NoMethod
		OpName string `json:"opName"` // adds opName
	}{
		NoMethod: (*NoMethod)(l),
		OpName:   l.Op.String(),
	})
}

// UnmarshalJSON implements json.Unmarshaler.
func (l *StructLog) UnmarshalJSON(input []byte) error {
	type NoMethod StructLog
	var dec *NoMethod = (*NoMethod)(l)
	return json.Unmarshal(input, dec)
}

// StructLogger is a EVM state logger and implements Tracer.
//
// StructLogger can be used to capture execution traces of a transaction on a
// step-by-step basis. A new StructLogger is created for each transaction.
//
// Note, the op-codes and the returned memory, stack and storage are copies and can be
// modified freely without worrying about side-effects.
type StructLogger struct {
	cfg            *Config
	logs           []StructLog
	storage        map[common.Address]map[common.Hash]common.Hash
	err            error
	interrupt      *atomic.Bool // pointer to transaction interrupt flag
	reason         error        // text reason for the interruption
	callFrameStack []vm.OpContext
}

// NewStructLogger returns a new logger that is used to step through an EVM
// execution and record the state changes in a structured way.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		cfg:     cfg,
		storage: make(map[common.Address]map[common.Hash]common.Hash),
	}
	if cfg != nil && cfg.EnableMemory {
		//Empiric testing shows that this is a good value to accommodate for chain reorgs
		logger.callFrameStack = make([]vm.OpContext, 0, 10)
	}
	return logger
}

// CaptureStart is called once before the start of a transaction.
func (l *StructLogger) CaptureStart(env *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	if l.cfg != nil && l.cfg.EnableMemory {
		l.callFrameStack = append(l.callFrameStack, env.Context)
	}
}

// CaptureState is called for each step of the EVM and collects all the useful data.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// check if the tracer was interrupted
	if l.interrupt != nil && l.interrupt.Load() {
		scope.EVM.Cancel()
		return
	}

	// copy stack
	var stack []*uint256.Int
	if l.cfg == nil || !l.cfg.DisableStack {
		// note: stack is a slice of references. so we need to copy the items one by one.
		// `append` would not be sufficient.
		stack = make([]*uint256.Int, scope.Stack.Len())
		for i, d := range scope.Stack.Data() {
			stack[i] = new(uint256.Int).Set(d)
		}
	}

	// copy memory
	var memory []byte
	if l.cfg != nil && l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}

	// copy return data
	var returnData []byte
	if l.cfg != nil && l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}

	// copy storage
	var storage map[common.Hash]common.Hash
	if l.cfg != nil && !l.cfg.DisableStorage {
		// Only create a new map if there are any changes
		if len(l.storage[scope.Contract.Address()]) > 0 {
			storage = make(map[common.Hash]common.Hash)
			for k, v := range l.storage[scope.Contract.Address()] {
				storage[k] = v
			}
		}
		// any changes to the state of this contract is cleared after the step
		l.storage[scope.Contract.Address()] = nil
	}

	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    returnData,
		Storage:       storage,
		Depth:         depth,
		RefundCounter: scope.StateDB.GetRefund(),
		Err:           err,
	}
	l.logs = append(l.logs, log)
}

// CaptureFault is called when an error occurs during the execution of an opcode.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.CaptureState(pc, op, gas, cost, scope, nil, depth, err)
}

// CaptureEnd is called after the call finishes to finalize the trace.
func (l *StructLogger) CaptureEnd(output []byte, gasUsed uint64, err error) {
	if l.err != nil {

		// Note that the error will be set by the last executed frame
		// in the case that the error is not set yet.
		// In the case that the error is already set, this means that
		// a previous frame has errored and we should not overwrite it.
		return
	}
	l.err = err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and executes the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for ErrExecutionReverted
// which means revert-and-keep-gas-left.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code omitted for brevity)

	// The Interpreter main run loop
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = &ScopeContext{
			Memory:   mem,
			Stack:    stack,
			Contract: contract,
		}
		// For optimisation, leave the relative pc to the returned offset
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the defer
		gasCopy uint64 // for EVM tracer
		logged  bool   // step sent to tracer.
	)
	// Don't move this deferred method in a loop, it needs to be executed only once
	// after the execution is done, and not after each op.
	if in.cfg.Tracer != nil {
		defer func() {
			if err != nil {
				if !logged {
					in.cfg.Tracer.CaptureState(pc, op, gasCopy, cost, callContext, in.returnData, in.depth, err)
				} else {
					in.cfg.Tracer.CaptureFault(pc, op, gasCopy, cost, callContext, in.depth, err)
				}
			}
			in.cfg.Tracer.CaptureEnd(ret, contract.Gas-gasCopy, err)
		}()
	}
	for {
		if in.cfg.Tracer != nil {
			// Note that the gas cost of the current opcode is not charged yet.
			// It will be charged after this hook.
			gasCopy = contract.Gas
			in.cfg.Tracer.CaptureState(pc, op, gasCopy, cost, callContext, in.returnData, in.depth, err)
			logged = true
		}

		// Get next opcode
		op = contract.GetOp(pc)
		cost = GasCost(op, in.evm.chainRules, callContext)

		// ... (opcode execution logic)

		switch op {
		// ... (case for each opcode)
		default:
			// handle invalid opcode
			err = ErrInvalidOpcode
		}
        // ... (error handling and loop continuation)
		if err != nil {
			return nil, err
		}
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Call executes the contract associated with the destination address.
//
// It can be called from within an existing contract to either call other contracts
// or send value to other accounts.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ...
	evm.depth++
	defer func() { evm.depth-- }()

	// ...
	if evm.Context.Tracer != nil {
		// It's not really possible to do this from within the opcode implementations,
		// so we do it here, which is not fully accurate. For one, it's not possible to
		// get the remaining gas of the caller, since it's not passed into the evm.
		// All we can do is have the tracer start with the same gas as we do.
		evm.Context.Tracer.CaptureEnter(evm.depth, byte(CALL), caller.Address(), addr, input, gas, value.ToBig())
		defer func() {
			evm.Context.Tracer.CaptureExit(evm.depth, ret, leftOverGas, err, false)
		}()
	}
	// ... (execution logic)
	return ret, leftOverGas, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/opcodes.go">
```go
// OpCode is a single byte representing an opcode.
type OpCode byte

// String returns the string representation of the opcode.
func (op OpCode) String() string {
	if s := opCodeToString[op]; s != "" {
		return s
	}
	return fmt.Sprintf("opcode 0x%x not defined", int(op))
}

// opCodeToString contains the string representations of all opcodes.
var opCodeToString = [256]string{
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	SUB:        "SUB",
	DIV:        "DIV",
	SDIV:       "SDIV",
	MOD:        "MOD",
	SMOD:       "SMOD",
	ADDMOD:     "ADDMOD",
	MULMOD:     "MULMOD",
	EXP:        "EXP",
	SIGNEXTEND: "SIGNEXTEND",
	// ... and so on for all opcodes
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
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

// ...

type (
	/*
		- VM events -
	*/

	// EnterHook is invoked when the processing of a message starts.
	EnterHook = func(depth int, typ byte, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// ExitHook is invoked when the processing of a message ends.
	ExitHook = func(depth int, output []byte, gasUsed uint64, err error, reverted bool)

	// OpcodeHook is invoked just prior to the execution of an opcode.
	OpcodeHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)

	// FaultHook is invoked when an error occurs during the execution of an opcode.
	FaultHook = func(pc uint64, op byte, gas, cost uint64, scope OpContext, depth int, err error)
    
    // ...
)

// Hooks contains all the hooks that can be registered with the EVM.
// These hooks are called during the execution of a transaction.
// Any of these can be nil.
type Hooks struct {
	// VM events
	OnTxStart   TxStartHook
	OnTxEnd     TxEndHook
	OnEnter     EnterHook
	OnExit      ExitHook
	OnOpcode    OpcodeHook
	OnFault     FaultHook
	OnGasChange GasChangeHook
	// ... (other hooks omitted)
}
```
</file>
</go-ethereum>

## Prompt Corrections
The EIP-3155 specification in the prompt lists both `op` (opcode name string) and `opName` (human readable opcode name string). This seems redundant. The Go-Ethereum `StructLogger` implementation has a single `Op` field of type `vm.OpCode` which is then marshalled to its string representation (e.g., `PUSH1`).

**Recommendation**: Implement a single `op` field as a string and use it for both purposes, simplifying the trace struct and aligning with Go-Ethereum's practical implementation.

Example from Geth's `logger.go`:
```go
// OpCode is a copy of vm.OpCode for marshaling purposes.
type OpCode byte

// MarshalText implements encoding.TextMarshaler.
func (op OpCode) MarshalText() ([]byte, error) {
	return []byte(vm.OpCode(op).String()), nil
}

// MarshalJSON implements json.Marshaler.
func (l *StructLog) MarshalJSON() ([]byte, error) {
	type NoMethod StructLog
	return json.Marshal(&struct {
		*NoMethod
		OpName string `json:"opName"` // adds opName
	}{
		NoMethod: (*NoMethod)(l),
		OpName:   l.Op.String(), // Here opName is derived from Op
	})
}
```
In this case, `Op` is the byte value and `OpName` is the string. The Zig implementation can just store the string name directly.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLog is a structured log message used in the EVM tracer.
type StructLog struct {
	Pc         uint64         `json:"pc"`
	Op         OpCode         `json:"op"`
	Gas        uint64         `json:"gas"`
	GasCost    uint64         `json:"gasCost"`
	Memory     []byte         `json:"memory"`
	Stack      []*uint256.Int `json:"stack"`
	ReturnData []byte         `json:"returnData"`
	Depth      int            `json:"depth"`
	Refund     uint64         `json:"refund"`
	Err        error          `json:"-"`
	OpName     string         `json:"opName"` // Added for op-code name
	Error      string         `json:"error,omitempty"`
}

// StructLogger is a EVM state logger and captures each step of the EVM execution.
// It can be used to debugging and tracing.
type StructLogger struct {
	cfg *Config

	logs            []StructLog
	changed         map[common.Address]struct{}
	err             error
	capture         nextCapture
	inInterp        bool // whether we are in the interpreter loop, or in a precompile
	output          []byte
	interrupt       *atomic.Bool // pointer to the external interrupt indicator.
	reason          error        // reason for stopping the execution
	disasm          *disasm.Disassembler
	activePreimages map[common.Hash]struct{}
}

// Tracer is the interface for EVM state logging.
//
// Implementations of this interface are not thread safe.
type Tracer interface {
	// CaptureStart is called once at the beginning of an execution.
	CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)

	// CaptureState is called on each step of the VM execution.
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)

	// CaptureFault is called when an error occurs during the execution of an opcode.
	// It is not called if `CaptureState` returns an error.
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)

	// CaptureEnd is called when the execution has finished.
	CaptureEnd(output []byte, gasUsed uint64, err error)

	// CaptureEnter is called when the EVM enters a new frame (via call, create).
	CaptureEnter(typ, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)

	// CaptureExit is called when the EVM exits a frame (via return, revert, selfdestruct).
	CaptureExit(output []byte, gasUsed uint64, err error)
}


// CaptureState captures the system state before the opcode is executed.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// check if the tracer wants to capture this step
	if !l.cfg.EnableMemory && !l.cfg.DisableStack && !l.cfg.EnableReturnData {
		return
	}
	// copy stack
	var stack []*uint256.Int
	if !l.cfg.DisableStack {
		stack = scope.Stack.slice()
		for i, j := 0, len(stack)-1; i < j; i, j = i+1, j-1 {
			stack[i], stack[j] = stack[j], stack[i] // shallow copy is enough
		}
	}
	// copy memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// copy return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}
	// create and append trace log
	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		Stack:      stack,
		ReturnData: returnData,
		Depth:      depth,
		Refund:     scope.StateDB.GetRefund(),
		Err:        err,
		OpName:     op.String(),
	}
	if err != nil {
		log.Error = err.Error()
	}
	l.logs = append(l.logs, log)
}

// CaptureFault captures an execution error for the last opcode.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	if len(l.logs) > 0 {
		l.logs[len(l.logs)-1].Err = err
		l.logs[len(l.logs)-1].Error = err.Error()
	}
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/gen_structlog_json.go">
```go
// Code generated by github.com/fjl/gencodec. DO NOT EDIT.

package vm

import (
	"encoding/json"
	"math/big"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/holiman/uint256"
)

// MarshalJSON marshals as JSON.
func (s StructLog) MarshalJSON() ([]byte, error) {
	type StructLog struct {
		Pc         uint64              `json:"pc"`
		Op         string              `json:"op"`
		Gas        uint64              `json:"gas"`
		GasCost    uint64              `json:"gasCost"`
		Memory     hexutil.Bytes       `json:"memory"`
		MemorySize int                 `json:"memSize"`
		Stack      []hexutil.Uint256   `json:"stack"`
		ReturnData hexutil.Bytes       `json:"returnData"`
		Depth      int                 `json:"depth"`
		Refund     uint64              `json:"refund"`
		Error      string              `json:"error,omitempty"`
	}
	var enc StructLog
	enc.Pc = s.Pc
	enc.Op = s.Op.String()
	enc.Gas = s.Gas
	enc.GasCost = s.GasCost
	enc.Memory = s.Memory
	enc.MemorySize = len(s.Memory)
	if s.Stack != nil {
		enc.Stack = make([]hexutil.Uint256, len(s.Stack))
		for i, st := range s.Stack {
			enc.Stack[i] = (hexutil.Uint256)(*st)
		}
	}
	enc.ReturnData = s.ReturnData
	enc.Depth = s.Depth
	enc.Refund = s.Refund
	if s.Err != nil {
		enc.Error = s.Err.Error()
	}
	return json.Marshal(&enc)
}

```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		callContext = newScopeContext(mem, stack, contract)
		// For optimisation, we have a jump table and evm ptr in the struct.
		opExecutionStart = time.Now()
	)
	// ...

	for {
		// ...
		// Get the operation from the jump table
		op = contract.GetOp(pc)
		operation = in.cfg.JumpTable[op]
		if operation == nil {
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// If the operation is valid, get the gas cost
		cost, err = operation.gasCost(in.evm, contract, stack, mem)
		if err != nil {
			return nil, err
		}
		// Validate stack
		if err = operation.validateStack(stack); err != nil {
			return nil, err
		}
		// Validate memory
		if err = operation.validateMemory(stack, mem, cost); err != nil {
			return nil, err
		}

		// Capture the state if a logger is configured
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(pc, op, gas, cost, callContext, in.returnData, in.evm.depth, err)
		}
		//...
		// Execute the operation
		res, err = operation.execute(&pc, in, callContext)
		//...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a no-reuse stack that can be used to store data for the EVM.
type Stack struct {
	data []*uint256.Int
}

// newstack returns a new stack with the default size.
func newstack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 16)}
}

// Data returns the underlying data of the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}

// push pushes an element to the top of the stack.
//
// NOTE: this method is not thread safe and should only be used within the EVM.
func (st *Stack) push(d *uint256.Int) {
	st.data = append(st.data, d)
}

// pop pops the top element from the stack and returns it.
//
// NOTE: this method is not thread safe and should only be used within the EVM.
func (st *Stack) pop() (ret *uint256.Int) {
	ret = st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return
}

// slice returns a clone of the stack as a slice of uint256.Int.
// The returned slice is not safe for concurrent use.
func (st *Stack) slice() []*uint256.Int {
	ret := make([]*uint256.Int, len(st.data))
	for i, item := range st.data {
		ret[i] = new(uint256.Int).Set(item)
	}
	return ret
}
```
</file>
</go-ethereum>

## Prompt Corrections
- **`op` vs `opName`**: The prompt lists `op` (opcode name) and `opName` (human readable opcode name) as separate required fields. In go-ethereum's implementation, the `StructLog` struct has a single `Op` field of type `OpCode`. During JSON serialization, this is converted to its string representation (e.g., "PUSH1") and assigned to the `op` key in the JSON output. There is no separate `opName` field in the final trace.
- **Stack Order**: The prompt specifies "stack contents, top element last". Go-ethereum's stack implementation has the top element at the end of its internal slice. `StructLogger.CaptureState` reverses this slice, which would make the top element appear *first* in the trace's stack array. This might be a difference in convention. For compatibility with existing tools that expect Geth traces, you should verify the expected order. The `geth_trace` RPC standard usually implies top-is-last. The code for copying the stack is provided above for reference.
- **`memSize` Field**: The go-ethereum `StructLog` struct does not have a `memSize` field. Instead, this value is derived during JSON serialization by taking the length of the `memory` byte array (`enc.MemorySize = len(s.Memory)`). This is an efficient approach to avoid redundant data.
- **Numeric Fields**: The prompt specifies `gas` and `gasCost` as hex strings. Go-ethereum's JSON marshaler for `StructLog` encodes them as standard unsigned integers (`uint64`). While most JSON parsers can handle both, this is a minor format difference to be aware of for strict compatibility.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/logger.go">
```go
// StructLogger is a EVM logger for structured logging.
// It provides a standardized log format for execution tracing.
// It is the reference implementation for EIP-3155.
type StructLogger struct {
	cfg              *Config
	storage          map[common.Address]map[common.Hash]common.Hash
	logs             []StructLog
	err              error
	captureReason    bool // If true, the reason for the capture is also captured
	reason           string
	interrupt        *atomic.Bool // pointer to the abort interrupt flag
	interruptTriggered bool         // true if the interrupt has been triggered
}

// NewStructLogger returns a new logger that records execution traces.
//
// The reason parameter is purely for printing and debugging reasons.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		cfg:     cfg,
		storage: make(map[common.Address]map[common.Hash]common.Hash),
	}
	if cfg != nil {
		logger.captureReason = cfg.Debug
		logger.interrupt = cfg.Interrupt
	}
	return logger
}

// CaptureStart is called when an execution starts.
func (l *StructLogger) CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
}

// CaptureEnd is called when an execution ends.
func (l *StructLogger) CaptureEnd(output []byte, gasUsed uint64, err error) {
}

// CaptureState is called for each step of the EVM.
func (l *StructLogger) CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error) {
	// Don't continue if interrupt has been triggered
	if l.interruptFired() {
		return
	}
	stack := scope.Stack.copy()
	memory := scope.Memory.copy()

	// create a snapshot of the corresponding storage.
	var storage map[common.Hash]common.Hash
	if l.cfg != nil && l.cfg.EnableStorage {
		storage = l.cloneStorage(scope.Contract.Address())
	}

	// capture the error message
	var errorStr string
	if err != nil {
		errorStr = err.Error()
	}
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           gas,
		GasCost:       cost,
		Memory:        memory,
		MemorySize:    len(memory),
		Stack:         stack.Data(),
		ReturnData:    rData,
		Storage:       storage,
		Depth:         depth,
		Err:           errorStr,
		OpName:        op.String(), // opName is the human-readable opcode name
		GasRefund:     scope.StateDB.GetRefund(),
	}
	if l.captureReason {
		log.Reason = l.reason
	}
	l.logs = append(l.logs, log)
}

// CaptureFault is called when an error occurs during the execution of an opcode.
func (l *StructLogger) CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error) {
	l.CaptureState(pc, op, gas, cost, scope, nil, depth, err)
}

// StructLog is a structured log message used in the EVM tracer.
type StructLog struct {
	Pc         uint64                     `json:"pc"`
	Op         OpCode                     `json:"op"`
	Gas        uint64                     `json:"gas"`
	GasCost    uint64                     `json:"gasCost"`
	Memory     []byte                     `json:"memory"`
	MemorySize int                        `json:"memSize"`
	Stack      []*big.Int                 `json:"stack"`
	ReturnData []byte                     `json:"returnData"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth      int                        `json:"depth"`
	Refund     uint64                     `json:"refund,omitempty"`
	Err        string                     `json:"error,omitempty"`
	Reason     string                     `json:"reason,omitempty"`

	// OpName is the human-readable opcode name.
	// This is not part of the official struct log, but a Geth extension.
	OpName string `json:"opName,omitempty"`

	// GasRefund is the amount of gas that will be refunded to the sender.
	// This is not part of the official struct log, but a Geth extension.
	GasRefund uint64 `json:"refund,omitempty"`
}

// opCode marshals as a hex string
func (l *StructLog) MarshalJSON() ([]byte, error) {
	// ...
	// The implementation handles custom JSON marshalling for different fields.
	// For example, it marshals byte slices as hex strings.
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no refunds whatsoever.
func (in *Interpreter) Run(contract *Contract, input []byte, static bool) (ret []byte, err error) {
	// ... (setup code)

	// Don't bother with the execution loop if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}

	// Main loop dispatching operations
	for {
		// Capture pre-execution state for tracing
		if cfg.Tracer != nil {
			cfg.Tracer.CaptureState(pc, op, gas, cost, scope, in.returnData, in.evm.depth, err)
		}

		// Execute the operation
		res, err = operation.execute(&pc, in, &callCtx)

		// ... (gas accounting)

		// If the tracer captured a fault, exit the loop
		if err != nil {
			break
		}
		// Update PC and gas for the next iteration
		pc++
	}

	// Capture end of execution for tracing
	if cfg.Tracer != nil {
		cfg.Tracer.CaptureEnd(ret, gas-contract.Gas, err)
	}
	return ret, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// OpCode is a single byte representing an opcode in the Ethereum Virtual Machine.
type OpCode byte

// String returns the string representation of the opcode
func (op OpCode) String() string {
	if op >= PUSH1 && op <= PUSH32 {
		return "PUSH"
	}
	if op >= DUP1 && op <= DUP16 {
		return "DUP"
	}
	if op >= SWAP1 && op <= SWAP16 {
		return "SWAP"
	}
	if op >= LOG0 && op <= LOG4 {
		return "LOG"
	}
	str := opCodeToString[op]
	if str == "" {
		return fmt.Sprintf("opcode 0x%x not defined", int(op))
	}
	return str
}

var opCodeToString = map[OpCode]string{
	// 0x0 range - arithmetic ops
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	SUB:        "SUB",
	DIV:        "DIV",
	SDIV:       "SDIV",
	MOD:        "MOD",
	SMOD:       "SMOD",
	ADDMOD:     "ADDMOD",
	MULMOD:     "MULMOD",
	EXP:        "EXP",
	SIGNEXTEND: "SIGNEXTEND",

	// 0x10 range - bit ops
	LT:     "LT",
	GT:     "GT",
	SLT:    "SLT",
	SGT:    "SGT",
	EQ:     "EQ",
	ISZERO: "ISZERO",
	AND:    "AND",
	OR:     "OR",
	XOR:    "XOR",
	NOT:    "NOT",
	BYTE:   "BYTE",
	SHL:    "SHL",
	SHR:    "SHR",
	SAR:    "SAR",

	// ... (rest of the opcodes)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a stack for 256-bit words.
type Stack struct {
	data []*big.Int
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*big.Int {
	return st.data
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents a simple memory model for the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{}
}

// Data returns the contents of the memory as a byte slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt contains a few inaccuracies when compared to the go-ethereum reference implementation (`StructLogger`) of EIP-3155.

1.  **`op` vs `opName`**:
    *   The prompt lists both `op` and `opName` as the string name of the opcode (e.g., `"PUSH1"`).
    *   In go-ethereum, `op` is the *byte value* of the opcode (e.g., `0x60`), while `opName` is the human-readable string. The JSON output from geth only includes `op`, which is marshalled into the string name. For clarity and compatibility, it's best to implement one field, likely `op`, and have it contain the string name as shown in the EIP-3155 example. Your Zig implementation should use `opName` as the field name to match the EIP example and serialize the string representation of the opcode there.

2.  **`refund` field**:
    *   The prompt specifies a `refund` field to be captured at each step.
    *   Go-ethereum's `StructLogger` implementation does **not** capture the gas refund counter at every step. It captures the `GasRefund` value in the `StructLog` struct, which represents the total accumulated refund *at that point in time*. This field is a geth extension and not part of the minimal EIP-3155 spec.
    *   **Recommendation**: Implement `refund` as the *total accumulated gas refund* before the instruction executes, which aligns with geth's behavior. This value can be retrieved from the state database's refund counter.

3.  **`error` field**:
    *   The prompt's example shows `error: ""`.
    *   In go-ethereum, the `error` field is only populated on the step where the error *occurs*. On all other steps, this field should be an empty string or omitted from the JSON output if possible. The `CaptureFault` hook is specifically designed for this purpose.

4.  **`gasCost` calculation**:
    *   The `gasCost` is the cost of the *current* operation. It's important to distinguish this from the *total gas used* so far. The go-ethereum `CaptureState` hook correctly receives both `gas` (remaining before op) and `cost` (for the current op).

By following the `StructLogger` implementation in `go-ethereum/core/vm/logger.go` as a reference, you will achieve the desired compatibility with existing tools.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLogger is a EVM logger that captures all structural data from the EVM
// and logs it as structured data.
type StructLogger struct {
	cfg        Config
	storage    map[common.Address]types.Storage
	logs       []*StructLog
	output     []byte
	err        error
	txStart    time.Time
	txGas      uint64
	statedb    vm.StateDB
	evm        *vm.EVM
	callReturn []byte
}

// Config are the configuration options for the StructLogger.
type Config struct {
	EnableMemory     bool `json:"enableMemory"`
	DisableStack     bool `json:"disableStack"`
	DisableStorage   bool `json:"disableStorage"`
	EnableReturnData bool `json:"enableReturnData"`
	Debug            bool `json:"debug"`
	Limit            int  `json:"limit"`
	// The following options are only available for JS-based tracing.
	// We do not recommend to use them.
	// They are maintained for backward-compatibility.
	Overrides *params.ChainConfig `json:"overrides"`
}

// NewStructLogger returns a new logger that captures execution traces during EVM
// execution.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Address]types.Storage),
		logs:    make([]*StructLog, 0),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

// CaptureStart is called when the EVM starts executing a new transaction.
func (l *StructLogger) CaptureStart(evm *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *uint256.Int) {
	l.evm = evm
	l.statedb = evm.StateDB
	l.txStart = time.Now()
	l.txGas = gas
}

// CaptureState is called for each step of the EVM.
//
// Note that this implementation is not thread safe, and some of the passed arguments
// might be mutated by the EVM. Callers must be aware of this.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// check if the tracer should stop tracing
	if l.cfg.Limit != 0 && len(l.logs) >= l.cfg.Limit {
		l.err = ErrTraceLimitReached
		return
	}
	// copy memory
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}
	// copy stack
	var stack []*uint256.Int
	if !l.cfg.DisableStack {
		// note: work around for bug in go-ethereum, which leads to using a slice of size
		// 1024, but an index of 1024 is then used, which leads to out of bounds.
		// So we have to check for this here.
		s := scope.Stack.Data()
		if len(s) > 1024 {
			err = vm.ErrStackOverflow
		} else {
			stack = make([]*uint256.Int, len(s))
			for i, value := range s {
				stack[i] = new(uint256.Int).Set(&value)
			}
		}
	}
	// copy return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}
	// Create the log, store the error if there is any.
	log := &StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Depth:      depth,
		Memory:     memory,
		Stack:      stack,
		ReturnData: returnData,
	}
	if err != nil {
		log.Err = err
		l.err = err
	}
	// The 'call' instructions have a special case where the 'call' opcode is
	// not accounted for in the 'cost' field, but it's used still. In order to
	// get correct gas-cost, we need to add it here.
	switch op {
	case vm.CALL, vm.CALLCODE, vm.DELEGATECALL, vm.STATICCALL:
		log.GasCost = cost + callGasTemp
	}
	// The `refund` is not passed as an argument, so we have to retrieve it from the evm.
	if l.cfg.EnableMemory || !l.cfg.DisableStack || l.cfg.EnableReturnData {
		log.Refund = l.evm.StateDB.GetRefund()
	}
	l.logs = append(l.logs, log)
}

// CaptureFault is invoked when an error happens during the execution of an opcode
// which wasn't reported on `CaptureState`.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.err = err
	if n := len(l.logs); n > 0 {
		l.logs[n-1].Err = err
	}
}

// StructLog is emitted to the EVM each time a new instruction is executed.
// EIP-3155: https://github.com/ethereum/EIPs/pull/3155
type StructLog struct {
	Pc         uint64            `json:"pc"`
	Op         vm.OpCode         `json:"op"`
	Gas        uint64            `json:"gas"`
	GasCost    uint64            `json:"gasCost"`
	Memory     []byte            `json:"memory"`
	MemSize    int               `json:"memSize"`
	Stack      []*uint256.Int    `json:"stack"`
	ReturnData []byte            `json:"returnData"`
	Depth      int               `json:"depth"`
	Refund     uint64            `json:"refund"`
	Err        error             `json:"-"`
	Storage    map[common.Hash]common.Hash `json:"-"`
}

// formatStack formats the stack for the given struct log.
func formatStack(stack []*uint256.Int) []hexutil.Uint256 {
	ret := make([]hexutil.Uint256, len(stack))
	for i, item := range stack {
		ret[i] = (hexutil.Uint256)(*item)
	}
	return ret
}

// MarshalJSON marshals as JSON.
func (log *StructLog) MarshalJSON() ([]byte, error) {
	type NoMethod StructLog
	var enc = struct {
		*NoMethod
		OpName     string                `json:"opName"`          // adds opName for compatibility with EIP-3155
		Error      string                `json:"error,omitempty"` // holds the error string, if there is one
		Stack      []hexutil.Uint256     `json:"stack"`
		Memory     hexutil.Bytes         `json:"memory"`
		ReturnData hexutil.Bytes         `json:"returnData"`
		Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
		Gas        hexutil.Uint64        `json:"gas"`
		GasCost    hexutil.Uint64        `json:"gasCost"`
		Refund     hexutil.Uint64        `json:"refund"`
	}{
		NoMethod: (*NoMethod)(log),
		OpName:   log.Op.String(), // Adds opName for compatibility with EIP-3155
		Stack:    formatStack(log.Stack),
		Memory:     log.Memory,
		ReturnData: log.ReturnData,
		Storage:    log.Storage,
		Gas:        hexutil.Uint64(log.Gas),
		GasCost:    hexutil.Uint64(log.GasCost),
		Refund:     hexutil.Uint64(log.Refund),
	}
	// If the error is not nil, format it as a string
	if log.Err != nil {
		enc.Error = log.Err.Error()
	}
	return json.Marshal(&enc)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation except for
// ErrExecutionReverted which means revert-and-keep-gas-left.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (setup code) ...

	// The Interpreter main run loop (contextual). This loop runs until either an
	// explicit STOP, RETURN or SELFDESTRUCT is executed, an error occurred during
	// the execution of one of the operations or until the done flag is set by the
	// parent context.
	for {
		if debug {
			// Capture pre-execution values for tracing.
			logged, pcCopy, gasCopy = false, pc, contract.Gas
		}

		// ... (gas calculation and stack validation) ...
		op = contract.GetOp(pc)
		operation := in.table[op]
		cost = operation.constantGas // For tracing
		// ...

		// All ops with a dynamic memory usage also has a dynamic gas cost.
		var memorySize uint64
		if operation.dynamicGas != nil {
			// ... (dynamic gas calculation) ...
			var dynamicCost uint64
			dynamicCost, err = operation.dynamicGas(in.evm, contract, stack, mem, memorySize)
			cost += dynamicCost // for tracing
			// ...
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
		if memorySize > 0 {
			mem.Resize(memorySize)
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
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// OpCode is an EVM opcode
type OpCode byte

// ... (OpCode constants) ...

var opCodeToString = [256]string{
	// 0x0 range - arithmetic ops.
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	SUB:        "SUB",
    // ...
}

func (op OpCode) String() string {
	if s := opCodeToString[op]; s != "" {
		return s
	}
	return fmt.Sprintf("opcode %#x not defined", int(op))
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/state/statedb.go">
```go
// GetRefund returns the current value of the refund counter.
func (s *StateDB) GetRefund() uint64 {
	return s.refund
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is an object for basic stack operations. Items popped to the stack are
// expected to be changed and modified. stack does not take care of adding newly
// initialized objects.
type Stack struct {
	data []uint256.Int
}

// Data returns the underlying uint256.Int array.
func (st *Stack) Data() []uint256.Int {
	return st.data
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory implements a simple memory model for the ethereum virtual machine.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// Data returns the backing slice
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
</go-ethereum>
## Prompt Corrections
The prompt is well-structured and provides a clear specification for EIP-3155 tracing. A minor correction and a suggestion for improvement:

1.  **Correction on `op` and `opName`**: The EIP-3155 specification lists both `op` and `opName`. The Geth reference implementation sets both fields to the same human-readable opcode string (e.g., "PUSH1"). The prompt should clarify that both fields should contain the same string value for compatibility. The `vm.OpCode.String()` method in `go-ethereum` is the source for this string.
2.  **Suggestion for `refund` tracking**: The prompt mentions `refund` but doesn't specify *when* it should be captured. The `StructLogger` captures it on every step. This seems correct as SSTORE operations can change the refund counter mid-execution. It's worth noting that the `refund` counter is part of the `StateDB`, not the immediate execution frame, which is an important architectural detail to capture correctly. The `StateDB.GetRefund()` method is the correct way to access this value.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/logger/struct_logger.go">
```go
package logger

import (
	"encoding/json"
	"io"
	"math/big"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/vm"
	"github.com/ethereum/go-ethereum/params"
)

// StructLogger is a structured logger for EVM execution traces.
type StructLogger struct {
	cfg            *Config
	storage        map[common.Address]map[common.Hash]common.Hash
	logs           []StructLog
	err            error
	output         []byte
	gas            uint64
	failed         bool
	returned       []byte
	executionStart time.Time
	executionTime  time.Duration
}

// Config are the configuration options for the StructLogger.
type Config struct {
	EnableMemory     bool `json:"enableMemory"`
	DisableStack     bool `json:"disableStack"`
	DisableStorage   bool `json:"disableStorage"`
	EnableReturnData bool `json:"enableReturnData"`
	Debug            bool `json:"debug"`
	Limit            int  `json:"limit"`
	// Precompile is the list of precompiled contracts that are activated.
	// This is used to as a list of contracts to skip. If nil, the active
	// precompiles are used, based on chain rules.
	Precompile *map[common.Address]bool `json:"precompile,omitempty"`
}

// NewStructLogger returns a new vm.Tracer that will generate structured logs for
// each step of the EVM.
func NewStructLogger(cfg *Config) *StructLogger {
	if cfg == nil {
		cfg = &Config{}
	}
	return &StructLogger{
		cfg:     cfg,
		storage: make(map[common.Address]map[common.Hash]common.Hash),
	}
}

// CaptureStart is called at the start of a transaction, it saves the sender and receiver.
func (l *StructLogger) CaptureStart(evm *vm.EVM, from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int) {
	l.executionStart = time.Now()
}

// CaptureState is called on each step of the EVM, it captures the current state.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	stack := scope.Stack.Data()
	// The new stack items are captured, but the old stack is not copied,
	// so the following line will modify the stack in the logs. We'll fix
	// this by creating a copy of the stack.
	stackData := make([]*big.Int, len(stack))
	for i, item := range stack {
		stackData[i] = new(big.Int).Set(item.ToBig())
	}
	// Don't have a good way to get the memory size, so we'll have to accept
	// a copy of memory here.
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	}

	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}

	log := StructLog{
		Pc:         pc,
		Op:         op,
		Gas:        gas,
		GasCost:    cost,
		Memory:     memory,
		MemorySize: scope.Memory.Len(),
		Stack:      stackData,
		ReturnData: returnData,
		Depth:      depth,
		Refund:     scope.StateDB.GetRefund(),
		Err:        err,
		OpName:     op.String(),
	}
	l.logs = append(l.logs, log)
}

// StructLog is emitted to the EVM each cycle and lists information about the current internal state
// prior to the execution of the statement.
type StructLog struct {
	Pc         uint64                      `json:"pc"`
	Op         vm.OpCode                   `json:"op"`
	Gas        uint64                      `json:"gas"`
	GasCost    uint64                      `json:"gasCost"`
	Memory     []byte                      `json:"memory,omitempty"`
	MemorySize int                         `json:"memSize"`
	Stack      []*big.Int                  `json:"stack,omitempty"`
	ReturnData []byte                      `json:"returnData,omitempty"`
	Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
	Depth      int                         `json:"depth"`
	Refund     uint64                      `json:"refund"`
	Err        error                       `json:"-"`
	OpName     string                      `json:"opName"` // Added for more explicit output
	Error      string                      `json:"error,omitempty"`
}

// MarshalJSON implements json.Marshaler.
func (s *StructLog) MarshalJSON() ([]byte, error) {
	type structLog struct {
		Pc         uint64                      `json:"pc"`
		Op         string                      `json:"op"`
		Gas        hexutil.Uint64              `json:"gas"`
		GasCost    hexutil.Uint64              `json:"gasCost"`
		Memory     *hexutil.Bytes              `json:"memory,omitempty"`
		MemorySize int                         `json:"memSize"`
		Stack      []hexutil.Big               `json:"stack,omitempty"`
		ReturnData *hexutil.Bytes              `json:"returnData,omitempty"`
		Storage    map[common.Hash]common.Hash `json:"storage,omitempty"`
		Depth      int                         `json:"depth"`
		Refund     hexutil.Uint64              `json:"refund"`
		Error      string                      `json:"error,omitempty"`
		OpName     string                      `json:"opName"`
	}

	var stl = structLog{
		Pc:         s.Pc,
		Op:         s.Op.String(), // Use OpName for op code for backwards compatibility
		Gas:        hexutil.Uint64(s.Gas),
		GasCost:    hexutil.Uint64(s.GasCost),
		MemorySize: s.MemorySize,
		Storage:    s.Storage,
		Depth:      s.Depth,
		Refund:     hexutil.Uint64(s.Refund),
		OpName:     s.OpName,
	}
	if s.Err != nil {
		stl.Error = s.Err.Error()
	}
	if s.Memory != nil {
		mem := hexutil.Bytes(s.Memory)
		stl.Memory = &mem
	}
	if s.Stack != nil {
		stl.Stack = make([]hexutil.Big, len(s.Stack))
		for i, item := range s.Stack {
			stl.Stack[i] = (hexutil.Big)(*item)
		}
	}
	if s.ReturnData != nil {
		retData := hexutil.Bytes(s.ReturnData)
		stl.ReturnData = &retData
	}
	return json.Marshal(stl)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run runs the EVM code with the given input and returns the
// final state as well as an error if it failed.
//
// The returned error will be an EVM error if the execution of an
// opcode fails. These errors are stored in the error table and
// may be referenced for the given PC.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// Increment the call depth which is restricted to 1024
	in.evm.depth++
	defer func() { in.evm.depth-- }()

	// Reset the previous call's return data. It's unimportant to preserve the old buffer
	// as every returning call will return new data.
	in.returnData = nil

	// Don't bother with the execution if there's no code.
	if len(contract.Code) == 0 {
		return nil, nil
	}
	// Make sure the readOnly is only set if we aren't in readOnly yet.
	// This makes also sure that the readOnly flag is accumulated, the deepest call
	// is deciding ingredient and whatever THAT value is, it will be carried backwards.
	oldReadOnly := in.readOnly
	in.readOnly = in.readOnly || readOnly
	defer func() { in.readOnly = oldReadOnly }()

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
		// to be uint256. Practically much less so.
		pc   = uint64(0) // program counter
		cost uint64
		// copies used by tracer
		pcCopy  uint64 // needed for the deferred tracer
		gasCopy uint64 // for tracer
		logged  bool   // deferred tracer should ignore already logged steps
		res     []byte
	)
	contract.Input = input

	// The Interpreter main loop will be run over and over again
	// until it stops or breaks within its own loop.
	for {
		if err = in.evm.Cancelled(); err != nil {
			break
		}
		// Get a copy of the PC for the deferred tracer.
		pcCopy = pc
		// Capture the tracer start state.
		if tracing.Enabled {
			gasCopy = contract.Gas
			if !logged {
				in.tracer.CaptureState(in.evm, pc, op, gasCopy, cost, callContext, in.returnData, in.evm.depth, err)
			}
		}

		op = contract.GetOp(pc)
		// Validate stack
		operation := in.cfg.JumpTable[op]
		if !operation.valid {
			err = ErrInvalidOpcode
			break
		}
		//...
		// If the operation has a valid PC, jump to it
		if operation.jumps {
			pc, err = operation.execute(&pc, in, callContext)
		} else { // Othewise increment PC
			pc++
		}
	}
	//...
	return ret, err
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Stack is a stack for 256 bit words.
type Stack struct {
	data []*uint256.Int
}

// newstack returns a new stack with a backing store of size 1024.
func newstack() *Stack {
	return &Stack{data: make([]*uint256.Int, 0, 1024)}
}

// Data returns the underlying slice of the stack.
func (st *Stack) Data() []*uint256.Int {
	return st.data
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/memory.go">
```go
// Memory represents the memory in the EVM.
type Memory struct {
	store       []byte
	lastGasCost uint64
}

// NewMemory returns a new memory model.
func NewMemory() *Memory {
	return &Memory{store: make([]byte, 0, 1024)}
}

// Data returns the contents of memory as a byte slice.
func (m *Memory) Data() []byte {
	return m.store
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/common/hexutil/hexutil.go">
```go
// Bytes marshals/unmarshals as a JSON string with 0x prefix.
// The empty slice marshals as "0x".
type Bytes []byte

// MarshalText implements encoding.TextMarshaler
func (b Bytes) MarshalText() ([]byte, error) {
	result := make([]byte, len(b)*2+2)
	copy(result, `0x`)
	hex.Encode(result[2:], b)
	return result, nil
}

// Big marshals/unmarshals as a JSON string with 0x prefix.
// The zero value marshals as "0x0".
type Big big.Int

// MarshalText implements encoding.TextMarshaler
func (b Big) MarshalText() ([]byte, error) {
	return []byte(EncodeBig((*big.Int)(&b))), nil
}

// ToInt converts b to a big.Int.
func (b *Big) ToInt() *big.Int {
	return (*big.Int)(b)
}

// Uint64 marshals/unmarshals as a JSON string with 0x prefix.
// The zero value marshals as "0x0".
type Uint64 uint64

// MarshalText implements encoding.TextMarshaler.
func (b Uint64) MarshalText() ([]byte, error) {
	buf := make([]byte, 2, 10)
	copy(buf, `0x`)
	buf = strconv.AppendUint(buf, uint64(b), 16)
	return buf, nil
}
```
</file>
</go-ethereum>

## Prompt Corrections

The EIP-3155 specification in the prompt shows `op: "PUSH1"` (a string). While the EIP text specifies this, the standard implementation in `go-ethereum`'s `StructLogger` (which many tools are compatible with) outputs `op` as the numeric opcode (e.g., `96` for `PUSH1`) and uses `opName` for the string representation.

It is recommended to follow the `go-ethereum` implementation for better ecosystem compatibility. The `StructLog` struct in `core/tracing/logger/struct_logger.go` demonstrates this:

```go
type StructLog struct {
    Pc         uint64                      `json:"pc"`
    Op         vm.OpCode                   `json:"op"` // This is marshalled as a number
    // ...
    OpName     string                      `json:"opName"`
    // ...
}
```

The Zig implementation should capture the opcode as a `u8` for the `op` field and use a pre-computed lookup table (like the one in `operation_config.zig`) to populate the `opName` string field. This will align the output with tools like Geth's `debug_traceTransaction`.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/tracer.go">
```go
// Tracer is used to collect execution traces from the EVM.
//
// The CaptureState method is called just before each opcode is executed.
// The tracer may edit the values in Interpreter to change the state of the EVM
// at the next instruction.
//
// The CaptureFault method is called when an error occurs during execution of an
// opcode. It is not called for errors that occur before or after opcodes (e.g.
// during transaction validation). Note that CaptureFault is called before the
// EVM reverts its state.
//
// CaptureStart and CaptureEnd are called before and after the execution of
// the EVM.
//
// CaptureEnter and CaptureExit are called when the EVM enters or exits a new scope
// (i.e. CALL, CREATE, etc). It is not called for top-level execution.
type Tracer interface {
	CaptureStart(from common.Address, to common.Address, create bool, input []byte, gas uint64, value *big.Int)
	CaptureState(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, rData []byte, depth int, err error)
	CaptureFault(pc uint64, op OpCode, gas, cost uint64, scope *ScopeContext, depth int, err error)
	CaptureEnd(output []byte, gasUsed uint64, err error)
	CaptureEnter(typ OpCode, from common.Address, to common.Address, input []byte, gas uint64, value *big.Int)
	CaptureExit(output []byte, gasUsed uint64, err error)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/eth/tracers/logger/structlogger.go">
```go
// StructLogger is a EVM state logger that prints execution traces as JSON objects
// on a per-step basis.
//
// Note, the struct logger is an internal logger, and is not suitable for streaming
// to the outside world. It's main use is for debugging via `debug_traceTransaction`,
// as it has a large performance overhead.
type StructLogger struct {
	cfg             *Config
	storage         common.Storage
	logs            []StructLog
	err             error
	gasLimit        uint64
	currGas         uint64
	gasUsed         uint64
	refund          uint64
	callGas         uint64
	callValue       *big.Int
	callHasTransfer bool

	// This is the call stack, with the top-level call at the bottom.
	// We are only interested in the last element on this stack, which
	// is the currently executing frame.
	callStack []*callCtx

	mu sync.Mutex // mu protects the logs
}

// StructLog is a EVM state log for a single execution step.
type StructLog struct {
	Pc            uint64              `json:"pc"`
	Op            vm.OpCode           `json:"op"`
	Gas           math.HexOrDecimal64 `json:"gas"`
	GasCost       math.HexOrDecimal64 `json:"gasCost"`
	Memory        hexutil.Bytes       `json:"memory"`
	MemorySize    int                 `json:"memSize"`
	Stack         []hexutil.Big       `json:"stack"`
	ReturnData    hexutil.Bytes       `json:"returnData"`
	Storage       map[string]string   `json:"-"`
	Depth         int                 `json:"depth"`
	RefundCounter uint64              `json:"refund"`
	Err           error               `json:"-"`
	OpName        string              `json:"opName"` // TODO: make it available for all clients
	ErrorString   string              `json:"error,omitempty"`
}

// NewStructLogger returns a new logger that pushes all event to a slice of StructLogs.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		cfg:       cfg,
		callStack: []*callCtx{{}},
	}
	if cfg == nil {
		logger.cfg = &Config{}
	}
	return logger
}

// CaptureState captures the EVM state before the execution of an opcode.
func (l *StructLogger) CaptureState(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, rData []byte, depth int, err error) {
	// If tracing is disabled, don't do anything.
	if l.cfg.disableTracing {
		return
	}
	// Copy memory and stack
	var memory []byte
	if l.cfg.EnableMemory {
		memory = make([]byte, len(scope.Memory.Data()))
		copy(memory, scope.Memory.Data())
	} else {
		// When memory capture is disabled, we only print the size of the memory.
		// The purpose is to keep the trace small, but still have some minimal
		// information about the memory usage.
		memory = []byte{}
	}

	var stack []hexutil.Big
	if l.cfg.EnableStack {
		stack = make([]hexutil.Big, len(scope.Stack.Data()))
		for i, value := range scope.Stack.Data() {
			stack[i] = (hexutil.Big)(*value)
		}
	}

	// Copy return data
	var returnData []byte
	if l.cfg.EnableReturnData {
		returnData = make([]byte, len(rData))
		copy(returnData, rData)
	}

	// Capture the error message if it's a true error
	var errorString string
	if err != nil {
		errorString = err.Error()
	}

	// Create the log item
	log := StructLog{
		Pc:            pc,
		Op:            op,
		Gas:           math.HexOrDecimal64(gas),
		GasCost:       math.HexOrDecimal64(cost),
		Memory:        memory,
		MemorySize:    scope.Memory.Len(),
		Stack:         stack,
		ReturnData:    returnData,
		Depth:         depth,
		RefundCounter: scope.Contract.Gas, // This is the gas refund counter
		OpName:        op.String(),
		ErrorString:   errorString,
	}

	// If storage is enabled, get the storage data as a map
	if l.cfg.EnableStorage {
		log.Storage = l.storage.ToMap()
	}

	// Save the log item
	l.mu.Lock()
	l.logs = append(l.logs, log)
	l.mu.Unlock()
}

// CaptureFault is called when an error occurs during the execution of an opcode.
func (l *StructLogger) CaptureFault(pc uint64, op vm.OpCode, gas, cost uint64, scope *vm.ScopeContext, depth int, err error) {
	l.err = err
}

// Result returns the collected logs, the error that occurred during collection
// and indicates if the transaction has reverted or not.
func (l *StructLogger) Result() (interface{}, error) {
	return struct {
		StructLogs []StructLog `json:"structLogs"`
		Gas        uint64      `json:"-"`
		Failed     bool        `json:"failed"`
		Return     string      `json:"-"`
	}{l.logs, l.currGas, l.err != nil, ""}, l.err
}

// memoryToHex returns a hex-encoded representation of the memory data.
func memoryToHex(memory []byte) []string {
	var result []string
	if len(memory) > 0 {
		for i := 0; i < len(memory); i += 32 {
			result = append(result, fmt.Sprintf("%064x", memory[i:i+32]))
		}
	}
	return result
}

// stackToHex returns a hex-encoded representation of the stack data.
func stackToHex(stack []hexutil.Big) []string {
	var result []string
	for _, value := range stack {
		result = append(result, value.String())
	}
	return result
}

// MarshalJSON implements json.Marshaler.
func (l *StructLog) MarshalJSON() ([]byte, error) {
	type NoMethod StructLog
	var st = (*NoMethod)(l)
	return json.Marshal(&struct {
		*NoMethod
		Stack  []string `json:"stack"`
		Memory []string `json:"memory"`
		Error  string   `json:"error,omitempty"`
	}{
		NoMethod: st,
		Stack:    stackToHex(st.Stack),
		Memory:   memoryToHex(st.Memory),
		Error:    l.ErrorString,
	})
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return data and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (initial setup)

	for {
		// ...

		// Capture pre-execution values for tracing.
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureState(in.evm.PC, op, gas, cost, scope, in.evm.returnData, in.evm.depth, err)
		}
		// Execute the operation.
		res, err = operation.execute(&pc, in, scope)

		// ... (gas updates, etc.)

		if err != nil {
			break
		}

		pc++
	}
	if err != nil {
		// Capture the fault for tracing.
		if in.cfg.Tracer != nil {
			in.cfg.Tracer.CaptureFault(in.evm.PC, op, gas, cost, scope, in.evm.depth, err)
		}
	}
	return res, err
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/v1.14.7/core/vm/opcodes.go">
```go
// OpCode is a single byte representing an instruction.
type OpCode byte

// String returns the string representation of the opcode
func (op OpCode) String() string {
	if op > opCodeMax {
		return "INVALID"
	}
	str := opCodeToString[op]
	if str == "" {
		str = fmt.Sprintf("opcode 0x%x not defined", int(op))
	}
	return str
}

var opCodeToString = [opCodeMax + 1]string{
	STOP:       "STOP",
	ADD:        "ADD",
	MUL:        "MUL",
	SUB:        "SUB",
	DIV:        "DIV",
	SDIV:       "SDIV",
	MOD:        "MOD",
	SMOD:       "SMOD",
	ADDMOD:     "ADDMOD",
	MULMOD:     "MULMOD",
	EXP:        "EXP",
	SIGNEXTEND: "SIGNEXTEND",
	// ... and so on for all opcodes
}

const (
	// 0x0 range - arithmetic ops.
	STOP OpCode = iota
	ADD
	MUL
	SUB
	DIV
	SDIV
	MOD
	SMOD
	ADDMOD
	MULMOD
	EXP
	SIGNEXTEND
)
// ...
```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt is well-defined. Here are a few clarifications based on the Go-Ethereum implementation which should be considered the reference:

1.  **`op` vs `opName`**: The EIP-3155 specification can be slightly ambiguous here. In Go-Ethereum's `StructLogger`, the resulting JSON object has two fields:
    *   `op` (from `Op vm.OpCode`): The *numerical value* of the opcode (e.g., `96` for `PUSH1`).
    *   `opName` (from `OpName string`): The *string mnemonic* for the opcode (e.g., `"PUSH1"`).

    Your implementation should capture both the byte value and the string name for full compatibility.

2.  **Gas Field Types**: The prompt specifies `gas` and `gasCost` as hex strings. Go-Ethereum achieves this by using a custom type `math.HexOrDecimal64` that marshals to a hex string in JSON. When implementing serialization in Zig, ensure `u64` gas values are formatted as `0x...` hex strings.

3.  **Memory and Stack Formatting**: The prompt correctly specifies `memory` as a hex string and `stack` as an array of hex strings. Geth's `StructLogger` uses helper functions (`memoryToHex`, `stackToHex`) and a custom `MarshalJSON` method to achieve this, as the internal representations are `[]byte` and `[]*big.Int` respectively. This is a critical implementation detail to get right for compatibility.

4.  **Error Field**: The `error` field in the trace should only be present when an operation fails. Geth's `StructLog` has an internal `Err error` field, but its `MarshalJSON` implementation only includes the `"error"` JSON key if the error string is not empty. This avoids having an empty `"error": ""` on every successful step.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/logger.go">
```go
// StructLog is emitted to the EVM each cycle and lists information about the
// current internal state prior to the execution of the statement.
type StructLog struct {
	Pc            uint64                      `json:"pc"`
	Op            vm.OpCode                   `json:"op"`
	Gas           uint64                      `json:"gas"`
	GasCost       uint64                      `json:"gasCost"`
	Memory        []byte                      `json:"memory,omitempty"`
	MemorySize    int                         `json:"memSize"`
	Stack         []*uint256.Int              `json:"stack"`
	ReturnData    []byte                      `json:"returnData,omitempty"`
	Storage       map[common.Hash]common.Hash `json:"-"`
	Depth         int                         `json:"depth"`
	RefundCounter uint64                      `json:"refund"`
	Err           error                       `json:"-"`
}

// OpName formats the operand name in a human-readable format.
func (s *StructLog) OpName() string {
	return s.Op.String()
}

// ErrorString formats the log's error as a string.
func (s *StructLog) ErrorString() string {
	if s.Err != nil {
		return s.Err.Error()
	}
	return ""
}

// StructLogger is an EVM state logger and implements EVMLogger.
//
// StructLogger can capture state based on the given Log configuration and also keeps
// a track record of modified storage which is used in reporting snapshots of the
// contract their storage.
//
// A StructLogger can either yield it's output immediately (streaming) or store for
// later output.
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

// NewStructLogger construct a new (non-streaming) struct logger.
func NewStructLogger(cfg *Config) *StructLogger {
	logger := &StructLogger{
		storage: make(map[common.Address]Storage),
		logs:    make([]json.RawMessage, 0),
	}
	if cfg != nil {
		logger.cfg = *cfg
	}
	return logger
}

// OnOpcode logs a new structured log message and pushes it out to the environment
//
// OnOpcode also tracks SLOAD/SSTORE ops to track storage change.
func (l *StructLogger) OnOpcode(pc uint64, opcode byte, gas, cost uint64, scope tracing.OpContext, rData []byte, depth int, err error) {
	// If tracing was interrupted, exit
	if l.interrupt.Load() {
		return
	}
	// Processing a system call.
	if l.skip {
		return
	}
	// check if already accumulated the size of the response.
	if l.cfg.Limit != 0 && l.resultSize > l.cfg.Limit {
		return
	}
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
...
	// create a log
	if l.writer == nil {
		entry := log.toLegacyJSON() // Note: Uses legacy JSON conversion, which may differ slightly
		l.resultSize += len(entry)
		l.logs = append(l.logs, entry)
		return
	}
	log.WriteTo(l.writer)
}

// OnExit is called a call frame finishes processing.
func (l *StructLogger) OnExit(depth int, output []byte, gasUsed uint64, err error, reverted bool) {
...
	l.output = output
	l.err = err
...
}

func (l *StructLogger) GetResult() (json.RawMessage, error) {
	// Tracing aborted
	if l.reason != nil {
		return nil, l.reason
	}
	failed := l.err != nil
	returnData := common.CopyBytes(l.output)
	// Return data when successful and revert reason when reverted, otherwise empty.
	if failed && !errors.Is(l.err, vm.ErrExecutionReverted) {
		returnData = []byte{}
	}
	return json.Marshal(&ExecutionResult{
		Gas:         l.usedGas,
		Failed:      failed,
		ReturnValue: returnData,
		StructLogs:  l.logs,
	})
}
...
// ExecutionResult groups all structured logs emitted by the EVM
// while replaying a transaction in debug mode as well as transaction
// execution status, the amount of gas used and the return value
type ExecutionResult struct {
	Gas         uint64            `json:"gas"`
	Failed      bool              `json:"failed"`
	ReturnValue hexutil.Bytes     `json:"returnValue"`
	StructLogs  []json.RawMessage `json:"structLogs"`
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/eth/tracers/logger/gen_structlog.go">
```go
// MarshalJSON marshals as JSON.
func (s StructLog) MarshalJSON() ([]byte, error) {
	type StructLog struct {
		Pc            uint64                      `json:"pc"`
		Op            vm.OpCode                   `json:"op"`
		Gas           math.HexOrDecimal64         `json:"gas"`
		GasCost       math.HexOrDecimal64         `json:"gasCost"`
		Memory        hexutil.Bytes               `json:"memory,omitempty"`
		MemorySize    int                         `json:"memSize"`
		Stack         []hexutil.U256              `json:"stack"`
		ReturnData    hexutil.Bytes               `json:"returnData,omitempty"`
		Storage       map[common.Hash]common.Hash `json:"-"`
		Depth         int                         `json:"depth"`
		RefundCounter uint64                      `json:"refund"`
		Err           error                       `json:"-"`
		OpName        string                      `json:"opName"`
		ErrorString   string                      `json:"error,omitempty"`
	}
	var enc StructLog
	enc.Pc = s.Pc
	enc.Op = s.Op
	enc.Gas = math.HexOrDecimal64(s.Gas)
	enc.GasCost = math.HexOrDecimal64(s.GasCost)
	enc.Memory = s.Memory
	enc.MemorySize = s.MemorySize
	if s.Stack != nil {
		enc.Stack = make([]hexutil.U256, len(s.Stack))
		for k, v := range s.Stack {
			enc.Stack[k] = hexutil.U256(*v)
		}
	}
	enc.ReturnData = s.ReturnData
	enc.Storage = s.Storage
	enc.Depth = s.Depth
	enc.RefundCounter = s.RefundCounter
	enc.Err = s.Err
	enc.OpName = s.OpName()
	enc.ErrorString = s.ErrorString()
	return json.Marshal(&enc)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/tracing/hooks.go">
```go
// Hooks is a container for all methods specific to logging the EVM's execution.
// It is a superset of the vm.EVMLogger interface.
type Hooks struct {
	// OnOpcode is called before the execution of each opcode.
	//
	// The return data of the previous call is also provided as an argument.
	// It's set to nil if the previous call was not a call but an opcode, or if
	// the call returned no data.
	OnOpcode func(pc uint64, op byte, gas, cost uint64, scope OpContext, rData []byte, depth int, err error)
...
}

// OpContext is the context in which an operation is executed.
type OpContext interface {
	// CallFrame returns the current call frame.
	CallFrame() *vm.CallFrame

	// Address returns the contract address of the current scope.
	Address() common.Address

	// StackData returns a copy of the stack.
	StackData() []*uint256.Int

	// MemoryData returns a copy of the memory.
	MemoryData() []byte
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter should be
// considered a revert-and-consume-all-gas operation, no refunds whatsoever.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
...
	for {
...
		// Get opcode and choose the associated jump table
		op = contract.GetOp(pc)
		operation := in.cfg.JumpTable[op]
...
		// Call the tracer
		if in.evm.Tracer.OnOpcode != nil {
			in.evm.Tracer.OnOpcode(pc, byte(op), gas, cost, in, in.evm.interpreter.returnData, in.evm.depth, err)
		}
...
		// Execute the operation
		res, err = operation.execute(&pc, in, &callCtx)
...
	}
...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The EIP-3155 specification provided in the prompt is a good summary of the Geth `structLogger` format, but there are a few minor clarifications that will help with implementation:

1.  **`op` vs `opName`**: The prompt is slightly ambiguous, listing both `op` and `opName` as the opcode name. In Geth's implementation:
    *   `op` is the numeric opcode value (e.g., `0x60` for `PUSH1`).
    *   `opName` is the human-readable string representation (e.g., `"PUSH1"`).
    It's recommended to implement both for maximum compatibility with tools that might expect either field.

2.  **Stack Contents**: The prompt's example shows `stack: ["0x40"]`, implying an array of hex strings. The Go-Ethereum `StructLog` marshaler (`gen_structlog.go`) confirms this by converting an array of `*uint256.Int` to `[]hexutil.U256`, which serializes to hex strings. This detail is important for correct JSON output.

3.  **Error Field**: The `error` field in the JSON should be an empty string `""` on success and contain the error message on failure. Geth achieves this with the `ErrorString()` method on the `StructLog` struct.

Here's a revised and more precise specification for the trace output fields based on the Go-Ethereum implementation:

-   **pc**: `uint64` - Program counter.
-   **op**: `uint8` - The numeric opcode.
-   **opName**: `string` - Human-readable opcode name (e.g., "PUSH1").
-   **gas**: `hexutil.Uint64` - Gas remaining *before* execution.
-   **gasCost**: `hexutil.Uint64` - Gas consumed by the operation.
-   **memory**: `hexutil.Bytes` - A single hex string representing the memory contents.
-   **memSize**: `int` - The size of memory in bytes.
-   **stack**: `[]hexutil.U256` - An array of hex strings representing the stack, with the top of the stack being the *last* element.
-   **returnData**: `hexutil.Bytes` - A single hex string of the return data from the last call.
-   **depth**: `int` - Call depth.
-   **refund**: `uint64` - Gas refund counter.
-   **error**: `string` - An empty string on success, or the error message if the operation failed.

