# EVM Opcode Implementation Issues and Testing Status

This document tracks the implementation status of all EVM opcodes, comparing our Zig implementation with the revm Rust implementation, and ensuring comprehensive test coverage.

## Implementation Comparison Table

| Opcode | Hex | Category | Zig Implementation | Revm Implementation | Test Coverage | Additional Tests Needed |
|--------|-----|----------|-------------------|---------------------|---------------|------------------------|
| **Arithmetic Operations** |
| STOP | 0x00 | Control | `control.zig` | `control::stop` | ✅ Basic test | Edge cases with nested calls |
| ADD | 0x01 | Arithmetic | `arithmetic.zig::op_add` | `arithmetic::add` | ✅ Basic, overflow | Large number edge cases |
| MUL | 0x02 | Arithmetic | `arithmetic.zig::op_mul` | `arithmetic::mul` | ✅ Basic | Overflow combinations |
| SUB | 0x03 | Arithmetic | `arithmetic.zig::op_sub` | `arithmetic::sub` | ✅ Basic | Underflow edge cases |
| DIV | 0x04 | Arithmetic | `arithmetic.zig::op_div` | `arithmetic::div` | ✅ Basic, div by zero | Edge cases with MAX values |
| SDIV | 0x05 | Arithmetic | `arithmetic.zig::op_sdiv` | `arithmetic::sdiv` | ⚠️ Limited | Negative number edge cases |
| MOD | 0x06 | Arithmetic | `arithmetic.zig::op_mod` | `arithmetic::rem` | ✅ Basic | Modulo with large numbers |
| SMOD | 0x07 | Arithmetic | `arithmetic.zig::op_smod` | `arithmetic::smod` | ⚠️ Limited | Signed modulo edge cases |
| ADDMOD | 0x08 | Arithmetic | `arithmetic.zig::op_addmod` | `arithmetic::addmod` | ✅ Basic | Modulo zero handling |
| MULMOD | 0x09 | Arithmetic | `arithmetic.zig::op_mulmod` | `arithmetic::mulmod` | ✅ Basic | Large multiplication modulo |
| EXP | 0x0A | Arithmetic | `arithmetic.zig::op_exp` | `arithmetic::exp` | ✅ Basic | Gas limit edge cases |
| SIGNEXTEND | 0x0B | Arithmetic | `arithmetic.zig::op_signextend` | `arithmetic::signextend` | ❌ Missing | Full implementation needed |
| **Comparison & Bitwise Operations** |
| LT | 0x10 | Comparison | `comparison.zig::op_lt` | `bitwise::lt` | ✅ Basic | Boundary value comparisons |
| GT | 0x11 | Comparison | `comparison.zig::op_gt` | `bitwise::gt` | ✅ Basic | Equal value edge cases |
| SLT | 0x12 | Comparison | `comparison.zig::op_slt` | `bitwise::slt` | ✅ Basic | Signed boundary tests |
| SGT | 0x13 | Comparison | `comparison.zig::op_sgt` | `bitwise::sgt` | ✅ Basic | Negative number comparisons |
| EQ | 0x14 | Comparison | `comparison.zig::op_eq` | `bitwise::eq` | ✅ Basic | Type edge cases |
| ISZERO | 0x15 | Comparison | `comparison.zig::op_iszero` | `bitwise::iszero` | ✅ Basic | Near-zero values |
| AND | 0x16 | Bitwise | `bitwise.zig::op_and` | `bitwise::bitand` | ✅ Basic | Bit pattern tests |
| OR | 0x17 | Bitwise | `bitwise.zig::op_or` | `bitwise::bitor` | ✅ Basic | All bits set/unset |
| XOR | 0x18 | Bitwise | `bitwise.zig::op_xor` | `bitwise::bitxor` | ✅ Basic | Self-XOR tests |
| NOT | 0x19 | Bitwise | `bitwise.zig::op_not` | `bitwise::not` | ✅ Basic | Double negation |
| BYTE | 0x1A | Bitwise | `bitwise.zig::op_byte` | `bitwise::byte` | ✅ Basic | Out of bounds access |
| SHL | 0x1B | Bitwise | `bitwise.zig::op_shl` | `bitwise::shl` | ✅ Basic | Shift overflow tests |
| SHR | 0x1C | Bitwise | `bitwise.zig::op_shr` | `bitwise::shr` | ✅ Basic | Large shift amounts |
| SAR | 0x1D | Bitwise | `bitwise.zig::op_sar` | `bitwise::sar` | ✅ Basic | Signed shift edge cases |
| **SHA3** |
| KECCAK256 | 0x20 | Crypto | `crypto.zig::op_keccak256` | `system::keccak256` | ✅ Basic | Large data hashing |
| **Environmental Information** |
| ADDRESS | 0x30 | Environment | `environment.zig::op_address` | `system::address` | ✅ Basic | Contract creation context |
| BALANCE | 0x31 | Environment | `environment.zig::op_balance` | `host::balance` | ✅ Basic | Non-existent accounts |
| ORIGIN | 0x32 | Environment | `environment.zig::op_origin` | `tx_info::origin` | ✅ Basic | Nested call contexts |
| CALLER | 0x33 | Environment | `environment.zig::op_caller` | `system::caller` | ✅ Basic | Delegate call contexts |
| CALLVALUE | 0x34 | Environment | `environment.zig::op_callvalue` | `system::callvalue` | ✅ Basic | Zero value calls |
| CALLDATALOAD | 0x35 | Environment | `environment.zig::op_calldataload` | `system::calldataload` | ⚠️ Limited | Out of bounds reads |
| CALLDATASIZE | 0x36 | Environment | `environment.zig::op_calldatasize` | `system::calldatasize` | ✅ Basic | Empty calldata |
| CALLDATACOPY | 0x37 | Environment | `environment.zig::op_calldatacopy` | `system::calldatacopy` | ⚠️ Limited | Memory expansion tests |
| CODESIZE | 0x38 | Environment | `environment.zig::op_codesize` | `system::codesize` | ✅ Basic | Large contracts |
| CODECOPY | 0x39 | Environment | `environment.zig::op_codecopy` | `system::codecopy` | ⚠️ Limited | Partial copy tests |
| GASPRICE | 0x3A | Environment | `environment.zig::op_gasprice` | `tx_info::gasprice` | ✅ Basic | Different gas price scenarios |
| EXTCODESIZE | 0x3B | Environment | `environment.zig::op_extcodesize` | `host::extcodesize` | ✅ Basic | EOA vs contract tests |
| EXTCODECOPY | 0x3C | Environment | `environment.zig::op_extcodecopy` | `host::extcodecopy` | ⚠️ Limited | Cross-contract tests |
| RETURNDATASIZE | 0x3D | Environment | `environment.zig::op_returndatasize` | `system::returndatasize` | ⚠️ Limited | After failed calls |
| RETURNDATACOPY | 0x3E | Environment | `environment.zig::op_returndatacopy` | `system::returndatacopy` | ⚠️ Limited | Buffer overflow tests |
| EXTCODEHASH | 0x3F | Environment | `environment.zig::op_extcodehash` | `host::extcodehash` | ✅ Basic | Empty account tests |
| **Block Information** |
| BLOCKHASH | 0x40 | Block | `block.zig::op_blockhash` | `host::blockhash` | ✅ Basic | Old block access tests |
| COINBASE | 0x41 | Block | `block.zig::op_coinbase` | `block_info::coinbase` | ✅ Basic | Different validators |
| TIMESTAMP | 0x42 | Block | `block.zig::op_timestamp` | `block_info::timestamp` | ✅ Basic | Timestamp manipulation |
| NUMBER | 0x43 | Block | `block.zig::op_number` | `block_info::block_number` | ✅ Basic | Genesis block edge case |
| PREVRANDAO | 0x44 | Block | `block.zig::op_prevrandao` | `block_info::difficulty` | ✅ Basic | Post-merge behavior |
| GASLIMIT | 0x45 | Block | `block.zig::op_gaslimit` | `block_info::gaslimit` | ✅ Basic | Different limit scenarios |
| CHAINID | 0x46 | Block | `block.zig::op_chainid` | `block_info::chainid` | ✅ Basic | Different chain tests |
| SELFBALANCE | 0x47 | Block | `block.zig::op_selfbalance` | `host::selfbalance` | ✅ Basic | Balance changes |
| BASEFEE | 0x48 | Block | `block.zig::op_basefee` | `block_info::basefee` | ✅ Basic | EIP-1559 scenarios |
| BLOBHASH | 0x49 | Block | `block.zig::op_blobhash` | `tx_info::blob_hash` | ✅ Basic | Multiple blob tests |
| BLOBBASEFEE | 0x4A | Block | `block.zig::op_blobbasefee` | `block_info::blob_basefee` | ✅ Basic | Fee market tests |
| **Stack, Memory, Storage and Flow Operations** |
| POP | 0x50 | Stack | `stack.zig::op_pop` | `stack::pop` | ✅ Basic | Empty stack tests |
| MLOAD | 0x51 | Memory | `memory.zig::op_mload` | `memory::mload` | ✅ Basic | Memory expansion tests |
| MSTORE | 0x52 | Memory | `memory.zig::op_mstore` | `memory::mstore` | ✅ Basic | Large offset tests |
| MSTORE8 | 0x53 | Memory | `memory.zig::op_mstore8` | `memory::mstore8` | ✅ Basic | Byte boundary tests |
| SLOAD | 0x54 | Storage | `storage.zig::op_sload` | `host::sload` | ✅ Basic | Cold/warm access tests |
| SSTORE | 0x55 | Storage | `storage.zig::op_sstore` | `host::sstore` | ✅ Basic | Gas refund scenarios |
| JUMP | 0x56 | Control | `control.zig::op_jump` | `control::jump` | ✅ Basic | Invalid jump tests |
| JUMPI | 0x57 | Control | `control.zig::op_jumpi` | `control::jumpi` | ✅ Basic | Conditional edge cases |
| PC | 0x58 | Control | `control.zig::op_pc` | `control::pc` | ✅ Basic | Different positions |
| MSIZE | 0x59 | Memory | `memory.zig::op_msize` | `memory::msize` | ✅ Basic | After expansions |
| GAS | 0x5A | System | `system.zig::op_gas` | `system::gas` | ✅ Basic | Low gas scenarios |
| JUMPDEST | 0x5B | Control | `control.zig::op_jumpdest` | `control::jumpdest_or_nop` | ✅ Basic | Valid destinations |
| TLOAD | 0x5C | Storage | `storage.zig::op_tload` | `host::tload` | ✅ Basic | Transient storage tests |
| TSTORE | 0x5D | Storage | `storage.zig::op_tstore` | `host::tstore` | ✅ Basic | Cross-call persistence |
| MCOPY | 0x5E | Memory | `memory.zig::op_mcopy` | `memory::mcopy` | ✅ Basic | Overlapping copies |
| PUSH0 | 0x5F | Stack | `stack.zig::op_push0` | `stack::push0` | ✅ Basic | Stack limit tests |
| PUSH1-32 | 0x60-0x7F | Stack | `stack.zig::op_push` | `stack::push` | ✅ Basic | Boundary value pushes |
| DUP1-16 | 0x80-0x8F | Stack | `stack.zig::op_dup` | `stack::dup` | ✅ Basic | Deep stack access |
| SWAP1-16 | 0x90-0x9F | Stack | `stack.zig::op_swap` | `stack::swap` | ✅ Basic | Stack position tests |
| **Logging Operations** |
| LOG0-4 | 0xA0-0xA4 | Log | `log.zig::op_log` | `host::log` | ✅ Basic | Topic limit tests |
| **System Operations** |
| CREATE | 0xF0 | System | `system.zig::op_create` | `contract::create` | ✅ Basic | Deployment failures |
| CALL | 0xF1 | System | `system.zig::op_call` | `contract::call` | ⚠️ Limited | Reentrancy tests |
| CALLCODE | 0xF2 | System | `system.zig::op_callcode` | `contract::call_code` | ⚠️ Limited | Context preservation |
| RETURN | 0xF3 | Control | `control.zig::op_return` | `control::ret` | ✅ Basic | Large return data |
| DELEGATECALL | 0xF4 | System | `system.zig::op_delegatecall` | `contract::delegate_call` | ⚠️ Limited | Storage context tests |
| CREATE2 | 0xF5 | System | `system.zig::op_create2` | `contract::create` | ✅ Basic | Salt collision tests |
| RETURNDATALOAD | 0xF7 | Environment | `environment.zig::op_returndataload` | `system::returndataload` | ❌ Missing | Implementation needed |
| EXTCALL | 0xF8 | System | ❌ Not implemented | `contract::extcall` | ❌ Missing | EOF implementation |
| EXTDELEGATECALL | 0xF9 | System | ❌ Not implemented | `contract::extdelegatecall` | ❌ Missing | EOF implementation |
| STATICCALL | 0xFA | System | `system.zig::op_staticcall` | `contract::static_call` | ⚠️ Limited | State mutation tests |
| EXTSTATICCALL | 0xFB | System | ❌ Not implemented | `contract::extstaticcall` | ❌ Missing | EOF implementation |
| REVERT | 0xFD | Control | `control.zig::op_revert` | `control::revert` | ✅ Basic | Revert reason tests |
| INVALID | 0xFE | Control | `control.zig::op_invalid` | `control::invalid` | ✅ Basic | Invalid sequence tests |
| SELFDESTRUCT | 0xFF | System | `control.zig::op_selfdestruct` | `host::selfdestruct` | ✅ Basic | Ether transfer tests |

## Priority Issues

### High Priority (Missing Implementations)
1. **SIGNEXTEND (0x0B)** - Not implemented in arithmetic.zig
2. **RETURNDATALOAD (0xF7)** - Missing implementation
3. **EXTCALL (0xF8)** - EOF-related, not implemented
4. **EXTDELEGATECALL (0xF9)** - EOF-related, not implemented
5. **EXTSTATICCALL (0xFB)** - EOF-related, not implemented

### Medium Priority (Limited Test Coverage)
1. **SDIV/SMOD** - Need comprehensive signed arithmetic tests
2. **CALLDATALOAD/CALLDATACOPY** - Need out-of-bounds and edge case tests
3. **CODECOPY/EXTCODECOPY** - Need partial copy and cross-contract tests
4. **RETURNDATASIZE/RETURNDATACOPY** - Need failure scenario tests
5. **CALL/DELEGATECALL/CALLCODE/STATICCALL** - Need reentrancy and context tests

### Low Priority (Enhancement Tests)
- Add gas consumption edge case tests for all opcodes
- Add memory expansion limit tests for memory operations
- Add stack depth limit tests for stack operations
- Add hardfork-specific behavior tests

## Testing Guidelines

For each opcode, ensure the following test cases are covered:

1. **Basic functionality** - Normal operation with valid inputs
2. **Edge cases** - Boundary values, empty inputs, maximum values
3. **Error conditions** - Stack underflow, out of gas, invalid parameters
4. **Gas consumption** - Verify correct gas costs
5. **Hardfork behavior** - Test different behavior across hardforks
6. **Integration** - Test interaction with other opcodes

## Implementation Comparison Notes

### Key Differences Found:
1. **Error Handling**: Revm uses Result types extensively, our Zig implementation uses error unions
2. **Gas Handling**: Revm uses macros for gas consumption, we use explicit function calls
3. **Stack Operations**: Revm uses macros like `popn_top!`, we use explicit stack manipulation
4. **Memory Management**: Different approaches to memory allocation and limits

### Recommendations:
1. Align error handling patterns between implementations
2. Ensure gas costs match exactly between implementations
3. Add comprehensive test suite that can run against both implementations
4. Document any intentional differences in behavior