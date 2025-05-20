# Zig EVM to Rust Tauri Integration Design

## Current State Analysis

The Tevm project currently has:

1. **Zig EVM Implementation** - A sophisticated Ethereum Virtual Machine implementation written in Zig
2. **Rust Tauri Backend** - A minimal Tauri backend that calls into Zig through FFI
3. **Solid.js Frontend** - A visual debugger UI for interacting with the EVM

### Issues with Current Setup

The current FFI interface between Zig and Rust is minimal and non-functional:

1. The `resetEvm()`, `stepEvm()`, and other functions in `src/root.zig` are mostly stubs.
2. There's no proper EVM state persistence across function calls.
3. The Zig code isn't properly initialized and doesn't maintain state between calls.
4. The current interface passes data via a raw byte buffer, which is error-prone.
5. The mock EVM state in `getEvmState()` doesn't reflect the actual EVM implementation.

## Proposed Design

### 1. Zig EVM State Management

Create a global EVM state handler in Zig:

```zig
// src/root.zig

const std = @import("std");
const evm = @import("Evm");
const utils = @import("Utils");
const address = @import("Address");
const StateManager = @import("StateManager/StateManager.zig").StateManager;

// Global state to persist across FFI calls
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
var allocator: std.mem.Allocator = undefined;
var evm_instance: ?*evm.Evm.Evm = null;
var state_manager: ?*StateManager = null;
var current_bytecode: ?[]u8 = null;
var current_interpreter: ?*evm.interpreter.Interpreter = null;
var current_frame: ?*evm.Frame.Frame = null;
var is_running: bool = false;

// Initialize the EVM system
export fn initEvm() bool {
    if (evm_instance != null) {
        // Already initialized
        return true;
    }

    allocator = gpa.allocator();
    
    // Create a new EVM instance
    var evm_obj = allocator.create(evm.Evm.Evm) catch {
        return false;
    };
    evm_obj.* = evm.Evm.Evm.init();
    evm_instance = evm_obj;
    
    // Create state manager
    var state_mgr = allocator.create(StateManager) catch {
        // Clean up EVM if we can't create state manager
        allocator.destroy(evm_obj);
        evm_instance = null;
        return false;
    };
    state_mgr.* = StateManager.init(allocator) catch {
        // Clean up on error
        allocator.destroy(evm_obj);
        evm_instance = null;
        return false;
    };
    state_manager = state_mgr;
    
    // Connect state manager to EVM
    evm_obj.setStateManager(state_mgr);
    
    return true;
}

// Cleanup resources on shutdown
export fn deinitEvm() void {
    if (current_frame) |frame| {
        frame.deinit();
        allocator.destroy(frame);
        current_frame = null;
    }
    
    if (current_interpreter) |interpreter| {
        interpreter.deinit();
        allocator.destroy(interpreter);
        current_interpreter = null;
    }
    
    if (current_bytecode) |bytecode| {
        allocator.free(bytecode);
        current_bytecode = null;
    }
    
    if (state_manager) |state_mgr| {
        state_mgr.deinit();
        allocator.destroy(state_mgr);
        state_manager = null;
    }
    
    if (evm_instance) |evm_inst| {
        allocator.destroy(evm_inst);
        evm_instance = null;
    }
    
    // Detect memory leaks in debug mode
    _ = gpa.deinit();
}
```

### 2. Enhanced FFI Interface

Redesign the FFI interface to properly support the EVM functionality:

```zig
// Parse and load bytecode for execution
export fn loadBytecode(bytecode_hex_ptr: [*]const u8, bytecode_hex_len: usize) bool {
    const bytecode_hex = bytecode_hex_ptr[0..bytecode_hex_len];
    
    // Initialize EVM if not already done
    if (evm_instance == null and !initEvm()) {
        return false;
    }
    
    // Clean up previous bytecode if exists
    if (current_bytecode) |prev_bytecode| {
        allocator.free(prev_bytecode);
        current_bytecode = null;
    }
    
    // Clean up previous execution state
    if (current_frame) |frame| {
        frame.deinit();
        allocator.destroy(frame);
        current_frame = null;
    }
    
    if (current_interpreter) |interpreter| {
        interpreter.deinit();
        allocator.destroy(interpreter);
        current_interpreter = null;
    }
    
    // Parse hex bytecode to bytes
    var bytecode = utils.hex.hexToBytes(allocator, bytecode_hex) catch {
        return false;
    };
    
    current_bytecode = bytecode;
    return true;
}

// Reset the EVM to initial state with loaded bytecode
export fn resetEvm() bool {
    if (evm_instance == null or current_bytecode == null) {
        return false;
    }
    
    // Clean up previous execution state
    if (current_frame) |frame| {
        frame.deinit();
        allocator.destroy(frame);
        current_frame = null;
    }
    
    if (current_interpreter) |interpreter| {
        interpreter.deinit();
        allocator.destroy(interpreter);
        current_interpreter = null;
    }
    
    // Set up a new contract with the bytecode
    const contract = allocator.create(evm.Contract.Contract) catch {
        return false;
    };
    
    // Use a dummy address for the contract
    const dummy_address = address.createAddress("0x0000000000000000000000000000000000000000");
    
    // Initialize contract with bytecode and dummy parameters
    contract.* = evm.Contract.Contract.init(
        allocator,
        dummy_address,
        dummy_address,
        current_bytecode.?,
        &[_]u8{},  // Empty calldata
        1000000,   // Gas limit
        0          // Value
    ) catch {
        allocator.destroy(contract);
        return false;
    };
    
    // Create a new frame for execution
    var frame = allocator.create(evm.Frame.Frame) catch {
        contract.deinit();
        allocator.destroy(contract);
        return false;
    };
    
    frame.* = evm.Frame.createFrame(allocator, contract) catch {
        allocator.destroy(frame);
        contract.deinit();
        allocator.destroy(contract);
        return false;
    };
    
    current_frame = frame;
    
    // Create interpreter
    var interpreter = allocator.create(evm.interpreter.Interpreter) catch {
        frame.deinit();
        allocator.destroy(frame);
        current_frame = null;
        return false;
    };
    
    // Use the latest jump table (Cancun by default)
    const jump_table = evm.JumpTable.createJumpTable(.Cancun);
    
    interpreter.* = evm.interpreter.Interpreter.create(
        allocator,
        evm_instance.?,
        jump_table
    );
    
    current_interpreter = interpreter;
    is_running = false;
    
    return true;
}

// Step through one EVM instruction
export fn stepEvm() bool {
    if (current_frame == null or current_interpreter == null) {
        return false;
    }
    
    var frame = current_frame.?;
    var interpreter = current_interpreter.?;
    
    // If we've reached the end of the code, stop
    if (frame.pc >= frame.contract.code.len) {
        return false;
    }
    
    // Execute one opcode
    // This would need to be implemented based on your interpreter design
    // For example, it might look like:
    const current_op = frame.contract.code[frame.pc];
    const op = interpreter.table.getOperation(current_op);
    
    // Execute the operation
    op.execute(frame.pc, interpreter, frame) catch |err| {
        // Handle execution errors
        if (err == evm.Frame.ExecutionError.STOP) {
            // Normal stop
            return false; 
        } else if (err == evm.Frame.ExecutionError.REVERT) {
            // Reverted
            return false;
        } else {
            // Other error
            return false;
        }
    };
    
    // Advance PC
    frame.pc += 1;
    
    return true;
}

// Toggle continuous execution mode
export fn toggleRunPause() bool {
    if (current_frame == null) {
        return false;
    }
    
    is_running = !is_running;
    return true;
}

// Get the current state of the EVM
export fn getEvmState(state_ptr: [*]u8, state_len: *usize) void {
    if (current_frame == null) {
        state_len.* = 0;
        return;
    }
    
    var frame = current_frame.?;
    
    // Using JSON for state representation
    var state = std.ArrayList(u8).init(allocator);
    defer state.deinit();
    
    const writer = state.writer();
    
    std.json.stringify(.{
        .pc = frame.pc,
        .opcode = if (frame.pc < frame.contract.code.len) 
            opcodes.opcodeNames[frame.contract.code[frame.pc]] 
            else "END",
        .gasLeft = frame.contract.gas,
        .depth = frame.contract.depth,
        .stack = frame.stackData(),
        .memory = utils.hex.bytesToHexString(allocator, frame.memoryData()) catch "0x",
        .storage = getCurrentStorage(),
        .logs = getLogs(),
        .returnData = if (frame.returnData) |data| 
            utils.hex.bytesToHexString(allocator, data) catch "0x" 
            else "0x",
    }, .{}, writer) catch {
        state_len.* = 0;
        return;
    };
    
    const json_str = state.items;
    
    if (json_str.len <= state_len.*) {
        @memcpy(state_ptr[0..json_str.len], json_str);
        state_len.* = json_str.len;
    } else {
        state_len.* = 0;
    }
}

// Helper functions for state extraction
fn getCurrentStorage() std.json.Value {
    // Implementation depends on your state manager design
    // This would extract storage slots from the current contract
    // ...
}

fn getLogs() std.json.Value {
    // Implementation depends on your EVM design
    // This would extract logs generated during execution
    // ...
}
```

### 3. Improved Rust Tauri Integration

Enhance the Rust side to better handle the Zig EVM interface:

```rust
// app/src-tauri/src/lib.rs

extern "C" {
    // Zig EVM functions (src/root.zig)
    fn initEvm() -> bool;
    fn deinitEvm();
    fn loadBytecode(bytecode_hex: *const u8, bytecode_hex_len: usize) -> bool;
    fn resetEvm() -> bool;
    fn stepEvm() -> bool;
    fn toggleRunPause() -> bool;
    fn getEvmState(state: *mut u8, state_len: *mut usize);
}

// Initialize EVM on application startup
#[tauri::command]
fn init_evm() -> bool {
    unsafe { initEvm() }
}

// Clean up EVM resources on application shutdown
#[tauri::command]
fn deinit_evm() {
    unsafe { deinitEvm() }
}

#[tauri::command]
fn load_bytecode(bytecode_hex: String) -> bool {
    unsafe {
        loadBytecode(bytecode_hex.as_ptr(), bytecode_hex.len())
    }
}

#[tauri::command]
fn reset_evm() -> bool {
    unsafe {
        resetEvm()
    }
}

#[tauri::command]
fn step_evm() -> bool {
    unsafe {
        stepEvm()
    }
}

#[tauri::command]
fn toggle_run_pause() -> bool {
    unsafe {
        toggleRunPause()
    }
}

#[tauri::command]
fn get_evm_state() -> serde_json::Value {
    let mut buffer = vec![0u8; 8192]; // Larger buffer to handle complex state
    let mut buffer_len = buffer.len();

    unsafe {
        getEvmState(buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        return serde_json::json!({});
    }

    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({})),
        Err(_) => serde_json::json!({}),
    }
}

// Clean up on application exit
struct EvmState;

impl Drop for EvmState {
    fn drop(&mut self) {
        unsafe { deinitEvm() }
    }
}

static EVM_STATE: once_cell::sync::Lazy<EvmState> = once_cell::sync::Lazy::new(|| {
    // Initialize EVM on first access
    unsafe { initEvm() };
    EvmState {}
});

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Ensure EVM is initialized
    let _ = &*EVM_STATE;
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init_evm,
            deinit_evm,
            load_bytecode,
            reset_evm,
            step_evm,
            toggle_run_pause,
            get_evm_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 4. Frontend Adjustments

Update the frontend to work with the improved backend:

```typescript
// app/src/components/evm-debugger/utils.ts

import { invoke } from "@tauri-apps/api/core";
import { EvmState } from "./types";

// Initialize EVM on application start
export async function initEvm(): Promise<boolean> {
  try {
    return await invoke<boolean>("init_evm");
  } catch (err) {
    throw new Error(`Failed to initialize EVM: ${err}`);
  }
}

export async function deinitEvm(): Promise<void> {
  try {
    await invoke<void>("deinit_evm");
  } catch (err) {
    console.error(`Failed to clean up EVM: ${err}`);
  }
}

export async function loadBytecode(bytecodeHex: string): Promise<boolean> {
  try {
    return await invoke<boolean>("load_bytecode", { bytecodeHex });
  } catch (err) {
    throw new Error(`Failed to load bytecode: ${err}`);
  }
}

export async function resetEvm(): Promise<boolean> {
  try {
    return await invoke<boolean>("reset_evm");
  } catch (err) {
    throw new Error(`Failed to reset EVM: ${err}`);
  }
}

export async function stepEvm(): Promise<boolean> {
  try {
    return await invoke<boolean>("step_evm");
  } catch (err) {
    throw new Error(`Failed to step: ${err}`);
  }
}

export async function toggleRunPause(): Promise<boolean> {
  try {
    return await invoke<boolean>("toggle_run_pause");
  } catch (err) {
    throw new Error(`Failed to toggle run/pause: ${err}`);
  }
}

export async function getEvmState(): Promise<EvmState> {
  try {
    return await invoke<EvmState>("get_evm_state");
  } catch (err) {
    throw new Error(`Failed to get state: ${err}`);
  }
}
```

## Implementation Plan

1. **Phase 1: Core EVM State Management**
   - Implement the global EVM state in `src/root.zig`
   - Create initialization and cleanup functions
   - Add initial bytecode loading functionality

2. **Phase 2: Execution Functionality**
   - Implement step-by-step execution
   - Add state extraction for the debugger
   - Implement running/pausing functionality

3. **Phase 3: Rust Integration**
   - Update Rust FFI interface to work with the new Zig functions
   - Add proper error handling and resource management
   - Implement buffer handling for state transfer

4. **Phase 4: Frontend Integration**
   - Update frontend to work with the new API
   - Add initialization on startup
   - Add cleanup on shutdown

## Future Enhancements

1. **Configuration Options**
   - Allow configuration of chain parameters (mainnet, testnet, etc.)
   - Support forking from real networks

2. **Performance Optimizations**
   - Use shared memory instead of JSON for state transfer
   - Implement batch stepping for faster execution

3. **Debugging Features**
   - Add breakpoints at specific opcodes or addresses
   - Add watch expressions for specific storage slots
   - Support source mapping for Solidity contracts

4. **Advanced State Management**
   - Support for snapshots and state rollback
   - Allow saving/loading execution state

5. **Testing Tools**
   - Add support for running test suites against contracts
   - Add code coverage reporting for executed code

## Conclusion

This design provides a robust architecture for connecting the Zig EVM implementation to the Rust Tauri application. By maintaining state across FFI calls and providing a clean interface, we enable the frontend to effectively control and visualize the EVM execution.

The modular approach allows for future enhancements while ensuring the core functionality works reliably. The focus on proper resource management and error handling will ensure a stable application experience.