const std = @import("std");

pub const Contracts = struct {
    pub const SnailTracer = @import("snail_tracer.zig");
};

pub const ContractCompiler = struct {
    allocator: std.mem.Allocator,
    snail_tracer: ?CompiledContractData = null,

    pub const CompiledContractData = struct {
        abi: []const u8,
        bytecode: []const u8,
        deployed_bytecode: []const u8,
        allocator: std.mem.Allocator,

        pub fn deinit(self: *CompiledContractData) void {
            self.allocator.free(self.abi);
            self.allocator.free(self.bytecode);
            self.allocator.free(self.deployed_bytecode);
        }
    };

    pub fn init(allocator: std.mem.Allocator) !ContractCompiler {
        var compiler = ContractCompiler{
            .allocator = allocator,
        };

        // Mock compiled contract data for now
        // TODO: Use actual Compiler when C dependencies are available
        const mock_abi =
            \\[{"inputs":[],"name":"Benchmark","outputs":[{"internalType":"bytes1","name":"r","type":"bytes1"},{"internalType":"bytes1","name":"g","type":"bytes1"},{"internalType":"bytes1","name":"b","type":"bytes1"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"spp","type":"int256"}],"name":"TraceImage","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"x","type":"int256"},{"internalType":"int256","name":"y","type":"int256"},{"internalType":"int256","name":"spp","type":"int256"}],"name":"TracePixel","outputs":[{"internalType":"bytes1","name":"r","type":"bytes1"},{"internalType":"bytes1","name":"g","type":"bytes1"},{"internalType":"bytes1","name":"b","type":"bytes1"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"int256","name":"y","type":"int256"},{"internalType":"int256","name":"spp","type":"int256"}],"name":"TraceScanline","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"nonpayable","type":"function"}]
        ;

        const mock_bytecode = "0x608060405234801561001057600080fd5b506104b1806100206000396000f3fe";
        const mock_deployed_bytecode = "0x608060405234801561001057600080fd5b50600080fd5b506104b1";

        compiler.snail_tracer = CompiledContractData{
            .abi = try allocator.dupe(u8, mock_abi),
            .bytecode = try allocator.dupe(u8, mock_bytecode),
            .deployed_bytecode = try allocator.dupe(u8, mock_deployed_bytecode),
            .allocator = allocator,
        };

        return compiler;
    }

    pub fn deinit(self: *ContractCompiler) void {
        if (self.snail_tracer) |*snail_tracer| {
            snail_tracer.deinit();
        }
    }

    pub fn getSnailTracerAbi(self: *const ContractCompiler) ?[]const u8 {
        if (self.snail_tracer) |snail_tracer| {
            return snail_tracer.abi;
        }
        return null;
    }

    pub fn getSnailTracerBytecode(self: *const ContractCompiler) ?[]const u8 {
        if (self.snail_tracer) |snail_tracer| {
            return snail_tracer.bytecode;
        }
        return null;
    }

    pub fn getSnailTracerDeployedBytecode(self: *const ContractCompiler) ?[]const u8 {
        if (self.snail_tracer) |snail_tracer| {
            return snail_tracer.deployed_bytecode;
        }
        return null;
    }
};
