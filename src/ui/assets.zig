// This file is auto-generated. Do not edit manually.
const std = @import("std");

pub const Asset = struct {
    path: []const u8,
    content: []const u8,
    mime_type: []const u8,

    pub const assets = [_]Asset{
    .{
        .path = "/index.html",
        .content = @embedFile("dist/index.html"),
        .mime_type = "text/html",
    },
    .{
        .path = "/vite.svg",
        .content = @embedFile("dist/vite.svg"),
        .mime_type = "image/svg+xml",
    },
    .{
        .path = "/assets/index-g0-s2jNV.js",
        .content = @embedFile("dist/assets/index-g0-s2jNV.js"),
        .mime_type = "application/javascript",
    },
    .{
        .path = "/assets/index-BG_JvFUn.css",
        .content = @embedFile("dist/assets/index-BG_JvFUn.css"),
        .mime_type = "text/css",
    },
    .{
        .path = "/assets/logo-BKhbptE1.svg",
        .content = @embedFile("dist/assets/logo-BKhbptE1.svg"),
        .mime_type = "image/svg+xml",
    },
    .{
        .path = "/tauri.svg",
        .content = @embedFile("dist/tauri.svg"),
        .mime_type = "image/svg+xml",
    },
    };

    pub fn getAsset(filename: []const u8) ?Asset {
        for (assets) |asset| {
            if (std.mem.eql(u8, asset.path, filename)) {
                return asset;
            }
        }
        return null;
    }
};
