// Simplified version of the opReturn function with debugging prints

const std = @import("std");
const pkg = @import("fixed_package_test.zig");
const Frame = pkg.Frame;
const Interpreter = pkg.Interpreter;
const ExecutionError = pkg.ExecutionError;

/// Debug version of RETURN opcode
pub fn opReturnDebug(_: usize, _: *Interpreter, frame: *Frame) ExecutionError![]const u8 {
    // Print debug info
    std.debug.print("Starting opReturnDebug\n", .{});
    
    // Pop offset and size from the stack
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    
    std.debug.print("Popped offset: {d}, size: {d}\n", .{offset, size});
    
    // Sanity check size to prevent excessive memory usage
    if (size > std.math.maxInt(usize)) {
        std.debug.print("Size too large\n", .{});
        return ExecutionError.OutOfGas;
    }
    
    const size_usize = @as(usize, @intCast(size));
    
    if (size_usize > 0) {
        std.debug.print("Size > 0, processing data\n", .{});
        
        // Check if offset is too large
        if (offset > std.math.maxInt(usize)) {
            std.debug.print("Offset too large\n", .{});
            return ExecutionError.OutOfGas;
        }
        
        const offset_usize = @as(usize, @intCast(offset));
        
        // Check if offset + size would overflow
        if (offset_usize > std.math.maxInt(usize) - size_usize) {
            std.debug.print("Offset + size would overflow\n", .{});
            return ExecutionError.OutOfGas;
        }
        
        // Debug print memory state
        std.debug.print("Memory size before require: {d}\n", .{frame.memory.data.len});
        
        // Ensure memory is sized appropriately before accessing
        frame.memory.require(offset_usize, size_usize) catch {
            std.debug.print("Memory resize failed\n", .{});
            return ExecutionError.OutOfGas;
        };
        
        std.debug.print("Memory size after require: {d}\n", .{frame.memory.data.len});
        
        // Print memory contents to verify data
        for (0..size_usize) |i| {
            const byte = frame.memory.get8(offset_usize + i);
            std.debug.print("Memory[{d}] = 0x{X:0>2}\n", .{offset_usize + i, byte});
        }
        
        // Create a new buffer for the return data
        var return_buffer = frame.memory.allocator.alloc(u8, size_usize) catch {
            std.debug.print("Failed to allocate return buffer\n", .{});
            return ExecutionError.OutOfGas;
        };
        
        // Safely copy memory contents to the new buffer
        for (0..size_usize) |i| {
            // Use safer get8 method that will handle bounds checking
            return_buffer[i] = frame.memory.get8(offset_usize + i);
            std.debug.print("return_buffer[{d}] = 0x{X:0>2}\n", .{i, return_buffer[i]});
        }
        
        // Free existing return data if any
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice and has content
            if (old_data.len > 0 and @intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                std.debug.print("Freeing old return data of length {d}\n", .{old_data.len});
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Set the return data using the safely constructed buffer
        frame.returnData = return_buffer;
        std.debug.print("Set return data of length {d}\n", .{return_buffer.len});
        
        // Print return data to verify
        if (frame.returnData) |data| {
            for (0..data.len) |i| {
                std.debug.print("frame.returnData[{d}] = 0x{X:0>2}\n", .{i, data[i]});
            }
        }
    } else {
        std.debug.print("Size is 0, setting empty return data\n", .{});
        
        // Empty return data
        // Free existing return data if any
        if (frame.returnData) |old_data| {
            // Only free if it's not a static empty slice and has content
            if (old_data.len > 0 and @intFromPtr(old_data.ptr) != @intFromPtr((&[_]u8{}).ptr)) {
                std.debug.print("Freeing old return data of length {d}\n", .{old_data.len});
                frame.memory.allocator.free(old_data);
            }
        }
        
        // Use a static empty slice to avoid allocation
        frame.returnData = &[_]u8{};
    }
    
    std.debug.print("Returning STOP\n", .{});
    
    // Halt execution
    return ExecutionError.STOP;
}