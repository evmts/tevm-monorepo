# Improved Zig EVM to Rust Tauri Integration Design

## Issues with the Original Design

The original design had several problems:

1. **Global State** - Using global variables for EVM state makes it impossible to have multiple independent instances
2. **Singleton Pattern** - The singleton approach prevents proper testing and limits flexibility
3. **Resource Management** - Relying on global cleanup is error-prone
4. **Concurrency** - A global approach doesn't support concurrent EVM instances

## Improved Design: Session-Based Architecture

Instead of a singleton architecture, we'll use a session-based approach:

1. Create a "Session" ID system to maintain multiple separate EVM instances
2. Pass session IDs between Zig and Rust to identify which instance to operate on
3. Manage resources per session with clean lifecycle management

### 1. Session Management in Zig

```zig
// src/root.zig

const std = @import("std");
const evm = @import("Evm");
const utils = @import("Utils");
const address = @import("Address");
const StateManager = @import("StateManager/StateManager.zig").StateManager;

/// EvmSession represents a single EVM execution context
/// Each session is independent with its own state and resources
pub const EvmSession = struct {
    id: u32,
    evm_instance: *evm.Evm.Evm,
    state_manager: *StateManager,
    current_bytecode: ?[]u8,
    current_interpreter: ?*evm.interpreter.Interpreter,
    current_frame: ?*evm.Frame.Frame,
    is_running: bool,
    allocator: std.mem.Allocator,
    
    /// Initialize a new EVM session
    pub fn init(allocator: std.mem.Allocator, id: u32) !EvmSession {
        // Create a new EVM instance
        var evm_obj = try allocator.create(evm.Evm.Evm);
        errdefer allocator.destroy(evm_obj);
        
        evm_obj.* = evm.Evm.Evm.init();
        
        // Create state manager
        var state_mgr = try allocator.create(StateManager);
        errdefer allocator.destroy(state_mgr);
        
        state_mgr.* = try StateManager.init(allocator);
        
        // Connect state manager to EVM
        evm_obj.setStateManager(state_mgr);
        
        return EvmSession{
            .id = id,
            .evm_instance = evm_obj,
            .state_manager = state_mgr,
            .current_bytecode = null,
            .current_interpreter = null,
            .current_frame = null,
            .is_running = false,
            .allocator = allocator,
        };
    }
    
    /// Clean up all resources used by this session
    pub fn deinit(self: *EvmSession) void {
        // Clean up execution resources
        if (self.current_frame) |frame| {
            frame.deinit();
            self.allocator.destroy(frame);
            self.current_frame = null;
        }
        
        if (self.current_interpreter) |interpreter| {
            interpreter.deinit();
            self.allocator.destroy(interpreter);
            self.current_interpreter = null;
        }
        
        if (self.current_bytecode) |bytecode| {
            self.allocator.free(bytecode);
            self.current_bytecode = null;
        }
        
        // Clean up core components
        self.state_manager.deinit();
        self.allocator.destroy(self.state_manager);
        
        self.allocator.destroy(self.evm_instance);
    }
    
    /// Load bytecode for execution in this session
    pub fn loadBytecode(self: *EvmSession, bytecode_hex: []const u8) !void {
        // Clean up previous bytecode if exists
        if (self.current_bytecode) |prev_bytecode| {
            self.allocator.free(prev_bytecode);
            self.current_bytecode = null;
        }
        
        // Clean up previous execution state
        if (self.current_frame) |frame| {
            frame.deinit();
            self.allocator.destroy(frame);
            self.current_frame = null;
        }
        
        if (self.current_interpreter) |interpreter| {
            interpreter.deinit();
            self.allocator.destroy(interpreter);
            self.current_interpreter = null;
        }
        
        // Parse hex bytecode to bytes
        var bytecode = try utils.hex.hexToBytes(self.allocator, bytecode_hex);
        
        self.current_bytecode = bytecode;
    }
    
    /// Reset the EVM to initial state with loaded bytecode
    pub fn reset(self: *EvmSession) !void {
        if (self.current_bytecode == null) {
            return error.NoBytecodeLoaded;
        }
        
        // Clean up previous execution state
        if (self.current_frame) |frame| {
            frame.deinit();
            self.allocator.destroy(frame);
            self.current_frame = null;
        }
        
        if (self.current_interpreter) |interpreter| {
            interpreter.deinit();
            self.allocator.destroy(interpreter);
            self.current_interpreter = null;
        }
        
        // Set up a new contract with the bytecode
        const contract = try self.allocator.create(evm.Contract.Contract);
        errdefer self.allocator.destroy(contract);
        
        // Use a dummy address for the contract
        const dummy_address = address.createAddress("0x0000000000000000000000000000000000000000");
        
        // Initialize contract with bytecode and dummy parameters
        contract.* = try evm.Contract.Contract.init(
            self.allocator,
            dummy_address,
            dummy_address,
            self.current_bytecode.?,
            &[_]u8{},  // Empty calldata
            1000000,   // Gas limit
            0          // Value
        );
        
        // Create a new frame for execution
        var frame = try self.allocator.create(evm.Frame.Frame);
        errdefer self.allocator.destroy(frame);
        
        frame.* = try evm.Frame.createFrame(self.allocator, contract);
        
        self.current_frame = frame;
        
        // Create interpreter
        var interpreter = try self.allocator.create(evm.interpreter.Interpreter);
        errdefer self.allocator.destroy(interpreter);
        
        // Use the latest jump table (Cancun by default)
        const jump_table = evm.JumpTable.createJumpTable(.Cancun);
        
        interpreter.* = evm.interpreter.Interpreter.create(
            self.allocator,
            self.evm_instance,
            jump_table
        );
        
        self.current_interpreter = interpreter;
        self.is_running = false;
    }
    
    /// Step through one EVM instruction
    pub fn step(self: *EvmSession) !bool {
        if (self.current_frame == null or self.current_interpreter == null) {
            return error.NoActiveExecution;
        }
        
        var frame = self.current_frame.?;
        var interpreter = self.current_interpreter.?;
        
        // If we've reached the end of the code, stop
        if (frame.pc >= frame.contract.code.len) {
            return false;
        }
        
        // Execute one opcode
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
    
    /// Toggle continuous execution mode
    pub fn toggleRunPause(self: *EvmSession) !bool {
        if (self.current_frame == null) {
            return error.NoActiveExecution;
        }
        
        self.is_running = !self.is_running;
        return self.is_running;
    }
    
    /// Get the current state of the EVM
    pub fn getState(self: *EvmSession, allocator: std.mem.Allocator) ![]u8 {
        if (self.current_frame == null) {
            return error.NoActiveExecution;
        }
        
        var frame = self.current_frame.?;
        
        var state = std.ArrayList(u8).init(allocator);
        errdefer state.deinit();
        
        const writer = state.writer();
        
        try std.json.stringify(.{
            .pc = frame.pc,
            .opcode = if (frame.pc < frame.contract.code.len) 
                evm.opcodes.opcodeNames[frame.contract.code[frame.pc]] 
                else "END",
            .gasLeft = frame.contract.gas,
            .depth = self.evm_instance.depth,
            .stack = frame.stackData(),
            .memory = try utils.hex.bytesToHexString(allocator, frame.memoryData()),
            .storage = try self.getCurrentStorage(allocator),
            .logs = try self.getLogs(allocator),
            .returnData = if (frame.returnData) |data| 
                try utils.hex.bytesToHexString(allocator, data) 
                else "0x",
        }, .{}, writer);
        
        return state.toOwnedSlice();
    }
    
    // Helper functions for state extraction
    fn getCurrentStorage(self: *EvmSession, allocator: std.mem.Allocator) !std.json.Value {
        // Implementation depends on your state manager design
        // This would extract storage slots from the current contract
        _ = self; // unused
        
        var map = std.StringHashMap([]const u8).init(allocator);
        defer {
            var iter = map.iterator();
            while (iter.next()) |entry| {
                allocator.free(entry.key_ptr.*);
                allocator.free(entry.value_ptr.*);
            }
            map.deinit();
        }
        
        // Placeholder: Add dummy storage
        try map.put(
            try allocator.dupe(u8, "0x0000000000000000000000000000000000000000000000000000000000000001"),
            try allocator.dupe(u8, "0x0000000000000000000000000000000000000000000000000000000000000010")
        );
        
        return std.json.Value{ .object = map };
    }

    fn getLogs(self: *EvmSession, allocator: std.mem.Allocator) !std.json.Value {
        // Implementation depends on your EVM design
        // This would extract logs generated during execution
        _ = self; // unused
        
        var logs = std.ArrayList(std.json.Value).init(allocator);
        defer logs.deinit();
        
        // Placeholder: Return empty logs
        return std.json.Value{ .array = logs };
    }
};

// Session manager to keep track of all active EVM sessions
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
var allocator: std.mem.Allocator = undefined;
var sessions: std.AutoHashMap(u32, EvmSession) = undefined;
var next_session_id: u32 = 1;
var initialized = false;

// Initialize the session manager
fn initSessionManager() !void {
    if (initialized) return;
    
    allocator = gpa.allocator();
    sessions = std.AutoHashMap(u32, EvmSession).init(allocator);
    initialized = true;
}

// Create a new EVM session
export fn createSession() u32 {
    if (!initialized) {
        initSessionManager() catch |err| {
            std.debug.print("Failed to initialize session manager: {}\n", .{err});
            return 0;
        };
    }
    
    const session_id = next_session_id;
    next_session_id += 1;
    
    var session = EvmSession.init(allocator, session_id) catch |err| {
        std.debug.print("Failed to create session: {}\n", .{err});
        return 0;
    };
    
    sessions.put(session_id, session) catch |err| {
        std.debug.print("Failed to store session: {}\n", .{err});
        session.deinit();
        return 0;
    };
    
    return session_id;
}

// Close an EVM session and free its resources
export fn closeSession(session_id: u32) bool {
    if (!initialized) return false;
    
    if (sessions.get(session_id)) |*session| {
        session.deinit();
        _ = sessions.remove(session_id);
        return true;
    }
    
    return false;
}

// Load bytecode for a specific session
export fn loadBytecodeForSession(session_id: u32, bytecode_hex_ptr: [*]const u8, bytecode_hex_len: usize) bool {
    if (!initialized) return false;
    
    const bytecode_hex = bytecode_hex_ptr[0..bytecode_hex_len];
    
    if (sessions.getPtr(session_id)) |session| {
        session.loadBytecode(bytecode_hex) catch {
            return false;
        };
        return true;
    }
    
    return false;
}

// Reset a specific session
export fn resetSession(session_id: u32) bool {
    if (!initialized) return false;
    
    if (sessions.getPtr(session_id)) |session| {
        session.reset() catch {
            return false;
        };
        return true;
    }
    
    return false;
}

// Step execution for a specific session
export fn stepSession(session_id: u32) bool {
    if (!initialized) return false;
    
    if (sessions.getPtr(session_id)) |session| {
        return session.step() catch {
            return false;
        };
    }
    
    return false;
}

// Toggle run/pause for a specific session
export fn toggleRunPauseSession(session_id: u32) bool {
    if (!initialized) return false;
    
    if (sessions.getPtr(session_id)) |session| {
        return session.toggleRunPause() catch {
            return false;
        };
    }
    
    return false;
}

// Get state for a specific session
export fn getSessionState(session_id: u32, state_ptr: [*]u8, state_len: *usize) void {
    if (!initialized) {
        state_len.* = 0;
        return;
    }
    
    if (sessions.getPtr(session_id)) |session| {
        var state = session.getState(allocator) catch {
            state_len.* = 0;
            return;
        };
        defer allocator.free(state);
        
        if (state.len <= state_len.*) {
            @memcpy(state_ptr[0..state.len], state);
            state_len.* = state.len;
        } else {
            state_len.* = 0;
        }
    } else {
        state_len.* = 0;
    }
}

// Cleanup all sessions and resources
export fn deinitSessionManager() void {
    if (!initialized) return;
    
    var it = sessions.iterator();
    while (it.next()) |entry| {
        entry.value_ptr.deinit();
    }
    sessions.deinit();
    
    var leaks = gpa.deinit();
    if (leaks) {
        std.debug.print("Memory leaks detected during session manager shutdown\n", .{});
    }
    
    initialized = false;
}
```

### 2. Enhanced Rust FFI Interface

```rust
// app/src-tauri/src/lib.rs

extern "C" {
    // Zig session management functions
    fn createSession() -> u32;
    fn closeSession(session_id: u32) -> bool;
    fn loadBytecodeForSession(session_id: u32, bytecode_hex: *const u8, bytecode_hex_len: usize) -> bool;
    fn resetSession(session_id: u32) -> bool;
    fn stepSession(session_id: u32) -> bool;
    fn toggleRunPauseSession(session_id: u32) -> bool;
    fn getSessionState(session_id: u32, state: *mut u8, state_len: *mut usize);
    fn deinitSessionManager();
}

use std::sync::Mutex;
use once_cell::sync::Lazy;

// Track the active session in Rust
static ACTIVE_SESSION: Lazy<Mutex<u32>> = Lazy::new(|| {
    // Create a session on first access
    let session_id = unsafe { createSession() };
    Mutex::new(session_id)
});

#[tauri::command]
fn create_session() -> u32 {
    unsafe { 
        let session_id = createSession();
        
        // Update active session
        if session_id != 0 {
            let mut active = ACTIVE_SESSION.lock().unwrap();
            *active = session_id;
        }
        
        session_id
    }
}

#[tauri::command]
fn close_session(session_id: u32) -> bool {
    unsafe { 
        let result = closeSession(session_id);
        
        // If we closed the active session, create a new one
        if result {
            let mut active = ACTIVE_SESSION.lock().unwrap();
            if *active == session_id {
                *active = createSession();
            }
        }
        
        result
    }
}

#[tauri::command]
fn load_bytecode(bytecode_hex: String) -> bool {
    let session_id = *ACTIVE_SESSION.lock().unwrap();
    
    unsafe {
        loadBytecodeForSession(session_id, bytecode_hex.as_ptr(), bytecode_hex.len())
    }
}

#[tauri::command]
fn reset_evm() -> bool {
    let session_id = *ACTIVE_SESSION.lock().unwrap();
    
    unsafe {
        resetSession(session_id)
    }
}

#[tauri::command]
fn step_evm() -> bool {
    let session_id = *ACTIVE_SESSION.lock().unwrap();
    
    unsafe {
        stepSession(session_id)
    }
}

#[tauri::command]
fn toggle_run_pause() -> bool {
    let session_id = *ACTIVE_SESSION.lock().unwrap();
    
    unsafe {
        toggleRunPauseSession(session_id)
    }
}

#[tauri::command]
fn get_evm_state() -> serde_json::Value {
    let session_id = *ACTIVE_SESSION.lock().unwrap();
    let mut buffer = vec![0u8; 8192]; // Larger buffer to handle complex state
    let mut buffer_len = buffer.len();

    unsafe {
        getSessionState(session_id, buffer.as_mut_ptr(), &mut buffer_len as *mut usize);
    }

    if buffer_len == 0 {
        return serde_json::json!({});
    }

    match std::str::from_utf8(&buffer[0..buffer_len]) {
        Ok(json_str) => serde_json::from_str(json_str).unwrap_or_else(|_| serde_json::json!({})),
        Err(_) => serde_json::json!({}),
    }
}

// Also provide a way to work with a specific session directly
#[tauri::command]
fn set_active_session(session_id: u32) -> bool {
    let mut active = ACTIVE_SESSION.lock().unwrap();
    *active = session_id;
    true
}

// Clean up on application exit
struct SessionManager;

impl Drop for SessionManager {
    fn drop(&mut self) {
        unsafe { deinitSessionManager() }
    }
}

static SESSION_MANAGER: Lazy<SessionManager> = Lazy::new(|| {
    SessionManager {}
});

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Ensure session manager is initialized
    let _ = &*SESSION_MANAGER;
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_session,
            close_session,
            load_bytecode,
            reset_evm,
            step_evm,
            toggle_run_pause,
            get_evm_state,
            set_active_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. Frontend Enhancements

The frontend can now be enhanced to handle multiple EVM sessions:

```typescript
// app/src/components/evm-debugger/utils.ts

import { invoke } from "@tauri-apps/api/core";
import { EvmState } from "./types";

// Create a new EVM session
export async function createSession(): Promise<number> {
  try {
    return await invoke<number>("create_session");
  } catch (err) {
    throw new Error(`Failed to create session: ${err}`);
  }
}

// Close an EVM session
export async function closeSession(sessionId: number): Promise<boolean> {
  try {
    return await invoke<boolean>("close_session", { sessionId });
  } catch (err) {
    throw new Error(`Failed to close session: ${err}`);
  }
}

// Set the active session
export async function setActiveSession(sessionId: number): Promise<boolean> {
  try {
    return await invoke<boolean>("set_active_session", { sessionId });
  } catch (err) {
    throw new Error(`Failed to set active session: ${err}`);
  }
}

// Load bytecode for the active session
export async function loadBytecode(bytecodeHex: string): Promise<boolean> {
  try {
    return await invoke<boolean>("load_bytecode", { bytecodeHex });
  } catch (err) {
    throw new Error(`Failed to load bytecode: ${err}`);
  }
}

// Reset the active session
export async function resetEvm(): Promise<boolean> {
  try {
    return await invoke<boolean>("reset_evm");
  } catch (err) {
    throw new Error(`Failed to reset EVM: ${err}`);
  }
}

// Step execution for the active session
export async function stepEvm(): Promise<boolean> {
  try {
    return await invoke<boolean>("step_evm");
  } catch (err) {
    throw new Error(`Failed to step: ${err}`);
  }
}

// Toggle running/paused state for the active session
export async function toggleRunPause(): Promise<boolean> {
  try {
    return await invoke<boolean>("toggle_run_pause");
  } catch (err) {
    throw new Error(`Failed to toggle run/pause: ${err}`);
  }
}

// Get state for the active session
export async function getEvmState(): Promise<EvmState> {
  try {
    return await invoke<EvmState>("get_evm_state");
  } catch (err) {
    throw new Error(`Failed to get state: ${err}`);
  }
}

// Enhance the main component to support multiple sessions

// app/src/components/evm-debugger/EvmDebugger.tsx

import { createSignal, onMount } from "solid-js";
import { createSession, closeSession, setActiveSession } from "./utils";

// ... other imports ...

const EvmDebugger = () => {
  // ... existing state ...
  
  // Add session management
  const [sessionId, setSessionId] = createSignal<number>(0);
  const [sessions, setSessions] = createSignal<number[]>([]);
  
  onMount(async () => {
    // Create initial session on mount
    const initialSession = await createSession();
    setSessionId(initialSession);
    setSessions([initialSession]);
    
    // ... other mount logic ...
  });
  
  const handleCreateSession = async () => {
    const newSession = await createSession();
    setSessions([...sessions(), newSession]);
    setSessionId(newSession);
    await setActiveSession(newSession);
    
    // Reset the state for the new session
    setState({
      pc: 0,
      opcode: "-",
      gasLeft: 0,
      depth: 0,
      stack: [],
      memory: "0x",
      storage: {},
      logs: [],
      returnData: "0x",
    });
  };
  
  const handleSwitchSession = async (id: number) => {
    await setActiveSession(id);
    setSessionId(id);
    
    // Refresh state for the switched session
    try {
      const freshState = await getEvmState();
      setState(freshState);
    } catch (err) {
      setError(`Failed to get state: ${err}`);
    }
  };
  
  const handleCloseSession = async (id: number) => {
    if (sessions().length <= 1) {
      setError("Cannot close the last session");
      return;
    }
    
    await closeSession(id);
    
    // Remove from sessions list
    const updatedSessions = sessions().filter(s => s !== id);
    setSessions(updatedSessions);
    
    // If we closed the active session, switch to another one
    if (sessionId() === id) {
      await handleSwitchSession(updatedSessions[0]);
    }
  };
  
  // ... rest of component ...
  
  return (
    <div>
      {/* Add session management UI */}
      <div class="session-controls mb-4 flex gap-2">
        <button 
          onClick={handleCreateSession}
          class="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
        >
          New Session
        </button>
        
        <div class="flex gap-1">
          {sessions().map(id => (
            <div class={`session-tab px-3 py-1 border rounded-md text-sm flex items-center gap-1 ${id === sessionId() ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'}`}>
              <button 
                onClick={() => handleSwitchSession(id)}
                class="text-blue-800"
              >
                Session {id}
              </button>
              {sessions().length > 1 && (
                <button 
                  onClick={() => handleCloseSession(id)}
                  class="text-red-500 ml-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Existing debugger UI */}
      {/* ... */}
    </div>
  );
};

export default EvmDebugger;
```

## Benefits of the Session-Based Approach

1. **Multiple Independent Instances**
   - The application can run multiple EVM instances simultaneously
   - Each instance has its own independent state and execution context
   - Users can test multiple contract states or versions side-by-side

2. **Improved Testability**
   - No global state means unit tests can create isolated instances
   - Different test scenarios won't interfere with each other
   - Tests can be run in parallel

3. **Better Resource Management**
   - Each session explicitly manages its own resources
   - Resources are tied to the session lifecycle
   - More predictable cleanup and fewer memory leaks

4. **Enhanced Flexibility**
   - Sessions can have different configurations (chain rules, states, etc.)
   - Future enhancements can add more per-session configuration
   - Can support comparing execution across different EVM configurations

5. **Cleaner Architecture**
   - Separation of concerns between session management and EVM logic
   - Explicit dependencies rather than implicit global state
   - More maintainable and easier to reason about

## Implementation Plan

1. **Phase 1: Core Session Management**
   - Implement the `EvmSession` structure
   - Create the session manager with create/close functionality
   - Add proper resource management

2. **Phase 2: Session-Based EVM Operations**
   - Implement bytecode loading for specific sessions
   - Add execution functionality tied to session IDs
   - Implement state retrieval for sessions

3. **Phase 3: Rust Interface**
   - Update Rust FFI to work with session-based approach
   - Add session tracking on the Rust side
   - Implement active session concept for backward compatibility

4. **Phase 4: Frontend Enhancements**
   - Add session management UI
   - Implement switching between sessions
   - Support running multiple EVMs in parallel

## Future Enhancements

1. **Session Persistence**
   - Save and load sessions to/from disk
   - Share sessions between users or instances

2. **Session Comparison**
   - Compare execution states between different sessions
   - Highlight differences in storage, memory, etc.

3. **Collaborative Debugging**
   - Share sessions with other users
   - Collaborate on debugging in real-time

4. **Session Templates**
   - Create predefined session configurations
   - Share templates for common testing scenarios

## Conclusion

The session-based approach provides a more robust, flexible, and maintainable architecture for integrating the Zig EVM with the Rust Tauri application. By explicitly managing resources per session and avoiding global state, we enable multiple independent EVM instances, better testing, and a more scalable architecture for future enhancements.