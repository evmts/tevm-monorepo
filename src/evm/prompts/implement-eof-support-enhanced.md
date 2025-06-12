# Implement EOF Support

## Git Workflow Instructions

### Branch Setup
1. **Create branch**: `feat_implement_eof_support` (snake_case, no emoji)
2. **Create worktree**: `git worktree add g/feat_implement_eof_support feat_implement_eof_support`
3. **Work in isolation**: `cd g/feat_implement_eof_support`
4. **Commit message**: `✨ feat: implement EOF (EVM Object Format) support`

### Workflow Steps
1. Create and switch to the new worktree
2. Implement all changes in the isolated branch
3. Run `zig build test-all` to ensure all tests pass
4. Commit with emoji conventional commit format
5. DO NOT merge - leave ready for review

## Context

Implement EVM Object Format (EOF) support, which is a significant evolution of the EVM that introduces structured bytecode containers, static analysis capabilities, and new execution semantics. EOF includes several EIPs: EIP-3540 (container format), EIP-3670 (code validation), EIP-4200 (static relative jumps), EIP-4750 (functions), and EIP-5450 (stack validation).

## EOF Specification Overview

### Core EIPs

#### EIP-3540: EOF Container Format
- Introduces structured bytecode containers with headers
- Separates code and data sections
- Enables static analysis and validation

#### EIP-3670: EOF Code Validation
- Validates bytecode at deployment time
- Ensures no invalid opcodes or malformed instructions
- Prevents certain classes of runtime errors

#### EIP-4200: EOF Static Relative Jumps
- Introduces RJUMP and RJUMPI opcodes for static jumps
- Eliminates dynamic jump destinations
- Enables better static analysis

#### EIP-4750: EOF Functions
- Introduces CALLF and RETF opcodes for function calls
- Enables stack-isolated function execution
- Provides better code organization

#### EIP-5450: EOF Stack Validation
- Validates stack effects at deployment time
- Ensures stack underflow/overflow cannot occur
- Enables optimization opportunities

### EOF Container Format
```zig
pub const EOF_MAGIC = [2]u8{ 0xEF, 0x00 };
pub const EOF_VERSION = 1;

pub const EOFContainer = struct {
    version: u8,
    types_section: ?[]TypeInfo,
    code_sections: [][]const u8,
    data_section: ?[]const u8,
    
    pub const TypeInfo = struct {
        inputs: u8,     // Stack inputs required
        outputs: u8,    // Stack outputs produced
        max_stack: u16, // Maximum stack height
    };
    
    pub fn parse(bytecode: []const u8) !EOFContainer {
        if (bytecode.len < 4) return error.InvalidEOFContainer;
        
        // Check magic and version
        if (!std.mem.eql(u8, bytecode[0..2], &EOF_MAGIC)) {
            return error.InvalidEOFMagic;
        }
        
        const version = bytecode[2];
        if (version != EOF_VERSION) {
            return error.UnsupportedEOFVersion;
        }
        
        // Parse container sections
        return parse_sections(bytecode[3..]);
    }
    
    fn parse_sections(data: []const u8) !EOFContainer {
        var offset: usize = 0;
        var types_section: ?[]TypeInfo = null;
        var code_sections = std.ArrayList([]const u8).init(allocator);
        var data_section: ?[]const u8 = null;
        
        while (offset < data.len) {
            if (data.len < offset + 3) break;
            
            const section_kind = data[offset];
            const section_size = std.mem.readIntBig(u16, data[offset + 1..offset + 3]);
            offset += 3;
            
            if (data.len < offset + section_size) return error.InvalidSectionSize;
            
            switch (section_kind) {
                0x01 => { // Type section
                    types_section = try parse_type_section(data[offset..offset + section_size]);
                },
                0x02 => { // Code section
                    try code_sections.append(data[offset..offset + section_size]);
                },
                0x03 => { // Data section
                    data_section = data[offset..offset + section_size];
                },
                0x00 => break, // Terminator
                else => return error.UnknownSectionKind,
            }
            
            offset += section_size;
        }
        
        return EOFContainer{
            .version = EOF_VERSION,
            .types_section = types_section,
            .code_sections = code_sections.toOwnedSlice(),
            .data_section = data_section,
        };
    }
};
```

## Implementation Requirements

### Core Functionality
1. **Container Parsing**: Parse and validate EOF containers
2. **Code Validation**: Validate bytecode at deployment time
3. **Static Analysis**: Analyze stack effects and jump targets
4. **New Opcodes**: Implement RJUMP, RJUMPI, CALLF, RETF
5. **Function Execution**: Handle function calls and returns
6. **Stack Validation**: Ensure stack consistency

### EOF Execution Context
```zig
pub const EOFExecutionFrame = struct {
    container: *const EOFContainer,
    code_section: u8,           // Current code section index
    pc: u32,                    // Program counter within section
    return_stack: ReturnStack,  // Function return addresses
    
    pub const ReturnStack = struct {
        frames: [1024]ReturnFrame, // Maximum call depth
        depth: u16,
        
        pub const ReturnFrame = struct {
            code_section: u8,
            return_pc: u32,
        };
        
        pub fn push(self: *ReturnStack, code_section: u8, return_pc: u32) !void {
            if (self.depth >= self.frames.len) {
                return error.CallStackOverflow;
            }
            
            self.frames[self.depth] = ReturnFrame{
                .code_section = code_section,
                .return_pc = return_pc,
            };
            self.depth += 1;
        }
        
        pub fn pop(self: *ReturnStack) !ReturnFrame {
            if (self.depth == 0) {
                return error.CallStackUnderflow;
            }
            
            self.depth -= 1;
            return self.frames[self.depth];
        }
    };
};
```

## Implementation Tasks

### Task 1: Implement EOF Container Parsing
File: `/src/evm/eof/container.zig`
```zig
const std = @import("std");

pub const EOF_MAGIC = [2]u8{ 0xEF, 0x00 };
pub const EOF_VERSION = 1;

// Section type identifiers
pub const TYPE_SECTION = 0x01;
pub const CODE_SECTION = 0x02;
pub const DATA_SECTION = 0x03;
pub const TERMINATOR = 0x00;

pub const EOFError = error{
    InvalidEOFMagic,
    UnsupportedEOFVersion,
    InvalidSectionSize,
    UnknownSectionKind,
    MissingTypeSection,
    MissingCodeSection,
    InvalidTypeInfo,
    DuplicateSection,
    InvalidTerminator,
};

pub const TypeInfo = struct {
    inputs: u8,     // Number of stack inputs
    outputs: u8,    // Number of stack outputs  
    max_stack: u16, // Maximum stack height during execution
    
    pub fn init(inputs: u8, outputs: u8, max_stack: u16) TypeInfo {
        return TypeInfo{
            .inputs = inputs,
            .outputs = outputs,
            .max_stack = max_stack,
        };
    }
};

pub const EOFContainer = struct {
    version: u8,
    types: []const TypeInfo,
    code_sections: []const []const u8,
    data_section: ?[]const u8,
    allocator: std.mem.Allocator,
    
    pub fn parse(bytecode: []const u8, allocator: std.mem.Allocator) !EOFContainer {
        if (bytecode.len < 4) {
            return EOFError.InvalidEOFMagic;
        }
        
        // Validate magic bytes
        if (!std.mem.eql(u8, bytecode[0..2], &EOF_MAGIC)) {
            return EOFError.InvalidEOFMagic;
        }
        
        // Validate version
        const version = bytecode[2];
        if (version != EOF_VERSION) {
            return EOFError.UnsupportedEOFVersion;
        }
        
        // Parse header and sections
        return parse_container(bytecode[3..], allocator);
    }
    
    pub fn deinit(self: *EOFContainer) void {
        self.allocator.free(self.types);
        self.allocator.free(self.code_sections);
        // Note: data_section points into original bytecode, no need to free
    }
    
    pub fn get_code_section(self: *const EOFContainer, index: u8) ?[]const u8 {
        if (index < self.code_sections.len) {
            return self.code_sections[index];
        }
        return null;
    }
    
    pub fn get_type_info(self: *const EOFContainer, index: u8) ?TypeInfo {
        if (index < self.types.len) {
            return self.types[index];
        }
        return null;
    }
    
    pub fn validate(self: *const EOFContainer) !void {
        // Validate container structure
        if (self.code_sections.len == 0) {
            return EOFError.MissingCodeSection;
        }
        
        if (self.types.len != self.code_sections.len) {
            return EOFError.InvalidTypeInfo;
        }
        
        // Validate each code section
        for (self.code_sections, 0..) |code, i| {
            try validate_code_section(code, self.types[i]);
        }
    }
    
    fn parse_container(data: []const u8, allocator: std.mem.Allocator) !EOFContainer {
        var offset: usize = 0;
        var types: ?[]TypeInfo = null;
        var code_sections = std.ArrayList([]const u8).init(allocator);
        defer code_sections.deinit();
        var data_section: ?[]const u8 = null;
        
        var has_type_section = false;
        var has_terminator = false;
        
        // Parse header
        while (offset < data.len and !has_terminator) {
            if (data.len < offset + 3) {
                return EOFError.InvalidSectionSize;
            }
            
            const section_kind = data[offset];
            const section_size = std.mem.readIntBig(u16, data[offset + 1..offset + 3]);
            offset += 3;
            
            switch (section_kind) {
                TYPE_SECTION => {
                    if (has_type_section) return EOFError.DuplicateSection;
                    has_type_section = true;
                    
                    if (data.len < offset + section_size) {
                        return EOFError.InvalidSectionSize;
                    }
                    
                    types = try parse_type_section(data[offset..offset + section_size], allocator);
                    offset += section_size;
                },
                CODE_SECTION => {
                    if (data.len < offset + section_size) {
                        return EOFError.InvalidSectionSize;
                    }
                    
                    try code_sections.append(data[offset..offset + section_size]);
                    offset += section_size;
                },
                DATA_SECTION => {
                    if (data_section != null) return EOFError.DuplicateSection;
                    
                    if (data.len < offset + section_size) {
                        return EOFError.InvalidSectionSize;
                    }
                    
                    data_section = data[offset..offset + section_size];
                    offset += section_size;
                },
                TERMINATOR => {
                    has_terminator = true;
                },
                else => return EOFError.UnknownSectionKind,
            }
        }
        
        if (!has_terminator) {
            return EOFError.InvalidTerminator;
        }
        
        if (types == null) {
            return EOFError.MissingTypeSection;
        }
        
        if (code_sections.items.len == 0) {
            return EOFError.MissingCodeSection;
        }
        
        return EOFContainer{
            .version = EOF_VERSION,
            .types = types.?,
            .code_sections = try code_sections.toOwnedSlice(),
            .data_section = data_section,
            .allocator = allocator,
        };
    }
    
    fn parse_type_section(data: []const u8, allocator: std.mem.Allocator) ![]TypeInfo {
        if (data.len % 4 != 0) {
            return EOFError.InvalidTypeInfo;
        }
        
        const type_count = data.len / 4;
        var types = try allocator.alloc(TypeInfo, type_count);
        
        for (0..type_count) |i| {
            const offset = i * 4;
            types[i] = TypeInfo{
                .inputs = data[offset],
                .outputs = data[offset + 1],
                .max_stack = std.mem.readIntBig(u16, data[offset + 2..offset + 4]),
            };
        }
        
        return types;
    }
    
    fn validate_code_section(code: []const u8, type_info: TypeInfo) !void {
        // Validate that code section matches type info
        // This includes stack validation and instruction validation
        var validator = CodeValidator.init(type_info);
        try validator.validate(code);
    }
};

const CodeValidator = struct {
    type_info: TypeInfo,
    stack_height: i32,
    max_stack_seen: u16,
    
    fn init(type_info: TypeInfo) CodeValidator {
        return CodeValidator{
            .type_info = type_info,
            .stack_height = @as(i32, @intCast(type_info.inputs)),
            .max_stack_seen = type_info.inputs,
        };
    }
    
    fn validate(self: *CodeValidator, code: []const u8) !void {
        var pc: usize = 0;
        
        while (pc < code.len) {
            const opcode = code[pc];
            
            // Validate instruction
            try self.validate_instruction(opcode, code, &pc);
            
            // Check stack bounds
            if (self.stack_height < 0) {
                return error.StackUnderflow;
            }
            
            if (self.stack_height > self.type_info.max_stack) {
                return error.StackOverflow;
            }
            
            self.max_stack_seen = @max(self.max_stack_seen, @as(u16, @intCast(self.stack_height)));
            pc += 1;
        }
        
        // Validate final stack state
        if (self.stack_height != self.type_info.outputs) {
            return error.InvalidFinalStackHeight;
        }
    }
    
    fn validate_instruction(self: *CodeValidator, opcode: u8, code: []const u8, pc: *usize) !void {
        // Get instruction stack effects
        const stack_effects = get_instruction_stack_effects(opcode);
        
        // Update stack height
        self.stack_height -= @as(i32, @intCast(stack_effects.inputs));
        self.stack_height += @as(i32, @intCast(stack_effects.outputs));
        
        // Handle immediate data (e.g., PUSH instructions)
        switch (opcode) {
            0x60...0x7F => { // PUSH1-PUSH32
                const push_size = opcode - 0x5F;
                if (pc.* + push_size >= code.len) {
                    return error.IncompletePushData;
                }
                pc.* += push_size;
            },
            0xE0 => { // RJUMP
                if (pc.* + 2 >= code.len) {
                    return error.IncompleteRJump;
                }
                pc.* += 2;
            },
            0xE1 => { // RJUMPI
                if (pc.* + 2 >= code.len) {
                    return error.IncompleteRJumpI;
                }
                pc.* += 2;
            },
            0xE3 => { // CALLF
                if (pc.* + 2 >= code.len) {
                    return error.IncompleteCallF;
                }
                pc.* += 2;
            },
            else => {},
        }
    }
};

const StackEffects = struct {
    inputs: u8,
    outputs: u8,
};

fn get_instruction_stack_effects(opcode: u8) StackEffects {
    return switch (opcode) {
        // Arithmetic operations
        0x01...0x0B => StackEffects{ .inputs = 2, .outputs = 1 }, // ADD, MUL, SUB, etc.
        0x10...0x1A => StackEffects{ .inputs = 2, .outputs = 1 }, // LT, GT, EQ, etc.
        
        // Stack operations
        0x50 => StackEffects{ .inputs = 1, .outputs = 0 }, // POP
        0x5F => StackEffects{ .inputs = 0, .outputs = 1 }, // PUSH0
        0x60...0x7F => StackEffects{ .inputs = 0, .outputs = 1 }, // PUSH1-PUSH32
        0x80...0x8F => StackEffects{ .inputs = opcode - 0x7F, .outputs = opcode - 0x7E }, // DUP1-DUP16
        0x90...0x9F => StackEffects{ .inputs = opcode - 0x8D, .outputs = opcode - 0x8D }, // SWAP1-SWAP16
        
        // EOF-specific opcodes
        0xE0 => StackEffects{ .inputs = 0, .outputs = 0 }, // RJUMP
        0xE1 => StackEffects{ .inputs = 1, .outputs = 0 }, // RJUMPI
        0xE3 => StackEffects{ .inputs = 0, .outputs = 0 }, // CALLF (varies by function)
        0xE4 => StackEffects{ .inputs = 0, .outputs = 0 }, // RETF (varies by function)
        
        else => StackEffects{ .inputs = 0, .outputs = 0 }, // Default/unknown
    };
}
```

### Task 2: Implement EOF Opcodes
File: `/src/evm/eof/opcodes.zig`
```zig
const std = @import("std");
const Vm = @import("../vm.zig").Vm;
const Frame = @import("../frame.zig").Frame;
const ExecutionResult = @import("../execution/execution_result.zig").ExecutionResult;
const ExecutionError = @import("../execution/execution_error.zig").ExecutionError;

// EOF-specific opcodes
pub const RJUMP = 0xE0;   // Relative jump
pub const RJUMPI = 0xE1;  // Conditional relative jump
pub const RJUMPV = 0xE2;  // Relative jump via jump table
pub const CALLF = 0xE3;   // Call function
pub const RETF = 0xE4;    // Return from function
pub const JUMPF = 0xE5;   // Jump to function (tail call)
pub const DUPN = 0xE6;    // Duplicate nth stack item
pub const SWAPN = 0xE7;   // Swap with nth stack item
pub const EXCHANGE = 0xE8; // Exchange stack items

// RJUMP implementation
pub fn execute_rjump(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Read 16-bit signed offset
    const current_pc = frame.pc;
    if (current_pc + 2 >= frame.code.len) {
        return ExecutionError.InvalidJump;
    }
    
    const offset_bytes = frame.code[current_pc + 1..current_pc + 3];
    const offset = @as(i16, @bitCast(std.mem.readIntBig(u16, offset_bytes)));
    
    // Calculate target PC (relative to instruction after RJUMP)
    const new_pc = @as(i32, @intCast(current_pc + 3)) + offset;
    
    if (new_pc < 0 or new_pc >= frame.code.len) {
        return ExecutionError.InvalidJump;
    }
    
    frame.pc = @as(u32, @intCast(new_pc));
    return ExecutionResult.continue_execution;
}

// RJUMPI implementation
pub fn execute_rjumpi(vm: *Vm, frame: *Frame) !ExecutionResult {
    const condition = frame.stack.pop_unsafe();
    
    if (condition != 0) {
        // Take the jump
        return execute_rjump(vm, frame);
    } else {
        // Skip the jump, advance PC past the offset
        frame.pc += 3;
        return ExecutionResult.continue_execution;
    }
}

// CALLF implementation
pub fn execute_callf(vm: *Vm, frame: *Frame) !ExecutionResult {
    // Read function index
    const current_pc = frame.pc;
    if (current_pc + 2 >= frame.code.len) {
        return ExecutionError.InvalidCall;
    }
    
    const function_index = std.mem.readIntBig(u16, frame.code[current_pc + 1..current_pc + 3]);
    
    // Get function type info
    const eof_frame = frame.eof_frame orelse return ExecutionError.NotEOFContext;
    const type_info = eof_frame.container.get_type_info(@as(u8, @intCast(function_index))) orelse {
        return ExecutionError.InvalidFunctionIndex;
    };
    
    // Validate stack has enough inputs
    if (frame.stack.size() < type_info.inputs) {
        return ExecutionError.StackUnderflow;
    }
    
    // Push return address to return stack
    try eof_frame.return_stack.push(eof_frame.code_section, current_pc + 3);
    
    // Switch to target function
    eof_frame.code_section = @as(u8, @intCast(function_index));
    eof_frame.pc = 0;
    
    // Update frame code pointer
    frame.code = eof_frame.container.get_code_section(eof_frame.code_section) orelse {
        return ExecutionError.InvalidFunctionIndex;
    };
    frame.pc = 0;
    
    return ExecutionResult.continue_execution;
}

// RETF implementation
pub fn execute_retf(vm: *Vm, frame: *Frame) !ExecutionResult {
    const eof_frame = frame.eof_frame orelse return ExecutionError.NotEOFContext;
    
    // Pop return address from return stack
    const return_frame = eof_frame.return_stack.pop() catch {
        // Main function return - halt execution
        return ExecutionResult.halt;
    };
    
    // Restore previous function context
    eof_frame.code_section = return_frame.code_section;
    eof_frame.pc = return_frame.return_pc;
    
    // Update frame code pointer
    frame.code = eof_frame.container.get_code_section(eof_frame.code_section) orelse {
        return ExecutionError.InvalidFunctionIndex;
    };
    frame.pc = eof_frame.pc;
    
    return ExecutionResult.continue_execution;
}

// DUPN implementation
pub fn execute_dupn(vm: *Vm, frame: *Frame) !ExecutionResult {
    const current_pc = frame.pc;
    if (current_pc + 1 >= frame.code.len) {
        return ExecutionError.InvalidInstruction;
    }
    
    const n = frame.code[current_pc + 1];
    
    // Validate stack depth
    if (frame.stack.size() <= n) {
        return ExecutionError.StackUnderflow;
    }
    
    // Duplicate nth stack item (0-indexed from top)
    const value = frame.stack.peek_unsafe(n);
    frame.stack.push_unsafe(value);
    
    frame.pc += 2; // Advance past immediate
    return ExecutionResult.continue_execution;
}

// SWAPN implementation
pub fn execute_swapn(vm: *Vm, frame: *Frame) !ExecutionResult {
    const current_pc = frame.pc;
    if (current_pc + 1 >= frame.code.len) {
        return ExecutionError.InvalidInstruction;
    }
    
    const n = frame.code[current_pc + 1];
    
    // Validate stack depth
    if (frame.stack.size() <= n) {
        return ExecutionError.StackUnderflow;
    }
    
    // Swap top with nth stack item
    frame.stack.swap_unsafe(0, n);
    
    frame.pc += 2; // Advance past immediate
    return ExecutionResult.continue_execution;
}

// EXCHANGE implementation
pub fn execute_exchange(vm: *Vm, frame: *Frame) !ExecutionResult {
    const current_pc = frame.pc;
    if (current_pc + 1 >= frame.code.len) {
        return ExecutionError.InvalidInstruction;
    }
    
    const operand = frame.code[current_pc + 1];
    const n = (operand >> 4) + 1;  // High nibble + 1
    const m = (operand & 0x0F) + 1; // Low nibble + 1
    
    // Validate stack depth
    if (frame.stack.size() < @max(n, m)) {
        return ExecutionError.StackUnderflow;
    }
    
    // Exchange stack items at positions n and m
    frame.stack.swap_unsafe(n - 1, m - 1);
    
    frame.pc += 2; // Advance past immediate
    return ExecutionResult.continue_execution;
}
```

### Task 3: Implement EOF Execution Context
File: `/src/evm/eof/execution.zig`
```zig
const std = @import("std");
const EOFContainer = @import("container.zig").EOFContainer;

pub const EOFExecutionFrame = struct {
    container: *const EOFContainer,
    code_section: u8,
    pc: u32,
    return_stack: ReturnStack,
    
    pub fn init(container: *const EOFContainer) EOFExecutionFrame {
        return EOFExecutionFrame{
            .container = container,
            .code_section = 0, // Start with main function
            .pc = 0,
            .return_stack = ReturnStack.init(),
        };
    }
    
    pub fn get_current_code(self: *const EOFExecutionFrame) ?[]const u8 {
        return self.container.get_code_section(self.code_section);
    }
    
    pub fn get_current_type_info(self: *const EOFExecutionFrame) ?TypeInfo {
        return self.container.get_type_info(self.code_section);
    }
};

pub const ReturnStack = struct {
    frames: [1024]ReturnFrame,
    depth: u16,
    
    pub const ReturnFrame = struct {
        code_section: u8,
        return_pc: u32,
    };
    
    pub fn init() ReturnStack {
        return ReturnStack{
            .frames = undefined,
            .depth = 0,
        };
    }
    
    pub fn push(self: *ReturnStack, code_section: u8, return_pc: u32) !void {
        if (self.depth >= 1024) {
            return error.CallStackOverflow;
        }
        
        self.frames[self.depth] = ReturnFrame{
            .code_section = code_section,
            .return_pc = return_pc,
        };
        self.depth += 1;
    }
    
    pub fn pop(self: *ReturnStack) !ReturnFrame {
        if (self.depth == 0) {
            return error.CallStackUnderflow;
        }
        
        self.depth -= 1;
        return self.frames[self.depth];
    }
    
    pub fn is_empty(self: *const ReturnStack) bool {
        return self.depth == 0;
    }
    
    pub fn size(self: *const ReturnStack) u16 {
        return self.depth;
    }
};

pub const EOFValidator = struct {
    pub fn validate_container(container: *const EOFContainer) !void {
        // Validate container structure
        try container.validate();
        
        // Validate each code section
        for (container.code_sections, 0..) |code, i| {
            const type_info = container.types[i];
            try validate_code_section(code, type_info, container);
        }
    }
    
    fn validate_code_section(
        code: []const u8,
        type_info: TypeInfo,
        container: *const EOFContainer
    ) !void {
        var validator = SectionValidator.init(type_info, container);
        try validator.validate(code);
    }
};

const SectionValidator = struct {
    type_info: TypeInfo,
    container: *const EOFContainer,
    stack_height: i32,
    max_stack_seen: u16,
    
    fn init(type_info: TypeInfo, container: *const EOFContainer) SectionValidator {
        return SectionValidator{
            .type_info = type_info,
            .container = container,
            .stack_height = @as(i32, @intCast(type_info.inputs)),
            .max_stack_seen = type_info.inputs,
        };
    }
    
    fn validate(self: *SectionValidator, code: []const u8) !void {
        var pc: usize = 0;
        
        while (pc < code.len) {
            try self.validate_instruction(code, &pc);
        }
        
        // Check final stack state
        if (self.stack_height != self.type_info.outputs) {
            return error.InvalidFinalStackHeight;
        }
        
        if (self.max_stack_seen > self.type_info.max_stack) {
            return error.MaxStackExceeded;
        }
    }
    
    fn validate_instruction(self: *SectionValidator, code: []const u8, pc: *usize) !void {
        const opcode = code[pc.*];
        
        // Update stack height based on instruction
        try self.update_stack_for_instruction(opcode, code, pc);
        
        // Validate stack bounds
        if (self.stack_height < 0) {
            return error.StackUnderflow;
        }
        
        if (self.stack_height > self.type_info.max_stack) {
            return error.StackOverflow;
        }
        
        self.max_stack_seen = @max(self.max_stack_seen, @as(u16, @intCast(self.stack_height)));
        
        // Validate instruction-specific constraints
        try self.validate_instruction_constraints(opcode, code, pc);
    }
    
    fn update_stack_for_instruction(self: *SectionValidator, opcode: u8, code: []const u8, pc: *usize) !void {
        switch (opcode) {
            // EOF-specific opcodes
            0xE3 => { // CALLF
                if (pc.* + 2 >= code.len) return error.IncompleteCallF;
                
                const function_index = std.mem.readIntBig(u16, code[pc.* + 1..pc.* + 3]);
                if (function_index >= self.container.types.len) {
                    return error.InvalidFunctionIndex;
                }
                
                const target_type = self.container.types[function_index];
                
                // Check stack inputs/outputs
                if (self.stack_height < target_type.inputs) {
                    return error.InsufficientStackForCall;
                }
                
                self.stack_height -= @as(i32, @intCast(target_type.inputs));
                self.stack_height += @as(i32, @intCast(target_type.outputs));
                
                pc.* += 2; // Skip immediate
            },
            else => {
                // Handle standard opcodes
                const effects = get_instruction_stack_effects(opcode);
                self.stack_height -= @as(i32, @intCast(effects.inputs));
                self.stack_height += @as(i32, @intCast(effects.outputs));
                
                // Handle immediate data
                try self.handle_instruction_immediates(opcode, code, pc);
            },
        }
    }
    
    fn validate_instruction_constraints(self: *SectionValidator, opcode: u8, code: []const u8, pc: *usize) !void {
        switch (opcode) {
            0xE0, 0xE1 => { // RJUMP, RJUMPI
                // Validate jump target is within bounds
                const offset = @as(i16, @bitCast(std.mem.readIntBig(u16, code[pc.* + 1..pc.* + 3])));
                const target_pc = @as(i32, @intCast(pc.* + 3)) + offset;
                
                if (target_pc < 0 or target_pc >= code.len) {
                    return error.InvalidJumpTarget;
                }
                
                // Validate target is at instruction boundary
                // This would require a more sophisticated analysis
            },
            0x56, 0x57 => { // JUMP, JUMPI - forbidden in EOF
                return error.DynamicJumpForbidden;
            },
            0x5B => { // JUMPDEST - forbidden in EOF
                return error.JumpDestForbidden;
            },
            else => {},
        }
    }
    
    fn handle_instruction_immediates(self: *SectionValidator, opcode: u8, code: []const u8, pc: *usize) !void {
        switch (opcode) {
            0x60...0x7F => { // PUSH1-PUSH32
                const push_size = opcode - 0x5F;
                if (pc.* + push_size >= code.len) {
                    return error.IncompletePushData;
                }
                pc.* += push_size;
            },
            0xE0, 0xE1 => { // RJUMP, RJUMPI
                if (pc.* + 2 >= code.len) {
                    return error.IncompleteJump;
                }
                pc.* += 2;
            },
            0xE6, 0xE7 => { // DUPN, SWAPN
                if (pc.* + 1 >= code.len) {
                    return error.IncompleteStackOp;
                }
                pc.* += 1;
            },
            0xE8 => { // EXCHANGE
                if (pc.* + 1 >= code.len) {
                    return error.IncompleteExchange;
                }
                pc.* += 1;
            },
            else => {},
        }
    }
};
```

### Task 4: Update Frame with EOF Support
File: `/src/evm/frame.zig` (modify existing)
```zig
const EOFExecutionFrame = @import("eof/execution.zig").EOFExecutionFrame;

pub const Frame = struct {
    // Existing fields...
    eof_frame: ?EOFExecutionFrame,
    
    pub fn init_eof(
        allocator: std.mem.Allocator,
        context: CallContext,
        container: *const EOFContainer
    ) !Frame {
        var frame = try Frame.init(allocator, context);
        
        frame.eof_frame = EOFExecutionFrame.init(container);
        
        // Set initial code from container
        if (container.get_code_section(0)) |main_code| {
            frame.code = main_code;
        }
        
        return frame;
    }
    
    pub fn is_eof_context(self: *const Frame) bool {
        return self.eof_frame != null;
    }
    
    pub fn get_eof_type_info(self: *const Frame) ?TypeInfo {
        if (self.eof_frame) |*eof| {
            return eof.get_current_type_info();
        }
        return null;
    }
};
```

### Task 5: Update VM with EOF Support
File: `/src/evm/vm.zig` (modify existing)
```zig
const EOFContainer = @import("eof/container.zig").EOFContainer;
const EOFValidator = @import("eof/execution.zig").EOFValidator;

pub const Vm = struct {
    // Existing fields...
    
    pub fn deploy_eof_contract(
        self: *Vm,
        bytecode: []const u8,
        deployer: Address
    ) !Address {
        // Parse and validate EOF container
        const container = try EOFContainer.parse(bytecode, self.allocator);
        defer container.deinit();
        
        // Validate container
        try EOFValidator.validate_container(&container);
        
        // Calculate contract address
        const contract_address = self.calculate_create_address(deployer);
        
        // Store the original bytecode (container format)
        self.state.set_code(contract_address, bytecode);
        
        return contract_address;
    }
    
    pub fn execute_eof_contract(
        self: *Vm,
        address: Address,
        call_data: []const u8,
        gas_limit: u64
    ) !ExecutionResult {
        // Get contract code
        const bytecode = self.state.get_code(address);
        
        // Parse EOF container
        const container = try EOFContainer.parse(bytecode, self.allocator);
        defer container.deinit();
        
        // Create EOF execution frame
        const call_context = CallContext{
            .address = address,
            .caller = self.origin,
            .value = 0,
            .call_data = call_data,
            .gas_limit = gas_limit,
        };
        
        var frame = try Frame.init_eof(self.allocator, call_context, &container);
        defer frame.deinit();
        
        // Execute the contract
        return self.execute_eof_frame(&frame);
    }
    
    fn execute_eof_frame(self: *Vm, frame: *Frame) !ExecutionResult {
        while (true) {
            if (frame.pc >= frame.code.len) {
                return ExecutionResult.halt;
            }
            
            const opcode = frame.code[frame.pc];
            
            // Check for EOF-specific opcodes
            const result = switch (opcode) {
                0xE0 => try execute_rjump(self, frame),
                0xE1 => try execute_rjumpi(self, frame),
                0xE3 => try execute_callf(self, frame),
                0xE4 => try execute_retf(self, frame),
                0xE6 => try execute_dupn(self, frame),
                0xE7 => try execute_swapn(self, frame),
                0xE8 => try execute_exchange(self, frame),
                else => try self.execute_standard_instruction(frame, opcode),
            };
            
            switch (result) {
                .continue_execution => continue,
                .halt, .revert => return result,
            }
        }
    }
    
    pub fn is_eof_bytecode(bytecode: []const u8) bool {
        return bytecode.len >= 2 and 
               std.mem.eql(u8, bytecode[0..2], &EOFContainer.EOF_MAGIC);
    }
};
```

## Testing Requirements

### Test File
Create `/test/evm/eof/eof_test.zig`

### Test Cases
```zig
test "eof container parsing" {
    // Test valid EOF container parsing
    // Test invalid containers (missing sections, wrong magic, etc.)
    // Test type section parsing
}

test "eof code validation" {
    // Test code section validation
    // Test stack underflow/overflow detection
    // Test invalid instruction detection
}

test "eof opcodes" {
    // Test RJUMP and RJUMPI
    // Test CALLF and RETF
    // Test DUPN, SWAPN, EXCHANGE
}

test "eof function calls" {
    // Test function calls with different stack patterns
    // Test nested function calls
    // Test return stack management
}

test "eof deployment and execution" {
    // Test EOF contract deployment
    // Test EOF contract execution
    // Test interaction between EOF and legacy contracts
}
```

## Integration Points

### Files to Create/Modify
- `/src/evm/eof/container.zig` - EOF container parsing and validation
- `/src/evm/eof/opcodes.zig` - EOF-specific opcodes
- `/src/evm/eof/execution.zig` - EOF execution context
- `/src/evm/frame.zig` - Add EOF support to frames
- `/src/evm/vm.zig` - Update VM with EOF support
- `/src/evm/execution/` - Update opcode execution
- `/test/evm/eof/eof_test.zig` - Comprehensive tests

## Success Criteria

1. **EOF Specification Compliance**: Full compliance with EIP-3540, 3670, 4200, 4750, 5450
2. **Container Validation**: Proper parsing and validation of EOF containers
3. **Static Analysis**: Working stack validation and jump analysis
4. **New Opcodes**: Correct implementation of EOF-specific opcodes
5. **Function Calls**: Working function call mechanism with CALLF/RETF
6. **Legacy Compatibility**: EOF contracts can interact with legacy contracts

## Critical Requirements

1. **NEVER commit until `zig build test-all` passes**
2. **EIP specification compliance** - Must match exact EOF behavior
3. **Static validation accuracy** - Critical for EOF security model
4. **Function call correctness** - Proper stack isolation and return handling
5. **Performance** - EOF execution should be faster than legacy
6. **Test with official vectors** - Use EOF test suite for validation

## References

- [EIP-3540: EOF Container Format](https://eips.ethereum.org/EIPS/eip-3540)
- [EIP-3670: EOF Code Validation](https://eips.ethereum.org/EIPS/eip-3670)
- [EIP-4200: EOF Static Relative Jumps](https://eips.ethereum.org/EIPS/eip-4200)
- [EIP-4750: EOF Functions](https://eips.ethereum.org/EIPS/eip-4750)
- [EIP-5450: EOF Stack Validation](https://eips.ethereum.org/EIPS/eip-5450)
- [EOF Test Suite](https://github.com/ethereum/tests/tree/develop/src/EOFTestsFiller)

## EVMONE Context

<evmone>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.hpp">
```cpp
// evmone/lib/evmone/eof.hpp

/// The representation of an EOF1 header.
///
/// This is created by parsing and validating the beginning of an EOF container.
/// It provides access to all sections and their properties.
struct EOF1Header
{
    /// Size of a type entry in bytes.
    static constexpr size_t TYPE_ENTRY_SIZE = sizeof(EOFCodeType);

    /// The EOF version, 0 means legacy code.
    uint8_t version = 0;

    /// Offset of the type section start.
    size_t type_section_offset = 0;

    /// Size of every code section.
    std::vector<uint16_t> code_sizes;

    /// Offset of every code section from the beginning of the EOF container.
    std::vector<uint16_t> code_offsets;

    /// Size of the data section.
    uint16_t data_size = 0;
    /// Offset of data container section start.
    uint32_t data_offset = 0;
    
    // ... more fields for containers
    
    /// A helper to extract reference to a specific type section.
    [[nodiscard]] EOFCodeType get_type(bytes_view container, size_t type_idx) const noexcept;

    /// Returns the number of types in the type section.
    [[nodiscard]] size_t get_type_count() const noexcept { return code_sizes.size(); }

    /// A helper to extract reference to a specific code section.
    [[nodiscard]] bytes_view get_code(bytes_view container, size_t code_idx) const noexcept;

    /// A helper to extract reference to the data section.
    [[nodiscard]] bytes_view get_data(bytes_view container) const noexcept;
    
    // ... more helpers
};

/// The type of an EOF code section.
struct EOFCodeType
{
    uint8_t inputs;               ///< Number of code inputs.
    uint8_t outputs;              ///< Number of code outputs.
    uint16_t max_stack_increase;  ///< Maximum stack height above the inputs reached in the code.

    // ... constructor
};

/// Validates whether given container is a valid EOF according to the rules of a given revision.
[[nodiscard]] EVMC_EXPORT EOFValidationError validate_eof(
    evmc_revision rev, ContainerKind kind, bytes_view container) noexcept;

```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/eof.cpp">
```cpp
// evmone/lib/evmone/eof.cpp

// Main validation entry point. It dispatches to version-specific validators.
EOFValidationError validate_eof(
    evmc_revision rev, ContainerKind kind, bytes_view container) noexcept
{
    return validate_eof1(rev, kind, container);
}

// Top-level validator for EOF1. It orchestrates the validation of headers,
// sections, instructions, and stack. This is analogous to the `validate`
// function in the prompt's `EOFContainer`.
EOFValidationError validate_eof1(
    evmc_revision rev, ContainerKind main_container_kind, bytes_view main_container) noexcept
{
    // ...
    // Queue for validating nested containers
    std::queue<ContainerValidation> container_queue;
    container_queue.push({main_container, main_container_kind});

    while (!container_queue.empty())
    {
        const auto& [container, container_kind] = container_queue.front();

        // 1. Validate header structure and section kinds/sizes
        auto error_or_header = validate_header(rev, container);
        if (const auto* error = std::get_if<EOFValidationError>(&error_or_header))
            return *error;

        auto& header = std::get<EOF1Header>(error_or_header);

        // 2. Validate type section contents
        if (const auto err = validate_types(container, header); err != EOFValidationError::success)
            return err;

        // 3. Validate code sections
        std::vector<bool> visited_code_sections(header.code_sizes.size());
        std::queue<uint16_t> code_sections_queue({0}); // Start with the first code section

        // ...

        while (!code_sections_queue.empty())
        {
            // ...

            // 3a. Validate instructions for each code section
            const auto instr_validation_result_or_error =
                validate_instructions(rev, header, container_kind, code_idx, container);
            // ...

            // 3b. Validate relative jump destinations
            if (!validate_rjump_destinations(header.get_code(container, code_idx)))
                return EOFValidationError::invalid_rjump_destination;

            // 3c. Validate stack usage for each code section
            const auto shi_or_error = validate_stack_height(
                header.get_code(container, code_idx), code_idx, header, container);
            if (const auto* error = std::get_if<EOFValidationError>(&shi_or_error))
                return *error;
            
            if (std::get<int32_t>(shi_or_error) !=
                header.get_type(container, code_idx).max_stack_increase)
                return EOFValidationError::invalid_max_stack_increase;
        }

        // ...
    }
    return EOFValidationError::success;
}

// This function shows how `evmone` validates the stack. It iterates through the
// bytecode, tracking the stack height and validating it at each instruction.
// This is very similar to the `CodeValidator` in the prompt.
std::variant<int32_t, EOFValidationError> validate_stack_height(
    bytes_view code, size_t func_index, const EOF1Header& header, bytes_view container)
{
    // ...
    struct StackHeightRange
    {
        int32_t min = -1; // -1 represents an unvisited location
        int32_t max = -1;
        // ...
    };

    const auto type = header.get_type(container, func_index);
    std::vector<StackHeightRange> stack_heights(code.size());
    stack_heights[0] = {type.inputs, type.inputs};

    for (size_t i = 0; i < code.size();)
    {
        const auto opcode = static_cast<Opcode>(code[i]);
        // ...

        int stack_height_required = instr::traits[opcode].stack_height_required;
        auto stack_height_change = instr::traits[opcode].stack_height_change;

        // ...
        
        // Handle stack changes for CALLF, which depend on the target function's type info
        if (opcode == OP_CALLF)
        {
            const auto fid = read_uint16_be(&code[i + 1]);
            const auto callee_type = header.get_type(container, fid);
            stack_height_required = callee_type.inputs;
            // ...
            stack_height_change = static_cast<int8_t>(callee_type.outputs - stack_height_required);
        }
        else if (opcode == OP_JUMPF)
        {
            // ... JUMPF stack validation logic ...
        }
        else if (opcode == OP_RETF)
        {
            stack_height_required = type.outputs;
            // ... RETF validation ...
        }
        
        // ...

        if (stack_height.min < stack_height_required)
            return EOFValidationError::stack_underflow;
            
        // ... more checks
    }

    // ...
    return max_stack_increase;
}
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions_traits.hpp">
```cpp
// evmone/lib/evmone/instructions_traits.hpp

// This file defines the static properties of each opcode, including stack
// requirements, which are crucial for both static validation and execution.

struct Traits
{
    // ...
    uint8_t stack_height_required = 0;
    int8_t stack_height_change = 0;
    // ...
};

constexpr inline std::array<Traits, 256> traits = []() noexcept {
    std::array<Traits, 256> table{};
    
    // ... other opcodes

    // EOF Opcodes
    table[OP_RJUMP] = {"RJUMP", 2, false, 0, 0, {}, REV_EOF1};
    table[OP_RJUMPI] = {"RJUMPI", 2, false, 1, -1, {}, REV_EOF1};
    table[OP_RJUMPV] = {
        "RJUMPV", 1 /* 1 byte static immediate + dynamic immediate */, false, 1, -1, {}, REV_EOF1};
    
    // For CALLF, stack requirements are dynamic based on the target function's type.
    // The base trait shows 0/0, but the validator/executor must handle this dynamically.
    table[OP_CALLF] = {"CALLF", 2, false, 0, 0, {}, REV_EOF1};
    table[OP_RETF] = {"RETF", 0, true, 0, 0, {}, REV_EOF1};
    table[OP_JUMPF] = {"JUMPF", 2, true, 0, 0, {}, REV_EOF1};

    table[OP_DUPN] = {"DUPN", 1, false, 0, 1, {}, REV_EOF1};
    table[OP_SWAPN] = {"SWAPN", 1, false, 0, 0, {}, REV_EOF1};
    table[OP_EXCHANGE] = {"EXCHANGE", 1, false, 0, 0, {}, REV_EOF1};

    table[OP_EOFCREATE] = {"EOFCREATE", 1, false, 4, -3, {}, REV_EOF1};
    table[OP_RETURNCODE] = {"RETURNCODE", 1, true, 2, -2, {}, REV_EOF1};

    // ... other opcodes

    return table;
}();
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/instructions.hpp">
```cpp
// evmone/lib/evmone/instructions.hpp

// This file contains the "core" implementations of opcodes. These are low-level
// functions that assume validation has already passed. They are used by the
// various interpreter backends.

namespace evmone::instr::core
{

// ...

// RJUMP implementation
inline code_iterator rjump(StackTop /*stack*/, ExecutionState& /*state*/, code_iterator pc) noexcept
{
    // Reading next 2 bytes is guaranteed to be safe by deploy-time validation.
    const auto offset = read_int16_be(&pc[1]);
    return pc + 3 + offset;  // PC_post_rjump + offset
}

// RJUMPI implementation
inline code_iterator rjumpi(StackTop stack, ExecutionState& state, code_iterator pc) noexcept
{
    const auto cond = stack.pop();
    return cond ? rjump(stack, state, pc) : pc + 3;
}

// CALLF implementation
inline code_iterator callf(StackTop stack, ExecutionState& state, code_iterator pos) noexcept
{
    const auto index = read_uint16_be(&pos[1]);
    const auto& header = state.analysis.baseline->eof_header();
    const auto stack_size = stack.end() - state.stack_space.bottom();
    const auto callee_type = header.get_type(state.original_code, index);
    if (stack_size + callee_type.max_stack_increase > StackSpace::limit)
    {
        state.status = EVMC_STACK_OVERFLOW;
        return nullptr;
    }

    if (state.call_stack.size() >= StackSpace::limit)
    {
        state.status = EVMC_STACK_OVERFLOW;
        return nullptr;
    }
    // Push the return address (the instruction after CALLF) to the call stack.
    state.call_stack.push_back(pos + 3);

    // Jump to the beginning of the target code section.
    const auto offset = header.code_offsets[index] - header.code_offsets[0];
    return state.analysis.baseline->executable_code().data() + offset;
}

// RETF implementation
inline code_iterator retf(StackTop /*stack*/, ExecutionState& state, code_iterator /*pos*/) noexcept
{
    // Pop the return address from the call stack and jump to it.
    const auto p = state.call_stack.back();
    state.call_stack.pop_back();
    return p;
}

// JUMPF implementation (tail call)
inline code_iterator jumpf(StackTop stack, ExecutionState& state, code_iterator pos) noexcept
{
    const auto index = read_uint16_be(&pos[1]);
    const auto& header = state.analysis.baseline->eof_header();
    const auto stack_size = stack.end() - state.stack_space.bottom();
    const auto callee_type = header.get_type(state.original_code, index);
    if (stack_size + callee_type.max_stack_increase > StackSpace::limit)
    {
        state.status = EVMC_STACK_OVERFLOW;
        return nullptr;
    }

    // Unlike CALLF, JUMPF does not push to the call stack. It's a direct tail call.
    const auto offset = header.code_offsets[index] - header.code_offsets[0];
    return state.analysis.baseline->executable_code().data() + offset;
}

// ...

}  // namespace evmone::instr::core
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp">
```cpp
// evmone/lib/evmone/execution_state.hpp

// The ExecutionState is analogous to the Frame concept in the prompt.
// It holds the context for a single call. The `call_stack` is the key
// part for implementing EOF functions.

class ExecutionState
{
public:
    // ... other fields
    
    /// Reference to original EVM code container.
    /// For legacy code this is a reference to entire original code.
    /// For EOF-formatted code this is a reference to entire container.
    bytes_view original_code;

    // ...

    /// The call stack for EOF subroutines (CALLF/RETF).
    /// Stores pointers to the return destinations.
    std::vector<const uint8_t*> call_stack;

    // ...
};
```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/utils/bytecode.hpp">
```cpp
// evmone/test/utils/bytecode.hpp

// This file provides a C++ DSL for building bytecode for tests.
// The `eof_bytecode` class is particularly useful for constructing
// valid or invalid EOF containers to test against.

struct eof_bytecode
{
private:
    std::vector<bytecode> m_codes;
    std::vector<evmone::EOFCodeType> m_types;
    bytecode m_data;
    uint16_t m_data_size = 0;
    std::vector<bytecode> m_containers;

    /// Constructs EOF header bytes
    bytecode header() const;

public:
    explicit eof_bytecode(bytecode code, uint16_t max_stack_increase = 0)
      : m_codes{std::move(code)}, m_types{{0, 0x80, max_stack_increase}}
    {}

    auto& code(bytecode c, uint8_t inputs, uint8_t outputs, uint16_t max_stack_increase = 0)
    {
        m_codes.emplace_back(std::move(c));
        m_types.emplace_back(inputs, outputs, max_stack_increase);
        return *this;
    }

    auto& data(bytecode d, uint16_t size = 0)
    {
        m_data = std::move(d);
        m_data_size = size;
        return *this;
    }

    auto& container(bytecode c)
    {
        m_containers.emplace_back(std::move(c));
        return *this;
    }

    operator bytecode() const
    {
        bytecode out{header()};
        for (const auto& code : m_codes)
            out += code;
        for (const auto& container : m_containers)
            out += container;
        out += m_data;
        return out;
    }
};

```
</file>
<file path="https://github.com/ethereum/evmone/blob/master/test/unittests/eof_validation_test.cpp">
```cpp
// evmone/test/unittests/eof_validation_test.cpp

// This test file shows many examples of valid and invalid EOF containers,
// which are invaluable for writing a robust implementation.

TEST_F(eof_validation, minimal_valid_EOF1_code)
{
    add_test_case(eof_bytecode(OP_INVALID), EOFValidationError::success);
}

TEST_F(eof_validation, minimal_valid_EOF1_multiple_code_sections)
{
    add_test_case(eof_bytecode(jumpf(1)).code(OP_INVALID, 0, 0x80).data("DA"),
        EOFValidationError::success, "with_data_section");
}

TEST_F(eof_validation, EOF1_rjump_invalid_destination)
{
    // Into header (offset = -5)
    add_test_case(eof_bytecode(rjump(-5) + OP_STOP), EOFValidationError::invalid_rjump_destination);

    // To after code end (offset = 2)
    add_test_case(eof_bytecode(rjump(2) + OP_STOP), EOFValidationError::invalid_rjump_destination);

    // To PUSH immediate (offset = -4)
    add_test_case(
        eof_bytecode(push(0) + rjump(-4) + OP_STOP), EOFValidationError::invalid_rjump_destination);
}

TEST_F(eof_validation, callf_invalid_code_section_index)
{
    add_test_case(eof_bytecode(callf(1) + OP_STOP), EOFValidationError::invalid_code_section_index);
}

TEST_F(eof_validation, callf_to_non_returning_function)
{
    // function 0: (0, non-returning) : CALLF{1} STOP
    // function 1: (0, non-returning) : STOP
    add_test_case(eof_bytecode(callf(1) + OP_STOP).code(OP_STOP, 0, 0x80),
        EOFValidationError::callf_to_non_returning_function);
}

TEST_F(eof_validation, no_terminating_instruction)
{
    add_test_case(eof_bytecode(push0()), EOFValidationError::no_terminating_instruction);
}

TEST_F(eof_validation, unreachable_code_sections)
{
    add_test_case(eof_bytecode(OP_INVALID).code(OP_INVALID, 0, 0x80),
        EOFValidationError::unreachable_code_sections);
}

TEST_F(eof_validation, retf_stack_validation)
{
    // 2 outputs, RETF has 2 values on stack
    add_test_case(eof_bytecode(callf(1) + OP_STOP, 2).code(push0() + push0() + OP_RETF, 0, 2, 2),
        EOFValidationError::success);

    // 2 outputs, RETF has 1 value on stack
    add_test_case(eof_bytecode(callf(1) + OP_STOP, 2).code(push0() + OP_RETF, 0, 2, 1),
        EOFValidationError::stack_underflow);

    // 2 outputs, RETF has 3 values on stack
    add_test_case(
        eof_bytecode(callf(1) + OP_STOP, 2).code(push0() + push0() + push0() + OP_RETF, 0, 2, 3),
        EOFValidationError::stack_higher_than_outputs_required);
}
```
</file>
</evmone>
## Prompt Corrections
The original prompt is excellent and very detailed. The provided Zig code snippets are well-structured and capture the essence of EOF implementation. The `evmone` code serves as a great C++ reference implementation, and its structure aligns well with the tasks outlined in the prompt.

One minor clarification based on `evmone`:

*   **`CALLF`/`RETF` Stack Effect:** The prompt correctly notes that the stack effect of `CALLF` and `RETF` varies. The `evmone` implementation clarifies this: the stack change is determined by looking up the `inputs` and `outputs` for the target function in the `type` section. The static validator (`CodeValidator` in the prompt, `validate_stack_height` in `evmone`) must perform this lookup to correctly track stack height across function calls. The provided Zig `SectionValidator::update_stack_for_instruction` already implements this correctly, so this is more of a confirmation of the prompt's design.



## REVM Context

<revm>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/eof.rs">
```rust
//! EOF bytecode.
//!
//! Contains body, header and raw bytes.
//!
//! Also contains verification logic and pretty printer.
mod body;
mod code_info;
mod decode_helpers;
mod header;
/// Pritty printer for the EOF bytecode. Enabled by `std` feature.
pub mod printer;
/// Verification logic for the EOF bytecode.
pub mod verification;

pub use body::EofBody;
pub use code_info::CodeInfo;
pub use header::{
    EofHeader, CODE_SECTION_SIZE, CONTAINER_SECTION_SIZE, KIND_CODE, KIND_CODE_INFO,
    KIND_CONTAINER, KIND_DATA, KIND_TERMINAL,
};
pub use verification::*;

use core::cmp::min;
use primitives::{b256, bytes, Bytes, B256};
use std::{fmt, vec, vec::Vec};

/// Hash of EF00 bytes that is used for EXTCODEHASH when called from legacy bytecode
pub const EOF_MAGIC_HASH: B256 =
    b256!("0x9dbf3648db8210552e9c4f75c6a1c3057c0ca432043bd648be15fe7be05646f5");

/// EOF Magic in [u16] form
pub const EOF_MAGIC: u16 = 0xEF00;

/// EOF magic number in array form
pub static EOF_MAGIC_BYTES: Bytes = bytes!("ef00");

/// EVM Object Format (EOF) container
///
/// It consists of a header, body and the raw original bytes.
#[derive(Clone, Debug, PartialEq, Eq, Hash, Ord, PartialOrd)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct Eof {
    /// Header of the EOF container
    pub header: EofHeader,
    /// Body of the EOF container
    pub body: EofBody,
    /// Raw bytes of the EOF container. Chunks of raw Bytes are used in Body to reference
    /// parts of code, data and container sections.
    pub raw: Bytes,
}

// ... (Default implementation)

impl Eof {
    // ...

    /// Decodes EOF from raw bytes.
    pub fn decode(raw: Bytes) -> Result<Self, EofDecodeError> {
        let (header, _) = EofHeader::decode(&raw)?;
        let body = EofBody::decode(&raw, &header)?;
        Ok(Self { header, body, raw })
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/eof/header.rs">
```rust
//! EOF header structure that contains section sizes and metadata
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash, Ord, PartialOrd)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct EofHeader {
    /// Size of EOF types section
    ///
    /// Types section includes num of input and outputs and max stack size.
    pub types_size: u16,
    /// Sizes of EOF code section
    ///
    /// Code size can't be zero.
    pub code_sizes: Vec<u16>,
    /// EOF Container size
    ///
    /// Container size can be zero.
    pub container_sizes: Vec<u32>,
    /// EOF data size
    pub data_size: u16,
    /// Sum of code sizes
    pub sum_code_sizes: usize,
    /// Sum of container sizes
    pub sum_container_sizes: usize,
}

/// EOF header terminal kind, marking end of header.
pub const KIND_TERMINAL: u8 = 0;
/// EOF header code info kind, marking code info section.
pub const KIND_CODE_INFO: u8 = 1;
/// EOF header code kind, marking code section.
pub const KIND_CODE: u8 = 2;
/// EOF header container kind, marking container section.
pub const KIND_CONTAINER: u8 = 3;
/// EOF header data kind, marking data section.
pub const KIND_DATA: u8 = 0xff;
// ...

impl EofHeader {
    // ...

    /// Decodes EOF header from binary form.
    /// Format of the code section is:
    /// 0xEF000101 | u16  | 0x02 | u16 | u16 * cnum | 0x03 | u16 | cnum* u32 | 0xff | u16 | 0x00
    pub fn decode(input: &[u8]) -> Result<(Self, &[u8]), EofDecodeError> {
        let mut header = EofHeader::default();

        // `magic`	2 bytes	0xEF00	EOF prefix
        let (input, kind) = consume_u16(input)?;
        if kind != 0xEF00 {
            return Err(EofDecodeError::InvalidEOFMagicNumber);
        }

        // `version`	1 byte	0x01	EOF version
        let (input, version) = consume_u8(input)?;
        if version != 0x01 {
            return Err(EofDecodeError::InvalidEOFVersion);
        }

        // `kind_types`	1 byte	0x01	kind marker for types size section
        let (input, kind_code_info) = consume_u8(input)?;
        if kind_code_info != KIND_CODE_INFO {
            return Err(EofDecodeError::InvalidTypesKind);
        }

        // `types_size`	2 bytes	0x0004-0xFFFF
        // 16-bit unsigned big-endian integer denoting the length of the type section content
        let (input, types_size) = consume_u16(input)?;
        header.types_size = types_size;

        // ... (validation logic)

        // `kind_code`	1 byte	0x02	kind marker for code size section
        let (input, kind_code) = consume_u8(input)?;
        if kind_code != KIND_CODE {
            return Err(EofDecodeError::InvalidCodeKind);
        }

        // `code_sections_sizes`
        let (input, sizes, sum) = consume_header_code_section(input)?;
        
        // ... (validation logic)

        header.code_sizes = sizes;
        header.sum_code_sizes = sum;

        let (input, kind_container_or_data) = consume_u8(input)?;

        let input = match kind_container_or_data {
            KIND_CONTAINER => {
                // container_sections_sizes
                let (input, sizes, sum) = consume_header_container_section(input)?;
                // ... (validation logic)
                header.container_sizes = sizes;
                header.sum_container_sizes = sum;
                let (input, kind_data) = consume_u8(input)?;
                if kind_data != KIND_DATA {
                    return Err(EofDecodeError::InvalidDataKind);
                }
                input
            }
            KIND_DATA => input,
            invalid_kind => return Err(EofDecodeError::InvalidKindAfterCode { invalid_kind }),
        };

        // `data_size`	2 bytes	0x0000-0xFFFF
        let (input, data_size) = consume_u16(input)?;
        header.data_size = data_size;

        // `terminator`	1 byte	0x00	marks the end of the EofHeader
        let (input, terminator) = consume_u8(input)?;
        if terminator != KIND_TERMINAL {
            return Err(EofDecodeError::InvalidTerminalByte);
        }

        Ok((header, input))
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/eof/code_info.rs">
```rust
/// Non returning function has a output `0x80`
const EOF_NON_RETURNING_FUNCTION: u8 = 0x80;

/// Types section that contains stack information for matching code section
#[derive(Debug, Clone, Default, Hash, PartialEq, Eq, Copy, PartialOrd, Ord)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CodeInfo {
    /// `inputs` - 1 byte - `0x00-0x7F`
    ///
    /// Number of stack elements the code section consumes
    pub inputs: u8,
    /// `outputs` - 1 byte - `0x00-0x80`
    ///
    /// Number of stack elements the code section returns or 0x80 for non-returning functions
    pub outputs: u8,
    /// `max_stack_increase` - 2 bytes - `0x0000-0x03FF`
    ///
    /// Maximum number of elements that got added to the stack by this code section.
    pub max_stack_increase: u16,
}

impl CodeInfo {
    // ...

    /// Decodes the section from the input.
    #[inline]
    pub fn decode(input: &[u8]) -> Result<(Self, &[u8]), EofDecodeError> {
        let (input, inputs) = consume_u8(input)?;
        let (input, outputs) = consume_u8(input)?;
        let (input, max_stack_increase) = consume_u16(input)?;
        let section = Self {
            inputs,
            outputs,
            max_stack_increase,
        };
        section.validate()?;
        Ok((section, input))
    }

    /// Validates the section.
    pub fn validate(&self) -> Result<(), EofDecodeError> {
        if self.inputs > 0x7f {
            return Err(EofDecodeError::InvalidCodeInfoInputValue { value: self.inputs });
        }

        if self.outputs > 0x80 {
            return Err(EofDecodeError::InvalidCodeInfoOutputValue {
                value: self.outputs,
            });
        }

        if self.max_stack_increase > 0x03FF {
            return Err(EofDecodeError::InvalidCodeInfoMaxIncrementValue {
                value: self.max_stack_increase,
            });
        }

        if self.inputs as usize + self.max_stack_increase as usize > STACK_LIMIT {
            return Err(EofDecodeError::InvalidCodeInfoStackOverflow {
                inputs: self.inputs,
                max_stack_increment: self.max_stack_increase,
            });
        }

        Ok(())
    }
}
```
</file>
<file path="https://github.com/bluealloy/revm/blob/main/crates/bytecode/src/eof/verification.rs">
```rust
// ... (imports)

/// Validates that:
/// * All instructions are valid.
/// * It ends with a terminating instruction or RJUMP.
/// * All instructions are accessed by forward jumps or .
///
/// Validate stack requirements and if all codes sections are used.
pub fn validate_eof_code(
    code: &[u8],
    data_size: usize,
    this_types_index: usize,
    num_of_containers: usize,
    types: &[CodeInfo],
    tracker: &mut AccessTracker,
) -> Result<(), EofValidationError> {
    let this_types = &types[this_types_index];

    #[derive(Debug, Copy, Clone)]
    struct InstructionInfo {
        /// Is immediate byte, jumps can't happen on this part of code.
        is_immediate: bool,
        /// Have forward jump to this opcode. Used to check if opcode
        /// after termination is accessed.
        is_jumpdest: bool,
        /// Smallest number of stack items accessed by jumps or sequential opcodes.
        smallest: i32,
        /// Biggest number of stack items accessed by jumps or sequential opcodes.
        biggest: i32,
    }
    // ...

    // All bytes that are intermediate.
    let mut jumps = vec



## EXECUTION-SPECS Context

An analysis of the `execution-specs` codebase reveals a comprehensive implementation of EOF in the `prague` fork. The following snippets provide a direct reference for the required functionality.

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork_types.py">
```python
"""
Ethereum Types
^^^^^^^^^^^^^^
"""

from dataclasses import dataclass
from enum import IntEnum

from ethereum_types.bytes import Bytes, Bytes20, Bytes256
from ethereum_types.frozen import slotted_freezable
from ethereum_types.numeric import U256, Uint

from ..crypto.hash import Hash32, keccak256

# ... (other types)

# EOF Types
# =========


@slotted_freezable
@dataclass
class Type:
    """
    Type information for a code section.
    """

    input_count: Uint
    output_count: Uint
    max_stack_height: Uint


class SectionId(IntEnum):
    """
    Section IDs for an EOF container.
    """

    TYPE = Uint(1)
    CODE = Uint(2)
    DATA = Uint(3)
    # The `CONTAINER` id is used to mark the end of the container section
    # within the raw bytes, it is not part of the `Container` data structure.
    CONTAINER = Uint(4)


@slotted_freezable
@dataclass
class Section:
    """
    A single section of an EOF container.
    """

    id: SectionId
    data: Bytes


@slotted_freezable
@dataclass
class Header:
    """
    The header of an EOF container.
    """

    type_section_size: Uint
    code_section_count: Uint
    code_section_sizes: Tuple[Uint, ...]
    data_section_size: Uint
    container_section_count: Uint
    container_section_sizes: Tuple[Uint, ...]


@slotted_freezable
@dataclass
class Container:
    """
    An EOF container.
    """

    header: Header
    type_section: Tuple[Type, ...]
    code_sections: Tuple[Bytes, ...]
    data_section: Bytes
    container_sections: Tuple[Bytes, ...]
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/runtime.py">
```python
"""
Ethereum Virtual Machine (EVM) Runtime Operations
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
"""

from typing import List, Set

from ethereum_types.bytes import Bytes
from ethereum_types.numeric import U256, Uint, ulen

from ..fork_types import Container, Header, SectionId, Type
from . import Evm
from .exceptions import InvalidEOFFormat, StackValidationError, ValidationException
from .instructions import Ops


def get_valid_jump_destinations(code: Bytes) -> Set[Uint]:
# ... (legacy jumpdest analysis)

def validate_eof(container: Container) -> None:
    """
    Validate an EOF container.
    """
    header = container.header

    if header.code_section_count == 0:
        raise InvalidEOFFormat("no code sections")

    if header.type_section_size != header.code_section_count:
        raise InvalidEOFFormat("type section size mismatch")

    for i in range(header.code_section_count):
        validate_code(
            container,
            i,
            container.code_sections[i],
            container.type_section[i],
        )

def validate_code(
    container: Container,
    code_section_index: Uint,
    code: Bytes,
    type: Type,
) -> None:
    """
    Validate a code section.
    """
    if len(code) == 0:
        return

    pc = Uint(0)
    max_stack_height = type.input_count

    # Find all valid jump destinations
    valid_jump_destinations = set()
    while pc < ulen(code):
        try:
            op = Ops(code[pc])
        except ValueError:
            # Skip invalid opcodes, as they don't affect the jumpdest
            # analysis. Nevertheless, such invalid opcodes would be caught
            # and raised when the interpreter runs.
            pc += Uint(1)
            continue

        if op == Ops.JUMPDEST:
            raise ValidationException(f"Invalid Opcode: {op}")
        elif op == Ops.RJUMPDEST:
            valid_jump_destinations.add(pc)
        elif Ops.PUSH1.value <= op.value <= Ops.PUSH32.value:
            pc += Uint(op.value - Ops.PUSH1.value + 1)

        pc += Uint(1)

    pc = Uint(0)
    # Validate each instruction
    while pc < ulen(code):
        op = Ops(code[pc])

        pc, max_stack_height = _validate_instruction(
            container,
            code,
            type,
            pc,
            op,
            valid_jump_destinations,
            max_stack_height,
        )

    # Validate the final stack height.
    # Note: the validation of each instruction already ensures that the stack
    # never underflows and that `max_stack_height` never exceeds
    # `type.max_stack_height`.
    if max_stack_height != type.input_count - type.output_count:
        raise StackValidationError("stack height mismatch")


def _validate_instruction(
    container: Container,
    code: Bytes,
    type: Type,
    pc: Uint,
    op: Ops,
    valid_jump_destinations: Set[Uint],
    max_stack_height: Uint,
) -> Tuple[Uint, Uint]:
    # ... (omitting other opcodes for brevity)

    elif op in (Ops.RJUMP, Ops.RJUMPI):
        if op == Ops.RJUMPI:
            max_stack_height -= 1
            if max_stack_height < 0:
                raise StackValidationError(
                    f"{op} operand stack underflow at pc={pc}"
                )

        if pc + 2 >= len(code):
            raise ValidationException(f"truncated {op} at pc={pc}")
        jump_offset = int.from_bytes(code[pc + 1 : pc + 3], "big", signed=True)
        jump_dest = pc + 3 + jump_offset

        if jump_dest not in valid_jump_destinations:
            raise ValidationException(f"invalid jump destination for {op}")
        pc += 2

    # ...

    elif op == Ops.CALLF:
        if pc + 2 >= len(code):
            raise ValidationException(f"truncated CALLF at pc={pc}")
        target_section_index = Uint.from_be_bytes(code[pc + 1 : pc + 3])
        if target_section_index >= container.header.code_section_count:
            raise ValidationException("invalid code section index")
        target_type = container.type_section[target_section_index]
        max_stack_height -= target_type.input_count
        if max_stack_height < 0:
            raise StackValidationError(
                f"CALLF operand stack underflow at pc={pc}"
            )
        max_stack_height += target_type.output_count
        if max_stack_height > type.max_stack_height:
            raise StackValidationError(
                f"CALLF max stack exceeded at pc={pc}, "
                f"is {max_stack_height} but expected "
                f"{type.max_stack_height}"
            )

        pc += 2

    elif op == Ops.RETF:
        if max_stack_height != type.input_count - type.output_count:
            raise StackValidationError(f"stack height mismatch at pc={pc}")

    else:
        # This part of validation is already handled by `validate_code`
        # and `get_valid_jump_destinations`
        # TODO: Move this logic over to `validate_code`
        # and remove it from here.
        if op.value in range(0xB0, 0xC0) or op in (
            Ops.INVALID,
            Ops.JUMP,
            Ops.JUMPI,
        ):
            raise ValidationException(f"Invalid Opcode: {op}")

    pc += 1
    return pc, max_stack_height
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/eof.py">
```python
"""
Ethereum Virtual Machine (EVM) EOF Instructions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. contents:: Table of Contents
    :backlinks: none
    :local:

Introduction
------------

Implementations of the EVM EOF instructions.
"""
from ethereum_types.numeric import U256, Uint

from ...vm import Evm
from ...vm.stack import pop, push


def rjump(evm: Evm) -> None:
    """
    Alter the program counter by a signed 2-byte value.
    """
    # STACK
    pass

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    jump_offset = int.from_bytes(evm.code[evm.pc + 1 : evm.pc + 3], "big")

    evm.pc += 3 + jump_offset


def rjumpi(evm: Evm) -> None:
    """
    Alter the program counter by a signed 2-byte value, if a condition is
    true.
    """
    # STACK
    condition = pop(evm.stack)

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    if condition != 0:
        jump_offset = int.from_bytes(
            evm.code[evm.pc + 1 : evm.pc + 3], "big", signed=True
        )
        evm.pc += 3 + jump_offset
    else:
        evm.pc += 3


def rjumpv(evm: Evm) -> None:
    """
    Alter the program counter by a signed 2-byte value taken from a jump
    table.
    """
    # STACK
    case = pop(evm.stack)

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    jump_table_size = evm.code[evm.pc + 1]
    if case >= jump_table_size:
        # Fall through, doing nothing
        evm.pc += 2 + jump_table_size * 2
        return

    jump_offset = int.from_bytes(
        evm.code[evm.pc + 2 + case * 2 : evm.pc + 4 + case * 2],
        "big",
        signed=True,
    )
    evm.pc += 2 + jump_offset


def callf(evm: Evm) -> None:
    """
    Call a function.
    """
    # STACK
    target_section_index = Uint.from_be_bytes(evm.code[evm.pc + 1 : evm.pc + 3])

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    evm.return_stack.append(
        (evm.code, evm.pc + 3, evm.message.code_section_index)
    )
    evm.code = evm.message.container.code_sections[target_section_index]
    evm.pc = Uint(0)
    evm.message.code_section_index = target_section_index


def retf(evm: Evm) -> None:
    """
    Return from a function.
    """
    # STACK
    pass

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    (
        evm.code,
        evm.pc,
        evm.message.code_section_index,
    ) = evm.return_stack.pop()


def dupn(evm: Evm) -> None:
    """
    Duplicate the Nth stack item.
    """
    # STACK
    pass

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    n = evm.code[evm.pc + 1]
    value = evm.stack[len(evm.stack) - 1 - n]
    push(evm.stack, value)

    evm.pc += 2


def swapn(evm: Evm) -> None:
    """
    Swap the top and Nth stack item.
    """
    # STACK
    pass

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    n = Uint(evm.code[evm.pc + 1]) + 1
    (evm.stack[len(evm.stack) - 1], evm.stack[len(evm.stack) - 1 - n]) = (
        evm.stack[len(evm.stack) - 1 - n],
        evm.stack[len(evm.stack) - 1],
    )
    evm.pc += 2


def exchange(evm: Evm) -> None:
    """
    Exchange two stack items.
    """
    # STACK
    pass

    # GAS
    # No gas cost, as it is paid for during validation.

    # OPERATION
    operand = evm.code[evm.pc + 1]
    n = operand >> 4
    m = operand & 0x0F

    if n >= m:
        raise ValueError("Invalid EXCHANGE operand")

    n += 1
    m += 1

    (evm.stack[len(evm.stack) - 1 - n], evm.stack[len(evm.stack) - 1 - m]) = (
        evm.stack[len(evm.stack) - 1 - m],
        evm.stack[len(evm.stack) - 1 - n],
    )
    evm.pc += 2
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/__init__.py">
```python
"""
Ethereum Virtual Machine (EVM)
"""

from dataclasses import dataclass, field
from typing import List, Optional, Set, Tuple, Union

from ethereum_types.bytes import Bytes, Bytes0, Bytes32
from ethereum_types.numeric import U64, U256, Uint

# ...

ReturnStack = List[Tuple[Bytes, Uint, Uint]]


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
    return_stack: ReturnStack = field(default_factory=list)

# ...
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/fork.py">
```python
def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.

    Parameters
    ----------
    message :
        Transaction specific items.

    Returns
    -------
    evm: :py:class:`~ethereum.prague.vm.Evm`
        Items containing execution specific objects.
    """
    # ... (snapshotting and collision checks)

    # In the previously mentioned edge case the preexisting storage is ignored
    # for gas refund purposes. In order to do this we must track created
    # accounts.
    mark_account_created(state, message.current_target)

    increment_nonce(state, message.current_target)
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        if len(contract_code) > 0:
            if contract_code[0] == VERSIONED_HASH_VERSION_EOF:
                try:
                    container = rlp.decode_to(Container, contract_code)
                    validate_eof(container)
                except (rlp.DecodingError, InvalidEOFFormat) as e:
                    rollback_transaction(state, transient_storage)
                    evm.gas_left = Uint(0)
                    evm.output = b""
                    evm.error = e
                    return evm
            elif contract_code[0] == 0xEF:
                raise InvalidContractPrefix

        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            charge_gas(evm, contract_code_gas)
            if len(contract_code) > MAX_CODE_SIZE:
                raise OutOfGasError
        except ExceptionalHalt as error:
            rollback_transaction(state, transient_storage)
            evm.gas_left = Uint(0)
            evm.output = b""
            evm.error = error
        else:
            set_code(state, message.current_target, contract_code)
            commit_transaction(state, transient_storage)
    else:
        rollback_transaction(state, transient_storage)
    return evm
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/exceptions.py">
```python
class ValidationException(ExceptionalHalt):
    """
    Raised when an invalid opcode is encountered.
    """

    pass


class InvalidEOFFormat(ValidationException):
    """
    Raised when an EOF-formatted contract is invalid.
    """

    pass


class StackValidationError(InvalidEOFFormat):
    """
    Raised when EOF stack validation fails.
    """

    pass
```
</file>
</execution-specs>

## Prompt Corrections

Your prompt is well-structured and provides a solid foundation for implementing EOF. Here are a few minor corrections and suggestions based on the `execution-specs` reference implementation:

1.  **Opcode Naming**: The prompt uses `RJUMPV`, `JUMPF`, `DUPN`, `SWAPN`, and `EXCHANGE`. The current `execution-specs` implementation in `prague` includes these as `RJUMPV`, `DUPN`, and `SWAPN`, but not `JUMPF` or `EXCHANGE` (though `EXCHANGE` is a proposed opcode). Be sure to align with the specific EOF EIPs you are targeting. `JUMPF` is part of EIP-6206, which might be a later addition.

2.  **`CALLF` and `RETF` Stack Effect**: Your `get_instruction_stack_effects` function has a `// (varies by function)` comment, which is correct. The reference implementation's `_validate_instruction` function demonstrates how this is handled: it reads the function index from the immediate operand, looks up the corresponding `Type` info from the container's type section, and then adjusts the stack height based on that type's `input_count` and `output_count`. This dynamic stack effect calculation during static validation is a key part of EIP-4750 and EIP-5450.

3.  **Deployment Validation**: The entry point for EOF validation happens at contract creation time. The `prague` fork's `process_create_message` function checks if the deployed code starts with the EOF magic `0xEF00`. If it does, it decodes it as a `Container` and calls `validate_eof`. This is the correct integration point to add the validation logic.

4.  **Error Handling**: The reference implementation introduces new, specific exceptions like `InvalidEOFFormat` and `StackValidationError`. Using distinct error types for different failure modes (e.g., malformed container vs. invalid stack usage) is a good practice to follow.

5.  **`EOFExecutionFrame`**: Your concept of an `EOFExecutionFrame` is well-aligned with the reference implementation. In the specs, the `Evm` struct itself is extended with a `return_stack`, and the `message` object is updated with the current `code_section_index`. This shows that modifying the existing `Frame` or `VM` context is a valid approach.

The provided prompt is an excellent starting point, and these suggestions from the reference implementation should help refine the details.

---

<execution-specs>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/__init__.py">
```python
class Ops(enum.Enum):
    """
    Enum for EVM Opcodes
    """

    # ... (other opcodes)

    # EIP-3541: Reject new contracts starting with the 0xEF byte
    EOF_CREATE = 0xF6

    # EIP-4200: Static relative jumps
    RJUMP = 0x5C
    RJUMPI = 0x5D

    # EIP-4750: EOF Functions
    CALLF = 0xE3
    RETF = 0xE4
    JUMPF = 0xE5

    # EIP-7480: EOF Data section access instructions
    DATALOAD = 0xE6
    DATALOADN = 0xE7
    DATASIZE = 0xE8
    DATACOPY = 0xE9

    # EIP-5450: Stack validation
    DUPN = 0xB0
    SWAPN = 0xB1
    EXCHANGE = 0xB2

# ...

op_implementation: Dict[Ops, Callable] = {
    # ... (other opcode implementations)
    Ops.RJUMP: control_flow_instructions.rjump,
    Ops.RJUMPI: control_flow_instructions.rjumpi,
    Ops.DUPN: stack_instructions.dupn,
    Ops.SWAPN: stack_instructions.swapn,
    Ops.EXCHANGE: stack_instructions.exchange,
    Ops.CALLF: control_flow_instructions.callf,
    Ops.RETF: control_flow_instructions.retf,
    Ops.JUMPF: control_flow_instructions.jumpf,
    Ops.DATALOAD: data_instructions.data_load,
    Ops.DATALOADN: data_instructions.data_loadn,
    Ops.DATASIZE: data_instructions.data_size,
    Ops.DATACOPY: data_instructions.data_copy,
}

```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/eof.py">
```python
"""
EVM Object Format
-----------------

Structure of an EVM Object Format container and validation rules.
"""
from dataclasses import dataclass
from typing import List, Optional

from ethereum_types.bytes import Bytes, Bytes2
from ethereum_types.numeric import Uint

from .opcodes import Ops
from .stack import STACK_DEPTH_LIMIT

EOF_MAGNITUDE = 0xEF
EOF_VERSION = 0x01

# Section IDs
TERMINATOR = 0x00
CODE = 0x01
DATA = 0x02
TYPE = 0x03
CONTAINER = 0x04


@dataclass
class InvalidEofFormat(Exception):
    """
    Error raised when an EOF container is invalid.
    """

    message: str


@dataclass
class Section:
    """
    An EOF section.
    """

    id: Uint
    size: Uint
    contents: Bytes


@dataclass
class EOF:
    """
    An EVM Object Format container.
    """

    version: Uint
    sections: List[Section]


def validate_eof(code: Bytes) -> None:
    """
    Validate an EOF container.
    """
    validate_container(parse_eof(code))


def parse_eof(code: Bytes) -> EOF:
    """
    Parse a supposedly EOF-formatted contract into an `EOF` object.
    """
    if len(code) == 0:
        raise InvalidEofFormat("EOF-formatted code cannot be empty")

    if code[0] != EOF_MAGNITUDE:
        raise InvalidEofFormat("invalid EOF magnitude")

    if len(code) < 2:
        raise InvalidEofFormat("EOF container too short")

    if code[1] != EOF_VERSION:
        raise InvalidEofFormat("unsupported EOF version")

    header_size = 2
    offset = header_size
    sections: List[Section] = []

    while True:
        if offset >= len(code):
            raise InvalidEofFormat("no section terminator")

        section_id = Uint(code[offset])
        offset += 1

        if section_id == TERMINATOR:
            break

        if offset + 1 >= len(code):
            raise InvalidEofFormat("section header ends prematurely")

        section_size_bytes = Bytes2(code[offset : offset + 2])
        section_size = Uint.from_be_bytes(section_size_bytes)
        offset += 2

        if offset + section_size > len(code):
            raise InvalidEofFormat("section contents end prematurely")

        sections.append(
            Section(
                id=section_id,
                size=section_size,
                contents=code[offset : offset + section_size],
            )
        )
        offset += section_size

    return EOF(version=Uint(code[1]), sections=sections)


def validate_container(container: EOF) -> None:
    """
    Verify that an `EOF` object is valid.
    """
    if container.version != 1:
        raise InvalidEofFormat("invalid version")

    if len(container.sections) == 0:
        raise InvalidEofFormat("no sections")

    # Validate section ordering, no duplicate sections, and required sections
    # are present.
    # TODO: This should probably take a hardfork parameter to make it easier
    #       to add new sections in the future.
    seen_ids: List[Uint] = []
    for section in container.sections:
        if section.id != CODE and section.size == 0:
            raise InvalidEofFormat("non-code section has zero size")

        if section.id in seen_ids:
            raise InvalidEofFormat(f"duplicate section id: {section.id}")

        if len(seen_ids) > 0:
            if section.id < seen_ids[-1]:
                raise InvalidEofFormat(
                    f"invalid section order: {section.id} after {seen_ids[-1]}"
                )

        seen_ids.append(section.id)

    code_sections = [
        s.contents for s in container.sections if s.id == CODE
    ]
    type_sections = [
        s.contents for s in container.sections if s.id == TYPE
    ]
    container_sections = [
        s.contents for s in container.sections if s.id == CONTAINER
    ]

    if len(code_sections) == 0:
        raise InvalidEofFormat("no code sections")

    if len(type_sections) == 0:
        raise InvalidEofFormat("no type section")

    if len(type_sections) > 1:
        raise InvalidEofFormat("more than one type section")

    if len(container_sections) > 1:
        raise InvalidEofFormat("more than one container section")

    types = parse_type(type_sections[0])

    if len(types) != len(code_sections):
        raise InvalidEofFormat("number of types and code sections differ")

    for i, code_section in enumerate(code_sections):
        validate_code(code_section, types[i])


def validate_code(code: Bytes, type: List[Uint]) -> None:
    """
    Validate an EOF code section.
    """
    if len(code) == 0:
        raise InvalidEofFormat("code section is empty")

    if Ops(code[-1]) not in (Ops.RETF, Ops.STOP):
        raise InvalidEofFormat("code doesn't end with a terminating instruction")

    # Validate that all defined opcodes are valid
    pc = Uint(0)
    while pc < len(code):
        op = Ops(code[pc])

        if op in (Ops.JUMP, Ops.JUMPI):
            raise InvalidEofFormat(f"found {op} in code")

        if op in (Ops.JUMPDEST,):
            raise InvalidEofFormat(f"found {op} in code")

        # No undefined instructions are allowed
        if op not in Ops:
            raise InvalidEofFormat(f"found undefined instruction: {hex(op)}")

        if Ops.PUSH1 <= op <= Ops.PUSH32:
            pc += op - Ops.PUSH1 + 1
        elif op in (Ops.RJUMP, Ops.RJUMPI):
            pc += 2
        elif op in (Ops.CALLF,):
            pc += 1

        pc += 1

    validate_stack(code, type)


def validate_stack(code: Bytes, type: List[Uint]) -> None:
    """
    Validate the stack requirements of an EOF code section.
    """
    # This is a stub at the moment.
    # See https://github.com/ethereum/execution-specs/issues/724
    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/control_flow.py">
```python
def rjump(evm: Evm) -> None:
    """
    Alter the program counter by a signed relative offset.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    signed_offset_bytes = buffer_read(evm.code, U256(evm.pc + 1), U256(2))
    signed_offset = Sint.from_be_bytes(signed_offset_bytes)
    destination = Uint(int(evm.pc) + 3 + signed_offset)

    if not (
        Uint(0) <= destination < ulen(evm.code)
        and evm.code[destination] == Ops.JUMPDEST.value
    ):
        raise InvalidJumpDestError

    # PROGRAM COUNTER
    evm.pc = destination


def rjumpi(evm: Evm) -> None:
    """
    Alter the program counter by a signed relative offset, but only if a
    condition is true.
    """
    # STACK
    conditional_value = pop(evm.stack)

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    if conditional_value != 0:
        signed_offset_bytes = buffer_read(evm.code, U256(evm.pc + 1), U256(2))
        signed_offset = Sint.from_be_bytes(signed_offset_bytes)
        destination = Uint(int(evm.pc) + 3 + signed_offset)

        if not (
            Uint(0) <= destination < ulen(evm.code)
            and evm.code[destination] == Ops.JUMPDEST.value
        ):
            raise InvalidJumpDestError

        # PROGRAM COUNTER
        evm.pc = destination
    else:
        # PROGRAM COUNTER
        evm.pc += 3


def callf(evm: Evm) -> None:
    """
    Call a function.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    section_id = U256.from_be_bytes(buffer_read(evm.code, U256(evm.pc + 1), 2))
    # TODO: This needs to be done properly once the stack validation is
    #       implemented.
    #       See https://github.com/ethereum/execution-specs/issues/724
    if section_id >= U256(len(evm.function_stack)):
        raise InvalidJumpDestError

    # TODO: Check that `evm.stack` has enough items for the call.

    return_address = evm.pc + 3
    evm.return_stack.append(return_address)
    # TODO: This will need to change when we have multiple code sections.
    #      See https://github.com/ethereum/execution-specs/issues/721
    evm.function_stack[section_id](evm)

    # PROGRAM COUNTER
    evm.pc = return_address


def retf(evm: Evm) -> None:
    """
    Return from a function.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    # TODO: This needs to be done properly once the stack validation is
    #       implemented.
    #       See https://github.com/ethereum/execution-specs/issues/724
    # TODO: Check that `evm.stack` has enough items for the call.
    evm.pc = evm.return_stack.pop()

    # PROGRAM COUNTER
    # This is updated by the operation above.
    pass


def jumpf(evm: Evm) -> None:
    """
    Jump to a function.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_LOW)

    # OPERATION
    section_id = U256.from_be_bytes(buffer_read(evm.code, U256(evm.pc + 1), 2))
    # TODO: This needs to be done properly once the stack validation is
    #       implemented.
    #       See https://github.com/ethereum/execution-specs/issues/724
    if section_id >= U256(len(evm.function_stack)):
        raise InvalidJumpDestError

    # TODO: Check that `evm.stack` has enough items for the call.

    evm.function_stack[section_id](evm)

    # PROGRAM COUNTER
    # This is updated by the function call.
    pass
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/instructions/stack.py">
```python
def dupn(evm: Evm) -> None:
    """
    Duplicate the Nth stack item to the top of stack, where N is an
    immediate value.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    item_number = Uint.from_be_bytes(buffer_read(evm.code, U256(evm.pc + 1), 1))
    if item_number >= len(evm.stack):
        raise StackUnderflowError
    data_to_duplicate = evm.stack[len(evm.stack) - 1 - int(item_number)]
    stack.push(evm.stack, data_to_duplicate)

    # PROGRAM COUNTER
    evm.pc += Uint(2)


def swapn(evm: Evm) -> None:
    """
    Swap the top and the Nth element of the stack, where N is an immediate
    value.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    item_number = int(
        Uint.from_be_bytes(buffer_read(evm.code, U256(evm.pc + 1), 1))
    )
    if item_number >= len(evm.stack):
        raise StackUnderflowError
    evm.stack[-1], evm.stack[-1 - item_number] = (
        evm.stack[-1 - item_number],
        evm.stack[-1],
    )

    # PROGRAM COUNTER
    evm.pc += Uint(2)


def exchange(evm: Evm) -> None:
    """
    Exchange two stack items.
    """
    # STACK
    pass

    # GAS
    charge_gas(evm, GAS_VERY_LOW)

    # OPERATION
    item_numbers = int(
        Uint.from_be_bytes(buffer_read(evm.code, U256(evm.pc + 1), 1))
    )
    m = item_numbers >> 4
    n = item_numbers & 0x0F

    if m >= len(evm.stack) or n >= len(evm.stack):
        raise StackUnderflowError
    evm.stack[-1 - m], evm.stack[-1 - n] = (
        evm.stack[-1 - n],
        evm.stack[-1 - m],
    )

    # PROGRAM COUNTER
    evm.pc += Uint(2)
```
</file>
<file path="https://github.com/ethereum/execution-specs/blob/master/src/ethereum/prague/vm/interpreter.py">
```python
def process_create_message(message: Message) -> Evm:
    """
    Executes a call to create a smart contract.
    ...
    """
    # ...
    evm = process_message(message)
    if not evm.error:
        contract_code = evm.output
        contract_code_gas = Uint(len(contract_code)) * GAS_CODE_DEPOSIT
        try:
            # EIP-3540: EOF - EVM Object Format
            if len(contract_code) > 0 and contract_code[0] == EOF_MAGNITUDE:
                try:
                    validate_eof(contract_code)
                except InvalidEofFormat as eof_error:
                    # TODO: The interpreter needs to be able to catch this
                    # error and return from `process_create_message`. At the
                    # moment this crashes the client.
                    # See https://github.com/ethereum/execution-specs/issues/723
                    raise eof_error

            if len(contract_code) > 0:
                if contract_code[0] == 0xEF:
                    raise InvalidContractPrefix
    # ...
```
</file>
</execution-specs>

## Prompt Corrections
- **Opcode Values**: The prompt lists opcode values for `DUPN`, `SWAPN`, and `EXCHANGE` in the `0xE*` range. The execution-specs for the Prague hardfork (where these are introduced) assign them to the `0xB*` range. The `0xE*` range is used for other EOF opcodes like `CALLF` and `RETF`. The correct values from the specs should be used:
  - `DUPN`: `0xB0`
  - `SWAPN`: `0xB1`
  - `EXCHANGE`: `0xB2`
- **Missing Opcodes**: The prompt mentions `RJUMPV` (0xE2) and `JUMPF` (0xE5).
  - `RJUMPV` is not present in the Prague specs provided. It is part of a separate EIP (EIP-6206) and may not be included in the same hardfork.
  - `JUMPF` (0xE5) is present in the specs and its implementation should be included.
- **Stack Validation**: The `execution-specs` contain a stub for `validate_stack`, indicating it is not yet fully specified. The detailed `CodeValidator` logic in the prompt is a good approach, and the provided spec snippets for `validate_code` and opcode implementations will help integrate it correctly.
- **`JUMPDEST` in `RJUMP`/`RJUMPI`**: The provided `rjump` and `rjumpi` implementations in the specs still validate against `JUMPDEST` (0x5B). This is likely a transitional detail in the specs. In a full EOF implementation, `JUMPDEST` is disallowed, and jump targets are simply validated to be at the beginning of an instruction. The provided code is still valuable for understanding the relative jump calculation.



## GO-ETHEREUM Context

An analysis of the go-ethereum codebase reveals a comprehensive implementation of the EVM Object Format (EOF). The most relevant logic for parsing, validation, and execution of EOF contracts is primarily located in `core/vm/eof.go`. The following snippets are extracted to provide direct guidance for the implementation tasks outlined in the prompt.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// This file contains the implementation of the EVM Object Format (EOF).
// It is based on the following EIPs:
//
// EIP-3540: EOF - EVM Object Format v1
// EIP-3670: EOF - Code Validation
// EIP-4200: EOF - Static relative jumps
// EIP-4750: EOF - Functions
// EIP-5450: EOF - Stack Validation
// EIP-663: SWAPN, DUPN and EXCHANGE instructions
// EIP-7480: EOF - Data section access instructions
// EIP-6206: JUMPFT and JUMPFB instructions
// EIP-7069: Revamped CALLF and RETF instructions
// EIP-7620: EOF - Contract Creation Instructions
//
// The implementation is split into two parts:
// 1. Validation logic: validates that a given bytecode is a valid EOF container.
//    This is done at contract creation time.
// 2. Execution logic: executes EOF contracts. This includes the implementation
//    of the new opcodes and the function call/return semantics.

// EOF-related constants
const (
	EOF_MAGIC   = 0xEF00
	EOF_VERSION = 0x01

	// Section kinds
	terminatorSection = 0x00
	codeSection       = 0x01
	dataSection       = 0x02
	typeSection       = 0x03
	containerSection  = 0x04 // EIP-7620
	headerSize        = 3    // version (1) + kind (1) + size (1)
)

// ...

// ValidateEOF checks if the given code is a valid EOF container.
// If it is, it returns the code segment to be executed. For initcode,
// this is the first code section. For runtime code, this is the code
// at index 0 of the first (and only) container section.
func ValidateEOF(code []byte, isInitcode bool) ([]byte, error) {
	// An EOF contract must at least contain the magic, version, and a terminator section.
	// magic (2) + version (1) + kind (1) + size (2) + kind (1) = 7
	// We check for >= 4 here, because we need to read section kind and size first.
	if len(code) < 4 {
		return nil, ErrInvalidEOF
	}

	// Check magic and version
	if magic := binary.BigEndian.Uint16(code); magic != EOF_MAGIC {
		// Code does not start with EOF magic, not an EOF contract.
		return nil, nil
	}
	if code[2] != EOF_VERSION {
		return nil, ErrUnsupportedEOFVersion
	}
	// EOF code must be validated, but we don't have a jump table here.
	// Creating a throw-away jump table just for this is a bit wasteful,
	// but it's the easiest way to do it.
	jt := NewEOFInstructionSetForTesting()
	return readAndValidateContainer(code, isInitcode, &jt)
}

// readAndValidateContainer reads an EOF container from the given byte slice.
func readAndValidateContainer(code []byte, isInitcode bool, jt *JumpTable) ([]byte, error) {
	container, err := readContainer(code, isInitcode, jt)
	if err != nil {
		return nil, err
	}
	return container.getCodeForExecution(isInitcode)
}

// readContainer reads an EOF container from the given byte slice.
func readContainer(code []byte, isInitcode bool, jt *JumpTable) (*container, error) {
	offset := 3 // Skip magic and version
	c := &container{
		isInitcode: isInitcode,
		code:       code,
		data:       make(map[uint16][]byte),
	}
	var (
		err           error
		kind          byte
		size          uint16
		seenSections  = make(map[byte]bool) // for duplicate section validation
		lastSectionId byte
	)
	for {
		kind, size, err = readSectionHeader(code, offset)
		if err != nil {
			return nil, err
		}
		if kind == terminatorSection {
			if size != 0 {
				return nil, ErrInvalidTerminator
			}
			offset += 1 // only kind, no size
			break
		}
		if seenSections[kind] {
			return nil, ErrDuplicateSection
		}
		seenSections[kind] = true

		if kind < lastSectionId {
			return nil, ErrInvalidSectionOrder
		}
		lastSectionId = kind

		// Now read section content
		offset += 3 // kind (1) + size (2)
		if err = c.readSection(kind, size, code, offset); err != nil {
			return nil, err
		}
		offset += int(size)
	}
	// ... rest of validation ...
	if err := c.validate(jt); err != nil {
		return nil, err
	}
	return c, nil
}

// ...

// validateCode iterates through a single code section and validates each instruction.
func (c *container) validateCode(codeIdx uint16, code []byte, jt *JumpTable) error {
	// ...
	var (
		pc                uint64
		opcode            OpCode
		currentStack      []stackEntry
		currentStackHeight = uint16(c.types[codeIdx].Inputs)
		maxStackHeight    = currentStackHeight
		// ...
	)
	for pc < uint64(len(code)) {
		opcode = OpCode(code[pc])
		// ...
		// Validate instruction and immediate
		pcDelta, err := c.validateInstruction(opcode, pc, code, currentStackHeight, codeIdx)
		if err != nil {
			return err
		}
		// ... 
		// Validate stack
		stack := int(currentStackHeight) - int(opCodeStack[opcode].reclaim) + int(opCodeStack[opcode].result)
		// ... 
		if err := c.validateStack(opcode, &currentStack, codeIdx); err != nil {
			return err
		}
		// ...
	}
	// ...
	return nil
}

// opRJUMP implements RJUMP.
func opRJUMP(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// We read the offset from the bytecode.
	offset := i.readJumpOffset()
	// And set PC to new destination.
	// We need to jump relative to the position *after* the instruction, so we add 2.
	*pc = uint64(int64(*pc) + int64(offset) + 2)
	return nil, nil
}

// opRJUMPI implements RJUMPI.
func opRJUMPI(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// We read the offset from the bytecode.
	offset := i.readJumpOffset()
	cond := s.Pop()
	// If condition is non-zero, we jump. Otherwise, we continue to the next instruction.
	if !cond.IsZero() {
		// We need to jump relative to the position *after* the instruction, so we add 2.
		*pc = uint64(int64(*pc) + int64(offset) + 2)
	}
	return nil, nil
}

// opRJUMPV implements RJUMPV.
func opRJUMPV(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// ...
}

// opCALLF implements CALLF.
func opCALLF(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// We read the function id from the bytecode.
	fid := i.readFunctionId()

	// Push current location to return stack
	i.returnStack.push(returnFrame{pc: *pc + 2, section: i.codeSection})

	// And set PC to new destination.
	i.codeSection = fid
	*pc = 0
	return nil, nil
}

// opRETF implements RETF.
func opRETF(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// Pop from return stack.
	frame, err := i.returnStack.pop()
	if err != nil {
		// RETF from section 0 means we're done.
		if i.codeSection == 0 {
			i.eofDone = true
			return nil, nil
		}
		return nil, err
	}
	// And set PC to new destination.
	i.codeSection = frame.section
	*pc = frame.pc

	return nil, nil
}

// opJUMPF implements JUMPF.
func opJUMPF(pc *uint64, i *Interpreter, s *Stack) ([]byte, error) {
	// ...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a go-ethereum EVM interpreter.
type Interpreter struct {
	// ...
	returnStack returnStack // for EOF
	// ...
}

// returnStack is a stack of return addresses for EOF.
type returnStack struct {
	items []returnFrame
}

// returnFrame is a single frame on the return stack.
type returnFrame struct {
	pc      uint64
	section uint16
}

// ...

// Run loops and executes operations until they are completed or the interpreter
// is stopped.
func (in *Interpreter) Run(code []byte, input []byte, static bool) (ret []byte, err error) {
	// ...
	var (
		op OpCode // current opcode
		// ...
	)
	// Don't think about anything else than just the stack.
	for {
		// ...
		// Get operation from table
		op = OpCode(in.frame.getCode()[pc])
		operation := in.cfg.JumpTable[op]
		// ...
		// if eof, in.frame.code is changed by CALLF/RETF
		var eofCode []byte
		if in.frame.eof {
			eofCode = in.frame.code
		}
		// Execute the operation
		res, err = operation.execute(&pc, in, &in.frame.Stack)
		// ...
		if in.frame.eof {
			// Check if code section was changed, if so, update reference
			if eofCode != in.frame.code {
				code = in.frame.code
			}
		}
		// ...
	}
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// Frame is a frame in the call stack.
type Frame struct {
	// Return stack for functions
	returnStack ReturnStack

	// EVM object format value
	eof         bool
	code        []byte
	codeSection uint16 // only used in eof
	// ...
}

// NewFrame returns a new frame.
func NewFrame(caller, to common.Address, input []byte, gas uint64, value *uint256.Int) *Frame {
	return &Frame{
		// ...
		returnStack: ReturnStack{items: make([]returnFrame, 0, 1024)},
		// ...
	}
}
```
</file>
</go-ethereum>

## Prompt Corrections
The provided Zig implementation sketch is a solid starting point. Based on the go-ethereum implementation, here are some corrections and suggestions for improvement:

1.  **Return Stack Location:** The Zig prompt places the `ReturnStack` inside the `EOFExecutionFrame`. In `go-ethereum`, the `returnStack` is part of the `Interpreter` struct, which is shared across all frames of an execution context. This is a more accurate model, as the return stack should persist across `CALLF`/`RETF` operations within the same top-level call. The `Frame` itself only needs to know the current `code_section` index.
    *   **Recommendation**: Move `return_stack: ReturnStack` from `EOFExecutionFrame` to the top-level `Vm` or a new `Interpreter` struct.

2.  **Opcodes in Separate File**: The prompt organizes opcode implementations in `/src/evm/eof/opcodes.zig`. Go-ethereum's implementation places the execution logic for EOF-specific opcodes (`opRJUMP`, `opCALLF`, etc.) directly in `core/vm/eof.go`. This co-location makes sense because these opcodes heavily rely on the EOF container's context (like the type section and code sections), which is parsed and managed there.
    *   **Recommendation**: Consider implementing the opcode execution functions (`execute_rjump`, etc.) within `/src/evm/eof/execution.zig` or a similar file that has direct access to the `EOFExecutionFrame` and `EOFContainer`, rather than in a separate `opcodes.zig`. This mirrors the clean separation seen in go-ethereum.

3.  **Validation Logic Granularity**: The Zig `CodeValidator` is a good concept. Go-ethereum's `validateCode` function shows a very detailed, instruction-by-instruction validation loop. It explicitly checks for:
    *   Undefined instructions.
    *   Instructions requiring a feature not enabled by the container (e.g. `CALLF` when no type section is present).
    *   Correctness of immediate arguments (e.g., jump destinations must not point into the middle of a `PUSH` instruction's data).
    *   Stack height consistency and bounds.
    *   **Recommendation**: Ensure your `CodeValidator.validate_instruction` is as thorough as go-ethereum's `validateInstruction`, paying close attention to the validation of immediates and terminal instructions.

4.  **Error Handling**: The `go-ethereum/core/vm/eof.go` file defines a comprehensive set of specific errors (e.g., `ErrInvalidTerminator`, `ErrDuplicateSection`, `ErrInvalidRelativeJump`).
    *   **Recommendation**: Adopt a similar, granular error system in `EOFError`. This will make debugging and testing much more effective. Your existing `EOFError` enum is a good start; you can expand it based on the failure cases found in the go-ethereum implementation.

5.  **Newer EOF EIPs**: The prompt correctly identifies several key EOF opcodes. Go-ethereum's implementation also includes opcodes from later EOF EIPs like `RJUMPV` (EIP-4200), `JUMPF` (EIP-4750), `DUPN`, `SWAPN`, and `EXCHANGE` (EIP-663). While not all are required by the prompt's task list, including them would create a more complete and future-proof implementation. The logic for `opDupN`, `opSwapN`, and `opExchange` in `eof.go` would be particularly helpful for Task 2.

---

An analysis of the `go-ethereum` codebase reveals a robust and mature implementation of the EVM Object Format (EOF). The most relevant components for this task are found in `core/vm/`, where EOF parsing, validation, and execution logic are defined.

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
This file is central to EOF support in Geth. It contains the data structures for the EOF container, the parsing logic to decode it, and the comprehensive validation rules required by the EIPs.

**EOF Container Struct & Parsing**
This Go struct is the equivalent of the `EOFContainer` in the prompt. It holds the parsed sections of the EOF bytecode. The `ParseEOF` function is analogous to `EOFContainer.parse` and handles the initial validation of magic bytes, version, and section headers.

```go
// EOF is the EVM Object Format container.
type EOF struct {
	Version     byte
	Code        [][]byte
	Data        []byte
	Types       []EOFType
	CodeSizes   []uint16
	DataSize    uint16
	NumSub      uint16
	Container   []byte // The original raw container, for code hashing purposes.
	codeHashes  []common.Hash
	inputHashes []common.Hash
}

// EOFType represents the type of a code section.
type EOFType struct {
	Inputs  byte
	Outputs byte
	Max     uint16 // Maximum stack height
}

const (
	eofMagic   = 0xef
	eofVersion = 0x01
)

const (
	terminatorSection = iota
	codeSection
	dataSection
	typeSection
)

// ParseEOF consumes a bytecode and checks if it's a valid EOF container.
func ParseEOF(code []byte) (*EOF, error) {
	// ... (initial length checks)

	if code[0] != eofMagic || code[1] != eofVersion {
		return nil, ErrInvalidEOFMagic
	}

	pos := 2
	if code[pos] != typeSection {
		return nil, ErrInvalidSectionOrder
	}
	pos++ // type section id
	
	// ... (parsing type section size and content)

	// Code sections
	numCodeSections := binary.BigEndian.Uint16(code[pos : pos+2])
	pos += 2
	if numCodeSections == 0 {
		return nil, ErrNoCodeSections
	}
	eof.Code = make([][]byte, numCodeSections)
	eof.CodeSizes = make([]uint16, numCodeSections)
	for i := 0; i < int(numCodeSections); i++ {
		// ... (parse each code section size and content)
	}

	// Data section
	if code[pos] != dataSection {
		return nil, ErrInvalidSectionOrder
	}
	pos++ // data section id
	// ... (parse data section size and content)
	
	// Terminator
	if pos >= len(code) || code[pos] != terminatorSection {
		return nil, ErrInvalidTerminator
	}
	// ...
	return &eof, nil
}
```

**EOF Validation**
The `validateEOF` function orchestrates the entire validation process, calling `validateEOFCode` for each code section. This is the Go equivalent of the `validate` and `validate_code_section` functions in the prompt. It checks for structural integrity, valid opcodes, and correct stack behavior.

```go
// validateEOF validates the given EOF container.
func validateEOF(eof *EOF, rules params.Rules) error {
	// ... (various structural checks) ...

	// Validate individual code sections.
	for i, code := range eof.Code {
		if len(code) == 0 {
			return fmt.Errorf("code #%d: empty", i)
		}
		if len(code) > params.MaxCodeSize {
			return fmt.Errorf("code #%d: exceeds max code size %d", i, params.MaxCodeSize)
		}
		if err := validateEOFCode(code, eof.Types[i], eof, rules); err != nil {
			return fmt.Errorf("code #%d: %w", i, err)
		}
	}
	return nil
}

// validateEOFCode validates a single code section.
func validateEOFCode(code []byte, eofType EOFType, eof *EOF, rules params.Rules) error {
	opCodeValidation := eofValidationTable(rules)
	maxStack := int(eofType.Inputs)
	currentStack := maxStack

	for pc := 0; pc < len(code); {
		op := OpCode(code[pc])
		opInfo := opCodeValidation[op]

		if !opInfo.isDefined {
			return fmt.Errorf("undefined opcode 0x%x at %d", op, pc)
		}
		// Check stack requirements
		if currentStack < int(opInfo.requiredStack) {
			return fmt.Errorf("stack underflow at %d", pc)
		}
		// Adjust stack height
		currentStack -= int(opInfo.requiredStack)
		currentStack += int(opInfo.returnedStack)

		if currentStack > int(eofType.Max) {
			return fmt.Errorf("stack overflow at %d, %d > %d", pc, currentStack, eofType.Max)
		}
		if currentStack > maxStack {
			maxStack = currentStack
		}
		// ... (opcode-specific validation for RJUMP, RJUMPI, CALLF) ...

		pc += opInfo.size
	}
	// ... (final stack height check) ...
	return nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
The interpreter implements the execution logic for each opcode. For EOF, the most relevant parts are the new opcode implementations and the modifications to the interpreter loop to handle the EOF context.

**New Opcode Implementations (RJUMP, CALLF, RETF)**
These functions show how the new EOF control flow opcodes are implemented. They interact with the `returnStack` and modify the program counter (`pc`) and the current code section index (`frame.codeSection`).

```go
func opRjump(pc *uint64, i *Interpreter, scope *ScopeContext) ([]byte, error) {
	offset := i.getCode16(1)
	*pc = uint64(int64(*pc) + 3 + int64(int16(offset)))
	return nil, nil
}

func opRjumpi(pc *uint64, i *Interpreter, scope *ScopeContext) ([]byte, error) {
	cond := scope.Stack.peek()
	if !cond.IsZero() {
		offset := i.getCode16(1)
		*pc = uint64(int64(*pc) + 3 + int64(int16(offset)))
	} else {
		*pc += 3
	}
	scope.Stack.pop()
	return nil, nil
}

func opCallF(pc *uint64, i *Interpreter, scope *ScopeContext) ([]byte, error) {
	codeIndex := i.getCode16(1)
	targetType := scope.eof.Types[codeIndex]

	if scope.Stack.len() < int(targetType.Inputs) {
		return nil, errStackUnderflow
	}
	if err := i.returnStack.push(i.frame.codeSection, uint16(*pc+3)); err != nil {
		return nil, err
	}
	i.frame.codeSection = uint16(codeIndex)
	*pc = 0
	return nil, nil
}

func opRetF(pc *uint64, i *Interpreter, scope *ScopeContext) ([]byte, error) {
	returnPC, returnSection, err := i.returnStack.pop()
	if err != nil {
		return nil, err
	}
	currentType := scope.eof.Types[i.frame.codeSection]
	if scope.Stack.len() < int(currentType.Outputs) {
		return nil, errStackUnderflow
	}

	*pc = uint64(returnPC)
	i.frame.codeSection = returnSection
	return nil, nil
}
```

**Interpreter Frame with EOF Context**
The `Interpreter` and `Frame` structs are augmented with fields to manage the EOF execution state, such as the `returnStack`, the parsed `eof` object, and the current `codeSection`.

```go
// Interpreter is a recurring state object tied to the execution of a single
// contract.
type Interpreter struct {
	// ... (existing fields)
	returnStack *returnStack
	frame       *Frame // Current execution frame
}

// Frame represents a frame on the EVM call stack. A new frame is created for
// every contract invocation.
type Frame struct {
	// ... (existing fields)

	// EOF-related fields
	eof         *EOF   // a pointer to the EOF container of the contract. It's nil for non-EOF contracts
	codeSection uint16 // current executing code section index
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/return_stack.go">
This file provides a dedicated implementation for the `returnStack`, a critical component for handling `CALLF`/`RETF`. This directly corresponds to the `ReturnStack` struct in the prompt.

```go
// returnStack is a stack of return addresses for CALLF/RETF.
type returnStack struct {
	data []returnFrame
}

type returnFrame struct {
	pc      uint16
	section uint16
}

// newReturnStack creates a new return stack.
func newReturnStack() *returnStack {
	return &returnStack{data: make([]returnFrame, 0, 16)}
}

// push pushes a return address to the stack.
func (s *returnStack) push(section, pc uint16) error {
	if len(s.data) >= 1024 {
		return errReturnStackOverflow
	}
	s.data = append(s.data, returnFrame{pc: pc, section: section})
	return nil
}

// pop pops a return address from the stack.
func (s *returnStack) pop() (pc, section uint16, err error) {
	if len(s.data) == 0 {
		return 0, 0, errReturnStackUnderflow
	}
	last := s.data[len(s.data)-1]
	s.data = s.data[:len(s.data)-1]
	return last.pc, last.section, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
This file shows how the top-level EVM integrates EOF logic, particularly for contract creation, which has different semantics than legacy EVM.

**EOF Contract Creation**
The `Create` function demonstrates the special handling for EOF contracts. Notably, for EOF, the *entire original container* is stored as the contract's code, not the return value of the init code. This is a critical distinction.

```go
// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (address calculation and value transfer)

	// EOF contract creation
	if len(code) > 2 && code[0] == eofMagic && code[1] == eofVersion {
		eof, err := ParseEOF(code)
		if err != nil {
			return nil, common.Address{}, gas, err
		}
		if err := validateEOF(eof, evm.chainRules); err != nil {
			return nil, common.Address{}, gas, err
		}
		// EOF contract is valid, run initcode
		_, _, leftOverGas, err = evm.interpreter.Run(eof, nil, gas)
		if err != nil {
			return nil, common.Address{}, leftOverGas, err
		}
		// For EOF, the code to be stored is the original container.
		evm.StateDB.SetCode(contractAddr, code)
		return nil, contractAddr, leftOverGas, nil
	}

	// Legacy contract creation...
	// ... (execute init code)
	// The return value of the init code is the contract's code
	evm.StateDB.SetCode(contractAddr, ret)

	return ret, contractAddr, leftOverGas, nil
}
```
</file>

## Prompt Corrections
The provided prompt is an excellent and detailed starting point. The `go-ethereum` implementation offers a few refinements and clarifications that would be valuable context:

1.  **EOF Container Storage**: A critical point missed in the prompt's `deploy_eof_contract` logic is that for EOF contracts, the *entire EOF container* (the original `bytecode` passed to `CREATE`) is stored on-chain, not the output of the initcode execution. Geth's `Create` function correctly reflects this. The initcode in EOF (`code_section` 0) is only for deployment-time logic and does not return the runtime code.

2.  **Execution Context Management**: The prompt suggests adding an `eof_frame` to the main `Frame`. Geth's approach is slightly different and arguably cleaner: it adds `eof *EOF` and `codeSection uint16` fields directly to its `Frame` struct. This avoids an extra layer of indirection. The interpreter's main loop then uses `frame.codeSection` to select the correct bytecode slice from `frame.eof.Code` to execute. This is a more efficient way to handle function calls within the same contract context.

3.  **Stack Validation Nuances**: The prompt's `CodeValidator` correctly identifies the need for stack validation. The `go-ethereum` implementation (`validateEOFCode`) reveals more detailed requirements:
    *   Validation must be performed for *every* code section.
    *   Opcodes like `CALLF` have stack effects that depend on the `EOFType` of the target function, which must be looked up during validation. The validator needs access to the full `EOF` object to do this correctly.
    *   The validation must not only check for underflow but also ensure the `max_stack` height declared in the type section is never exceeded.

4.  **Return Stack**: The prompt correctly models a `ReturnStack`. The `go-ethereum` implementation in `core/vm/return_stack.go` is a good, simple reference. It's crucial to note that this stack is separate from the main operand stack and is only used for `CALLF`/`RETF` control flow.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// MagicEOF is the first two bytes of an EOF container.
	MagicEOF = 0xef00

	// LatestEOFVersion is the latest supported EOF version.
	LatestEOFVersion = 1
)

// Section kinds for EOF.
const (
	terminatorSectionKind = 0
	codeSectionKind       = 1
	dataSectionKind       = 2
	typeSectionKind       = 3
	containerSectionKind  = 4
)
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// ValidateEOF validates the given code as EOF-1 bytecode.
// The code is incomplete and will be fleshed out as EOF progresses.
//
// Ref: EIP-3540 EVM Object Format (EOF) v1
// Ref: EIP-3670 EOF - Code Validation
// Ref: EIP-4200 EOF - Static-relative Jumps
// Ref: EIP-4750 EOF - Functions
// Ref: EIP-5450 EOF - Stack Validation
// Ref: EIP-6206 EOF - JUMPF and CALLF
// Ref: EIP-7069 EOF - Revamped CALL instructions
// Ref: EIP-7480 EOF - Data section access instructions
// Ref: EIP-7620 EOF - Creation Transaction
func ValidateEOF(code []byte) error {
	// A new contract must be at least large enough to have a magic, version,
	// at least one section kind (terminator) and data size.
	if len(code) < 4 {
		return ErrInvalidEOFCode
	}
	// Validate magic and version.
	if code[0] != 0xEF || code[1] != 0x00 || code[2] != 0x01 {
		return ErrInvalidEOFCode
	}
	// EOF code must not be empty, must have a code section and a terminator.
	if len(code) <= 4 {
		return ErrInvalidEOFCode
	}
	// Parse the header and validate its correctness.
	eof, err := parseEOFHeader(code)
	if err != nil {
		return err
	}

	// Validate the container as a whole. The various EIPs specify a set of rules
	// for the container.
	if err := eof.validateContainer(); err != nil {
		return err
	}

	// Validate each code section individually.
	for i, code := range eof.code {
		if err := eof.validateCode(uint16(i), code); err != nil {
			return err
		}
	}
	return nil
}

// EOF is a parsed EOF-formatted bytecode.
type EOF struct {
	// Raw EOF bytecode.
	raw []byte

	// EOF version.
	version byte

	// Section sizes.
	typeSize   uint16
	codeSizes  []uint16
	dataSize   uint16
	numSub     uint16 // Number of sub-containers.
	totalSize  uint16 // Total size of all sections.
	headerSize uint16

	// Section contents.
	types []Type // Parsed types section.
	code  [][]byte
	data  []byte
}

// Type represents a single function type from the types section.
type Type struct {
	Inputs  byte
	Outputs byte
}

// parseEOFHeader parses the header of an EOF container and returns a partially
// initialized EOF object. It assumes the magic and version have been already
// validated by the caller.
func parseEOFHeader(code []byte) (*EOF, error) {
	eof := &EOF{
		raw:     code,
		version: code[2],
	}
	pos := 3 // Current position in the code, after magic and version

	// Loop over the section headers and parse them. The section data itself is
	// not accessed at this point.
	for {
		// Ensure there's a section kind. A well formed EOF must have a terminator
		// section, so this will be hit at least once.
		if len(code) <= pos {
			return nil, ErrInvalidEOFCode
		}
		kind := code[pos]
		pos++

		if kind == terminatorSectionKind {
			break
		}
		// Any non-terminator section requires a size.
		if len(code) <= pos+1 {
			return nil, ErrInvalidEOFCode
		}
		size := binary.BigEndian.Uint16(code[pos:])
		pos += 2

		switch kind {
		case typeSectionKind:
			if eof.typeSize != 0 {
				return nil, ErrDuplicateSection
			}
			if len(eof.codeSizes) > 0 || eof.dataSize > 0 || eof.numSub > 0 {
				return nil, ErrInvalidSectionOrder
			}
			if size == 0 {
				return nil, ErrInvalidTypeSectionSize
			}
			if int(size)%2 != 0 {
				return nil, ErrInvalidTypeSectionSize
			}
			eof.typeSize = size

		case codeSectionKind:
			if eof.dataSize > 0 || eof.numSub > 0 {
				return nil, ErrInvalidSectionOrder
			}
			if size == 0 {
				return nil, ErrInvalidCodeSectionSize
			}
			eof.codeSizes = append(eof.codeSizes, size)

		case dataSectionKind:
			if eof.dataSize != 0 {
				return nil, ErrDuplicateSection
			}
			if eof.numSub > 0 {
				return nil, ErrInvalidSectionOrder
			}
			if size == 0 {
				return nil, ErrInvalidDataSectionSize
			}
			eof.dataSize = size

		case containerSectionKind:
			return nil, ErrUnsupportedSection
		default:
			return nil, ErrUnknownSection
		}
	}
	// Final checks on the parsed headers.
	if len(eof.codeSizes) == 0 {
		return nil, ErrMissingCodeSection
	}
	// Calculate the total size of all sections and check against the code length.
	totalSize := uint32(eof.typeSize) + uint32(eof.dataSize)
	for _, size := range eof.codeSizes {
		totalSize += uint32(size)
	}
	if totalSize > uint32(len(code)) {
		return nil, ErrInvalidEOFCode // Should not be reachable
	}
	eof.totalSize = uint16(totalSize)

	// After the section headers, we should have the exact amount of bytes for the
	// section contents.
	eof.headerSize = uint16(pos)
	if uint32(len(code)) != uint32(eof.headerSize)+totalSize {
		return nil, ErrInvalidEOFCode
	}
	// Header parsing finished, slice up the data sections.
	// Types section
	if eof.typeSize > 0 {
		types, err := parseTypes(code[pos : pos+int(eof.typeSize)])
		if err != nil {
			return nil, err
		}
		eof.types = types
	}
	pos += int(eof.typeSize)

	// Code sections
	for _, size := range eof.codeSizes {
		eof.code = append(eof.code, code[pos:pos+int(size)])
		pos += int(size)
	}
	// Data section
	eof.data = code[pos : pos+int(eof.dataSize)]

	return eof, nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof_validation.go">
```go
// validateContainer validates the EOF container against the rules defined by the
// various EIPs. It assumes the header has already been parsed.
func (eof *EOF) validateContainer() error {
	if eof.typeSize > 0 {
		// EIP-4750: The number of type sections must match the number of code sections.
		if len(eof.types) != len(eof.codeSizes) {
			return ErrTypeSectionMissing
		}
	} else {
		// EIP-4750: Type section must be present for code with more than 1 sections.
		if len(eof.codeSizes) > 1 {
			return ErrTypeSectionMissing
		}
	}
	return nil
}

// codeValidation is a helper struct for validating a single EOF code section.
type codeValidation struct {
	eof  *EOF
	code []byte

	// Jump destinations analysis results.
	jumpdests bitvec
	immediates bitvec
}

// validateCode validates a single code section against the rules defined by the
// various EIPs.
func (eof *EOF) validateCode(i uint16, code []byte) error {
	// Run a cheap analysis of the code first to find jump destinations and immediate
	// arguments. This is needed because some validation rules depend on these.
	jumpdests, immediates, err := analyzeCode(code)
	if err != nil {
		return err
	}

	// With the basic analysis done, create a validation context and check the code.
	v := &codeValidation{
		eof:        eof,
		code:       code,
		jumpdests:  jumpdests,
		immediates: immediates,
	}
	return v.validate()
}

// validate runs the main validation loop over the bytecode.
func (v *codeValidation) validate() error {
	var (
		op  OpCode
		pos uint32
	)
	for pos < uint32(len(v.code)) {
		op = OpCode(v.code[pos])

		// Validate the instruction itself.
		if err := v.validateInstruction(op, pos); err != nil {
			return err
		}
		// Move to the next instruction.
		if op.isPush() {
			pos += uint32(op) - uint32(PUSH1) + 2
		} else {
			pos++
		}
	}
	// Validate that the code ends with a terminating instruction.
	if !op.isTerminating() {
		return ErrUnterminatedCode
	}
	// Validate stack consistency across the entire code.
	return v.validateStack()
}

// validateInstruction validates a single instruction at a given position.
func (v *codeValidation) validateInstruction(op OpCode, pos uint32) error {
	// EIP-3540: Undefined instructions are disallowed.
	if !op.defined() {
		return errUndefinedInstruction
	}
	// EIP-3540: Truncated PUSH instruction data.
	if op.isPush() {
		size := uint32(op) - uint32(PUSH1) + 1
		if pos+1+size > uint32(len(v.code)) {
			return ErrTruncatedPush
		}
	}
	// EIP-4200: All RJUMP and RJUMPI instructions must have valid jump destinations.
	if op == RJUMP || op == RJUMPI {
		return v.validateRJump(pos)
	}
	// EIP-4750: All CALLF instructions must refer to a valid function.
	if op == CALLF {
		return v.validateCallF(pos)
	}
	return nil
}


// validateRJump validates a relative jump instruction at a given position.
func (v *codeValidation) validateRJump(pos uint32) error {
	// EIP-4200: Truncated relative jump offset.
	if pos+2 >= uint32(len(v.code)) {
		return ErrTruncatedRJump
	}
	// EIP-4200: Relative jumps must not be inside immediate data.
	// Note, no need to check for pos, it's never immediate data due to the outer loop.
	if v.immediates.isSet(pos + 1) {
		return ErrImmediateAsOffset
	}
	if v.immediates.isSet(pos + 2) {
		return ErrImmediateAsOffset
	}
	// EIP-4200: Relative jump destinations must point to a valid instruction.
	offset := int32(binary.BigEndian.Uint16(v.code[pos+1:]))
	if offset > 0x7fff {
		offset = offset - 0x10000
	}
	dest := int64(pos) + 3 + int64(offset)

	if dest < 0 || dest >= int64(len(v.code)) || v.immediates.isSet(uint(dest)) {
		return ErrInvalidRJumpDestination
	}
	return nil
}

// validateCallF validates a CALLF instruction at a given position.
func (v *codeValidation) validateCallF(pos uint32) error {
	// EIP-4750: Truncated CALLF instruction data.
	if pos+2 >= uint32(len(v.code)) {
		return ErrTruncatedCallF
	}
	// EIP-4750: CALLF must refer to a valid code section.
	id := binary.BigEndian.Uint16(v.code[pos+1:])
	if int(id) >= len(v.eof.code) {
		return ErrInvalidCodeSection
	}
	return nil
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// Interpreter is a recurring instance of the EVM. It can be used to execute code
// on a given state database.
//
// The Interpreter should not be reused for different transactions.
type Interpreter struct {
	// ... (other fields)

	// EOF related fields
	eof           bool     // Whether the contract is an EOF contract
	eofContainer  *EOF     // Parsed EOF container
	eofReturnPC   uint64   // Return PC for the current EOF function
	eofReturnSect uint16   // Return section for the current EOF function
	eofReturnSP   int      // Return stack pointer for the current EOF function
	returnStack   []uint64 // Return stack for EOF function calls
}
// ...

// Run loops and evaluates the contract's code with the given input data and returns
// the return byte-slice and an error if one occurred.
//
// It's important to note that any errors returned by the interpreter are
// indicative of computer exceptional behavior and should be considered private
// internal bug triggering mechanisms. They should never be exposed to users of
// an Ethereum client.
func (in *Interpreter) Run(code []byte, input []byte, static bool) (ret []byte, err error) {
	// ... (setup logic)

	// Check if the code is EOF.
	in.eof = len(code) >= 2 && code[0] == 0xef && code[1] == 0

	// If the code is EOF, validate and parse it.
	if in.eof {
		// ... (initial validation)
		if err = ValidateEOF(code); err != nil {
			return nil, err
		}
		// Don't need to parse immediately, only when CALLF happens
	}
	// ... (main execution loop)
}

// function call/return for EOF
func (in *Interpreter) callF(section uint16) error {
	// EIP-4750: Call stack size check
	if len(in.returnStack) > 1022 { // 1023 because we need space for pc, section and sp
		return ErrDepth
	}

	// Load the called function's type data
	calledType := in.eofContainer.types[section]
	callerType := in.eofContainer.types[in.contract.eofCodeSection]

	// Stack validation. This is also covered by deploy-time validation but let's
	// be defensive against buggy validators and state corruptions.
	if in.stack.len() < int(calledType.Inputs) {
		return ErrStackUnderflow
	}

	// Update the return stack
	in.returnStack = append(in.returnStack, in.eofReturnPC)
	in.returnStack = append(in.returnStack, uint64(in.eofReturnSect))
	in.returnStack = append(in.returnStack, uint64(in.eofReturnSP))
	// Set the new return context
	in.eofReturnPC = in.pc() + 2
	in.eofReturnSect = in.contract.eofCodeSection
	in.eofReturnSP = in.stack.len() - int(calledType.Inputs) + int(callerType.Outputs)

	// Set the new program counter and code section
	in.contract.Code = in.eofContainer.code[section]
	in.contract.eofCodeSection = section
	in.pc = &in.contract.Code[0]

	return nil
}

func (in *Interpreter) retF() error {
	// EIP-4750: return stack check
	if len(in.returnStack) < 3 {
		return ErrInvalidJump // RETF from top-level
	}

	// The stack must have the exact number of values the function promised to
	// return. This is also checked by deploy-time validation.
	// EIP-4750: Stack height check
	callerType := in.eofContainer.types[in.eofReturnSect]
	currentType := in.eofContainer.types[in.contract.eofCodeSection]
	if in.stack.len() != in.eofReturnSP-int(callerType.Outputs)+int(currentType.Outputs) {
		return ErrStackUnderflow
	}
	// Pop return context from the stack
	retSP := in.returnStack[len(in.returnStack)-1]
	retSect := in.returnStack[len(in.returnStack)-2]
	retPC := in.returnStack[len(in.returnStack)-3]
	in.returnStack = in.returnStack[:len(in.returnStack)-3]

	// Restore the return context
	in.eofReturnPC = in.returnStack[len(in.returnStack)-3]
	in.eofReturnSect = uint16(in.returnStack[len(in.returnStack)-2])
	in.eofReturnSP = int(in.returnStack[len(in.returnStack)-1])

	// Set the new program counter and code section
	in.contract.Code = in.eofContainer.code[retSect]
	in.contract.eofCodeSection = uint16(retSect)
	in.pc = &in.contract.Code[retPC]

	return nil
}

```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go">
```go
func opRJump(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// opRJump is a static jump, no need to check validity. It's already been
	// checked at deploy time.
	offset := int16(binary.BigEndian.Uint16(contract.Code[*pc+1:]))
	*pc += 3 + uint64(offset)
	return nil, nil
}

func opRJumpI(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	cond := stack.pop()
	if !cond.IsZero() {
		offset := int16(binary.BigEndian.Uint16(contract.Code[*pc+1:]))
		*pc += 3 + uint64(offset)
	} else {
		*pc += 3
	}
	return nil, nil
}

func opCallF(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// The section to be called. This has already been validated at deploy-time.
	section := binary.BigEndian.Uint16(contract.Code[*pc+1:])

	// Gas cost is already paid as part of the opcode fee. The interpreter will
	// handle the stack changes and the actual jump.
	err := evm.interpreter.callF(section)

	// Note: callF handles the PC change.
	return nil, err
}

func opRetF(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Gas cost is already paid as part of the opcode fee. The interpreter will
	// handle the stack changes and the actual jump.
	err := evm.interpreter.retF()

	// Note: retF handles the PC change.
	return nil, err
}
```
</file>

<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (depth and balance checks)

	// Create a new account on the state
	nonce := evm.StateDB.GetNonce(caller.Address())
	evm.StateDB.SetNonce(caller.Address(), nonce+1)

	// Check whether the code is EOF code.
	isEOF := len(code) >= 2 && code[0] == 0xef && code[1] == 0

	var (
		contractCode []byte
		contractHash common.Hash
	)
	if isEOF {
		// Validate and transform the EOF code.
		if err := ValidateEOF(code); err != nil {
			return nil, common.Address{}, gas, err
		}
		// If the initcode is valid EOF, the deployed code is the initcode itself.
		// No execution is needed, just validation. This is a significant change
		// from legacy EVM.
		// EIP-3540: EOF contract creation does not execute init-code.
		contractCode = code
	} else {
		// Legacy contract creation.
		// ... (execute init code)
	}
	// ... (gas calculation for code storage)
	
	// Create the contract account with the code and hash.
	contractAddr = crypto.CreateAddress(caller.Address(), nonce)
	evm.StateDB.SetCode(contractAddr, contractCode)
	// ...
	return ret, contractAddr, gas, err
}
```
</file>

## Prompt Corrections
The original prompt is excellent and very detailed. The Zig code stubs are well-structured and provide a great starting point. Here are a few minor clarifications and suggestions based on the go-ethereum implementation which represents the official specification:

1.  **Deployment Logic:** The `Vm::deploy_eof_contract` in the prompt seems to imply that it will execute initcode and then store the result. However, as per EIP-3540, EOF contract creation is different:
    *   The `code` passed to a `CREATE` transaction *is* the final EOF container to be deployed.
    *   It is **validated** at deployment, but **not executed**.
    *   The Zig implementation should be updated to skip the execution step for EOF contracts and directly store the validated bytecode. The `go-ethereum/core/vm/evm.go` snippet confirms this behavior.

2.  **Stack Validation Nuances:** The prompt's static validator is a good start, but a robust implementation needs to handle control flow more precisely. The `go-ethereum/core/vm/eof_validation.go` logic is more sophisticated. Key takeaways for the Zig implementation:
    *   Validation should be performed on a per-function (per-code-section) basis.
    *   The validator needs to analyze all possible execution paths within a function. When a branch occurs (e.g., `RJUMPI`), both the "jump" and "fall-through" paths must be analyzed.
    *   The stack state (height and types) must be consistent at all join points (e.g., a `JUMPDEST` that can be reached from multiple locations). This requires a more complex analysis than a simple linear scan.
    *   The `go-ethereum` `codeValidation` struct uses `bitvec` to mark jump destinations and immediate data *before* the main validation pass, which is a good pattern to follow.

3.  **CALLF/RETF and the Return Stack:**
    *   The prompt correctly identifies the need for a new `ReturnStack`.
    *   In `go-ethereum`, `callF` pushes the return PC, the *return section index*, and the *return stack pointer* (`eofReturnSP`) onto its `returnStack`. The `eofReturnSP` is crucial for validating that the called function (`CALLF`) returns with the correct number of items on the stack for the caller to consume. The Zig implementation should be sure to include this stack pointer in its return stack frames.

4.  **Forbidden Opcodes:** The validation logic must explicitly forbid legacy opcodes like `JUMP`, `JUMPI`, and `JUMPDEST`. The `go-ethereum/core/vm/eof_validation.go` file will have checks for these that can be used as a reference.

5.  **New Opcodes:** The prompt includes `RJUMPV`, `JUMPF`, `DUPN`, `SWAPN`, and `EXCHANGE`. While `RJUMP`, `RJUMPI`, `CALLF`, and `RETF` are the most critical for core EOF support, the others are part of subsequent or related EIPs. It's good to be aware that a complete implementation will eventually need them, but focusing on the core set first is a sound strategy.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// Container is an EOF container object.
type Container struct {
	types             []*functionMetadata
	codeSections      [][]byte
	subContainers     []*Container
	subContainerCodes [][]byte
	data              []byte
	dataSize          int // might be more than len(data)
}

// functionMetadata is an EOF function signature.
type functionMetadata struct {
	inputs         uint8
	outputs        uint8
	maxStackHeight uint16
}

// UnmarshalBinary decodes an EOF container.
func (c *Container) UnmarshalBinary(b []byte, isInitcode bool) error {
	return c.unmarshalContainer(b, isInitcode, true)
}

func (c *Container) unmarshalContainer(b []byte, isInitcode bool, topLevel bool) error {
	if !hasEOFMagic(b) {
		return fmt.Errorf("%w: want %x", errInvalidMagic, eofMagic)
	}
	if len(b) < 14 {
		return io.ErrUnexpectedEOF
	}
	if len(b) > params.MaxInitCodeSize {
		return ErrMaxCodeSizeExceeded
	}
	if !isEOFVersion1(b) {
		return fmt.Errorf("%w: have %d, want %d", errInvalidVersion, b[2], eof1Version)
	}

	var (
		kind, typesSize, dataSize int
		codeSizes                 []int
		err                       error
	)

	// Parse type section header.
	kind, typesSize, err = parseSection(b, offsetTypesKind)
	if err != nil {
		return err
	}
	if kind != kindTypes {
		return fmt.Errorf("%w: found section kind %x instead", errMissingTypeHeader, kind)
	}
	if typesSize < 4 || typesSize%4 != 0 {
		return fmt.Errorf("%w: type section size must be divisible by 4, have %d", errInvalidTypeSize, typesSize)
	}
	if typesSize/4 > 1024 {
		return fmt.Errorf("%w: type section must not exceed 4*1024, have %d", errInvalidTypeSize, typesSize)
	}

	// Parse code section header.
	kind, codeSizes, err = parseSectionList(b, offsetCodeKind)
	if err != nil {
		return err
	}
	if kind != kindCode {
		return fmt.Errorf("%w: found section kind %x instead", errMissingCodeHeader, kind)
	}
	if len(codeSizes) != typesSize/4 {
		return fmt.Errorf("%w: mismatch of code sections found and type signatures, types %d, code %d", errInvalidCodeSize, typesSize/4, len(codeSizes))
	}

	// Parse (optional) container section header.
	var containerSizes []int
	offset := offsetCodeKind + 2 + 2*len(codeSizes) + 1
	if offset < len(b) && b[offset] == kindContainer {
		kind, containerSizes, err = parseSectionList(b, offset)
		if err != nil {
			return err
		}
		if kind != kindContainer {
			panic("somethings wrong")
		}
		if len(containerSizes) == 0 {
			return fmt.Errorf("%w: total container count must not be zero", errInvalidContainerSectionSize)
		}
		offset = offset + 2 + 2*len(containerSizes) + 1
	}

	// Parse data section header.
	kind, dataSize, err = parseSection(b, offset)
	if err != nil {
		return err
	}
	if kind != kindData {
		return fmt.Errorf("%w: found section %x instead", errMissingDataHeader, kind)
	}
	c.dataSize = dataSize

	// Check for terminator.
	offsetTerminator := offset + 3
	if len(b) < offsetTerminator {
		return fmt.Errorf("%w: invalid offset terminator", io.ErrUnexpectedEOF)
	}
	if b[offsetTerminator] != 0 {
		return fmt.Errorf("%w: have %x", errMissingTerminator, b[offsetTerminator])
	}
	...
	// Parse types section.
	idx := offsetTerminator + 1
	var types = make([]*functionMetadata, 0, typesSize/4)
	for i := 0; i < typesSize/4; i++ {
		sig := &functionMetadata{
			inputs:         b[idx+i*4],
			outputs:        b[idx+i*4+1],
			maxStackHeight: binary.BigEndian.Uint16(b[idx+i*4+2:]),
		}
		...
		types = append(types, sig)
	}
	...
	c.types = types

	// Parse code sections.
	idx += typesSize
	codeSections := make([][]byte, len(codeSizes))
	for i, size := range codeSizes {
		if size == 0 {
			return fmt.Errorf("%w for section %d: size must not be 0", errInvalidCodeSize, i)
		}
		codeSections[i] = b[idx : idx+size]
		idx += size
	}
	c.codeSections = codeSections
	...
	//Parse data section.
	end := len(b)
	if !isInitcode {
		end = min(idx+dataSize, len(b))
	}
	if topLevel && len(b) != idx+dataSize {
		return errTruncatedTopLevelContainer
	}
	c.data = b[idx:end]

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof_validation.go">
```go
// ValidateCode validates each code section of the container against the EOF v1
// rule set.
func (c *Container) ValidateCode(jt *JumpTable, isInitCode bool) error {
	refBy := notRefByEither
	if isInitCode {
		refBy = refByEOFCreate
	}
	return c.validateSubContainer(jt, refBy)
}

func (c *Container) validateSubContainer(jt *JumpTable, refBy int) error {
	visited := make(map[int]struct{})
	subContainerVisited := make(map[int]int)
	toVisit := []int{0}
	for len(toVisit) > 0 {
		...
		var (
			index = toVisit[0]
			code  = c.codeSections[index]
		)
		if _, ok := visited[index]; !ok {
			res, err := validateCode(code, index, c, jt, refBy == refByEOFCreate)
			if err != nil {
				return err
			}
			visited[index] = struct{}{}
			// Mark all sections that can be visited from here.
			for idx := range res.visitedCode {
				if _, ok := visited[idx]; !ok {
					toVisit = append(toVisit, idx)
				}
			}
			...
		}
		toVisit = toVisit[1:]
	}
	// Make sure every code section is visited at least once.
	if len(visited) != len(c.codeSections) {
		return errUnreachableCode
	}
	for idx, container := range c.subContainers {
		...
		if err := container.validateSubContainer(jt, reference); err != nil {
			return err
		}
	}
	return nil
}

// validateCode validates the code parameter against the EOF v1 validity requirements.
func validateCode(code []byte, section int, container *Container, jt *JumpTable, isInitCode bool) (*validationResult, error) {
	...
	// This loop visits every single instruction and verifies:
	// * if the instruction is valid for the given jump table.
	// * if the instruction has an immediate value, it is not truncated.
	// * if performing a relative jump, all jump destinations are valid.
	// * if changing code sections, the new code section index is valid and
	//   will not cause a stack overflow.
	for i < len(code) {
		count++
		op = OpCode(code[i])
		if jt[op].undefined {
			return nil, fmt.Errorf("%w: op %s, pos %d", errUndefinedInstruction, op, i)
		}
		size := int(immediates[op])
		if size != 0 && len(code) <= i+size {
			return nil, fmt.Errorf("%w: op %s, pos %d", errTruncatedImmediate, op, i)
		}
		switch op {
		case RJUMP, RJUMPI:
			if err := checkDest(code, &analysis, i+1, i+3, len(code)); err != nil {
				return nil, err
			}
		...
		case CALLF:
			arg, _ := parseUint16(code[i+1:])
			if arg >= len(container.types) {
				return nil, fmt.Errorf("%w: arg %d, last %d, pos %d", errInvalidSectionArgument, arg, len(container.types), i)
			}
			if container.types[arg].outputs == 0x80 {
				return nil, fmt.Errorf("%w: section %v", errInvalidCallArgument, arg)
			}
			if visitedCode == nil {
				visitedCode = make(map[int]struct{})
			}
			visitedCode[arg] = struct{}{}
		...
		}
		i += size + 1
	}
	// Code sections may not "fall through" and require proper termination.
	// Therefore, the last instruction must be considered terminal or RJUMP.
	if !terminals[op] && op != RJUMP {
		return nil, fmt.Errorf("%w: end with %s, pos %d", errInvalidCodeTermination, op, i)
	}
	if paths, err := validateControlFlow(code, section, container.types, jt); err != nil {
		return nil, err
	} else if paths != count {
		// TODO(matt): return actual position of unreachable code
		return nil, errUnreachableCode
	}
	...
}

// checkDest parses a relative offset at code[0:2] and checks if it is a valid jump destination.
func checkDest(code []byte, analysis *bitvec, imm, from, length int) error {
	if len(code) < imm+2 {
		return io.ErrUnexpectedEOF
	}
	if analysis != nil && *analysis == nil {
		*analysis = eofCodeBitmap(code)
	}
	offset := parseInt16(code[imm:])
	dest := from + offset
	if dest < 0 || dest >= length {
		return fmt.Errorf("%w: out-of-bounds offset: offset %d, dest %d, pos %d", errInvalidJumpDest, offset, dest, imm)
	}
	if !analysis.codeSegment(uint64(dest)) {
		return fmt.Errorf("%w: offset into immediate: offset %d, dest %d, pos %d", errInvalidJumpDest, offset, dest, imm)
	}
	return nil
}

func validateControlFlow(code []byte, section int, metadata []*functionMetadata, jt *JumpTable) (int, error) {
	...
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof_instructions.go">
```go
// opRjump implements the RJUMP opcode.
func opRjump(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	offset := parseInt16(scope.Contract.Code[*pc+1:])
	*pc += uint64(offset)
	return nil, nil
}

// opRjumpi implements the RJUMPI opcode
func opRjumpi(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	cond := scope.Stack.pop()
	if !cond.IsZero() {
		offset := parseInt16(scope.Contract.Code[*pc+1:])
		*pc += uint64(offset)
	} else {
		*pc += 2
	}
	return nil, nil
}
...
// opCallf implements the CALLF opcode
func opCallf(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	section, _ := parseUint16(scope.Contract.Code[*pc+1:])
	metadata := interpreter.evm.eofCode.types[section]
	if err := metadata.checkInputs(scope.Stack.len()); err != nil {
		return nil, err
	}
	if err := metadata.checkStackMax(scope.Stack.len()); err != nil {
		return nil, err
	}
	interpreter.returnStack.push(returnFrame{pc: *pc + 2, section: scope.Contract.eofSection})
	scope.Contract.eofSection = section
	*pc = 0
	return nil, nil
}

// opRetf implements the RETF opcode
func opRetf(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	frame, err := interpreter.returnStack.pop()
	if err != nil {
		// TODO should be exit
		return nil, err
	}
	metadata := interpreter.evm.eofCode.types[scope.Contract.eofSection]
	if err := metadata.checkStackHeight(scope.Stack.len()); err != nil {
		return nil, err
	}
	scope.Contract.eofSection = frame.section
	*pc = frame.pc
	return nil, nil
}
...
// opReturnContract implements the RETURNCONTRACT opcode
func opReturnContract(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
	// TODO implement
	return nil, errStopToken
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// returnFrame is the frame in which a `CALLF` was made, and to which `RETF`
// will return.
type returnFrame struct {
	pc      uint64
	section int
}

// returnStack is a stack of return frames.
type returnStack struct {
	data []returnFrame
}

// push pushes a new return frame on the stack.
func (rs *returnStack) push(frame returnFrame) {
	rs.data = append(rs.data, frame)
}

// pop pops a return frame from the stack.
func (rs *returnStack) pop() (returnFrame, error) {
	if len(rs.data) == 0 {
		return returnFrame{}, ErrReturnStackUnderflow
	}
	ret := rs.data[len(rs.data)-1]
	rs.data = rs.data[:len(rs.data)-1]
	return ret, nil
}

// EVMInterpreter represents an EVM interpreter
type EVMInterpreter struct {
	evm   *EVM
	table *JumpTable

	hasher    crypto.KeccakState // Keccak256 hasher instance shared across opcodes
	hasherBuf common.Hash        // Keccak256 hasher result array shared across opcodes

	readOnly     bool          // Whether to throw on stateful modifications
	returnData   []byte        // Last CALL's return data for subsequent reuse
	returnStack  returnStack     // The stack for function returns
	eofContainer *codeAndInput // The container for the EOF execution
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// create creates a new contract using code as deployment code.
func (evm *EVM) create(caller common.Address, code []byte, gas uint64, value *uint256.Int, address common.Address, typ OpCode) (ret []byte, createAddress common.Address, leftOverGas uint64, err error) {
	...
	// Ensure there's no existing contract already at the designated address...
	// If the code is EOF, run validation first.
	if evm.chainRules.IsPrague && len(code) > 0 && code[0] == eofFormatByte {
		if _, err := evm.interpreter.validateEOF(code, true); err != nil {
			return nil, common.Address{}, gas, err
		}
	}
	...
	// Create a new account on the state only if the object was not present.
	snapshot := evm.StateDB.Snapshot()
	if !evm.StateDB.Exist(address) {
		evm.StateDB.CreateAccount(address)
	}
	...
	// Initialise a new contract and set the code that is to be used by the EVM.
	// The contract is a scoped environment for this execution context only.
	contract := NewContract(caller, address, value, gas, evm.jumpDests)
	contract.IsDeployment = true

	// If EOF, use special interpreter settings
	if evm.chainRules.IsPrague && len(code) > 0 && code[0] == eofFormatByte {
		contract.isEOF = true
	}

	// Explicitly set the code to a null hash to prevent caching of jump analysis
	// for the initialization code.
	contract.SetCallCode(common.Hash{}, code)
	...
}
```
</file>
</go-ethereum>

## Prompt Corrections
The original prompt provided a solid foundation for implementing EOF. However, based on the `go-ethereum` implementation, here are some notes and potential improvements:

1.  **EOF Validation is Complex**: The provided `CodeValidator` in the prompt is a good start, but the official implementation is significantly more involved. The Go version (`core/vm/eof_validation.go`) includes:
    *   **Control Flow Analysis**: It doesn't just validate individual instructions but also traces all possible execution paths (`RJUMP`, `RJUMPI`, `RJUMPV`, `CALLF`, `RETF`) to ensure there's no unreachable code and that stack heights are consistent at all merge points (e.g., a `JUMPDEST` reachable from multiple locations).
    *   **Recursive Validation**: The validation process is recursive for `CALLF`. When a `CALLF` is encountered, the validator must also validate the target function if it hasn't been validated yet.
    *   **Non-Returning Functions**: EOF introduces the concept of non-returning functions (those ending in `STOP`, `REVERT`, etc., but not `RETF`). A `CALLF` to a non-returning function is invalid, and this must be checked.

2.  **`opCodeToString` and `immediates` tables**: The Go implementation uses lookup tables (`opCodeToString` and `immediates` in `core/vm/opcodes.go` and `core/vm/eof_immediates.go` respectively) to define opcode names and the size of their immediate data. This is a clean way to manage opcode metadata and would be beneficial for the Zig implementation for validation and disassembly.

3.  **`ReturnStack` is part of the Interpreter**: In `go-ethereum`, the `returnStack` is a field within the `EVMInterpreter`, not a separate `EOFExecutionFrame` as suggested in the prompt's architecture. This is a minor architectural difference but keeps all execution-specific state within the interpreter object.

4.  **`EOFCREATE` and `RETURNCONTRACT`**: The prompt's opcode list is good, but misses two other important EOF opcodes: `EOFCREATE` (for creating EOF contracts from within another EOF contract) and `RETURNCONTRACT` (for returning a sub-container as the deployment code). These are crucial for the full EOF feature set.

5.  **Distinction between `initcode` and `runtime` validation**: The validation rules are slightly different for initialization code vs. runtime code. For instance, `RETURN` and `STOP` are forbidden in `initcode`, which must use `RETURNCONTRACT`. The Go implementation handles this distinction, which is a key detail to capture.

The provided Go snippets will give a much clearer picture of these complexities and serve as a robust reference for a production-quality implementation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// This file contains the EVM Object Format (EOF) data types.
// https://eips.ethereum.org/EIPS/eip-3540
// https://eips.ethereum.org/EIPS/eip-3670
// https://eips.ethereum.org/EIPS/eip-4200
// https://eips.ethereum.org/EIPS/eip-4750
// https://eips.ethereum.org/EIPS/eip-5450

package vm

import (
	"encoding/binary"
	"errors"
	"fmt"
)

// Magic and version of the EOF format.
var (
	eofMagic   = []byte{0xef, 0x00}
	eofVersion = byte(0x01)
)

// Section kinds
const (
	terminatorSection = 0
	codeSection       = 1
	dataSection       = 2
	typeSection       = 3
	// maxSection is the maximum possible section kind. Used for validation.
	maxSection = 3
)

// CodeType represents a single entry in the type section of an EOF container.
type CodeType struct {
	// Inputs defines the number of stack items consumed by the function.
	Inputs uint8
	// Outputs defines the number of stack items returned by the function.
	Outputs uint8
	// MaxStack is the maximum number of items on the stack during the
	// function's execution.
	MaxStack uint16
}

// EOF is the parsed representation of an EVM Object Format container.
type EOF struct {
	// Version is the version of the container format. Must be 1.
	Version byte
	// Types contains the type information for each code section.
	Types []CodeType
	// Code contains the bytecode for each code section.
	Code [][]byte
	// Data contains the data section of the container.
	Data []byte
	// The raw code for hashing
	raw []byte
}

// IsEOF checks if the given bytecode is prefixed with the EOF magic.
func IsEOF(code []byte) bool {
	return len(code) > 2 && code[0] == eofMagic[0] && code[1] == eofMagic[1]
}

// ParseEOF parses the given bytecode as an EOF container.
func ParseEOF(code []byte) (*EOF, error) {
	// Must have at least the magic and version.
	if !IsEOF(code) {
		return nil, ErrInvalidEOFMagic
	}
	if code[2] != eofVersion {
		return nil, ErrInvalidEOFVersion
	}
	// EOF needs to have a terminator section.
	if len(code) < 4 || code[len(code)-1] != terminatorSection {
		return nil, ErrMissingTerminator
	}
	var (
		err       error
		res       = &EOF{Version: code[2]}
		pos       = 3
		lastfound = 0
		size      int
	)
	for pos < len(code)-1 { // a valid EOF must end with a terminator section
		kind := int(code[pos])
		pos++

		// Section headers need to be ordered by kind, and no duplicates
		// are allowed.
		if kind <= lastfound {
			return nil, ErrInvalidSectionOrder
		}
		lastfound = kind

		switch kind {
		case typeSection:
			size, pos, err = parseSize(code, pos)
			if err != nil {
				return nil, err
			}
			if err := res.parseTypes(code, pos, size); err != nil {
				return nil, err
			}
		case codeSection:
			size, pos, err = parseSize(code, pos)
			if err != nil {
				return nil, err
			}
			if err := res.parseCode(code, pos, size); err != nil {
				return nil, err
			}
		case dataSection:
			size, pos, err = parseSize(code, pos)
			if err != nil {
				return nil, err
			}
			res.Data = code[pos : pos+size]
		default:
			return nil, ErrUnknownSection
		}
		pos += size
	}
	// The only remaining byte should be the terminator.
	if code[pos] != terminatorSection {
		return nil, ErrMissingTerminator
	}
	res.raw = code
	return res, nil
}

func (eof *EOF) parseTypes(data []byte, pos, size int) error {
	if size%4 != 0 {
		return ErrInvalidTypeSection
	}
	eof.Types = make([]CodeType, size/4)
	for i := 0; i < len(eof.Types); i++ {
		entry := data[pos+i*4 : pos+(i+1)*4]
		eof.Types[i] = CodeType{
			Inputs:   entry[0],
			Outputs:  entry[1],
			MaxStack: binary.BigEndian.Uint16(entry[2:4]),
		}
	}
	return nil
}

func (eof *EOF) parseCode(data []byte, pos, size int) error {
	end := pos + size
	for pos < end {
		csize, cpos, err := parseSize(data, pos)
		if err != nil {
			return err
		}
		if cpos+csize > end {
			return errors.New("code section size is larger than section")
		}
		eof.Code = append(eof.Code, data[cpos:cpos+csize])
		pos = cpos + csize
	}
	if pos != end {
		return errors.New("invalid code section size mismatch")
	}
	return nil
}

func parseSize(data []byte, pos int) (int, int, error) {
	if pos+2 > len(data) {
		return 0, 0, errors.New("incomplete section size")
	}
	return int(binary.BigEndian.Uint16(data[pos : pos+2])), pos + 2, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof_validation.go">
```go
// ValidateEOF validates the EOF container against the specification rules.
func ValidateEOF(cfg *params.ChainConfig, code []byte) error {
	eof, err := ParseEOF(code)
	if err != nil {
		return err
	}
	if err := eof.validateHeader(); err != nil {
		return err
	}
	// Run validation on all code sections
	for i, code := range eof.Code {
		if err := eof.validateCode(i, code); err != nil {
			return err
		}
	}
	return nil
}

// validateHeader validates the EOF structure.
// https://eips.ethereum.org/EIPS/eip-3670#container-format-validation
func (eof *EOF) validateHeader() error {
	// There must be at least one code section.
	if len(eof.Code) == 0 {
		return ErrNoCodeSection
	}
	// All code sections must be non-empty.
	for i, c := range eof.Code {
		if len(c) == 0 {
			return fmt.Errorf("%w: code section %d", ErrEmptyCodeSection, i)
		}
	}
	if len(eof.Types) == 0 {
		return ErrNoTypeSection
	}
	// Ensure the number of types and codes match.
	if len(eof.Code) != len(eof.Types) {
		return ErrCodeTypeSectionMismatch
	}
	if len(eof.Code) > 1024 {
		return ErrMaxCodeSectionsExceeded
	}
	return nil
}

// validateCode validates a single code section against the specification rules.
func (eof *EOF) validateCode(section int, code []byte) error {
	// Code cannot be empty. This is already checked in validateHeader
	// but we double-check for safety.
	if len(code) == 0 {
		return fmt.Errorf("%w: code section %d", ErrEmptyCodeSection, section)
	}
	// Last opcode must be a terminating one.
	op := OpCode(code[len(code)-1])
	if !op.isTerminating() {
		return ErrLastOpcodeNotTerminating
	}
	// No undefined opcodes are allowed.
	for i := 0; i < len(code); {
		op := OpCode(code[i])
		if !op.IsPush() {
			if !validEOFOpcodes[op] {
				return fmt.Errorf("%w: %v", ErrUndefinedInstruction, op)
			}
			i++
			continue
		}
		// Data segment of PUSH instruction must be within code bounds
		n := int(op - PUSH1 + 1)
		if i+1+n > len(code) {
			return ErrInvalidPush
		}
		i += 1 + n
	}
	// Validate jump destinations.
	jumpdests, err := eof.getJumpDests(code)
	if err != nil {
		return err
	}
	return eof.validateStack(section, code, jumpdests)
}

// ...

// validateStack validates the stack usage for a given code section. It returns an error
// if the validation fails, otherwise nil.
// The method checks for stack underflow, overflow, and whether the final stack height
// matches the declared number of outputs.
// https://eips.ethereum.org/EIPS/eip-5450
func (eof *EOF) validateStack(section int, code []byte, jumpdests map[uint64]stackInfo) error {
	// Initialise a stack with the number of inputs for the code section.
	// We don't really care about the values on the stack, only their number.
	// We do care about the type of values for CALLF, so we use a special value
	// to represent outputs of a CALLF instruction.
	currentStack := newStackInfo(int(eof.Types[section].Inputs))
	maxStack := int(eof.Types[section].Inputs)

	// Keep a list of code locations to visit, starting with the first instruction.
	// The values in this list are pairs of (program counter, stack info).
	// We also keep track of visited locations to avoid redundant checks.
	var (
		q            = []path{{pc: 0, si: currentStack}}
		maxStackPcs  = make(map[int]int)
		visited      = make([]stackInfo, len(code))
		maxStackEver = 0
	)
	// ... (stack validation loop logic) ...
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/stack.go">
```go
// ...

// ReturnStack is a stack of return addresses for RETF.
type ReturnStack struct {
	data []uint16
}

// newReturnStack creates a new return stack.
func newReturnStack() *ReturnStack {
	return &ReturnStack{data: make([]uint16, 0, 16)}
}

// push pushes a return address to the stack.
func (st *ReturnStack) push(retPC uint16) {
	st.data = append(st.data, retPC)
}

// pop pops a return address from the stack.
func (st *ReturnStack) pop() (uint16, error) {
	if len(st.data) == 0 {
		return 0, ErrReturnStackUnderflow
	}
	ret := st.data[len(st.data)-1]
	st.data = st.data[:len(st.data)-1]
	return ret, nil
}

func (st *ReturnStack) len() int {
	return len(st.data)
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// ...

// run runs the EVM code with the given contract and input data.
// It will not make any changes to the state, and does not ever return an error.
// The interpreter will quit with an error which is available through the Error
// method.
func (in *EVMInterpreter) run(frame *frame, eof *EOF) (ret []byte, err error) {
	// ... (setup) ...
	var (
		op OpCode // current opcode
		// ...
		callf = eof != nil // Enable EOF opcodes if in EOF context
	)

	for {
		// ... (gas checks, etc.) ...
		op = frame.contract.GetOp(frame.pc)

		operation := in.cfg.JumpTable[op]
		// ...

		switch {
		// ... (standard opcodes) ...

		case op == CALLF:
			if !callf {
				err = ErrInvalidOpcode
				break
			}
			// get section from immediate
			section, err := frame.contract.readCode(frame.pc + 1, 2)
			if err != nil {
				break
			}
			// ... (stack validation) ...

			// push current pc + immediate size to return stack
			frame.returnStack.push(uint16(frame.pc + 3))

			// set pc to section start
			frame.pc = eof.Code[section].start

			// continue to next instruction
			continue

		case op == RETF:
			if !callf {
				err = ErrInvalidOpcode
				break
			}
			// ... (stack validation) ...

			// pop from return stack
			retPC, err := frame.returnStack.pop()
			if err != nil {
				break
			}
			frame.pc = int(retPC)

			// continue to next instruction
			continue

		case op == RJUMP:
			if !callf {
				err = ErrInvalidOpcode
				break
			}
			// get offset from immediate
			offset, err := frame.contract.readCode(frame.pc+1, 2)
			if err != nil {
				break
			}
			// set pc to current pc + offset + immediate size
			frame.pc = int(int16(offset)) + frame.pc + 3

			// continue to next instruction
			continue

		case op == RJUMPI:
			if !callf {
				err = ErrInvalidOpcode
				break
			}
			// ... (stack pop for condition) ...
			if cond.IsZero() {
				frame.pc += 3 // condition false, continue to next instruction
			} else {
				// condition true, jump
				offset, err := frame.contract.readCode(frame.pc+1, 2)
				if err != nil {
					break
				}
				frame.pc = int(int16(offset)) + frame.pc + 3
			}
			// continue to next instruction
			continue

		// ... (other opcodes) ...
		}
		// ... (error handling and exit) ...
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go">
```go
// ...

// Create creates a new contract using code as deployment code.
func Create(contract *Contract, state vm.StateDB, vm *vm.EVM, rules *params.Rules) (ret []byte, remainingGas uint64, err error) {
	// ... (balance checks, etc.) ...

	// Validate the init code before executing it.
	// The code can only be validated after theCancun fork. Before that, we must
	// execute the code and observe a failure.
	if rules.IsCancun {
		if err := validateCode(rules, contract.Code()); err != nil {
			return nil, contract.Gas, err
		}
	}
	// ... (EVM execution of init code) ...
}

// validateCode validates the given code against the EVM rules.
func validateCode(rules *params.Rules, code []byte) error {
	// Contract creation init code validation for EIP-3860.
	if rules.IsShanghai && len(code) > params.MaxInitCodeSize {
		return ErrMaxInitCodeSizeExceeded
	}
	// Disallow contracts starting with 0xEF.
	if rules.IsLondon && len(code) > 0 && code[0] == 0xEF {
		return ErrInvalidCode
	}
	// If the code is empty, it is valid.
	if len(code) == 0 {
		return nil
	}
	// Validate the code against the EVM rules.
	// We can't use `cfg.JumpTable` since it's not available here.
	br, err := analysis.Analyze(code, rules)
	if err != nil {
		return err
	}
	if len(br.Jumpdests) == 0 {
		return nil // no need to check JUMPDEST validity
	}
	// We can't use `cfg.JumpTable` since it's not available here.
	jumptable := vm.NewJumpTable(rules)
	for i := 0; i < len(code); {
		op := vm.OpCode(code[i])
		if !op.IsPush() {
			i++
			continue
		}
		if op >= vm.JUMP && op <= vm.JUMPDEST {
			return ErrInvalidCode
		}
		i += int(op - vm.PUSH1 + 2)
	}
	// Check jump destination validity.
	for dest := range br.Jumpdests {
		if !jumptable.Valid(vm.OpCode(code[dest])) {
			return fmt.Errorf("%w: invalid jump destination %v", ErrInvalidCode, vm.OpCode(code[dest]))
		}
	}
	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/analysis.go">
```go
// analysis contains the results of analyzing a block of code.
type analysis struct {
	jumpdests destinations
}

// destinations is a bit map of valid jump destinations.
type destinations bitset

// analyze performs a single pass over the code to collect jump destinations.
func analyze(code []byte, rules *params.Rules) (a analysis, err error) {
	a.jumpdests = make(bitset, len(code)/8+1)
	for i := 0; i < len(code); {
		op := OpCode(code[i])

		if op == JUMPDEST {
			a.jumpdests.set(i)
		} else if op >= PUSH1 && op <= PUSH32 {
			i += int(op - PUSH1 + 1)
		} else if rules.IsPrague && op >= RJUMP && op <= RJUMPV {
			// Relative jumps require their destinations to be at instruction starts
			// and within code bounds. This needs more sophisticated analysis than
			// just collecting JUMPDESTs. The full EOF validation handles this.
			// For legacy code, these are invalid opcodes.
		}
		i++
	}
	return a, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/params/protocol_params.go">
```go
const (
	// ...
	RJUMP      = 0x5c
	RJUMPI     = 0x5d
	RJUMPV     = 0x5e
	PUSH0      = 0x5f
	// ...
	CALLF      = 0xb0
	RETF       = 0xb1
	JUMPF      = 0xb2
	// ...
)
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt is excellent and provides a solid foundation for implementing EOF support. The proposed Zig structure is well-thought-out and aligns with the core concepts of EOF. Here are a few minor points of clarification and potential improvement based on the `go-ethereum` implementation:

1.  **Return Stack Location**: In the prompt, the `ReturnStack` is part of the `EOFExecutionFrame`, which is a good, isolated design. In `go-ethereum`, the `ReturnStack` is a field within the main `Stack` struct itself (`core/vm/stack.go`). This is just a different implementation choice, but it's worth noting. The prompt's approach might be cleaner as it keeps EOF-specific logic more contained.

2.  **Opcode Naming**: The prompt uses opcodes like `DUPN`, `SWAPN`, `EXCHANGE`, which are proposed in various EOF-related EIPs but not yet finalized for a specific hardfork in the same way as `RJUMP`, `CALLF`, etc. The go-ethereum snippets focus on the opcodes that have reached a more stable part of the specification (`RJUMP`, `RJUMPI`, `CALLF`, `RETF`). The implementation of `DUPN/SWAPN/EXCHANGE` can be easily extrapolated from existing `DUP/SWAP` implementations in `jump_table.go`.

3.  **Validation Logic**: The prompt correctly identifies the need for a `CodeValidator`. In `go-ethereum`, this logic is split between `core/vm/contracts.go` (for initial deployment validation of legacy code) and `core/vm/eof_validation.go` (for comprehensive EOF-specific validation). The `eof_validation.go` file in Geth is a rich source of patterns for implementing the detailed validation checks required by EOF, especially for stack analysis (`validateStack`) and code-flow integrity.

The provided Go-ethereum snippets should offer valuable patterns for parsing, validation, and execution that can be directly adapted to the proposed Zig implementation.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// This file contains the EVM Object Format (EOF) functions.
// It is the main entry point for EOF validation and execution.

package vm

import (
	"bytes"
	"encoding/binary"
	"errors"
	"fmt"
	"math"

	"github.com/ethereum/go-ethereum/params"
)

const (
	eofMagic   = 0xef00
	eofVersion = 0x01
)

// Section IDs
const (
	terminatorSection = 0x00
	codeSection       = 0x01
	dataSection       = 0x02
	typeSection       = 0x03
	// ... other section types
)

// EOF is the parsed representation of EVM Object Format bytecode.
type EOF struct {
	Version      byte
	CodeSections []EOFCodeSection
	DataSection  []byte
	TypeSections []EOFTypeSection
}

// EOFCodeSection represents a single code section in an EOF container.
type EOFCodeSection []byte

// EOFTypeSection represents the type information for a code section.
type EOFTypeSection struct {
	Inputs  uint8
	Outputs uint8
	MaxStack uint16
}

// ParseEOF parses the given bytecode as EOF.
func ParseEOF(code []byte) (*EOF, error) {
	if len(code) < 4 || binary.BigEndian.Uint16(code) != eofMagic {
		return nil, nil // Not an EOF contract, not an error
	}
	// ... minimal header validation ...
	version := code[2]
	if version != eofVersion {
		return nil, fmt.Errorf("unsupported EOF version: %d", version)
	}

	eof := &EOF{Version: version}
	body := code[3:]

	// Parse sections
	var seenTerminator, seenData, seenTypes bool
	offset := 0
	for {
		if offset >= len(body) {
			return nil, errors.New("EOF body must end with a terminator section")
		}
		sectionID := body[offset]
		offset++

		if sectionID == terminatorSection {
			if offset != len(body) {
				return nil, errors.New("terminator section must be the last section")
			}
			seenTerminator = true
			break
		}
		// ... section size parsing ...
		if offset+2 > len(body) {
			return nil, errors.New("EOF section header overflow")
		}
		sectionSize := int(binary.BigEndian.Uint16(body[offset:]))
		offset += 2
		sectionEnd := offset + sectionSize
		if sectionEnd > len(body) {
			return nil, errors.New("EOF section content overflow")
		}
		sectionData := body[offset:sectionEnd]

		switch sectionID {
		case typeSection:
			if seenTypes {
				return nil, errors.New("multiple type sections")
			}
			// ... type section parsing ...
			seenTypes = true

		case codeSection:
			// ... code section parsing ...
			eof.CodeSections = append(eof.CodeSections, sectionData)

		case dataSection:
			if seenData {
				return nil, errors.New("multiple data sections")
			}
			eof.DataSection = sectionData
			seenData = true

		default:
			return nil, fmt.Errorf("unknown section ID: %d", sectionID)
		}
		offset = sectionEnd
	}

	if !seenTerminator {
		return nil, errors.New("EOF body must end with a terminator section")
	}
	// ... more structural validation ...
	return eof, nil
}


// ValidateEOF validates the given EOF bytecode against the rules defined in EIPs.
// This function performs static analysis at deployment time.
func ValidateEOF(code []byte) error {
	eof, err := ParseEOF(code)
	if err != nil {
		return err
	}
	if eof == nil {
		return nil // Not an EOF contract
	}

	// Structural validation
	if len(eof.CodeSections) == 0 {
		return errors.New("no code sections in EOF")
	}
	if len(eof.TypeSections) != len(eof.CodeSections) {
		return errors.New("type and code section number mismatch")
	}

	for i, codeSection := range eof.CodeSections {
		typeSection := eof.TypeSections[i]
		if err := validateEOFCode(codeSection, typeSection, eof.CodeSections, eof.TypeSections); err != nil {
			return fmt.Errorf("invalid code section %d: %w", i, err)
		}
	}
	return nil
}

// validateEOFCode performs static analysis on a single code section.
func validateEOFCode(code []byte, types EOFTypeSection, allCode [][]byte, allTypes []EOFTypeSection) error {
	if len(code) == 0 {
		return errors.New("code section is empty")
	}
	// Last instruction must be a terminating one.
	lastOpcode := OpCode(code[len(code)-1])
	if !lastOpcode.isTerminating() {
		return fmt.Errorf("code section does not end with a terminating instruction, got %v", lastOpcode)
	}

	var (
		pc               uint64
		currentStackHeight = int(types.Inputs)
	)

	for pc < uint64(len(code)) {
		op := OpCode(code[pc])

		// Opcodes validation
		if !op.isEofValid() {
			return fmt.Errorf("invalid opcode in EOF: %v", op)
		}
		if op.IsPush() {
			pushSize := int(op - PUSH1 + 1)
			if int(pc)+1+pushSize > len(code) {
				return errors.New("truncated PUSH")
			}
		}

		// Stack validation
		// ... calculate stack change for the current opcode ...
		// currentStackHeight += stackOuts - stackIns
		if currentStackHeight < 0 {
			return errors.New("stack underflow")
		}
		if currentStackHeight > int(types.MaxStack) {
			return errors.New("stack overflow")
		}

		// Jump validation (for RJUMP, RJUMPI)
		if op == RJUMP || op == RJUMPI {
			if int(pc)+2 >= len(code) {
				return errors.New("truncated RJUMP/RJUMPI")
			}
			offset := int16(binary.BigEndian.Uint16(code[pc+1:]))
			jumpDest := int64(pc) + 3 + int64(offset)

			if jumpDest < 0 || jumpDest >= int64(len(code)) {
				return errors.New("relative jump destination out of bounds")
			}
			// ... check if jumpDest points to an instruction start ...
		}

		// CALLF validation
		if op == CALLF {
			if int(pc)+2 >= len(code) {
				return errors.New("truncated CALLF")
			}
			sectionIndex := binary.BigEndian.Uint16(code[pc+1:])
			if int(sectionIndex) >= len(allTypes) {
				return fmt.Errorf("CALLF to non-existent section %d", sectionIndex)
			}
			targetType := allTypes[sectionIndex]
			// ... stack validation for CALLF ...
			// currentStackHeight -= targetType.Inputs
			// currentStackHeight += targetType.Outputs
		}

		pc += uint64(op.pushSize() + 1)
	}

	// Final stack height must match declared outputs
	if currentStackHeight != int(types.Outputs) {
		return fmt.Errorf("unbalanced stack, expected %d, got %d", types.Outputs, currentStackHeight)
	}

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// ...

type returnStack struct {
	data []returnFrame
}

type returnFrame struct {
	pc          uint64
	codeSection uint16
}

func newReturnStack() *returnStack {
	return &returnStack{data: make([]returnFrame, 0, 16)}
}

func (s *returnStack) push(codeSection uint16, pc uint64) {
	s.data = append(s.data, returnFrame{codeSection: codeSection, pc: pc})
}

func (s *returnStack) pop() (uint16, uint64) {
	if len(s.data) == 0 {
		// This can only happen if RETF is called from the top-level frame.
		return 0, 0
	}
	frame := s.data[len(s.data)-1]
	s.data = s.data[:len(s.data)-1]
	return frame.codeSection, frame.pc
}

func (s *returnStack) len() int {
	return len(s.data)
}


// ...

// Run starts execution of the contract and returns the gas left, the output and an error if one occurred.
func (in *EVMInterpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ...
	
	// Check for EOF header and validate if present
	isEOF := contract.isEOF()
	var eof *EOF
	if isEOF {
		if err := ValidateEOF(contract.Code); err != nil {
			return nil, err
		}
		// The code below assumes this does not return nil for EOF code.
		eof, _ = ParseEOF(contract.Code)
	}

	// ...
	var (
		op          OpCode        // current opcode
		mem         = NewMemory() // bound memory
		stack       = newstack()  // local stack
		returnStack *returnStack  // EOF return stack
		// ...
	)
	if isEOF {
		returnStack = newReturnStack()
	}
	
	// ... main execution loop ...
	for {
		// ...
		op = contract.GetOp(pc)
		// ... gas and stack validation ...
		
		// This is where Geth's execution loop dispatches opcodes.
		// A real implementation would call the opcode function here.
		switch op {
		case RJUMP:
			// ...
		case RJUMPI:
			// ...
		case CALLF:
			// ...
		case RETF:
			// ...
		case DUPN:
			// ...
		case SWAPN:
			// ...
		case EXCHANGE:
			// ...
		// ... other opcodes
		}
	}
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/jump_table.go">
```go
// This file contains the implementations of all assembly opcodes.
// They are referenced by the jump table.

func opCallF(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	// Stack: [ret_pc_inc, section_idx, ...args] -> [...results]
	sectionIdx, _ := stack.pop()
	targetSection := int(sectionIdx.Uint64())

	// Sanity checks from validation
	// 1. targetSection must be valid
	// 2. stack must have enough arguments for target section
	// 3. return stack must not be full

	targetType := contract.EOF.TypeSections[targetSection]
	if stack.len() < int(targetType.Inputs) {
		return nil, ErrStackUnderflow
	}
	if evm.interpreter.returnStack.len() >= 1024 {
		return nil, ErrReturnStackOverflow
	}

	// Consume gas (static part, dynamic part for stack change already done)
	// cost := GasFastestStep // Example, real cost is more complex
	// if !contract.UseGas(cost) { ... }

	// Push current location to return stack
	evm.interpreter.returnStack.push(uint16(contract.ActiveCodeSection), *pc+1)

	// Set new active code section
	contract.SetActiveCode(targetSection)
	*pc = 0 // Jump to the beginning of the new section
	return nil, nil
}

func opRetF(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	// Stack: [...results] -> [...] (stack change validated)
	currentType := contract.EOF.TypeSections[contract.ActiveCodeSection]
	if stack.len() < int(currentType.Outputs) {
		return nil, ErrStackUnderflow // Should be caught by validation
	}

	// Pop return address from return stack
	returnSection, returnPC := evm.interpreter.returnStack.pop()

	if evm.interpreter.returnStack.len() == 0 {
		// This is the final return from the top-level function.
		// It should behave like a STOP.
		return nil, errStopToken
	}

	// Set active code section back
	contract.SetActiveCode(int(returnSection))
	*pc = returnPC
	return nil, nil
}


func opRJump(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	// Read 16-bit signed relative offset
	offset := int16(binary.BigEndian.Uint16(contract.GetByte(*pc+1, *pc+2)))
	// Jump destination is relative to instruction *after* RJUMP
	*pc = uint64(int64(*pc) + 2 + int64(offset))
	return nil, nil
}

func opRJumpI(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	cond, _ := stack.pop()
	if !cond.IsZero() {
		// Same logic as RJUMP
		offset := int16(binary.BigEndian.Uint16(contract.GetByte(*pc+1, *pc+2)))
		*pc = uint64(int64(*pc) + 2 + int64(offset))
	} else {
		// Don't jump, just step over the instruction and its immediate
		*pc += 2
	}
	return nil, nil
}

func opDupN(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	n := contract.GetByte(*pc + 1)
	stack.dup(int(n))
	*pc += 1 // Step over immediate
	return nil, nil
}

func opSwapN(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	n := contract.GetByte(*pc + 1)
	stack.swap(int(n) + 1) // SWAPN swaps with (n+1)th element from top
	*pc += 1 // Step over immediate
	return nil, nil
}

func opExchange(pc *uint64, evm *EVM, contract *Contract, stack *Stack, mem *Memory, gas *uint64) ([]byte, error) {
	imm := contract.GetByte(*pc + 1)
	m := int(imm>>4) + 1
	n := int(imm&0x0f) + 1
	stack.swap(m, n)
	*pc += 1 // Step over immediate
	return nil, nil
}

```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *big.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ...
	// Ensure the contract code is valid to be deployed to the state.
	// The following rules are checked:
	// 1. `code` must not be empty.
	// 2. `code[0]` is not `0xef` (EOF).
	if contract.Code[0] == eofMagic {
		if err := ValidateEOF(contract.Code); err != nil {
			// consume all gas and return error
			return nil, common.Address{}, 0, err
		}
	} else if len(contract.Code) > 0 {
		// legacy contract validation
		// ...
	}
	// ... store code in state ...
	// ...
	return ret, contractAddr, gas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
const (
	// ... other opcodes ...

	// EIP-4200: Static relative jumps
	RJUMP OpCode = 0xe0
	RJUMPI OpCode = 0xe1

	// EIP-4750: Functions
	CALLF OpCode = 0xe3
	RETF OpCode = 0xe4

	// EIP-663: Unlimited SWAP and DUP instructions
	DUPN     OpCode = 0xb1
	SWAPN    OpCode = 0xb2
	EXCHANGE OpCode = 0xb3
)

// isEofValid checks whether an opcode is valid in EOF contracts.
func (op OpCode) isEofValid() bool {
	// JUMP, JUMPI, JUMPDEST, PC, SELFDESTRUCT, etc. are disallowed.
	switch op {
	case JUMP, JUMPI, JUMPDEST, PC, SELFDESTRUCT, CALLER, CALLVALUE,
		// ... and many others ...
		GASPRICE, EXTCODECOPY, EXTCODESIZE, EXTCODEHASH, BLOCKHASH,
		COINBASE, TIMESTAMP, NUMBER, DIFFICULTY, GASLIMIT, CREATE,
		CREATE2, CALL, CALLCODE, DELEGATECALL, STATICCALL:
		return false
	}
	return true
}

```
</file>
## Prompt Corrections
The original prompt provides a very solid foundation for implementing EOF. The provided Zig code examples are well-structured and capture the core concepts correctly. The following are not so much "corrections" as they are suggestions and clarifications based on `go-ethereum`'s production implementation, which may help refine the task.

1.  **Separation of Validation and Execution**: In `go-ethereum`, EOF validation (`ValidateEOF`) is a self-contained static analysis step performed *once* at deployment time. The execution logic in the EVM interpreter then assumes the code is valid. The prompt's `CodeValidator` seems to blur this line by manipulating a `pc` value. It would be clearer to design the validator to:
    *   Iterate through the bytecode and analyze instruction properties (opcode, immediates, stack effects).
    *   Build a map of valid jump destinations.
    *   Validate stack depth against `max_stack` without actually simulating execution.
    *   This strict separation makes the validator's role clearer and keeps the execution loop simpler.

2.  **State of the `returnStack`**: The prompt places the `returnStack` inside the `EOFExecutionFrame`. In `go-ethereum`, the `returnStack` is part of the top-level `Interpreter` struct. This is a subtle but important distinction. An `Interpreter` instance handles the entire transaction execution, which can involve multiple contract calls (frames). The `returnStack` needs to persist across these internal calls within the EOF context. Placing it on the `Interpreter` is a robust way to model this.

3.  **New Opcodes**: The prompt correctly identifies the key new opcodes. The Geth implementation confirms that `DUPN`, `SWAPN`, and `EXCHANGE` are part of the broader EOF-related changes and should be implemented alongside `RJUMP`, `CALLF`, etc. The extracted snippets from `jump_table.go` show their simple logic.

4.  **Error Handling**: The `go-ethereum` implementation returns specific, descriptive errors for different validation failures (e.g., `truncated PUSH`, `unbalanced stack`, `jump destination out of bounds`). Emulating this will make debugging much easier. The prompt defines a generic `EOFError` enum, which could be expanded to provide more granular error reporting.

5.  **Integration Point for Validation**: The `go-ethereum/core/vm/evm.go` snippet shows the ideal place to hook in the validation logic: within the `Create` function. When a contract creation transaction is processed, the VM checks for the `0xEF00` magic bytes and, if present, immediately runs `ValidateEOF`. If validation fails, the creation process is aborted, and gas is consumed. This is the correct security model.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof.go">
```go
// This file contains the EVM Object Format (EOF) functions from go-ethereum.
// It is the primary reference for container parsing, validation, and execution context.

// EOF constants
const (
	eofMagic         = 0xEF00
	versionEOF       = 1
	codeSection      = 2
	dataSection      = 3
	terminatorSection = 0
)

// EOFContainer is the in-memory representation of an EOF contract.
// This struct directly maps to the `EOFContainer` in the prompt. It's the
// result of successfully parsing the EOF bytecode.
type EOFContainer struct {
	Version byte
	Types   []Type   // Corresponds to the types section
	Code    [][]byte // Corresponds to the code sections
	Data    []byte   // Corresponds to the data section
}

// Type represents a single entry in the types section. It defines the stack
// requirements for a function, which is critical for EIP-5450 stack validation.
type Type struct {
	Inputs   byte
	Outputs  byte
	MaxStack uint16
}

// ParseEOF parses the given bytecode and returns an EOFContainer if the bytecode
// is valid EOF, or an error otherwise. This function is the direct Go equivalent
// of the `EOFContainer.parse` function requested in the prompt.
func ParseEOF(code []byte) (*EOFContainer, error) {
	// ... (initial length checks) ...

	// Check magic and version
	if binary.BigEndian.Uint16(code) != eofMagic {
		return nil, ErrInvalidEOFMagic
	}
	if code[2] != versionEOF {
		return nil, ErrUnsupportedEOFVersion
	}
	// ... (more checks) ...

	var (
		container = &EOFContainer{Version: code[2]}
		pos       = 3
		seenKind  = byte(0) // Kinds must be in increasing order
	)
	// Parse the types section
	if code[pos] != typeSection {
		return nil, ErrMissingTypeSection
	}
	// ... (parsing logic for type section) ...
	pos += 3 + int(typesSize)

	// Parse code sections
	for code[pos] == codeSection {
		// ... (parsing logic for code section) ...
		pos += 3 + int(codeSize)
	}

	// Parse data section (optional)
	if code[pos] == dataSection {
		// ... (parsing logic for data section) ...
		pos += 3 + int(dataSize)
	}

	// Check terminator section
	if code[pos] != terminatorSection {
		return nil, ErrInvalidTerminator
	}
	return container, nil
}

// validateEOFCode validates a single code section of an EOF container. This is the
// most critical part of EOF static analysis, covering EIP-3670 and EIP-5450.
// The logic here is an excellent reference for the Zig `CodeValidator` struct.
func validateEOFCode(code []byte, maxStackSize uint16, numFunctions uint16, jumpdestBits *bit.Bitmap) (err error) {
	// ... (initial setup) ...

	// Validate the code
	var (
		stackSize    = int(inputs)
		maxStackSize = int(inputs)
	)
	for pc := 0; pc < len(code); {
		op := OpCode(code[pc])

		// ... (check for undefined opcodes) ...

		// The stack validation logic is particularly important.
		// It checks for underflow before an operation and overflow after.
		nPush, nPop := op.StackDetails()
		if stackSize < nPop {
			return errStackUnderflow
		}
		stackSize = stackSize - nPop + nPush
		if stackSize > int(maxStackSize) {
			return errStackOverflow
		}

		switch op {
		// Legacy JUMP/JUMPI/JUMPDEST opcodes are invalid in EOF.
		case JUMP, JUMPI, JUMPDEST:
			return ErrJumpDestInV1

		// The new relative jump opcodes require their targets to be valid.
		// A bitmap of valid jump destinations is pre-calculated and checked.
		case RJUMP, RJUMPI:
			offset, err := readSigned16(code, pc+1)
			if err != nil {
				return err
			}
			dest := pc + 3 + int(offset)
			if dest < 0 || dest >= len(code) || !jumpdestBits.Get(dest) {
				return ErrInvalidRjumpDestination
			}

		// CALLF/RETF are for function calls.
		case CALLF:
			// ... (validation for function index and stack) ...
			findex, err := readU16(code, pc+1)
			if err != nil {
				return err
			}
			if findex >= numFunctions {
				return ErrInvalidCallfImmediate
			}
			// ...

		case RETF:
			// RETF must be the last instruction in the function
			if pc != len(code)-1 {
				return ErrRetfNotTerminal
			}

		// PUSH operations require their data to be fully within the code bounds.
		case PUSH1, PUSH2, /* ..., */ PUSH32:
			size := int(op - PUSH1 + 1)
			if pc+1+size > len(code) {
				return ErrPushDataPastCode
			}
			pc += size
		}
		pc++
	}

	// Final stack height must match the declared number of outputs for the function.
	if stackSize != int(outputs) {
		return errStackHigherThan2
	}

	return nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// This file contains the runtime implementation of the new EOF opcodes.
// It shows how to interact with the `eofExecutionCtx` and the return stack.

// opCallf implements the CALLF opcode.
// It demonstrates how to call an EOF function, manage the return stack,
// and switch execution contexts.
func opCallf(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Read the function index from the immediate operand.
	findex, err := readU16(contract.Code, int(*pc+1))
	if err != nil {
		return nil, err
	// ... (more error checks) ...
	}
	fInputs := contract.eofContainer.Types[findex].Inputs
	fOutputs := contract.eofContainer.Types[findex].Outputs
	fMaxStack := contract.eofContainer.Types[findex].MaxStack

	// Check if the current stack has enough values for the function's inputs.
	if stack.Len() < int(fInputs) {
		return nil, ErrStackUnderflow
	}
	// Check if the new function's max stack requirements would cause an overflow
	// on the current stack.
	if stack.Len()-int(fInputs)+int(fMaxStack) > 1024 {
		return nil, ErrStackOverflow
	}

	// Push the return address and current code section to the return stack.
	// This is the core mechanism of function calls in EOF.
	if err := evm.eofExecutionCtx.push(uint16(*pc+3), contract.codeSectionIndex); err != nil {
		return nil, err
	}

	// Switch to the new code section and reset the program counter.
	contract.codeSectionIndex = findex
	contract.Code = contract.eofContainer.Code[findex]
	*pc = 0

	return nil, nil
}

// opRetf implements the RETF opcode.
// It demonstrates how to return from an EOF function and restore the
// previous execution context from the return stack.
func opRetf(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	// Pop the return frame from the return stack.
	returnPC, returnSectionIndex, err := evm.eofExecutionCtx.pop()
	if err != nil {
		return nil, err
	}

	// Get the type info for the returning function to check stack outputs.
	fOutputs := contract.eofContainer.Types[contract.codeSectionIndex].Outputs
	if stack.Len() < int(fOutputs) {
		return nil, errStackUnderflow
	}

	// Restore the previous execution context.
	contract.codeSectionIndex = returnSectionIndex
	contract.Code = contract.eofContainer.Code[returnSectionIndex]
	*pc = uint64(returnPC)

	return nil, nil
}

// opRjump implements the RJUMP opcode.
// It reads a 16-bit signed relative offset and updates the program counter.
func opRjump(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	offset, err := readSigned16(contract.Code, int(*pc+1))
	if err != nil {
		return nil, err
	}
	// The new PC is relative to the instruction *after* RJUMP (PC+3).
	*pc = uint64(int(*pc+3) + int(offset))
	return nil, nil
}

// opRjumpi implements the RJUMPI opcode.
// It's a conditional version of RJUMP, checking the top of the stack.
func opRjumpi(pc *uint64, evm *EVM, contract *Contract, memory *Memory, stack *Stack) ([]byte, error) {
	cond := stack.Pop()
	if !cond.IsZero() {
		offset, err := readSigned16(contract.Code, int(*pc+1))
		if err != nil {
			return nil, err
		}
		*pc = uint64(int(*pc+3) + int(offset))
	} else {
		*pc += 3
	}
	return nil, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// This file shows how contract creation is modified to support EOF.
// After the initcode of a contract is executed, the returned code is
// validated to be a compliant EOF container if it starts with the magic bytes.

// Create creates a new contract using the data taken from the input.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (code for address generation and value transfer) ...

	// Run the container's init code.
	_, contract.Code, _, err = evm.interpreter.Run(contract, code, false)

	// ... (handle errors and out of gas) ...

	// Post-execution validation for EOF contracts.
	// If the returned code starts with the EOF magic, it must be a valid EOF container.
	// This is the point where deployment-time validation occurs.
	if len(contract.Code) > 0 && contract.Code[0] == 0xef {
		if _, err := ParseEOF(contract.Code); err != nil {
			return nil, common.Address{}, leftOverGas, err
		}
	} else if evm.chainRules.IsEIP3541(evm.Context.BlockNumber) {
		// On chains where EIP-3541 is active, deployed code starting with 0xEF
		// is invalid unless it's a valid EOF container.
		if len(contract.Code) > 0 && contract.Code[0] == 0xef {
			return nil, common.Address{}, leftOverGas, ErrInvalidCodeInV1
		}
	}
	// ... (gas cost calculation and state commit) ...

	return ret, contractAddr, leftOverGas, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/opcodes.go">
```go
// This file defines the properties of the new EOF opcodes, including their
// stack requirements. This is a good reference for the Zig implementation's
// `get_instruction_stack_effects` function.

// An OpCode is a single byte representing an instruction.
type OpCode byte

// ... (existing opcodes) ...

const (
	// ...

	// EIP-4200: Static relative jumps
	RJUMP  OpCode = 0x5c
	RJUMPI OpCode = 0x5d

	// EIP-4750: Functions
	CALLF OpCode = 0xb0
	RETF  OpCode = 0xb1

	// ...
)

// opStack is a map of opcodes to their stack requirements.
// The first value is the number of items popped from the stack,
// the second is the number of items pushed to the stack.
//
// NOTE: For EOF, some opcodes have variable stack effects (e.g., CALLF).
// The static validator in `eof.go` handles this by looking up the type
// information for the called function. The interpreter does the same at runtime.
// The values here are for non-EOF contexts or as a baseline.
var opStack = [256]struct{ pop, push int }{
	// ...
	RJUMP:  {pop: 0, push: 0},
	RJUMPI: {pop: 1, push: 0},
	// CALLF and RETF have variable stack effects, which must be
	// determined from the function's type signature. The static
	// validator will check this at deploy time.
	CALLF: {pop: 0, push: 0}, // Placeholder; actual pop/push depends on type info
	RETF:  {pop: 0, push: 0}, // Placeholder; actual pop depends on type info
	// ...
}
```
</file>
</go-ethereum>
## Prompt Corrections

The original prompt is excellent and provides a very solid foundation for implementing EOF. The Zig code snippets are well-structured and closely mirror the logic found in production implementations like `go-ethereum`.

There are no direct errors in the prompt. However, here are some improvements and clarifications based on the `go-ethereum` implementation that could make the implementation process smoother:

1.  **Deployment Validation Nuance**: The prompt correctly states that code is validated at deployment time. The `go-ethereum/core/vm/evm.go` snippet clarifies *exactly* when this happens: after the `initcode` for a contract creation runs, the **returned code** is what gets parsed and validated as an EOF container. This is a critical detail for the `Vm.deploy_eof_contract` task.

2.  **`JUMPDEST` Analysis is Key for `RJUMP` Validation**: The `go-ethereum/core/vm/eof.go` `validateEOFCode` function shows that before validating instructions, it first calculates a `jumpdestBits` bitmap. This bitmap marks every valid instruction start. The `RJUMP` and `RJUMPI` validation then simply checks if the calculated jump target is a '1' in this bitmap. This is a much more efficient and robust way to validate jump targets than re-calculating instruction boundaries on every jump. The prompt's `CodeValidator` should be updated to include this pre-analysis step.

3.  **Variable Stack Effects of `CALLF`/`RETF`**: The `go-ethereum/core/vm/opcodes.go` file shows that `CALLF` and `RETF` have variable stack effects. The prompt's `get_instruction_stack_effects` function has a placeholder for this. The `go-ethereum` `validateEOFCode` implementation shows the correct approach: during validation of a `CALLF` instruction, the validator must read the function index from the immediate operand, look up the `TypeInfo` for that function, and then adjust the simulated stack height based on the `inputs` and `outputs` from that specific `TypeInfo`. The same applies to `RETF` and its function's `outputs`.

4.  **`RETF` Must Be Terminal**: A subtle but important validation rule shown in `go-ethereum`'s `validateEOFCode` is that `RETF` *must* be the very last instruction in its code section. The prompt's `CodeValidator` should include this check.

---

<go-ethereum>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof/eof.go">
```go
// Package eof handles the EVM Object Format (EOF), as specified by EIP-3540.
// It provides functionality for parsing and basic validation of EOF-formatted
// contract code.
package eof

import (
	"encoding/binary"
	"errors"
	"fmt"

	"github.com/ethereum/go-ethereum/params"
)

// Magic is the first two bytes of a valid EOF container.
var Magic = [2]byte{0xEF, 0x00}

// Version is the supported EOF version.
const Version = 0x01

const (
	// KindType identifies a type section.
	KindType = byte(0x01)
	// KindCode identifies a code section.
	KindCode = byte(0x02)
	// KindData identifies a data section.
	KindData = byte(0x03)
	// KindTerminator identifies the end of sections.
	KindTerminator = byte(0x00)
)

const (
	// MaxTypeSections is the maximum number of type sections allowed.
	MaxTypeSections = 1
	// MaxCodeSections is the maximum number of code sections allowed.
	MaxCodeSections = 1024
	// MaxDataSections is the maximum number of data sections allowed.
	MaxDataSections = 1
)

// EOF represents a parsed EOF container.
type EOF struct {
	Version      byte
	Types        []Type    // All type sections concatenated.
	Code         [][]byte  // All code sections.
	Data         []byte    // The data section.
	Subcontainer [][]byte  // EOFs embedded in data section
	Size         uintptr   // Memory size of the EOF structure
	CodeOutputs  [][]uint8 // outputs for each code section; an optimisation to avoid re-computing it all the time
}

// Type represents the type information for a single function.
type Type struct {
	Inputs  byte
	Outputs byte
	MaxStack uint16
}

// Parse checks if the given code is valid EOF and if so, returns the parsed
// container.
func Parse(code []byte) (EOF, error) {
	eof := EOF{}

	// Magic and version check
	if len(code) < 3 || code[0] != Magic[0] || code[1] != Magic[1] {
		return eof, errors.New("invalid EOF magic")
	}
	eof.Version = code[2]
	if eof.Version != Version {
		return eof, fmt.Errorf("unsupported EOF version: %d", eof.Version)
	}

	// Section headers parsing
	offset := 3
	numCodeSections := 0
	numDataSections := 0
	hasTerminator := false

	// Loop over section headers until the terminator is found
	for !hasTerminator {
		if offset+1 > len(code) {
			return eof, errors.New("EOF container too short")
		}
		kind := code[offset]
		offset++

		switch kind {
		case KindType:
			if len(eof.Types) > 0 {
				return eof, errors.New("multiple type sections")
			}
			if offset+2 > len(code) {
				return eof, errors.New("EOF container too short")
			}
			size := binary.BigEndian.Uint16(code[offset : offset+2])
			offset += 2
			if size == 0 {
				return eof, errors.New("invalid zero-sized type section")
			}
			if int(size)%4 != 0 {
				return eof, errors.New("invalid type section size")
			}

			if offset+int(size) > len(code) {
				return eof, errors.New("type section size exceeds code size")
			}
			eof.Types = make([]Type, size/4)
			for i := 0; i < int(size)/4; i++ {
				eof.Types[i].Inputs = code[offset+i*4]
				eof.Types[i].Outputs = code[offset+i*4+1]
				eof.Types[i].MaxStack = binary.BigEndian.Uint16(code[offset+i*4+2 : offset+i*4+4])
			}
			offset += int(size)

		case KindCode:
			numCodeSections++
			if numCodeSections > MaxCodeSections {
				return eof, errors.New("too many code sections")
			}
			if offset+2 > len(code) {
				return eof, errors.New("EOF container too short")
			}
			size := binary.BigEndian.Uint16(code[offset : offset+2])
			offset += 2
			if size == 0 {
				return eof, errors.New("code section is zero-sized")
			}

			if offset+int(size) > len(code) {
				return eof, errors.New("code section size exceeds code size")
			}
			eof.Code = append(eof.Code, code[offset:offset+int(size)])
			offset += int(size)

		case KindData:
			numDataSections++
			if numDataSections > MaxDataSections {
				return eof, errors.New("multiple data sections")
			}
			if offset+2 > len(code) {
				return eof, errors.New("EOF container too short")
			}
			size := binary.BigEndian.Uint16(code[offset : offset+2])
			offset += 2
			if size == 0 {
				return eof, errors.New("data section is zero-sized")
			}

			if offset+int(size) > len(code) {
				return eof, errors.New("data section size exceeds code size")
			}
			eof.Data = code[offset : offset+int(size)]
			offset += int(size)

		case KindTerminator:
			hasTerminator = true

		default:
			return eof, fmt.Errorf("invalid section kind: %d", kind)
		}
	}

	if !hasTerminator {
		return eof, errors.New("missing terminator")
	}

	// Validate section counts and order
	if len(eof.Types) == 0 {
		return eof, errors.New("missing type section")
	}
	if len(eof.Code) == 0 {
		return eof, errors.New("missing code section")
	}
	if len(eof.Types) != numCodeSections {
		return eof, errors.New("type/code section mismatch")
	}
	if offset > len(code) {
		return eof, errors.New("section content size mismatch")
	}
	if len(eof.Data) != len(code)-offset {
		return eof, errors.New("data section size mismatch")
	}
	return eof, nil
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/eof/validation.go">
```go
package eof

import (
	"errors"
	"fmt"
	"math/bits"

	"github.com/ethereum/go-ethereum/core/vm"
)

// Validate validates the EOF container against the full set of rules.
// This should be called only during contract creation.
func (c *EOF) Validate(rules vm.Rules) error {
	if len(c.Code) != len(c.Types) {
		return errors.New("code and type section mismatch")
	}
	for i, code := range c.Code {
		if err := c.validateCode(i, code, rules); err != nil {
			return fmt.Errorf("code section %d invalid: %w", i, err)
		}
	}
	return nil
}

// validateCode validates a single code section.
func (c *EOF) validateCode(codeSectionIndex int, code []byte, rules vm.Rules) error {
	if len(code) > 2*vm.MaxCodeSize {
		return errors.New("code section too large")
	}
	opInfo := vm.GetEofOpInfo()

	// Perform static analysis of the code.
	maxStack := c.Types[codeSectionIndex].Inputs
	var stackSize uint16 = c.Types[codeSectionIndex].Inputs
	jumpdests := make(map[uint16]struct{})

	pc := uint16(0)
	for pc < uint16(len(code)) {
		op := vm.OpCode(code[pc])
		info := opInfo[op]

		// Check for undefined opcodes.
		if !info.IsDefined {
			return fmt.Errorf("undefined instruction 0x%x", op)
		}
		// JUMP, JUMPI, JUMPDEST are not allowed.
		if op == vm.JUMP || op == vm.JUMPI || op == vm.JUMPDEST {
			return fmt.Errorf("invalid opcode %v", op)
		}
		// All push opcodes are not allowed.
		if op >= vm.PUSH1 && op <= vm.PUSH32 {
			return fmt.Errorf("invalid opcode %v", op)
		}
		// Check stack requirements.
		if stackSize < info.StackReads {
			return fmt.Errorf("stack underflow (%d < %d)", stackSize, info.StackReads)
		}
		stackSize = stackSize - info.StackReads + info.StackWrites
		if stackSize > c.Types[codeSectionIndex].MaxStack {
			return fmt.Errorf("max stack exceeded (%d > %d)", stackSize, c.Types[codeSectionIndex].MaxStack)
		}
		// Calculate max stack height seen so far.
		if stackSize > maxStack {
			maxStack = stackSize
		}

		if op == vm.RJUMP || op == vm.RJUMPI {
			if pc+2 >= uint16(len(code)) {
				return errors.New("truncated relative jump")
			}
			// The jump offset is a signed 16-bit integer.
			offset := int16(binary.BigEndian.Uint16(code[pc+1 : pc+3]))
			dest := int64(pc) + 3 + int64(offset)
			if dest < 0 || dest >= int64(len(code)) {
				return fmt.Errorf("relative jump destination out of bounds %d", dest)
			}
			jumpdests[uint16(dest)] = struct{}{}
		} else if op == vm.CALLF {
			if pc+2 >= uint16(len(code)) {
				return errors.New("truncated callf")
			}
			section := binary.BigEndian.Uint16(code[pc+1 : pc+3])
			if int(section) >= len(c.Code) {
				return fmt.Errorf("invalid code section %d", section)
			}
			// Check stack requirements for the call.
			if stackSize < c.Types[section].Inputs {
				return errors.New("stack underflow for callf")
			}
			stackSize = stackSize - c.Types[section].Inputs + c.Types[section].Outputs
			if stackSize > c.Types[codeSectionIndex].MaxStack {
				return fmt.Errorf("max stack exceeded (%d > %d)", stackSize, c.Types[codeSectionIndex].MaxStack)
			}
		}
		pc += uint16(info.Size)
	}

	// The last instruction must be a terminating one.
	if len(code) > 0 {
		lastOp := vm.OpCode(code[len(code)-1])
		if !isTerminating(lastOp) {
			return errors.New("non-terminating instruction at end of code")
		}
	}
	// Check stack height at the end of the code.
	if stackSize != c.Types[codeSectionIndex].Outputs {
		return fmt.Errorf("unbalanced stack, expected %d, got %d", c.Types[codeSectionIndex].Outputs, stackSize)
	}
	return nil
}

// isTerminating returns true if the given opcode is a terminating one.
func isTerminating(op vm.OpCode) bool {
	return op == vm.RETF || op == vm.STOP || op == vm.REVERT
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/interpreter.go">
```go
// run is the main loop for executing EVM code.
func (in *Interpreter) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (omitted setup)

	// Check if the contract is an EOF contract.
	if len(contract.Code) > 0 && contract.Code[0] == eof.Magic[0] {
		// This is an EOF contract, run it in the EOF interpreter.
		return in.runEOF(contract, input, readOnly)
	}

	// ... (legacy EVM execution loop) ...
}


// runEOF is the main loop for executing EOF-formatted EVM code.
func (in *Interpreter) runEOF(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
	// ... (omitted initial setup and gas checks) ...
	
	// Ensure the contract is parsed and validated before execution.
	eofCode, err := eof.Parse(contract.Code)
	if err != nil {
		return nil, err
	}
	// Note: Full validation is only performed at deployment time.
	// Here we assume the code is valid as it's already on-chain.

	var (
		op          OpCode
		code        []byte
		pc          uint64
		codeSection uint16

		returnStack []returnFrame // The return stack for CALLF/RETF
		opInfo      = GetEofOpInfo()
	)

	// The first code section is the entry point.
	code = eofCode.Code[0]

	for {
		// ... (gas checks, debug tracing, etc.) ...
		
		op = OpCode(code[pc])
		opExecution := opInfo[op]

		// ... (stack validation based on opExecution info) ...
		
		switch op {
		case RJUMP:
			// Read 16-bit signed offset from bytecode.
			offset := int16(binary.BigEndian.Uint16(code[pc+1:]))
			// New PC is relative to the position *after* the RJUMP instruction.
			pc = uint64(int64(pc) + 3 + int64(offset))
			continue // Continue to next instruction without incrementing PC.

		case RJUMPI:
			// Pop condition from stack.
			val := in.stack.pop()
			if !val.IsZero() {
				// Condition is true, take the jump.
				offset := int16(binary.BigEndian.Uint16(code[pc+1:]))
				pc = uint64(int64(pc) + 3 + int64(offset))
				continue
			}
			// Condition is false, fall through.
			pc += 3 // Skip instruction and its operand.

		case CALLF:
			// Read target code section index.
			section := binary.BigEndian.Uint16(code[pc+1:])

			// Push current state to the return stack.
			returnStack = append(returnStack, returnFrame{
				pc:          pc + 3, // Return to instruction after CALLF.
				codeSection: codeSection,
			})
			if len(returnStack) > 1024 {
				return nil, ErrDepth
			}

			// Switch to the new code section.
			codeSection = section
			code = eofCode.Code[codeSection]
			pc = 0 // Start at the beginning of the new section.
			continue

		case RETF:
			if len(returnStack) == 0 {
				// Returning from the top-level function, execution ends.
				return in.returnData, nil
			}

			// Pop from the return stack to resume previous function.
			lastFrame := returnStack[len(returnStack)-1]
			returnStack = returnStack[:len(returnStack)-1]

			codeSection = lastFrame.codeSection
			pc = lastFrame.pc
			code = eofCode.Code[codeSection]
			continue

		// ... other EOF opcodes ...

		default:
			// Standard opcode execution logic can be placed here if any are shared.
			// Or handle as an error for opcodes not allowed in EOF.
			return nil, &ErrInvalidOpcode{opcode: op}
		}
		// ... (PC increment for non-jump instructions) ...
	}
}

// returnFrame holds the information needed to return from a function call (CALLF).
type returnFrame struct {
	pc          uint64
	codeSection uint16
}
```
</file>
<file path="https://github.com/ethereum/go-ethereum/blob/master/core/vm/evm.go">
```go
// Create creates a new contract using code as deployment code.
func (evm *EVM) Create(caller ContractRef, code []byte, gas uint64, value *uint256.Int) (ret []byte, contractAddr common.Address, leftOverGas uint64, err error) {
	// ... (omitted initial checks) ...

	// In EIP-3541, reject contracts starting with 0xEF
	if evm.chainRules.IsEIP3541 && len(code) > 0 && code[0] == 0xEF {
		return nil, common.Address{}, gas, ErrInvalidCodeInCreate
	}

	// Check if the code is EOF. If it is, we need to do validation before anything else.
	if evm.chainRules.IsEIP3540 && len(code) > 0 && code[0] == eof.Magic[0] {
		// This is an EOF contract.
		eofCode, err := eof.Parse(code)
		if err != nil {
			return nil, common.Address{}, 0, err
		}
		if err := eofCode.Validate(evm.chainRules); err != nil {
			return nil, common.Address{}, 0, err
		}

		// EOF contract deployment stores the whole container, not just runtime code.
		// There is no initcode execution for EOF contracts in this model.
		// The `code` passed to Create IS the final contract.
		contractAddr = evm.StateDB.GetNextNonce(caller.Address())
		evm.StateDB.SetCode(contractAddr, code)

		// ... (gas calculation for deployment) ...
		return nil, contractAddr, gas, nil
	}

	// ... (legacy contract creation logic) ...
	// It involves running the initcode and taking the return value as the contract's runtime code.
	// Legacy contracts will execute the code in `run` method, which does not have the EOF check.
}

// Call executes the contract associated with the destination address.
func (evm *EVM) Call(caller ContractRef, addr common.Address, input []byte, gas uint64, value *uint256.Int) (ret []byte, leftOverGas uint64, err error) {
	// ... (omitted checks for depth, value transfer, etc.) ...

	// If the account has no code, it's a simple value transfer.
	if evm.StateDB.GetCodeSize(addr) == 0 {
		// ... (handle simple transfer) ...
		return nil, gas, nil
	}
	
	// Retrieve code from the state database.
	code := evm.StateDB.GetCode(addr)

	// Check if it's an EOF contract.
	if evm.chainRules.IsEIP3540 && len(code) > 0 && code[0] == eof.Magic[0] {
		// EOF contracts have a different execution model.
		// The `runEOF` method in the interpreter handles this.
	}
	
	// ... (setup for contract execution) ...
	
	// Create a new contract object for the execution context.
	contract := NewContract(caller, AccountRef(addr), value, gas)
	contract.SetCode(addr, code)

	// Execute the contract. The interpreter's `Run` method will detect EOF
	// and dispatch to `runEOF`.
	ret, err = evm.interpreter.Run(contract, input, evm.readOnly)
	
	// ... (handle result and refund gas) ...
	return ret, contract.Gas, err
}

```
</file>
</go-ethereum>
## Prompt Corrections
The original prompt provides an excellent and detailed overview of implementing EOF support. The Zig code snippets are well-structured and reflect the EOF specification accurately. Here are a few minor corrections and observations based on the `go-ethereum` implementation:

1.  **Opcode Set Evolution**: The prompt lists several new opcodes like `RJUMPV`, `JUMPF`, `DUPN`, `SWAPN`, and `EXCHANGE`. These are part of later EOF EIPs (like EIP-6206 and EIP-7480) which build on the foundational EOF EIPs. The provided `go-ethereum` snippets focus on the initial, core set of EOF opcodes (`RJUMP`, `RJUMPI`, `CALLF`, `RETF`) which establish the fundamental execution model. When implementing, it's common to start with the foundational EIPs and add the others incrementally. The patterns for `CALLF` and `RJUMP` can be adapted to implement the others.

2.  **Execution Loop**: `go-ethereum` handles EOF execution in a completely separate loop (`runEOF`) within the interpreter, rather than adding cases to the main `run` loop's switch statement. This is a clean design choice because the execution semantics (e.g., no PUSH opcodes, PC management, return stack) are fundamentally different. The prompt's approach in `Task 5` of adding cases to the main VM loop is also valid, but a separate function for the EOF context might be cleaner.

3.  **Deployment Validation**: The `go-ethereum` `Create` function shows that EOF validation (`eofCode.Validate`) happens *before* any state changes (like nonce increment or balance transfer). This is a critical security property of EOF: if the container is invalid, the deployment fails entirely with no side effects, and all gas is consumed.

4.  **No Initcode Execution for EOF**: A key distinction highlighted by the `go-ethereum` `Create` function is that for EOF, the `code` provided for creation *is* the final contract. There is no concept of executing "initcode" which then *returns* the runtime bytecode. The entire valid EOF container is stored directly as the contract's code. This simplifies the deployment process significantly compared to legacy contracts.

