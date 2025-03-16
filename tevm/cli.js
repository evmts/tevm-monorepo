#!/usr/bin/env node

console.log("\x1b[90m$ tevm " + process.argv.slice(2).join(" ") + "\x1b[0m");
import("@tevm/cli");
