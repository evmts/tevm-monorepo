# EVM Opcode Implementation Verification Checklist

This document tracks the implementation and testing status of all EVM opcodes. Each opcode needs to be:
1. Verified against the revm implementation
2. Have at least basic test coverage 
3. Have additional VM-level integration tests

## Status Legend
- ✅ Complete (implementation verified, tests exist)
- 🔨 In Progress
- ❌ Not Started
- ⚠️ Needs Review (implementation exists but needs verification)

## Arithmetic Operations (0x01-0x0B)
- [✅] **ADD** (0x01) - Addition operation
  - Implementation: `src/evm/opcodes/arithmetic.zig` ✅ Verified against revm
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::add`
  - Tests: `test/evm/opcodes/arithmetic_test.zig` ✅ Has unit tests
  - VM Tests: `test/evm/vm_opcode_test.zig` ✅ Added comprehensive VM tests

- [🔨] **MUL** (0x02) - Multiplication operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::mul`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: `test/evm/vm_opcode_test.zig` ⚠️ Basic test exists, needs expansion

- [ ] **SUB** (0x03) - Subtraction operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::sub`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **DIV** (0x04) - Integer division operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::div`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SDIV** (0x05) - Signed integer division operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::sdiv`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MOD** (0x06) - Modulo remainder operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::rem`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SMOD** (0x07) - Signed modulo remainder operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::smod`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **ADDMOD** (0x08) - Modulo addition operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::addmod`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MULMOD** (0x09) - Modulo multiplication operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::mulmod`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXP** (0x0A) - Exponential operation
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::exp`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SIGNEXTEND** (0x0B) - Extend length of two's complement signed integer
  - Implementation: `src/evm/opcodes/arithmetic.zig`
  - Revm: `revm/crates/interpreter/src/instructions/arithmetic.rs::signextend`
  - Tests: `test/evm/opcodes/arithmetic_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Comparison & Bitwise Logic Operations (0x10-0x1D)
- [ ] **LT** (0x10) - Less-than comparison
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **GT** (0x11) - Greater-than comparison
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SLT** (0x12) - Signed less-than comparison
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SGT** (0x13) - Signed greater-than comparison
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EQ** (0x14) - Equality comparison
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **ISZERO** (0x15) - Simple not operator
  - Implementation: `src/evm/opcodes/comparison.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/comparison_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **AND** (0x16) - Bitwise AND operation
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **OR** (0x17) - Bitwise OR operation
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **XOR** (0x18) - Bitwise XOR operation
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **NOT** (0x19) - Bitwise NOT operation
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **BYTE** (0x1A) - Retrieve single byte from word
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SHL** (0x1B) - Shift left
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SHR** (0x1C) - Logical shift right
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SAR** (0x1D) - Arithmetic (signed) shift right
  - Implementation: `src/evm/opcodes/bitwise.zig`
  - Revm: `revm/crates/interpreter/src/instructions/bitwise.rs`
  - Tests: `test/evm/opcodes/bitwise_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## SHA3 (0x20)
- [ ] **KECCAK256** (0x20) - Compute Keccak-256 hash
  - Implementation: `src/evm/opcodes/crypto.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/crypto_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Environmental Information (0x30-0x3F)
- [ ] **ADDRESS** (0x30) - Get address of currently executing account
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **BALANCE** (0x31) - Get balance of the given account
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **ORIGIN** (0x32) - Get execution origination address
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/tx_info.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLER** (0x33) - Get caller address
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLVALUE** (0x34) - Get deposited value by the instruction/transaction responsible for this execution
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLDATALOAD** (0x35) - Get input data of current environment
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLDATASIZE** (0x36) - Get size of input data in current environment
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLDATACOPY** (0x37) - Copy input data in current environment to memory
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CODESIZE** (0x38) - Get size of code running in current environment
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CODECOPY** (0x39) - Copy code running in current environment to memory
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **GASPRICE** (0x3A) - Get price of gas in current environment
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/tx_info.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXTCODESIZE** (0x3B) - Get size of an account's code
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXTCODECOPY** (0x3C) - Copy an account's code to memory
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **RETURNDATASIZE** (0x3D) - Get size of output data from the previous call
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **RETURNDATACOPY** (0x3E) - Copy output data from the previous call to memory
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXTCODEHASH** (0x3F) - Get hash of an account's code
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Block Information (0x40-0x4A)
- [ ] **BLOCKHASH** (0x40) - Get the hash of one of the 256 most recent complete blocks
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **COINBASE** (0x41) - Get the block's beneficiary address
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **TIMESTAMP** (0x42) - Get the block's timestamp
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **NUMBER** (0x43) - Get the block's number
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **PREVRANDAO** (0x44) - Get the previous block's RANDAO mix
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **GASLIMIT** (0x45) - Get the block's gas limit
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CHAINID** (0x46) - Get the chain ID
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SELFBALANCE** (0x47) - Get balance of currently executing account
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **BASEFEE** (0x48) - Get the base fee
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **BLOBHASH** (0x49) - Get versioned hash at index
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/tx_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **BLOBBASEFEE** (0x4A) - Get blob base fee
  - Implementation: `src/evm/opcodes/block.zig`
  - Revm: `revm/crates/interpreter/src/instructions/block_info.rs`
  - Tests: `test/evm/opcodes/block_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Stack, Memory, Storage and Flow Operations (0x50-0x5F)
- [ ] **POP** (0x50) - Remove item from stack
  - Implementation: `src/evm/opcodes/stack.zig`
  - Revm: `revm/crates/interpreter/src/instructions/stack.rs`
  - Tests: `test/evm/opcodes/stack_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MLOAD** (0x51) - Load word from memory
  - Implementation: `src/evm/opcodes/memory.zig`
  - Revm: `revm/crates/interpreter/src/instructions/memory.rs`
  - Tests: `test/evm/opcodes/memory_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MSTORE** (0x52) - Save word to memory
  - Implementation: `src/evm/opcodes/memory.zig`
  - Revm: `revm/crates/interpreter/src/instructions/memory.rs`
  - Tests: `test/evm/opcodes/memory_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MSTORE8** (0x53) - Save byte to memory
  - Implementation: `src/evm/opcodes/memory.zig`
  - Revm: `revm/crates/interpreter/src/instructions/memory.rs`
  - Tests: `test/evm/opcodes/memory_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SLOAD** (0x54) - Load word from storage
  - Implementation: `src/evm/opcodes/storage.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/storage_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SSTORE** (0x55) - Save word to storage
  - Implementation: `src/evm/opcodes/storage.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/storage_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **JUMP** (0x56) - Alter the program counter
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **JUMPI** (0x57) - Conditionally alter the program counter
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **PC** (0x58) - Get the value of the program counter prior to the increment
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MSIZE** (0x59) - Get the size of active memory in bytes
  - Implementation: `src/evm/opcodes/memory.zig`
  - Revm: `revm/crates/interpreter/src/instructions/memory.rs`
  - Tests: `test/evm/opcodes/memory_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **GAS** (0x5A) - Get the amount of available gas
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/system.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **JUMPDEST** (0x5B) - Mark a valid destination for jumps
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **TLOAD** (0x5C) - Load word from transient storage
  - Implementation: `src/evm/opcodes/storage.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/storage_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **TSTORE** (0x5D) - Save word to transient storage
  - Implementation: `src/evm/opcodes/storage.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/storage_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **MCOPY** (0x5E) - Copy memory areas
  - Implementation: `src/evm/opcodes/memory.zig`
  - Revm: `revm/crates/interpreter/src/instructions/memory.rs`
  - Tests: `test/evm/opcodes/memory_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **PUSH0** (0x5F) - Place 0 on stack
  - Implementation: `src/evm/opcodes/stack.zig`
  - Revm: `revm/crates/interpreter/src/instructions/stack.rs`
  - Tests: `test/evm/opcodes/stack_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Push Operations (0x60-0x7F)
- [ ] **PUSH1** to **PUSH32** (0x60-0x7F) - Place 1 to 32 bytes item on stack
  - Implementation: `src/evm/opcodes/stack.zig`
  - Revm: `revm/crates/interpreter/src/instructions/stack.rs`
  - Tests: `test/evm/opcodes/stack_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Duplication Operations (0x80-0x8F)
- [ ] **DUP1** to **DUP16** (0x80-0x8F) - Duplicate stack item
  - Implementation: `src/evm/opcodes/stack.zig`
  - Revm: `revm/crates/interpreter/src/instructions/stack.rs`
  - Tests: `test/evm/opcodes/stack_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Exchange Operations (0x90-0x9F)
- [ ] **SWAP1** to **SWAP16** (0x90-0x9F) - Exchange stack items
  - Implementation: `src/evm/opcodes/stack.zig`
  - Revm: `revm/crates/interpreter/src/instructions/stack.rs`
  - Tests: `test/evm/opcodes/stack_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## Logging Operations (0xA0-0xA4)
- [ ] **LOG0** to **LOG4** (0xA0-0xA4) - Append log record with topics
  - Implementation: `src/evm/opcodes/log.zig`
  - Revm: `revm/crates/interpreter/src/instructions/host.rs`
  - Tests: `test/evm/opcodes/log_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## System Operations (0xF0-0xFF)
- [ ] **CREATE** (0xF0) - Create a new account with associated code
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALL** (0xF1) - Message-call into an account
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CALLCODE** (0xF2) - Message-call into this account with alternative account's code
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **RETURN** (0xF3) - Halt execution returning output data
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **DELEGATECALL** (0xF4) - Message-call into this account with an alternative account's code, but persisting the current values for sender and value
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **CREATE2** (0xF5) - Create a new account with associated code at a predictable address
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **RETURNDATALOAD** (0xF7) - Load word from return data
  - Implementation: `src/evm/opcodes/environment.zig`
  - Revm: `revm/crates/interpreter/src/instructions/data.rs`
  - Tests: `test/evm/opcodes/environment_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXTCALL** (0xF8) - Message-call into an account (EIP-7069)
  - Implementation: ❌ Not implemented
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: ❌ No tests
  - VM Tests: ❌ No tests

- [ ] **EXTDELEGATECALL** (0xF9) - Message-call into this account with an alternative account's code (EIP-7069)
  - Implementation: ❌ Not implemented
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: ❌ No tests
  - VM Tests: ❌ No tests

- [ ] **STATICCALL** (0xFA) - Static message-call into an account
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **EXTSTATICCALL** (0xFB) - Static message-call into an account (EIP-7069)
  - Implementation: ❌ Not implemented
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: ❌ No tests
  - VM Tests: ❌ No tests

- [ ] **REVERT** (0xFD) - Halt execution reverting state changes but returning data and remaining gas
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **INVALID** (0xFE) - Designated invalid instruction
  - Implementation: `src/evm/opcodes/control.zig`
  - Revm: `revm/crates/interpreter/src/instructions/control.rs`
  - Tests: `test/evm/opcodes/control_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

- [ ] **SELFDESTRUCT** (0xFF) - Halt execution and register account for later deletion
  - Implementation: `src/evm/opcodes/system.zig`
  - Revm: `revm/crates/interpreter/src/instructions/contract.rs`
  - Tests: `test/evm/opcodes/system_test.zig`
  - VM Tests: ⚠️ Needs additional VM-level tests

## VM-Level Integration Test Suite

### Test Categories Needed:
1. **Simple Bytecode Programs** - Hand-crafted bytecode sequences testing individual opcodes
2. **Complex Interactions** - Multi-opcode sequences testing interactions
3. **Edge Cases** - Boundary conditions, gas limits, stack limits
4. **State Changes** - Storage, balance, and contract creation
5. **Error Handling** - Invalid jumps, out of gas, stack underflow/overflow

### Example VM Test Structure:
```zig
test "VM: STOP opcode halts execution" {
    const allocator = testing.allocator;
    var vm = try Vm.init(allocator);
    defer vm.deinit();
    
    const bytecode = [_]u8{0x00}; // STOP
    const result = try vm.run(&bytecode, Address.zero(), 1000, null);
    
    try testing.expect(result.status == .Success);
    try testing.expectEqual(@as(u64, 999), result.gas_used); // 1 gas for STOP
}
```

## Action Items:
1. For each opcode marked with ⚠️, verify implementation against revm
2. Add at least one additional unit test per opcode
3. Create VM-level integration tests for each opcode
4. Update this document as opcodes are verified and tested
5. Implement missing opcodes (EXTCALL, EXTDELEGATECALL, EXTSTATICCALL)