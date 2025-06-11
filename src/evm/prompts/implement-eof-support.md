# Implement EOF Support

You are implementing EOF Support for the Tevm EVM written in Zig. Your goal is to implement EOF (EVM Object Format) support for contract evolution following Ethereum specifications and maintaining compatibility with existing implementations.

## Development Workflow
- **Branch**: `feat_implement_eof_support` (snake_case)
- **Worktree**: `git worktree add g/feat_implement_eof_support feat_implement_eof_support`
- **Testing**: Run `zig build test-all` before committing
- **Commit**: Use emoji conventional commits with XML summary format


## Context

Implement EVM Object Format (EOF) support, which is a significant evolution of the EVM that introduces structured bytecode containers, static analysis capabilities, and new execution semantics. EOF includes several EIPs: EIP-3540 (container format), EIP-3670 (code validation), EIP-4200 (static relative jumps), EIP-4750 (functions), and EIP-5450 (stack validation).

## ELI5

Current smart contract bytecode is like a long string of assembly instructions all jumbled together with no structure. EOF (EVM Object Format) is like organizing that mess into a proper filing system with labeled sections and safety checks. It's similar to how modern programming languages have functions, imports, and type checking, versus old assembly code that was just one long list of instructions. EOF makes smart contracts safer (by catching errors before deployment), faster (by enabling optimizations), and easier to analyze. It's like upgrading from a text file full of random code to a properly structured program with clear functions and validation.

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

## Test-Driven Development (TDD) Strategy

### Testing Philosophy
🚨 **CRITICAL**: Follow strict TDD approach - write tests first, implement second, refactor third.

**TDD Workflow:**
1. **Red**: Write failing tests for expected behavior
2. **Green**: Implement minimal code to pass tests  
3. **Refactor**: Optimize while keeping tests green
4. **Repeat**: For each new requirement or edge case

### Required Test Categories

#### 1. **Unit Tests** (`/test/evm/eof/eof_support_test.zig`)
```zig
// Test basic eof_support functionality
test "eof_support basic functionality works correctly"
test "eof_support handles edge cases properly"
test "eof_support validates inputs appropriately"
test "eof_support produces correct outputs"
```

#### 2. **Integration Tests**
```zig
test "eof_support integrates with EVM properly"
test "eof_support maintains system compatibility"
test "eof_support works with existing components"
test "eof_support handles cross-system interactions"
```

#### 3. **Performance Tests**
```zig
test "eof_support meets performance requirements"
test "eof_support optimizes resource usage"
test "eof_support scales appropriately with load"
test "eof_support benchmark vs baseline"
```

#### 4. **Compliance Tests**
```zig
test "eof_support meets specification requirements"
test "eof_support maintains EVM compatibility"
test "eof_support handles hardfork transitions"
test "eof_support cross-client behavior consistency"
```

#### 5. **Error Handling Tests**
```zig
test "eof_support handles errors gracefully"
test "eof_support proper error propagation"
test "eof_support recovery from failure states"
test "eof_support validates error conditions"
```

#### 6. **Security Tests** (where applicable)
```zig
test "eof_support prevents security vulnerabilities"
test "eof_support handles malicious inputs safely"
test "eof_support maintains isolation boundaries"
test "eof_support validates security properties"
```

### Test Development Priority
1. **Core functionality** - Basic feature operation
2. **Specification compliance** - Meet requirements
3. **Integration** - System-level correctness
4. **Performance** - Efficiency targets
5. **Error handling** - Robust failures
6. **Security** - Vulnerability prevention

### Test Data Sources
- **Specification documents**: Official requirements and test vectors
- **Reference implementations**: Cross-client compatibility
- **Performance baselines**: Optimization targets
- **Real-world data**: Production scenarios
- **Synthetic cases**: Edge conditions and stress testing

### Continuous Testing
- Run `zig build test-all` after every change
- Maintain 100% test coverage for public APIs
- Validate performance regression prevention
- Test both debug and release builds
- Verify cross-platform behavior

### Test-First Examples

**Before implementation:**
```zig
test "eof_support basic operation" {
    // This test MUST fail initially
    const input = test_data.validInput();
    const expected = test_data.expectedOutput();
    
    const result = eof_support.process(input);
    try testing.expectEqual(expected, result);
}
```

**Then implement:**
```zig
pub const eof_support = struct {
    pub fn process(input: InputType) !OutputType {
        return error.NotImplemented; // Initially
    }
};
```

### Critical Requirements
- **Never commit without passing tests**
- **Test all configuration paths**
- **Verify specification compliance**
- **Validate performance implications**
- **Ensure cross-platform compatibility**

## References

- [EIP-3540: EOF Container Format](https://eips.ethereum.org/EIPS/eip-3540)
- [EIP-3670: EOF Code Validation](https://eips.ethereum.org/EIPS/eip-3670)
- [EIP-4200: EOF Static Relative Jumps](https://eips.ethereum.org/EIPS/eip-4200)
- [EIP-4750: EOF Functions](https://eips.ethereum.org/EIPS/eip-4750)
- [EIP-5450: EOF Stack Validation](https://eips.ethereum.org/EIPS/eip-5450)
- [EOF Test Suite](https://github.com/ethereum/tests/tree/develop/src/EOFTestsFiller)