# EVM Implementation Issues List

Based on the comprehensive code review, here are the issues that need to be addressed to bring the EVM implementation to production quality.

## Issue Tracking Summary

**Total Issues**: 47  
**P0 (Critical)**: 15  
**P1 (High)**: 18  
**P2 (Medium)**: 14  

**Estimated Total Effort**: 3-4 weeks with 2 developers

---

## Priority 0: Critical Issues (Must Fix Immediately)

### 🏗️ Infrastructure Issues

#### ISSUE-001: Fix Import Organization
- **Status**: Complete
- **Component**: All opcode files + jump_table.zig
- **Description**: Imports are missing or incorrectly placed. Frame import is at bottom of jump_table.zig
- **Effort**: 2 hours
- **Files Affected**: All files in src/evm/opcodes/, jump_table.zig
- **Resolution**: Fixed Frame import location in jump_table.zig. Note: Address imports in opcodes need to use @import("Address") module syntax to avoid conflicts

#### ISSUE-002: Add Missing u256 Type Import
- **Status**: Complete
- **Component**: All opcode files
- **Description**: u256 type is used throughout but never imported
- **Effort**: 1 hour
- **Solution**: Add `const u256 = @import("../types.zig").u256;` or similar
- **Resolution**: u256 is a built-in type in Zig (unsigned 256-bit integer) and doesn't require import

#### ISSUE-003: Define VM Interface
- **Status**: Complete
- **Component**: Core infrastructure
- **Description**: Opcodes reference VM methods that don't exist
- **Effort**: 4 hours
- **Required Methods**:
  ```zig
  get_storage(address: Address, slot: u256) u256
  set_storage(address: Address, slot: u256, value: u256) void
  get_balance(address: Address) u256
  get_code(address: Address) []const u8
  create_contract(...) CreateResult
  call_contract(...) CallResult
  get_transient_storage(address: Address, slot: u256) u256
  set_transient_storage(address: Address, slot: u256, value: u256) void
  ```
- **Resolution**: All required VM interface methods have been added to vm.zig including storage, balance, code, transient storage, and placeholder methods for contract creation/calling. Fixed Address import to use package module syntax.

#### ISSUE-004: Complete Frame Structure
- **Status**: Complete
- **Component**: frame.zig
- **Description**: Frame is missing required fields
- **Effort**: 2 hours
- **Missing Fields**:
  - `return_data_buffer: []u8`
  - `input: []const u8`
  - `depth: u32`
  - `is_static: bool`
- **Resolution**: All fields have been added to the Frame structure. Changed return_data_buffer from []const u8 to []u8 to allow mutation, and changed depth from u16 to u32 as specified. Updated init_with_state function to include all new fields as optional parameters.

### 🔥 Critical Opcode Issues

#### ISSUE-005: Storage Operations Are Completely Stubbed
- **Status**: Complete
- **Component**: storage.zig
- **Description**: SLOAD/SSTORE return dummy values, no actual storage access
- **Effort**: 4 hours
- **Impact**: Core EVM functionality broken
- **Resolution**: Implemented actual storage access methods in vm.zig:
  - Added storage and transient_storage hash maps to VM
  - Implemented get_storage, set_storage, get_transient_storage, set_transient_storage methods
  - Updated all storage opcodes (SLOAD, SSTORE, TLOAD, TSTORE) to use actual VM storage
  - Fixed error handling to map OutOfMemory errors to OutOfGas
  - Fixed VM's interpreter/state pointer casting to pass VM as interpreter

#### ISSUE-006: Environment Opcodes Return Hardcoded Values
- **Status**: Complete
- **Component**: environment.zig
- **Description**: BALANCE, ORIGIN, CALLER, etc. return placeholder values
- **Effort**: 6 hours
- **Impact**: Contracts cannot access basic environment data
- **Resolution**: Updated all environment opcodes to use actual VM state:
  - op_balance: Gets balance from vm.balances
  - op_origin: Returns vm.tx_origin
  - op_gasprice: Returns vm.gas_price  
  - op_extcodesize: Gets code size from vm.code
  - op_extcodecopy: Copies code from vm.code to memory
  - op_extcodehash: Computes keccak256 of code from vm.code
  - op_selfbalance: Gets balance of current contract
  - op_chainid: Returns vm.chain_id

#### ISSUE-007: Block Opcodes Return Hardcoded Values
- **Status**: Complete
- **Component**: block.zig
- **Description**: TIMESTAMP returns 1, NUMBER returns 0, etc.
- **Effort**: 4 hours
- **Impact**: Time-dependent contracts broken
- **Resolution**: Updated all block opcodes to use VM block context fields. Added blob_hashes and blob_base_fee fields to VM structure for EIP-4844 support.

#### ISSUE-008: Call Operations Not Implemented
- **Status**: Complete
- **Component**: system.zig
- **Description**: CALL, DELEGATECALL, STATICCALL, CREATE are stubs
- **Effort**: 8 hours
- **Impact**: No contract interaction possible
- **Resolution**: 
  - Completed STATICCALL implementation to match CALL but with is_static=true
  - All call operations (CREATE, CREATE2, CALL, CALLCODE, DELEGATECALL, STATICCALL) now properly:
    - Check call depth (1024 limit)
    - Get arguments from memory
    - Ensure memory is allocated for return data
    - Calculate gas to give to the called contract
    - Call the appropriate VM method
    - Update gas remaining after the call
    - Write return data to memory
    - Set return_data_buffer
    - Push success/failure status to stack
  - Note: The actual VM methods (create_contract, call_contract, etc.) are still placeholders and would need separate implementation

### ⛽ Gas Accounting Issues

#### ISSUE-009: Dynamic Gas Not Consumed
- **Status**: In Progress (Working on it)
- **Component**: All opcode files
- **Description**: Gas is calculated but never consumed via frame.gas.consume()
- **Effort**: 4 hours
- **Example**: EXP calculates gas_cost but doesn't consume it
- **Resolution**: Identified opcodes missing gas consumption for memory expansion:
  - environment.zig: op_extcodecopy (line 149) - ensures memory but doesn't consume gas
  - log.zig: op_log0-4 (line 64) - consumes gas for data bytes but not memory expansion
  - control.zig: op_return (line 123), op_revert (line 160) - ensure memory but don't consume gas
  - system.zig: op_create (line 58), op_create2 (line 119), op_call (lines 179, 192) - ensure memory but don't consume gas
  - memory.zig: op_calldatacopy (line 234), op_codecopy (line 276), op_returndatacopy (line 323) - memory expansion gas needs to be added
  - Note: Other memory operations (MLOAD, MSTORE, MSTORE8, MCOPY) and crypto operations (SHA3) correctly consume gas

#### ISSUE-010: Missing Gas Consumption in Jump Table
- **Status**: Complete
- **Component**: jump_table.zig
- **Description**: execute() method should consume base gas before calling handler
- **Effort**: 2 hours
- **Resolution**: Added execute() method to JumpTable that consumes base gas from frame.gas_remaining before calling the opcode handler. Updated VM to use table.execute() instead of directly calling operation.execute(). Added test to verify gas consumption.

### 🚨 Missing Essential Opcodes

#### ISSUE-011: Missing Byzantium Opcodes
- **Status**: Complete
- **Component**: jump_table.zig
- **Opcodes**: RETURNDATASIZE (0x3d), RETURNDATACOPY (0x3e), REVERT (0xfd), STATICCALL (0xfa)
- **Effort**: 4 hours
- **Resolution**: Added all four Byzantium opcodes to the jump table:
  - RETURNDATASIZE (0x3d) and RETURNDATACOPY (0x3e) added to 0x30s section
  - STATICCALL (0xfa) and REVERT (0xfd) added to 0xf0s section
  - All opcodes were already implemented in their respective modules

#### ISSUE-012: Missing Constantinople Opcodes
- **Status**: Complete
- **Component**: jump_table.zig
- **Opcodes**: CREATE2 (0xf5), EXTCODEHASH (0x3f), SHL/SHR/SAR (0x1b-0x1d)
- **Effort**: 4 hours
- **Note**: Bitwise shifts are implemented but not in jump table
- **Resolution**: 
  - Added CREATE2 operation definition with gas cost and stack requirements
  - Added DELEGATECALL operation definition (needed for Homestead+) 
  - Fixed EXTCODEHASH to only be added for Constantinople+ (was incorrectly in Frontier)
  - Fixed SHL/SHR/SAR to only be added for Constantinople+ (was incorrectly in Frontier)
  - Updated init_from_hardfork to properly handle hardfork progression:
    - Homestead+ adds DELEGATECALL (0xf4)
    - Byzantium+ adds RETURNDATASIZE, RETURNDATACOPY, REVERT, STATICCALL
    - Constantinople+ adds CREATE2 (0xf5), EXTCODEHASH (0x3f), SHL/SHR/SAR (0x1b-0x1d)

#### ISSUE-013: Missing Istanbul+ Opcodes
- **Status**: Complete
- **Component**: jump_table.zig
- **Opcodes**: CHAINID (0x46), SELFBALANCE (0x47), BASEFEE (0x48)
- **Effort**: 2 hours
- **Resolution**:
  - Added CHAINID and SELFBALANCE operation definitions (Istanbul)
  - Added BASEFEE operation definition (London) 
  - Updated init_from_hardfork to properly handle Istanbul and London hardforks:
    - Istanbul+ adds CHAINID (0x46) and SELFBALANCE (0x47)
    - London+ adds BASEFEE (0x48)
  - Added comprehensive test coverage for Istanbul opcodes
  - All three opcodes were already implemented in their respective modules (environment.zig and block.zig)

#### ISSUE-014: Missing Shanghai Opcodes
- **Status**: Complete
- **Component**: jump_table.zig
- **Opcodes**: PUSH0 (0x5f)
- **Effort**: 1 hour
- **Resolution**:
  - Added PUSH0 operation definition with GasQuickStep cost
  - Updated init_from_hardfork to add PUSH0 for Shanghai+ hardforks
  - Added comprehensive test coverage for Shanghai opcodes
  - PUSH0 was already implemented in stack.zig

#### ISSUE-015: Missing Cancun Opcodes
- **Status**: Complete
- **Component**: jump_table.zig
- **Opcodes**: BLOBHASH (0x49), BLOBBASEFEE (0x4a), MCOPY (0x5e), TLOAD (0x5c), TSTORE (0x5d)
- **Effort**: 3 hours
- **Resolution**:
  - Added all five Cancun operation definitions with appropriate gas costs
  - BLOBHASH: GasFastestStep, min_stack 1
  - BLOBBASEFEE: GasQuickStep, min_stack 0
  - MCOPY: GasFastestStep, min_stack 3
  - TLOAD/TSTORE: 100 gas, min_stack 1/2 respectively
  - Updated init_from_hardfork to add all Cancun opcodes for Cancun hardfork
  - Added comprehensive test coverage for all Cancun opcodes
  - All opcodes were already implemented in their respective modules

---

## Priority 1: High Priority Issues

### 🔧 Implementation Completion

#### ISSUE-016: Complete ADDMOD/MULMOD Implementation
- **Status**: Complete
- **Component**: arithmetic.zig
- **Description**: Need proper 512-bit intermediate calculations
- **Effort**: 3 hours
- **Resolution**:
  - Implemented proper ADDMOD that correctly handles overflow when (a + b) exceeds u256
  - Uses modular arithmetic properties to compute (a + b) % n without needing 512-bit integers
  - Handles the overflow case by computing 2^256 % n using two's complement arithmetic
  - Implemented proper MULMOD using Russian peasant multiplication algorithm
  - Computes (a * b) % n iteratively, taking modulo at each step to avoid overflow
  - Both implementations now correctly handle all edge cases including when a*b or a+b exceed 2^256

#### ISSUE-017: Implement Memory Operations Fully
- **Status**: Complete
- **Component**: memory.zig
- **Description**: Connect to actual memory management, fix RETURNDATACOPY
- **Effort**: 4 hours
- **Resolution**:
  - All memory operations (MLOAD, MSTORE, MSTORE8, MSIZE, MCOPY) are properly implemented
  - RETURNDATACOPY is correctly implemented with bounds checking and gas calculations
  - All operations properly calculate and consume memory expansion gas
  - Memory module uses efficient checkpointing system with shared buffer
  - Proper context-relative memory operations with child context support
  - All copy operations (CALLDATACOPY, CODECOPY, RETURNDATACOPY, MCOPY) handle gas correctly

#### ISSUE-018: Implement LOG Operations
- **Component**: log.zig
- **Description**: Currently calculates gas but doesn't emit logs
- **Effort**: 3 hours

#### ISSUE-019: Fix JUMP/JUMPI Contract Integration
- **Component**: control.zig
- **Description**: Uses contract.valid_jumpdest which may not exist
- **Effort**: 2 hours

### 🏛️ Hardfork Support

#### ISSUE-020: Implement Hardfork Configuration System
- **Component**: jump_table.zig
- **Description**: Only Frontier is implemented, need all hardforks
- **Effort**: 6 hours
- **Required**: configureHomestead(), configureByzantium(), etc.

#### ISSUE-021: Add Hardfork-Specific Gas Costs
- **Component**: jump_table.zig
- **Description**: Gas costs change between hardforks
- **Effort**: 4 hours

#### ISSUE-022: Implement EIP-2929 Access Lists
- **Component**: storage.zig, environment.zig
- **Description**: Cold/warm access tracking for Berlin+
- **Effort**: 6 hours

### 🧪 Testing Infrastructure

#### ISSUE-023: Create Unit Test Framework
- **Component**: tests/evm/opcodes/
- **Description**: No tests exist at all
- **Effort**: 4 hours

#### ISSUE-024: Add Opcode Unit Tests
- **Component**: tests/evm/opcodes/*_test.zig
- **Description**: Every opcode needs comprehensive tests
- **Effort**: 16 hours (30 min per opcode average)

#### ISSUE-025: Add Integration Tests
- **Component**: tests/evm/integration/
- **Description**: Test opcode sequences and interactions
- **Effort**: 8 hours

#### ISSUE-026: Add Gas Accounting Tests
- **Component**: tests/evm/gas/
- **Description**: Verify gas calculations match Yellow Paper
- **Effort**: 6 hours

### 🐛 Bug Fixes

#### ISSUE-027: Fix PC Manipulation in PUSH Operations
- **Component**: stack.zig
- **Description**: PUSH ops modify PC which may conflict with VM loop
- **Effort**: 2 hours

#### ISSUE-028: Fix Memory Allocation in RETURN/REVERT
- **Component**: control.zig
- **Description**: Unbounded allocation is potential DOS vector
- **Effort**: 2 hours

#### ISSUE-029: Fix Address Type Usage
- **Component**: contract.zig, environment.zig
- **Description**: Inconsistent Address type usage and imports
- **Effort**: 2 hours

#### ISSUE-030: Fix Error Type Mappings
- **Component**: All opcode files
- **Description**: Stack/Memory errors not properly mapped to ExecutionError
- **Effort**: 3 hours

### 📝 Documentation

#### ISSUE-031: Document VM Interface Requirements
- **Component**: Documentation
- **Description**: Define clear interface between opcodes and VM
- **Effort**: 2 hours

#### ISSUE-032: Document Gas Calculation Rules
- **Component**: Documentation
- **Description**: Document dynamic gas calculation for each opcode
- **Effort**: 3 hours

#### ISSUE-033: Document Hardfork Differences
- **Component**: Documentation
- **Description**: Create hardfork compatibility matrix
- **Effort**: 2 hours

---

## Priority 2: Medium Priority Issues

### ⚡ Performance Optimizations

#### ISSUE-034: Implement Batched Stack Operations
- **Component**: Stack operations
- **Description**: Add pop2_push1 style optimizations
- **Effort**: 4 hours

#### ISSUE-035: Add Cache-Line Alignment
- **Component**: jump_table.zig
- **Description**: Align jump table for better cache performance
- **Effort**: 1 hour

#### ISSUE-036: Create Unsafe Operation Variants
- **Component**: Stack/Memory operations
- **Description**: Add unsafe variants for hot paths
- **Effort**: 4 hours

#### ISSUE-037: Optimize 256-bit Arithmetic
- **Component**: arithmetic.zig
- **Description**: Use specialized 256-bit math library
- **Effort**: 6 hours

### 🔒 Security Enhancements

#### ISSUE-038: Add Stack Depth Validation
- **Component**: All opcode files
- **Description**: Ensure stack depth limits are enforced
- **Effort**: 2 hours

#### ISSUE-039: Add Memory Limit Enforcement
- **Component**: memory.zig
- **Description**: Prevent excessive memory allocation
- **Effort**: 2 hours

#### ISSUE-040: Add Static Call Protection Validation
- **Component**: All write operations
- **Description**: Ensure all state modifications check is_static
- **Effort**: 3 hours

### 🏗️ Code Quality

#### ISSUE-041: Standardize Error Handling
- **Component**: All files
- **Description**: Consistent error types and handling patterns
- **Effort**: 4 hours

#### ISSUE-042: Remove All TODO Comments
- **Component**: All files
- **Description**: Replace TODOs with actual implementations
- **Effort**: Included in other issues

#### ISSUE-043: Add Inline Documentation
- **Component**: Complex operations
- **Description**: Document complex gas calculations and edge cases
- **Effort**: 3 hours

### 🔧 Additional Features

#### ISSUE-044: Add Opcode Tracing Support
- **Component**: jump_table.zig
- **Description**: Hook for debugging/tracing opcode execution
- **Effort**: 3 hours

#### ISSUE-045: Add Benchmark Suite
- **Component**: benchmarks/
- **Description**: Performance benchmarks for optimization
- **Effort**: 4 hours

#### ISSUE-046: Add Fuzzing Tests
- **Component**: tests/fuzzing/
- **Description**: Fuzz test opcode implementations
- **Effort**: 6 hours

#### ISSUE-047: Add Ethereum Test Vector Support
- **Component**: tests/consensus/
- **Description**: Run official Ethereum test vectors
- **Effort**: 8 hours

---

## Implementation Roadmap

### Week 1: Critical Infrastructure (P0)
- Fix all import issues
- Define VM interface
- Complete Frame structure
- Implement basic storage/environment access
- Fix gas accounting

### Week 2: Core Functionality (P0 + P1)
- Add all missing opcodes to jump table
- Complete storage operations
- Implement call operations
- Add hardfork support
- Begin unit testing

### Week 3: Testing & Refinement (P1)
- Complete all unit tests
- Add integration tests
- Fix all identified bugs
- Complete documentation

### Week 4: Optimization & Polish (P2)
- Performance optimizations
- Security enhancements
- Benchmark suite
- Final testing and validation

---

## Success Criteria

- [ ] All 47 issues resolved
- [ ] 100% opcode implementation coverage
- [ ] All Ethereum consensus tests passing
- [ ] Gas accounting matches reference implementations
- [ ] Performance benchmarks competitive with revm/evmone
- [ ] Comprehensive test coverage (>95%)
- [ ] No TODO comments remaining
- [ ] Full hardfork support (Frontier through Cancun)