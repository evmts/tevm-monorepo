const std = @import("std");

/// SnailTracer contract documentation and metadata
pub const SnailTracer = struct {
    pub const contract_name = "SnailTracer";
    pub const description = "A path tracing contract implementing ray tracing entirely in Solidity/EVM";
    pub const license = "GPL-3.0";
    pub const original_author = "Péter Szilágyi";
    pub const github_url = "https://github.com/karalabe/snailtracer";

    /// Functions exposed by the SnailTracer contract
    pub const functions = struct {
        pub const TracePixel = "TracePixel(int256,int256,int256)";
        pub const TraceScanline = "TraceScanline(int256,int256)";
        pub const TraceImage = "TraceImage(int256)";
        pub const Benchmark = "Benchmark()";
    };

    /// Main mathematical structures used in the contract
    pub const Vector = struct {
        x: i256,
        y: i256,
        z: i256,
    };

    pub const Ray = struct {
        origin: Vector,
        direction: Vector,
        depth: i256,
        refract: bool,
    };

    pub const Material = enum {
        Diffuse,
        Specular,
        Refractive,
    };
};
