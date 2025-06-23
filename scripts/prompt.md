<prompt><intro>You are going to do a large scale refactor as a zig bot. Your goal is to only focus on idiomatic language usage as well as optimal performance.   │
│   I will share the entire language spec so you can play role as language expert. I will also share std lib context</intro><context><language-spec>[Pasted text #1  │
│   +11852 lines]</language-spec><std><link>https://ziglang.org/documentation/master/std/</link>visit the docs here and casually explore the std docs to become      │
│   familiar</std></context><steps><step>read src/evm/README.md to become familiar with project. Note we are only interested in src/evm/**/*.zig<step><step>make a   │
│   markdown todo list of every file in the evm package</step><while condition="list is not done"><step>grab next item on list</step><step>Audit that file and fix   │
│   any idiomatic zig things regarding more idiomatic use of language, better use of standard library, or more performant code</step><step>make sure no regressions  │
│   via running all tests `zig build test-all`</step></while><steps><IMPORTANT>You should use git submodules. make a branch. Then check it out in g/<branch name>    │
│   wwork on isolation. Commit as you work. Once your job is complete and you deleted the todo file please squash all your commits together into a single commit     │
│   with message aggregating the stylestic changes you made as well as including this original prompt. You may want to include original prompt in your todo file so  │
│   you don't forget it.<success-criteria>every file in src/evm/**/*.zig is audited for idiomatic performant zig code making great use of standard                   │
│   library</success-criteria><links><>standard lib https://ziglang.org/documentation/master/std/</><>language                                                       │
│   https://ziglang.org/documentation/master/</></links></prompt>
<rawcontent>
Zig Language Reference
Zig Version
0.1.1 | 0.2.0 | 0.3.0 | 0.4.0 | 0.5.0 | 0.6.0 | 0.7.1 | 0.8.1 | 0.9.1 | 0.10.1 | 0.11.0 | 0.12.0 | 0.13.0 | 0.14.1 | master
Table of Contents
Introduction
Zig Standard Library
Hello World
Comments
Doc Comments
Top-Level Doc Comments
Values
Primitive Types
Primitive Values
String Literals and Unicode Code Point Literals
Escape Sequences
Multiline String Literals
Assignment
undefined
Destructuring
Zig Test
Test Declarations
Doctests
Test Failure
Skip Tests
Report Memory Leaks
Detecting Test Build
Test Output and Logging
The Testing Namespace
Test Tool Documentation
Variables
Identifiers
Container Level Variables
Static Local Variables
Thread Local Variables
Local Variables
Integers
Integer Literals
Runtime Integer Values
Floats
Float Literals
Floating Point Operations
Operators
Table of Operators
Precedence
Arrays
Multidimensional Arrays
Sentinel-Terminated Arrays
Destructuring Arrays
Vectors
Destructuring Vectors
Pointers
volatile
Alignment
allowzero
Sentinel-Terminated Pointers
Slices
Sentinel-Terminated Slices
struct
Default Field Values
Faulty Default Field Values
extern struct
packed struct
Struct Naming
Anonymous Struct Literals
Tuples
Destructuring Tuples
enum
extern enum
Enum Literals
Non-exhaustive enum
union
Tagged union
extern union
packed union
Anonymous Union Literals
opaque
Blocks
Shadowing
Empty Blocks
switch
Exhaustive Switching
Switching with Enum Literals
Labeled switch
Inline Switch Prongs
while
Labeled while
while with Optionals
while with Error Unions
inline while
for
Labeled for
inline for
if
if with Optionals
defer
unreachable
Basics
At Compile-Time
noreturn
Functions
Pass-by-value Parameters
Function Parameter Type Inference
inline fn
Function Reflection
Errors
Error Set Type
The Global Error Set
Error Union Type
catch
try
errdefer
Merging Error Sets
Inferred Error Sets
Error Return Traces
Implementation Details
Optionals
Optional Type
null
Optional Pointers
Casting
Type Coercion
Type Coercion: Stricter Qualification
Type Coercion: Integer and Float Widening
Type Coercion: Float to Int
Type Coercion: Slices, Arrays and Pointers
Type Coercion: Optionals
Type Coercion: Error Unions
Type Coercion: Compile-Time Known Numbers
Type Coercion: Unions and Enums
Type Coercion: undefined
Type Coercion: Tuples to Arrays
Explicit Casts
Peer Type Resolution
Zero Bit Types
void
Result Location Semantics
Result Types
Result Locations
usingnamespace
comptime
Introducing the Compile-Time Concept
Compile-Time Parameters
Compile-Time Variables
Compile-Time Expressions
Generic Data Structures
Case Study: print in Zig
Assembly
Output Constraints
Input Constraints
Clobbers
Global Assembly
Atomics
Async Functions
Builtin Functions
@addrSpaceCast
@addWithOverflow
@alignCast
@alignOf
@as
@atomicLoad
@atomicRmw
@atomicStore
@bitCast
@bitOffsetOf
@bitSizeOf
@branchHint
@breakpoint
@mulAdd
@byteSwap
@bitReverse
@offsetOf
@call
@cDefine
@cImport
@cInclude
@clz
@cmpxchgStrong
@cmpxchgWeak
@compileError
@compileLog
@constCast
@ctz
@cUndef
@cVaArg
@cVaCopy
@cVaEnd
@cVaStart
@divExact
@divFloor
@divTrunc
@embedFile
@enumFromInt
@errorFromInt
@errorName
@errorReturnTrace
@errorCast
@export
@extern
@field
@fieldParentPtr
@FieldType
@floatCast
@floatFromInt
@frameAddress
@hasDecl
@hasField
@import
@inComptime
@intCast
@intFromBool
@intFromEnum
@intFromError
@intFromFloat
@intFromPtr
@max
@memcpy
@memset
@memmove
@min
@wasmMemorySize
@wasmMemoryGrow
@mod
@mulWithOverflow
@panic
@popCount
@prefetch
@ptrCast
@ptrFromInt
@rem
@returnAddress
@select
@setEvalBranchQuota
@setFloatMode
@setRuntimeSafety
@shlExact
@shlWithOverflow
@shrExact
@shuffle
@sizeOf
@splat
@reduce
@src
@sqrt
@sin
@cos
@tan
@exp
@exp2
@log
@log2
@log10
@abs
@floor
@ceil
@trunc
@round
@subWithOverflow
@tagName
@This
@trap
@truncate
@Type
@typeInfo
@typeName
@TypeOf
@unionInit
@Vector
@volatileCast
@workGroupId
@workGroupSize
@workItemId
Build Mode
Debug
ReleaseFast
ReleaseSafe
ReleaseSmall
Single Threaded Builds
Illegal Behavior
Reaching Unreachable Code
Index out of Bounds
Cast Negative Number to Unsigned Integer
Cast Truncates Data
Integer Overflow
Default Operations
Standard Library Math Functions
Builtin Overflow Functions
Wrapping Operations
Exact Left Shift Overflow
Exact Right Shift Overflow
Division by Zero
Remainder Division by Zero
Exact Division Remainder
Attempt to Unwrap Null
Attempt to Unwrap Error
Invalid Error Code
Invalid Enum Cast
Invalid Error Set Cast
Incorrect Pointer Alignment
Wrong Union Field Access
Out of Bounds Float to Integer Cast
Pointer Cast Invalid Null
Memory
Choosing an Allocator
Where are the bytes?
Implementing an Allocator
Heap Allocation Failure
Recursion
Lifetime and Ownership
Compile Variables
Compilation Model
Source File Structs
File and Declaration Discovery
Special Root Declarations
Entry Point
Standard Library Options
Panic Handler
Zig Build System
C
C Type Primitives
Import from C Header File
C Translation CLI
Command line flags
Using -target and -cflags
@cImport vs translate-c
C Translation Caching
Translation failures
C Macros
C Pointers
C Variadic Functions
Exporting a C Library
Mixing Object Files
WebAssembly
Freestanding
WASI
Targets
Style Guide
Avoid Redundancy in Names
Avoid Redundant Names in Fully-Qualified Namespaces
Whitespace
Names
Examples
Doc Comment Guidance
Source Encoding
Keyword Reference
Appendix
Containers
Grammar
Zen
Introduction 
Zig is a general-purpose programming language and toolchain for maintaining robust, optimal, and reusable software.

Robust
Behavior is correct even for edge cases such as out of memory.
Optimal
Write programs the best way they can behave and perform.
Reusable
The same code works in many environments which have different constraints.
Maintainable
Precisely communicate intent to the compiler and other programmers. The language imposes a low overhead to reading code and is resilient to changing requirements and environments.
Often the most efficient way to learn something new is to see examples, so this documentation shows how to use each of Zig's features. It is all on one page so you can search with your browser's search tool.

The code samples in this document are compiled and tested as part of the main test suite of Zig.

This HTML document depends on no external files, so you can use it offline.

Zig Standard Library 
The Zig Standard Library has its own documentation.

Zig's Standard Library contains commonly used algorithms, data structures, and definitions to help you build programs or libraries. You will see many examples of Zig's Standard Library used in this documentation. To learn more about the Zig Standard Library, visit the link above.

Alternatively, the Zig Standard Library documentation is provided with each Zig distribution. It can be rendered via a local webserver with:

Shell
zig std
Hello World 
hello.zig
const std = @import("std");

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Hello, {s}!\n", .{"world"});
}
Shell
$ zig build-exe hello.zig
$ ./hello
Hello, world!
Most of the time, it is more appropriate to write to stderr rather than stdout, and whether or not the message is successfully written to the stream is irrelevant. For this common case, there is a simpler API:

hello_again.zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello, world!\n", .{});
}
Shell
$ zig build-exe hello_again.zig
$ ./hello_again
Hello, world!
In this case, the ! may be omitted from the return type of main because no errors are returned from the function.

See also:

Values
Tuples
@import
Errors
Entry Point
Source Encoding
try
Comments 
Zig supports 3 types of comments. Normal comments are ignored, but doc comments and top-level doc comments are used by the compiler to generate the package documentation.

The generated documentation is still experimental, and can be produced with:

Shell
zig test -femit-docs main.zig
comments.zig
const print = @import("std").debug.print;

pub fn main() void {
    // Comments in Zig start with "//" and end at the next LF byte (end of line).
    // The line below is a comment and won't be executed.

    //print("Hello?", .{});

    print("Hello, world!\n", .{}); // another comment
}
Shell
$ zig build-exe comments.zig
$ ./comments
Hello, world!
There are no multiline comments in Zig (e.g. like /* */ comments in C). This allows Zig to have the property that each line of code can be tokenized out of context.

Doc Comments 
A doc comment is one that begins with exactly three slashes (i.e. /// but not ////); multiple doc comments in a row are merged together to form a multiline doc comment. The doc comment documents whatever immediately follows it.

doc_comments.zig
/// A structure for storing a timestamp, with nanosecond precision (this is a
/// multiline doc comment).
const Timestamp = struct {
    /// The number of seconds since the epoch (this is also a doc comment).
    seconds: i64, // signed so we can represent pre-1970 (not a doc comment)
    /// The number of nanoseconds past the second (doc comment again).
    nanos: u32,

    /// Returns a `Timestamp` struct representing the Unix epoch; that is, the
    /// moment of 1970 Jan 1 00:00:00 UTC (this is a doc comment too).
    pub fn unixEpoch() Timestamp {
        return Timestamp{
            .seconds = 0,
            .nanos = 0,
        };
    }
};
Doc comments are only allowed in certain places; it is a compile error to have a doc comment in an unexpected place, such as in the middle of an expression, or just before a non-doc comment.

invalid_doc-comment.zig
/// doc-comment
//! top-level doc-comment
const std = @import("std");
Shell
$ zig build-obj invalid_doc-comment.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/invalid_doc-comment.zig:1:16: error: expected type expression, found 'a document comment'
/// doc-comment
               ^

unattached_doc-comment.zig
pub fn main() void {}

/// End of file
Shell
$ zig build-obj unattached_doc-comment.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/unattached_doc-comment.zig:3:1: error: unattached documentation comment
/// End of file
^~~~~~~~~~~~~~~

Doc comments can be interleaved with normal comments. Currently, when producing the package documentation, normal comments are merged with doc comments.

Top-Level Doc Comments 
A top-level doc comment is one that begins with two slashes and an exclamation point: //!; it documents the current module.

It is a compile error if a top-level doc comment is not placed at the start of a container, before any expressions.

tldoc_comments.zig
//! This module provides functions for retrieving the current date and
//! time with varying degrees of precision and accuracy. It does not
//! depend on libc, but will use functions from it if available.

const S = struct {
    //! Top level comments are allowed inside a container other than a module,
    //! but it is not very useful.  Currently, when producing the package
    //! documentation, these comments are ignored.
};
Values 
values.zig
// Top-level declarations are order-independent:
const print = std.debug.print;
const std = @import("std");
const os = std.os;
const assert = std.debug.assert;

pub fn main() void {
    // integers
    const one_plus_one: i32 = 1 + 1;
    print("1 + 1 = {}\n", .{one_plus_one});

    // floats
    const seven_div_three: f32 = 7.0 / 3.0;
    print("7.0 / 3.0 = {}\n", .{seven_div_three});

    // boolean
    print("{}\n{}\n{}\n", .{
        true and false,
        true or false,
        !true,
    });

    // optional
    var optional_value: ?[]const u8 = null;
    assert(optional_value == null);

    print("\noptional 1\ntype: {}\nvalue: {?s}\n", .{
        @TypeOf(optional_value), optional_value,
    });

    optional_value = "hi";
    assert(optional_value != null);

    print("\noptional 2\ntype: {}\nvalue: {?s}\n", .{
        @TypeOf(optional_value), optional_value,
    });

    // error union
    var number_or_error: anyerror!i32 = error.ArgNotFound;

    print("\nerror union 1\ntype: {}\nvalue: {!}\n", .{
        @TypeOf(number_or_error),
        number_or_error,
    });

    number_or_error = 1234;

    print("\nerror union 2\ntype: {}\nvalue: {!}\n", .{
        @TypeOf(number_or_error), number_or_error,
    });
}
Shell
$ zig build-exe values.zig
$ ./values
1 + 1 = 2
7.0 / 3.0 = 2.3333333e0
false
true
false

optional 1
type: ?[]const u8
value: null

optional 2
type: ?[]const u8
value: hi

error union 1
type: anyerror!i32
value: error.ArgNotFound

error union 2
type: anyerror!i32
value: 1234
Primitive Types 
Primitive Types
Type	C Equivalent	Description
i8	int8_t	signed 8-bit integer
u8	uint8_t	unsigned 8-bit integer
i16	int16_t	signed 16-bit integer
u16	uint16_t	unsigned 16-bit integer
i32	int32_t	signed 32-bit integer
u32	uint32_t	unsigned 32-bit integer
i64	int64_t	signed 64-bit integer
u64	uint64_t	unsigned 64-bit integer
i128	__int128	signed 128-bit integer
u128	unsigned __int128	unsigned 128-bit integer
isize	intptr_t	signed pointer sized integer
usize	uintptr_t, size_t	unsigned pointer sized integer. Also see #5185
c_char	char	for ABI compatibility with C
c_short	short	for ABI compatibility with C
c_ushort	unsigned short	for ABI compatibility with C
c_int	int	for ABI compatibility with C
c_uint	unsigned int	for ABI compatibility with C
c_long	long	for ABI compatibility with C
c_ulong	unsigned long	for ABI compatibility with C
c_longlong	long long	for ABI compatibility with C
c_ulonglong	unsigned long long	for ABI compatibility with C
c_longdouble	long double	for ABI compatibility with C
f16	_Float16	16-bit floating point (10-bit mantissa) IEEE-754-2008 binary16
f32	float	32-bit floating point (23-bit mantissa) IEEE-754-2008 binary32
f64	double	64-bit floating point (52-bit mantissa) IEEE-754-2008 binary64
f80	long double	80-bit floating point (64-bit mantissa) IEEE-754-2008 80-bit extended precision
f128	_Float128	128-bit floating point (112-bit mantissa) IEEE-754-2008 binary128
bool	bool	true or false
anyopaque	void	Used for type-erased pointers.
void	(none)	Always the value void{}
noreturn	(none)	the type of break, continue, return, unreachable, and while (true) {}
type	(none)	the type of types
anyerror	(none)	an error code
comptime_int	(none)	Only allowed for comptime-known values. The type of integer literals.
comptime_float	(none)	Only allowed for comptime-known values. The type of float literals.
In addition to the integer types above, arbitrary bit-width integers can be referenced by using an identifier of i or u followed by digits. For example, the identifier i7 refers to a signed 7-bit integer. The maximum allowed bit-width of an integer type is 65535.

See also:

Integers
Floats
void
Errors
@Type
Primitive Values 
Primitive Values
Name	Description
true and false	bool values
null	used to set an optional type to null
undefined	used to leave a value unspecified
See also:

Optionals
undefined
String Literals and Unicode Code Point Literals 
String literals are constant single-item Pointers to null-terminated byte arrays. The type of string literals encodes both the length, and the fact that they are null-terminated, and thus they can be coerced to both Slices and Null-Terminated Pointers. Dereferencing string literals converts them to Arrays.

Because Zig source code is UTF-8 encoded, any non-ASCII bytes appearing within a string literal in source code carry their UTF-8 meaning into the content of the string in the Zig program; the bytes are not modified by the compiler. It is possible to embed non-UTF-8 bytes into a string literal using \xNN notation.

Indexing into a string containing non-ASCII bytes returns individual bytes, whether valid UTF-8 or not.

Unicode code point literals have type comptime_int, the same as Integer Literals. All Escape Sequences are valid in both string literals and Unicode code point literals.

string_literals.zig
const print = @import("std").debug.print;
const mem = @import("std").mem; // will be used to compare bytes

pub fn main() void {
    const bytes = "hello";
    print("{}\n", .{@TypeOf(bytes)}); // *const [5:0]u8
    print("{d}\n", .{bytes.len}); // 5
    print("{c}\n", .{bytes[1]}); // 'e'
    print("{d}\n", .{bytes[5]}); // 0
    print("{}\n", .{'e' == '\x65'}); // true
    print("{d}\n", .{'\u{1f4a9}'}); // 128169
    print("{d}\n", .{'💯'}); // 128175
    print("{u}\n", .{'⚡'});
    print("{}\n", .{mem.eql(u8, "hello", "h\x65llo")}); // true
    print("{}\n", .{mem.eql(u8, "💯", "\xf0\x9f\x92\xaf")}); // also true
    const invalid_utf8 = "\xff\xfe"; // non-UTF-8 strings are possible with \xNN notation.
    print("0x{x}\n", .{invalid_utf8[1]}); // indexing them returns individual bytes...
    print("0x{x}\n", .{"💯"[1]}); // ...as does indexing part-way through non-ASCII characters
}
Shell
$ zig build-exe string_literals.zig
$ ./string_literals
*const [5:0]u8
5
e
0
true
128169
128175
⚡
true
true
0xfe
0x9f
See also:

Arrays
Source Encoding
Escape Sequences 
Escape Sequences
Escape Sequence	Name
\n	Newline
\r	Carriage Return
\t	Tab
\\	Backslash
\'	Single Quote
\"	Double Quote
\xNN	hexadecimal 8-bit byte value (2 digits)
\u{NNNNNN}	hexadecimal Unicode scalar value UTF-8 encoded (1 or more digits)
Note that the maximum valid Unicode scalar value is 0x10ffff.

Multiline String Literals 
Multiline string literals have no escapes and can span across multiple lines. To start a multiline string literal, use the \\ token. Just like a comment, the string literal goes until the end of the line. The end of the line is not included in the string literal. However, if the next line begins with \\ then a newline is appended and the string literal continues.

multiline_string_literals.zig
const hello_world_in_c =
    \\#include <stdio.h>
    \\
    \\int main(int argc, char **argv) {
    \\    printf("hello world\n");
    \\    return 0;
    \\}
;
See also:

@embedFile
Assignment 
Use the const keyword to assign a value to an identifier:

constant_identifier_cannot_change.zig
const x = 1234;

fn foo() void {
    // It works at file scope as well as inside functions.
    const y = 5678;

    // Once assigned, an identifier cannot be changed.
    y += 1;
}

pub fn main() void {
    foo();
}
Shell
$ zig build-exe constant_identifier_cannot_change.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/constant_identifier_cannot_change.zig:8:5: error: cannot assign to constant
    y += 1;
    ^
referenced by:
    main: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/constant_identifier_cannot_change.zig:12:8
    callMain [inlined]: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22
    callMainWithArgs [inlined]: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:635:20
    posixCallMainAndExit: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:590:36
    2 reference(s) hidden; use '-freference-trace=6' to see all references

const applies to all of the bytes that the identifier immediately addresses. Pointers have their own const-ness.

If you need a variable that you can modify, use the var keyword:

mutable_var.zig
const print = @import("std").debug.print;

pub fn main() void {
    var y: i32 = 5678;

    y += 1;

    print("{d}", .{y});
}
Shell
$ zig build-exe mutable_var.zig
$ ./mutable_var
5679
Variables must be initialized:

var_must_be_initialized.zig
pub fn main() void {
    var x: i32;

    x = 1;
}
Shell
$ zig build-exe var_must_be_initialized.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/var_must_be_initialized.zig:2:15: error: expected '=', found ';'
    var x: i32;
              ^

undefined 
Use undefined to leave variables uninitialized:

assign_undefined.zig
const print = @import("std").debug.print;

pub fn main() void {
    var x: i32 = undefined;
    x = 1;
    print("{d}", .{x});
}
Shell
$ zig build-exe assign_undefined.zig
$ ./assign_undefined
1
undefined can be coerced to any type. Once this happens, it is no longer possible to detect that the value is undefined. undefined means the value could be anything, even something that is nonsense according to the type. Translated into English, undefined means "Not a meaningful value. Using this value would be a bug. The value will be unused, or overwritten before being used."

In Debug and ReleaseSafe mode, Zig writes 0xaa bytes to undefined memory. This is to catch bugs early, and to help detect use of undefined memory in a debugger. However, this behavior is only an implementation feature, not a language semantic, so it is not guaranteed to be observable to code.

Destructuring 
A destructuring assignment can separate elements of indexable aggregate types (Tuples, Arrays, Vectors):

destructuring_to_existing.zig
const print = @import("std").debug.print;

pub fn main() void {
    var x: u32 = undefined;
    var y: u32 = undefined;
    var z: u32 = undefined;

    const tuple = .{ 1, 2, 3 };

    x, y, z = tuple;

    print("tuple: x = {}, y = {}, z = {}\n", .{x, y, z});

    const array = [_]u32{ 4, 5, 6 };

    x, y, z = array;

    print("array: x = {}, y = {}, z = {}\n", .{x, y, z});

    const vector: @Vector(3, u32) = .{ 7, 8, 9 };

    x, y, z = vector;

    print("vector: x = {}, y = {}, z = {}\n", .{x, y, z});
}
Shell
$ zig build-exe destructuring_to_existing.zig
$ ./destructuring_to_existing
tuple: x = 1, y = 2, z = 3
array: x = 4, y = 5, z = 6
vector: x = 7, y = 8, z = 9
A destructuring expression may only appear within a block (i.e. not at container scope). The left hand side of the assignment must consist of a comma separated list, each element of which may be either an lvalue (for instance, an existing `var`) or a variable declaration:

destructuring_mixed.zig
const print = @import("std").debug.print;

pub fn main() void {
    var x: u32 = undefined;

    const tuple = .{ 1, 2, 3 };

    x, var y : u32, const z = tuple;

    print("x = {}, y = {}, z = {}\n", .{x, y, z});

    // y is mutable
    y = 100;

    // You can use _ to throw away unwanted values.
    _, x, _ = tuple;

    print("x = {}", .{x});
}
Shell
$ zig build-exe destructuring_mixed.zig
$ ./destructuring_mixed
x = 1, y = 2, z = 3
x = 2
A destructure may be prefixed with the comptime keyword, in which case the entire destructure expression is evaluated at comptime. All vars declared would be comptime vars and all expressions (both result locations and the assignee expression) are evaluated at comptime.

See also:

Destructuring Tuples
Destructuring Arrays
Destructuring Vectors
Zig Test 
Code written within one or more test declarations can be used to ensure behavior meets expectations:

testing_introduction.zig
const std = @import("std");

test "expect addOne adds one to 41" {

    // The Standard Library contains useful functions to help create tests.
    // `expect` is a function that verifies its argument is true.
    // It will return an error if its argument is false to indicate a failure.
    // `try` is used to return an error to the test runner to notify it that the test failed.
    try std.testing.expect(addOne(41) == 42);
}

test addOne {
    // A test name can also be written using an identifier.
    // This is a doctest, and serves as documentation for `addOne`.
    try std.testing.expect(addOne(41) == 42);
}

/// The function `addOne` adds one to the number given as its argument.
fn addOne(number: i32) i32 {
    return number + 1;
}
Shell
$ zig test testing_introduction.zig
1/2 testing_introduction.test.expect addOne adds one to 41...OK
2/2 testing_introduction.decltest.addOne...OK
All 2 tests passed.
The testing_introduction.zig code sample tests the function addOne to ensure that it returns 42 given the input 41. From this test's perspective, the addOne function is said to be code under test.

zig test is a tool that creates and runs a test build. By default, it builds and runs an executable program using the default test runner provided by the Zig Standard Library as its main entry point. During the build, test declarations found while resolving the given Zig source file are included for the default test runner to run and report on.

This documentation discusses the features of the default test runner as provided by the Zig Standard Library. Its source code is located in lib/compiler/test_runner.zig.
The shell output shown above displays two lines after the zig test command. These lines are printed to standard error by the default test runner:

1/2 testing_introduction.test.expect addOne adds one to 41...
Lines like this indicate which test, out of the total number of tests, is being run. In this case, 1/2 indicates that the first test, out of a total of two tests, is being run. Note that, when the test runner program's standard error is output to the terminal, these lines are cleared when a test succeeds.
2/2 testing_introduction.decltest.addOne...
When the test name is an identifier, the default test runner uses the text decltest instead of test.
All 2 tests passed.
This line indicates the total number of tests that have passed.
Test Declarations 
Test declarations contain the keyword test, followed by an optional name written as a string literal or an identifier, followed by a block containing any valid Zig code that is allowed in a function.

Non-named test blocks always run during test builds and are exempt from Skip Tests.

Test declarations are similar to Functions: they have a return type and a block of code. The implicit return type of test is the Error Union Type anyerror!void, and it cannot be changed. When a Zig source file is not built using the zig test tool, the test declarations are omitted from the build.

Test declarations can be written in the same file, where code under test is written, or in a separate Zig source file. Since test declarations are top-level declarations, they are order-independent and can be written before or after the code under test.

See also:

The Global Error Set
Grammar
Doctests 
Test declarations named using an identifier are doctests. The identifier must refer to another declaration in scope. A doctest, like a doc comment, serves as documentation for the associated declaration, and will appear in the generated documentation for the declaration.

An effective doctest should be self-contained and focused on the declaration being tested, answering questions a new user might have about its interface or intended usage, while avoiding unnecessary or confusing details. A doctest is not a substitute for a doc comment, but rather a supplement and companion providing a testable, code-driven example, verified by zig test.

Test Failure 
The default test runner checks for an error returned from a test. When a test returns an error, the test is considered a failure and its error return trace is output to standard error. The total number of failures will be reported after all tests have run.

testing_failure.zig
const std = @import("std");

test "expect this to fail" {
    try std.testing.expect(false);
}

test "expect this to succeed" {
    try std.testing.expect(true);
}
Shell
$ zig test testing_failure.zig
1/2 testing_failure.test.expect this to fail...FAIL (TestUnexpectedResult)
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/testing.zig:586:14: 0x1032019 in expect (std.zig)
    if (!ok) return error.TestUnexpectedResult;
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/testing_failure.zig:4:5: 0x1032076 in test.expect this to fail (testing_failure.zig)
    try std.testing.expect(false);
    ^
2/2 testing_failure.test.expect this to succeed...OK
1 passed; 0 skipped; 1 failed.
error: the following test command failed with exit code 1:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/48f3ff852a8460792ceab1420717ec5e/test --seed=0x444ba11e
Skip Tests 
One way to skip tests is to filter them out by using the zig test command line parameter --test-filter [text]. This makes the test build only include tests whose name contains the supplied filter text. Note that non-named tests are run even when using the --test-filter [text] command line parameter.

To programmatically skip a test, make a test return the error error.SkipZigTest and the default test runner will consider the test as being skipped. The total number of skipped tests will be reported after all tests have run.

testing_skip.zig
test "this will be skipped" {
    return error.SkipZigTest;
}
Shell
$ zig test testing_skip.zig
1/1 testing_skip.test.this will be skipped...SKIP
0 passed; 1 skipped; 0 failed.
Report Memory Leaks 
When code allocates Memory using the Zig Standard Library's testing allocator, std.testing.allocator, the default test runner will report any leaks that are found from using the testing allocator:

testing_detect_leak.zig
const std = @import("std");

test "detect leak" {
    var list = std.ArrayList(u21).init(std.testing.allocator);
    // missing `defer list.deinit();`
    try list.append('☔');

    try std.testing.expect(list.items.len == 1);
}
Shell
$ zig test testing_detect_leak.zig
1/1 testing_detect_leak.test.detect leak...OK
[gpa] (err): memory address 0x7f5738ba0000 leaked:
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/array_list.zig:474:67: 0x1097ead in ensureTotalCapacityPrecise (std.zig)
                const new_memory = try self.allocator.alignedAlloc(T, alignment, new_capacity);
                                                                  ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/array_list.zig:450:51: 0x105c787 in ensureTotalCapacity (std.zig)
            return self.ensureTotalCapacityPrecise(better_capacity);
                                                  ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/array_list.zig:500:41: 0x103dee8 in addOne (std.zig)
            try self.ensureTotalCapacity(newlen);
                                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/array_list.zig:261:49: 0x103974c in append (std.zig)
            const new_item_ptr = try self.addOne();
                                                ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/testing_detect_leak.zig:6:20: 0x10360a7 in test.detect leak (testing_detect_leak.zig)
    try list.append('☔');
                   ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1193c58 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x118d0e7 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x118621d in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1185af3 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^

All 1 tests passed.
1 errors were logged.
1 tests leaked memory.
error: the following test command failed with exit code 1:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/feba8548ab6b404d64d13c35f0abd4c0/test --seed=0x71d34d97
See also:

defer
Memory
Detecting Test Build 
Use the compile variable @import("builtin").is_test to detect a test build:

testing_detect_test.zig
const std = @import("std");
const builtin = @import("builtin");
const expect = std.testing.expect;

test "builtin.is_test" {
    try expect(isATest());
}

fn isATest() bool {
    return builtin.is_test;
}
Shell
$ zig test testing_detect_test.zig
1/1 testing_detect_test.test.builtin.is_test...OK
All 1 tests passed.
Test Output and Logging 
The default test runner and the Zig Standard Library's testing namespace output messages to standard error.

The Testing Namespace 
The Zig Standard Library's testing namespace contains useful functions to help you create tests. In addition to the expect function, this document uses a couple of more functions as exemplified here:

testing_namespace.zig
const std = @import("std");

test "expectEqual demo" {
    const expected: i32 = 42;
    const actual = 42;

    // The first argument to `expectEqual` is the known, expected, result.
    // The second argument is the result of some expression.
    // The actual's type is casted to the type of expected.
    try std.testing.expectEqual(expected, actual);
}

test "expectError demo" {
    const expected_error = error.DemoError;
    const actual_error_union: anyerror!void = error.DemoError;

    // `expectError` will fail when the actual error is different than
    // the expected error.
    try std.testing.expectError(expected_error, actual_error_union);
}
Shell
$ zig test testing_namespace.zig
1/2 testing_namespace.test.expectEqual demo...OK
2/2 testing_namespace.test.expectError demo...OK
All 2 tests passed.
The Zig Standard Library also contains functions to compare Slices, strings, and more. See the rest of the std.testing namespace in the Zig Standard Library for more available functions.

Test Tool Documentation 
zig test has a few command line parameters which affect the compilation. See zig test --help for a full list.

Variables 
A variable is a unit of Memory storage.

It is generally preferable to use const rather than var when declaring a variable. This causes less work for both humans and computers to do when reading code, and creates more optimization opportunities.

The extern keyword or @extern builtin function can be used to link against a variable that is exported from another object. The export keyword or @export builtin function can be used to make a variable available to other objects at link time. In both cases, the type of the variable must be C ABI compatible.

See also:

Exporting a C Library
Identifiers 
Variable identifiers are never allowed to shadow identifiers from an outer scope.

Identifiers must start with an alphabetic character or underscore and may be followed by any number of alphanumeric characters or underscores. They must not overlap with any keywords. See Keyword Reference.

If a name that does not fit these requirements is needed, such as for linking with external libraries, the @"" syntax may be used.

identifiers.zig
const @"identifier with spaces in it" = 0xff;
const @"1SmallStep4Man" = 112358;

const c = @import("std").c;
pub extern "c" fn @"error"() void;
pub extern "c" fn @"fstat$INODE64"(fd: c.fd_t, buf: *c.Stat) c_int;

const Color = enum {
    red,
    @"really red",
};
const color: Color = .@"really red";
Container Level Variables 
Container level variables have static lifetime and are order-independent and lazily analyzed. The initialization value of container level variables is implicitly comptime. If a container level variable is const then its value is comptime-known, otherwise it is runtime-known.

test_container_level_variables.zig
var y: i32 = add(10, x);
const x: i32 = add(12, 34);

test "container level variables" {
    try expect(x == 46);
    try expect(y == 56);
}

fn add(a: i32, b: i32) i32 {
    return a + b;
}

const std = @import("std");
const expect = std.testing.expect;
Shell
$ zig test test_container_level_variables.zig
1/1 test_container_level_variables.test.container level variables...OK
All 1 tests passed.
Container level variables may be declared inside a struct, union, enum, or opaque:

test_namespaced_container_level_variable.zig
const std = @import("std");
const expect = std.testing.expect;

test "namespaced container level variable" {
    try expect(foo() == 1235);
    try expect(foo() == 1236);
}

const S = struct {
    var x: i32 = 1234;
};

fn foo() i32 {
    S.x += 1;
    return S.x;
}
Shell
$ zig test test_namespaced_container_level_variable.zig
1/1 test_namespaced_container_level_variable.test.namespaced container level variable...OK
All 1 tests passed.
Static Local Variables 
It is also possible to have local variables with static lifetime by using containers inside functions.

test_static_local_variable.zig
const std = @import("std");
const expect = std.testing.expect;

test "static local variable" {
    try expect(foo() == 1235);
    try expect(foo() == 1236);
}

fn foo() i32 {
    const S = struct {
        var x: i32 = 1234;
    };
    S.x += 1;
    return S.x;
}
Shell
$ zig test test_static_local_variable.zig
1/1 test_static_local_variable.test.static local variable...OK
All 1 tests passed.
Thread Local Variables 
A variable may be specified to be a thread-local variable using the threadlocal keyword, which makes each thread work with a separate instance of the variable:

test_thread_local_variables.zig
const std = @import("std");
const assert = std.debug.assert;

threadlocal var x: i32 = 1234;

test "thread local storage" {
    const thread1 = try std.Thread.spawn(.{}, testTls, .{});
    const thread2 = try std.Thread.spawn(.{}, testTls, .{});
    testTls();
    thread1.join();
    thread2.join();
}

fn testTls() void {
    assert(x == 1234);
    x += 1;
    assert(x == 1235);
}
Shell
$ zig test test_thread_local_variables.zig
1/1 test_thread_local_variables.test.thread local storage...OK
All 1 tests passed.
For Single Threaded Builds, all thread local variables are treated as regular Container Level Variables.

Thread local variables may not be const.

Local Variables 
Local variables occur inside Functions, comptime blocks, and @cImport blocks.

When a local variable is const, it means that after initialization, the variable's value will not change. If the initialization value of a const variable is comptime-known, then the variable is also comptime-known.

A local variable may be qualified with the comptime keyword. This causes the variable's value to be comptime-known, and all loads and stores of the variable to happen during semantic analysis of the program, rather than at runtime. All variables declared in a comptime expression are implicitly comptime variables.

test_comptime_variables.zig
const std = @import("std");
const expect = std.testing.expect;

test "comptime vars" {
    var x: i32 = 1;
    comptime var y: i32 = 1;

    x += 1;
    y += 1;

    try expect(x == 2);
    try expect(y == 2);

    if (y != 2) {
        // This compile error never triggers because y is a comptime variable,
        // and so `y != 2` is a comptime value, and this if is statically evaluated.
        @compileError("wrong y value");
    }
}
Shell
$ zig test test_comptime_variables.zig
1/1 test_comptime_variables.test.comptime vars...OK
All 1 tests passed.
Integers 
Integer Literals 
integer_literals.zig
const decimal_int = 98222;
const hex_int = 0xff;
const another_hex_int = 0xFF;
const octal_int = 0o755;
const binary_int = 0b11110000;

// underscores may be placed between two digits as a visual separator
const one_billion = 1_000_000_000;
const binary_mask = 0b1_1111_1111;
const permissions = 0o7_5_5;
const big_address = 0xFF80_0000_0000_0000;
Runtime Integer Values 
Integer literals have no size limitation, and if any Illegal Behavior occurs, the compiler catches it.

However, once an integer value is no longer known at compile-time, it must have a known size, and is vulnerable to safety-checked Illegal Behavior.

runtime_vs_comptime.zig
fn divide(a: i32, b: i32) i32 {
    return a / b;
}
In this function, values a and b are known only at runtime, and thus this division operation is vulnerable to both Integer Overflow and Division by Zero.

Operators such as + and - cause Illegal Behavior on integer overflow. Alternative operators are provided for wrapping and saturating arithmetic on all targets. +% and -% perform wrapping arithmetic while +| and -| perform saturating arithmetic.

Zig supports arbitrary bit-width integers, referenced by using an identifier of i or u followed by digits. For example, the identifier i7 refers to a signed 7-bit integer. The maximum allowed bit-width of an integer type is 65535. For signed integer types, Zig uses a two's complement representation.

See also:

Wrapping Operations
Floats 
Zig has the following floating point types:

f16 - IEEE-754-2008 binary16
f32 - IEEE-754-2008 binary32
f64 - IEEE-754-2008 binary64
f80 - IEEE-754-2008 80-bit extended precision
f128 - IEEE-754-2008 binary128
c_longdouble - matches long double for the target C ABI
Float Literals 
Float literals have type comptime_float which is guaranteed to have the same precision and operations of the largest other floating point type, which is f128.

Float literals coerce to any floating point type, and to any integer type when there is no fractional component.

float_literals.zig
const floating_point = 123.0E+77;
const another_float = 123.0;
const yet_another = 123.0e+77;

const hex_floating_point = 0x103.70p-5;
const another_hex_float = 0x103.70;
const yet_another_hex_float = 0x103.70P-5;

// underscores may be placed between two digits as a visual separator
const lightspeed = 299_792_458.000_000;
const nanosecond = 0.000_000_001;
const more_hex = 0x1234_5678.9ABC_CDEFp-10;
There is no syntax for NaN, infinity, or negative infinity. For these special values, one must use the standard library:

float_special_values.zig
const std = @import("std");

const inf = std.math.inf(f32);
const negative_inf = -std.math.inf(f64);
const nan = std.math.nan(f128);
Floating Point Operations 
By default floating point operations use Strict mode, but you can switch to Optimized mode on a per-block basis:

float_mode_obj.zig
const std = @import("std");
const big = @as(f64, 1 << 40);

export fn foo_strict(x: f64) f64 {
    return x + big - big;
}

export fn foo_optimized(x: f64) f64 {
    @setFloatMode(.optimized);
    return x + big - big;
}
Shell
$ zig build-obj float_mode_obj.zig -O ReleaseFast
For this test we have to separate code into two object files - otherwise the optimizer figures out all the values at compile-time, which operates in strict mode.

float_mode_exe.zig
const print = @import("std").debug.print;

extern fn foo_strict(x: f64) f64;
extern fn foo_optimized(x: f64) f64;

pub fn main() void {
    const x = 0.001;
    print("optimized = {}\n", .{foo_optimized(x)});
    print("strict = {}\n", .{foo_strict(x)});
}
See also:

@setFloatMode
Division by Zero
Operators 
There is no operator overloading. When you see an operator in Zig, you know that it is doing something from this table, and nothing else.

Table of Operators 
Name	Syntax	Types	Remarks	Example
Addition	
a + b
a += b
Integers
Floats
Can cause overflow for integers.
Invokes Peer Type Resolution for the operands.
See also @addWithOverflow.
2 + 5 == 7
Wrapping Addition	
a +% b
a +%= b
Integers
Twos-complement wrapping behavior.
Invokes Peer Type Resolution for the operands.
See also @addWithOverflow.
@as(u32, 0xffffffff) +% 1 == 0
Saturating Addition	
a +| b
a +|= b
Integers
Invokes Peer Type Resolution for the operands.
@as(u8, 255) +| 1 == @as(u8, 255)
Subtraction	
a - b
a -= b
Integers
Floats
Can cause overflow for integers.
Invokes Peer Type Resolution for the operands.
See also @subWithOverflow.
2 - 5 == -3
Wrapping Subtraction	
a -% b
a -%= b
Integers
Twos-complement wrapping behavior.
Invokes Peer Type Resolution for the operands.
See also @subWithOverflow.
@as(u8, 0) -% 1 == 255
Saturating Subtraction	
a -| b
a -|= b
Integers
Invokes Peer Type Resolution for the operands.
@as(u32, 0) -| 1 == 0
Negation	
-a
Integers
Floats
Can cause overflow for integers.
-1 == 0 - 1
Wrapping Negation	
-%a
Integers
Twos-complement wrapping behavior.
-%@as(i8, -128) == -128
Multiplication	
a * b
a *= b
Integers
Floats
Can cause overflow for integers.
Invokes Peer Type Resolution for the operands.
See also @mulWithOverflow.
2 * 5 == 10
Wrapping Multiplication	
a *% b
a *%= b
Integers
Twos-complement wrapping behavior.
Invokes Peer Type Resolution for the operands.
See also @mulWithOverflow.
@as(u8, 200) *% 2 == 144
Saturating Multiplication	
a *| b
a *|= b
Integers
Invokes Peer Type Resolution for the operands.
@as(u8, 200) *| 2 == 255
Division	
a / b
a /= b
Integers
Floats
Can cause overflow for integers.
Can cause Division by Zero for integers.
Can cause Division by Zero for floats in FloatMode.Optimized Mode.
Signed integer operands must be comptime-known and positive. In other cases, use @divTrunc, @divFloor, or @divExact instead.
Invokes Peer Type Resolution for the operands.
10 / 5 == 2
Remainder Division	
a % b
a %= b
Integers
Floats
Can cause Division by Zero for integers.
Can cause Division by Zero for floats in FloatMode.Optimized Mode.
Signed or floating-point operands must be comptime-known and positive. In other cases, use @rem or @mod instead.
Invokes Peer Type Resolution for the operands.
10 % 3 == 1
Bit Shift Left	
a << b
a <<= b
Integers
Moves all bits to the left, inserting new zeroes at the least-significant bit.
b must be comptime-known or have a type with log2 number of bits as a.
See also @shlExact.
See also @shlWithOverflow.
0b1 << 8 == 0b100000000
Saturating Bit Shift Left	
a <<| b
a <<|= b
Integers
See also @shlExact.
See also @shlWithOverflow.
@as(u8, 1) <<| 8 == 255
Bit Shift Right	
a >> b
a >>= b
Integers
Moves all bits to the right, inserting zeroes at the most-significant bit.
b must be comptime-known or have a type with log2 number of bits as a.
See also @shrExact.
0b1010 >> 1 == 0b101
Bitwise And	
a & b
a &= b
Integers
Invokes Peer Type Resolution for the operands.
0b011 & 0b101 == 0b001
Bitwise Or	
a | b
a |= b
Integers
Invokes Peer Type Resolution for the operands.
0b010 | 0b100 == 0b110
Bitwise Xor	
a ^ b
a ^= b
Integers
Invokes Peer Type Resolution for the operands.
0b011 ^ 0b101 == 0b110
Bitwise Not	
~a
Integers
~@as(u8, 0b10101111) == 0b01010000
Defaulting Optional Unwrap	
a orelse b
Optionals
If a is null, returns b ("default value"), otherwise returns the unwrapped value of a. Note that b may be a value of type noreturn.	
const value: ?u32 = null;
const unwrapped = value orelse 1234;
unwrapped == 1234
Optional Unwrap	
a.?
Optionals
Equivalent to:
a orelse unreachable
const value: ?u32 = 5678;
value.? == 5678
Defaulting Error Unwrap	
a catch b
a catch |err| b
Error Unions
If a is an error, returns b ("default value"), otherwise returns the unwrapped value of a. Note that b may be a value of type noreturn. err is the error and is in scope of the expression b.	
const value: anyerror!u32 = error.Broken;
const unwrapped = value catch 1234;
unwrapped == 1234
Logical And	
a and b
bool
If a is false, returns false without evaluating b. Otherwise, returns b.	
(false and true) == false
Logical Or	
a or b
bool
If a is true, returns true without evaluating b. Otherwise, returns b.	
(false or true) == true
Boolean Not	
!a
bool
!false == true
Equality	
a == b
Integers
Floats
bool
type
packed struct
Returns true if a and b are equal, otherwise returns false. Invokes Peer Type Resolution for the operands.	
(1 == 1) == true
Null Check	
a == null
Optionals
Returns true if a is null, otherwise returns false.	
const value: ?u32 = null;
(value == null) == true
Inequality	
a != b
Integers
Floats
bool
type
Returns false if a and b are equal, otherwise returns true. Invokes Peer Type Resolution for the operands.	
(1 != 1) == false
Non-Null Check	
a != null
Optionals
Returns false if a is null, otherwise returns true.	
const value: ?u32 = null;
(value != null) == false
Greater Than	
a > b
Integers
Floats
Returns true if a is greater than b, otherwise returns false. Invokes Peer Type Resolution for the operands.	
(2 > 1) == true
Greater or Equal	
a >= b
Integers
Floats
Returns true if a is greater than or equal to b, otherwise returns false. Invokes Peer Type Resolution for the operands.	
(2 >= 1) == true
Less Than	
a < b
Integers
Floats
Returns true if a is less than b, otherwise returns false. Invokes Peer Type Resolution for the operands.	
(1 < 2) == true
Lesser or Equal	
a <= b
Integers
Floats
Returns true if a is less than or equal to b, otherwise returns false. Invokes Peer Type Resolution for the operands.	
(1 <= 2) == true
Array Concatenation	
a ++ b
Arrays
Only available when the lengths of both a and b are compile-time known.
const mem = @import("std").mem;
const array1 = [_]u32{1,2};
const array2 = [_]u32{3,4};
const together = array1 ++ array2;
mem.eql(u32, &together, &[_]u32{1,2,3,4})
Array Multiplication	
a ** b
Arrays
Only available when the length of a and b are compile-time known.
const mem = @import("std").mem;
const pattern = "ab" ** 3;
mem.eql(u8, pattern, "ababab")
Pointer Dereference	
a.*
Pointers
Pointer dereference.	
const x: u32 = 1234;
const ptr = &x;
ptr.* == 1234
Address Of	
&a
All types		
const x: u32 = 1234;
const ptr = &x;
ptr.* == 1234
Error Set Merge	
a || b
Error Set Type
Merging Error Sets	
const A = error{One};
const B = error{Two};
(A || B) == error{One, Two}
Precedence 
x() x[] x.y x.* x.?
a!b
x{}
!x -x -%x ~x &x ?x
* / % ** *% *| ||
+ - ++ +% -% +| -|
<< >> <<|
& ^ | orelse catch
== != < > <= >=
and
or
= *= *%= *|= /= %= += +%= +|= -= -%= -|= <<= <<|= >>= &= ^= |=
Arrays 
test_arrays.zig
const expect = @import("std").testing.expect;
const assert = @import("std").debug.assert;
const mem = @import("std").mem;

// array literal
const message = [_]u8{ 'h', 'e', 'l', 'l', 'o' };

// alternative initialization using result location
const alt_message: [5]u8 = .{ 'h', 'e', 'l', 'l', 'o' };

comptime {
    assert(mem.eql(u8, &message, &alt_message));
}

// get the size of an array
comptime {
    assert(message.len == 5);
}

// A string literal is a single-item pointer to an array.
const same_message = "hello";

comptime {
    assert(mem.eql(u8, &message, same_message));
}

test "iterate over an array" {
    var sum: usize = 0;
    for (message) |byte| {
        sum += byte;
    }
    try expect(sum == 'h' + 'e' + 'l' * 2 + 'o');
}

// modifiable array
var some_integers: [100]i32 = undefined;

test "modify an array" {
    for (&some_integers, 0..) |*item, i| {
        item.* = @intCast(i);
    }
    try expect(some_integers[10] == 10);
    try expect(some_integers[99] == 99);
}

// array concatenation works if the values are known
// at compile time
const part_one = [_]i32{ 1, 2, 3, 4 };
const part_two = [_]i32{ 5, 6, 7, 8 };
const all_of_it = part_one ++ part_two;
comptime {
    assert(mem.eql(i32, &all_of_it, &[_]i32{ 1, 2, 3, 4, 5, 6, 7, 8 }));
}

// remember that string literals are arrays
const hello = "hello";
const world = "world";
const hello_world = hello ++ " " ++ world;
comptime {
    assert(mem.eql(u8, hello_world, "hello world"));
}

// ** does repeating patterns
const pattern = "ab" ** 3;
comptime {
    assert(mem.eql(u8, pattern, "ababab"));
}

// initialize an array to zero
const all_zero = [_]u16{0} ** 10;

comptime {
    assert(all_zero.len == 10);
    assert(all_zero[5] == 0);
}

// use compile-time code to initialize an array
var fancy_array = init: {
    var initial_value: [10]Point = undefined;
    for (&initial_value, 0..) |*pt, i| {
        pt.* = Point{
            .x = @intCast(i),
            .y = @intCast(i * 2),
        };
    }
    break :init initial_value;
};
const Point = struct {
    x: i32,
    y: i32,
};

test "compile-time array initialization" {
    try expect(fancy_array[4].x == 4);
    try expect(fancy_array[4].y == 8);
}

// call a function to initialize an array
var more_points = [_]Point{makePoint(3)} ** 10;
fn makePoint(x: i32) Point {
    return Point{
        .x = x,
        .y = x * 2,
    };
}
test "array initialization with function calls" {
    try expect(more_points[4].x == 3);
    try expect(more_points[4].y == 6);
    try expect(more_points.len == 10);
}
Shell
$ zig test test_arrays.zig
1/4 test_arrays.test.iterate over an array...OK
2/4 test_arrays.test.modify an array...OK
3/4 test_arrays.test.compile-time array initialization...OK
4/4 test_arrays.test.array initialization with function calls...OK
All 4 tests passed.
See also:

for
Slices
Multidimensional Arrays 
Multidimensional arrays can be created by nesting arrays:

test_multidimensional_arrays.zig
const std = @import("std");
const expect = std.testing.expect;
const expectEqual = std.testing.expectEqual;

const mat4x5 = [4][5]f32{
    [_]f32{ 1.0, 0.0, 0.0, 0.0, 0.0 },
    [_]f32{ 0.0, 1.0, 0.0, 1.0, 0.0 },
    [_]f32{ 0.0, 0.0, 1.0, 0.0, 0.0 },
    [_]f32{ 0.0, 0.0, 0.0, 1.0, 9.9 },
};
test "multidimensional arrays" {
    // mat4x5 itself is a one-dimensional array of arrays.
    try expectEqual(mat4x5[1], [_]f32{ 0.0, 1.0, 0.0, 1.0, 0.0 });

    // Access the 2D array by indexing the outer array, and then the inner array.
    try expect(mat4x5[3][4] == 9.9);

    // Here we iterate with for loops.
    for (mat4x5, 0..) |row, row_index| {
        for (row, 0..) |cell, column_index| {
            if (row_index == column_index) {
                try expect(cell == 1.0);
            }
        }
    }

    // Initialize a multidimensional array to zeros.
    const all_zero: [4][5]f32 = .{.{0} ** 5} ** 4;
    try expect(all_zero[0][0] == 0);
}
Shell
$ zig test test_multidimensional_arrays.zig
1/1 test_multidimensional_arrays.test.multidimensional arrays...OK
All 1 tests passed.
Sentinel-Terminated Arrays 
The syntax [N:x]T describes an array which has a sentinel element of value x at the index corresponding to the length N.

test_null_terminated_array.zig
const std = @import("std");
const expect = std.testing.expect;

test "0-terminated sentinel array" {
    const array = [_:0]u8{ 1, 2, 3, 4 };

    try expect(@TypeOf(array) == [4:0]u8);
    try expect(array.len == 4);
    try expect(array[4] == 0);
}

test "extra 0s in 0-terminated sentinel array" {
    // The sentinel value may appear earlier, but does not influence the compile-time 'len'.
    const array = [_:0]u8{ 1, 0, 0, 4 };

    try expect(@TypeOf(array) == [4:0]u8);
    try expect(array.len == 4);
    try expect(array[4] == 0);
}
Shell
$ zig test test_null_terminated_array.zig
1/2 test_null_terminated_array.test.0-terminated sentinel array...OK
2/2 test_null_terminated_array.test.extra 0s in 0-terminated sentinel array...OK
All 2 tests passed.
See also:

Sentinel-Terminated Pointers
Sentinel-Terminated Slices
Destructuring Arrays 
Arrays can be destructured:

destructuring_arrays.zig
const print = @import("std").debug.print;

fn swizzleRgbaToBgra(rgba: [4]u8) [4]u8 {
    // readable swizzling by destructuring
    const r, const g, const b, const a = rgba;
    return .{ b, g, r, a };
}

pub fn main() void {
    const pos = [_]i32{ 1, 2 };
    const x, const y = pos;
    print("x = {}, y = {}\n", .{x, y});

    const orange: [4]u8 = .{ 255, 165, 0, 255 };
    print("{any}\n", .{swizzleRgbaToBgra(orange)});
}
Shell
$ zig build-exe destructuring_arrays.zig
$ ./destructuring_arrays
x = 1, y = 2
{ 0, 165, 255, 255 }
See also:

Destructuring
Destructuring Tuples
Destructuring Vectors
Vectors 
A vector is a group of booleans, Integers, Floats, or Pointers which are operated on in parallel, using SIMD instructions if possible. Vector types are created with the builtin function @Vector.

Vectors support the same builtin operators as their underlying base types. These operations are performed element-wise, and return a vector of the same length as the input vectors. This includes:

Arithmetic (+, -, /, *, @divFloor, @sqrt, @ceil, @log, etc.)
Bitwise operators (>>, <<, &, |, ~, etc.)
Comparison operators (<, >, ==, etc.)
It is prohibited to use a math operator on a mixture of scalars (individual numbers) and vectors. Zig provides the @splat builtin to easily convert from scalars to vectors, and it supports @reduce and array indexing syntax to convert from vectors to scalars. Vectors also support assignment to and from fixed-length arrays with comptime-known length.

For rearranging elements within and between vectors, Zig provides the @shuffle and @select functions.

Operations on vectors shorter than the target machine's native SIMD size will typically compile to single SIMD instructions, while vectors longer than the target machine's native SIMD size will compile to multiple SIMD instructions. If a given operation doesn't have SIMD support on the target architecture, the compiler will default to operating on each vector element one at a time. Zig supports any comptime-known vector length up to 2^32-1, although small powers of two (2-64) are most typical. Note that excessively long vector lengths (e.g. 2^20) may result in compiler crashes on current versions of Zig.

test_vector.zig
const std = @import("std");
const expectEqual = std.testing.expectEqual;

test "Basic vector usage" {
    // Vectors have a compile-time known length and base type.
    const a = @Vector(4, i32){ 1, 2, 3, 4 };
    const b = @Vector(4, i32){ 5, 6, 7, 8 };

    // Math operations take place element-wise.
    const c = a + b;

    // Individual vector elements can be accessed using array indexing syntax.
    try expectEqual(6, c[0]);
    try expectEqual(8, c[1]);
    try expectEqual(10, c[2]);
    try expectEqual(12, c[3]);
}

test "Conversion between vectors, arrays, and slices" {
    // Vectors and fixed-length arrays can be automatically assigned back and forth
    const arr1: [4]f32 = [_]f32{ 1.1, 3.2, 4.5, 5.6 };
    const vec: @Vector(4, f32) = arr1;
    const arr2: [4]f32 = vec;
    try expectEqual(arr1, arr2);

    // You can also assign from a slice with comptime-known length to a vector using .*
    const vec2: @Vector(2, f32) = arr1[1..3].*;

    const slice: []const f32 = &arr1;
    var offset: u32 = 1; // var to make it runtime-known
    _ = &offset; // suppress 'var is never mutated' error
    // To extract a comptime-known length from a runtime-known offset,
    // first extract a new slice from the starting offset, then an array of
    // comptime-known length
    const vec3: @Vector(2, f32) = slice[offset..][0..2].*;
    try expectEqual(slice[offset], vec2[0]);
    try expectEqual(slice[offset + 1], vec2[1]);
    try expectEqual(vec2, vec3);
}
Shell
$ zig test test_vector.zig
1/2 test_vector.test.Basic vector usage...OK
2/2 test_vector.test.Conversion between vectors, arrays, and slices...OK
All 2 tests passed.
TODO talk about C ABI interop
TODO consider suggesting std.MultiArrayList

See also:

@splat
@shuffle
@select
@reduce
Destructuring Vectors 
Vectors can be destructured:

destructuring_vectors.zig
const print = @import("std").debug.print;

// emulate punpckldq
pub fn unpack(x: @Vector(4, f32), y: @Vector(4, f32)) @Vector(4, f32) {
    const a, const c, _, _ = x;
    const b, const d, _, _ = y;
    return .{ a, b, c, d };
}

pub fn main() void {
    const x: @Vector(4, f32) = .{ 1.0, 2.0, 3.0, 4.0 };
    const y: @Vector(4, f32) = .{ 5.0, 6.0, 7.0, 8.0 };
    print("{}", .{unpack(x, y)});
}
Shell
$ zig build-exe destructuring_vectors.zig
$ ./destructuring_vectors
{ 1e0, 5e0, 2e0, 6e0 }
See also:

Destructuring
Destructuring Tuples
Destructuring Arrays
Pointers 
Zig has two kinds of pointers: single-item and many-item.

*T - single-item pointer to exactly one item.
Supports deref syntax: ptr.*
Supports slice syntax: ptr[0..1]
Supports pointer subtraction: ptr - ptr
[*]T - many-item pointer to unknown number of items.
Supports index syntax: ptr[i]
Supports slice syntax: ptr[start..end] and ptr[start..]
Supports pointer-integer arithmetic: ptr + int, ptr - int
Supports pointer subtraction: ptr - ptr
T must have a known size, which means that it cannot be anyopaque or any other opaque type.
These types are closely related to Arrays and Slices:

*[N]T - pointer to N items, same as single-item pointer to an array.
Supports index syntax: array_ptr[i]
Supports slice syntax: array_ptr[start..end]
Supports len property: array_ptr.len
Supports pointer subtraction: array_ptr - array_ptr
[]T - is a slice (a fat pointer, which contains a pointer of type [*]T and a length).
Supports index syntax: slice[i]
Supports slice syntax: slice[start..end]
Supports len property: slice.len
Use &x to obtain a single-item pointer:

test_single_item_pointer.zig
const expect = @import("std").testing.expect;

test "address of syntax" {
    // Get the address of a variable:
    const x: i32 = 1234;
    const x_ptr = &x;

    // Dereference a pointer:
    try expect(x_ptr.* == 1234);

    // When you get the address of a const variable, you get a const single-item pointer.
    try expect(@TypeOf(x_ptr) == *const i32);

    // If you want to mutate the value, you'd need an address of a mutable variable:
    var y: i32 = 5678;
    const y_ptr = &y;
    try expect(@TypeOf(y_ptr) == *i32);
    y_ptr.* += 1;
    try expect(y_ptr.* == 5679);
}

test "pointer array access" {
    // Taking an address of an individual element gives a
    // single-item pointer. This kind of pointer
    // does not support pointer arithmetic.
    var array = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    const ptr = &array[2];
    try expect(@TypeOf(ptr) == *u8);

    try expect(array[2] == 3);
    ptr.* += 1;
    try expect(array[2] == 4);
}

test "slice syntax" {
    // Get a pointer to a variable:
    var x: i32 = 1234;
    const x_ptr = &x;

    // Convert to array pointer using slice syntax:
    const x_array_ptr = x_ptr[0..1];
    try expect(@TypeOf(x_array_ptr) == *[1]i32);

    // Coerce to many-item pointer:
    const x_many_ptr: [*]i32 = x_array_ptr;
    try expect(x_many_ptr[0] == 1234);
}
Shell
$ zig test test_single_item_pointer.zig
1/3 test_single_item_pointer.test.address of syntax...OK
2/3 test_single_item_pointer.test.pointer array access...OK
3/3 test_single_item_pointer.test.slice syntax...OK
All 3 tests passed.
Zig supports pointer arithmetic. It's better to assign the pointer to [*]T and increment that variable. For example, directly incrementing the pointer from a slice will corrupt it.

test_pointer_arithmetic.zig
const expect = @import("std").testing.expect;

test "pointer arithmetic with many-item pointer" {
    const array = [_]i32{ 1, 2, 3, 4 };
    var ptr: [*]const i32 = &array;

    try expect(ptr[0] == 1);
    ptr += 1;
    try expect(ptr[0] == 2);

    // slicing a many-item pointer without an end is equivalent to
    // pointer arithmetic: `ptr[start..] == ptr + start`
    try expect(ptr[1..] == ptr + 1);

    // subtraction between any two pointers except slices based on element size is supported
    try expect(&ptr[1] - &ptr[0] == 1);
}

test "pointer arithmetic with slices" {
    var array = [_]i32{ 1, 2, 3, 4 };
    var length: usize = 0; // var to make it runtime-known
    _ = &length; // suppress 'var is never mutated' error
    var slice = array[length..array.len];

    try expect(slice[0] == 1);
    try expect(slice.len == 4);

    slice.ptr += 1;
    // now the slice is in an bad state since len has not been updated

    try expect(slice[0] == 2);
    try expect(slice.len == 4);
}
Shell
$ zig test test_pointer_arithmetic.zig
1/2 test_pointer_arithmetic.test.pointer arithmetic with many-item pointer...OK
2/2 test_pointer_arithmetic.test.pointer arithmetic with slices...OK
All 2 tests passed.
In Zig, we generally prefer Slices rather than Sentinel-Terminated Pointers. You can turn an array or pointer into a slice using slice syntax.

Slices have bounds checking and are therefore protected against this kind of Illegal Behavior. This is one reason we prefer slices to pointers.

test_slice_bounds.zig
const expect = @import("std").testing.expect;

test "pointer slicing" {
    var array = [_]u8{ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
    var start: usize = 2; // var to make it runtime-known
    _ = &start; // suppress 'var is never mutated' error
    const slice = array[start..4];
    try expect(slice.len == 2);

    try expect(array[3] == 4);
    slice[1] += 1;
    try expect(array[3] == 5);
}
Shell
$ zig test test_slice_bounds.zig
1/1 test_slice_bounds.test.pointer slicing...OK
All 1 tests passed.
Pointers work at compile-time too, as long as the code does not depend on an undefined memory layout:

test_comptime_pointers.zig
const expect = @import("std").testing.expect;

test "comptime pointers" {
    comptime {
        var x: i32 = 1;
        const ptr = &x;
        ptr.* += 1;
        x += 1;
        try expect(ptr.* == 3);
    }
}
Shell
$ zig test test_comptime_pointers.zig
1/1 test_comptime_pointers.test.comptime pointers...OK
All 1 tests passed.
To convert an integer address into a pointer, use @ptrFromInt. To convert a pointer to an integer, use @intFromPtr:

test_integer_pointer_conversion.zig
const expect = @import("std").testing.expect;

test "@intFromPtr and @ptrFromInt" {
    const ptr: *i32 = @ptrFromInt(0xdeadbee0);
    const addr = @intFromPtr(ptr);
    try expect(@TypeOf(addr) == usize);
    try expect(addr == 0xdeadbee0);
}
Shell
$ zig test test_integer_pointer_conversion.zig
1/1 test_integer_pointer_conversion.test.@intFromPtr and @ptrFromInt...OK
All 1 tests passed.
Zig is able to preserve memory addresses in comptime code, as long as the pointer is never dereferenced:

test_comptime_pointer_conversion.zig
const expect = @import("std").testing.expect;

test "comptime @ptrFromInt" {
    comptime {
        // Zig is able to do this at compile-time, as long as
        // ptr is never dereferenced.
        const ptr: *i32 = @ptrFromInt(0xdeadbee0);
        const addr = @intFromPtr(ptr);
        try expect(@TypeOf(addr) == usize);
        try expect(addr == 0xdeadbee0);
    }
}
Shell
$ zig test test_comptime_pointer_conversion.zig
1/1 test_comptime_pointer_conversion.test.comptime @ptrFromInt...OK
All 1 tests passed.
@ptrCast converts a pointer's element type to another. This creates a new pointer that can cause undetectable Illegal Behavior depending on the loads and stores that pass through it. Generally, other kinds of type conversions are preferable to @ptrCast if possible.

test_pointer_casting.zig
const std = @import("std");
const expect = std.testing.expect;

test "pointer casting" {
    const bytes align(@alignOf(u32)) = [_]u8{ 0x12, 0x12, 0x12, 0x12 };
    const u32_ptr: *const u32 = @ptrCast(&bytes);
    try expect(u32_ptr.* == 0x12121212);

    // Even this example is contrived - there are better ways to do the above than
    // pointer casting. For example, using a slice narrowing cast:
    const u32_value = std.mem.bytesAsSlice(u32, bytes[0..])[0];
    try expect(u32_value == 0x12121212);

    // And even another way, the most straightforward way to do it:
    try expect(@as(u32, @bitCast(bytes)) == 0x12121212);
}

test "pointer child type" {
    // pointer types have a `child` field which tells you the type they point to.
    try expect(@typeInfo(*u32).pointer.child == u32);
}
Shell
$ zig test test_pointer_casting.zig
1/2 test_pointer_casting.test.pointer casting...OK
2/2 test_pointer_casting.test.pointer child type...OK
All 2 tests passed.
See also:

Optional Pointers
@ptrFromInt
@intFromPtr
C Pointers
volatile 
Loads and stores are assumed to not have side effects. If a given load or store should have side effects, such as Memory Mapped Input/Output (MMIO), use volatile. In the following code, loads and stores with mmio_ptr are guaranteed to all happen and in the same order as in source code:

test_volatile.zig
const expect = @import("std").testing.expect;

test "volatile" {
    const mmio_ptr: *volatile u8 = @ptrFromInt(0x12345678);
    try expect(@TypeOf(mmio_ptr) == *volatile u8);
}
Shell
$ zig test test_volatile.zig
1/1 test_volatile.test.volatile...OK
All 1 tests passed.
Note that volatile is unrelated to concurrency and Atomics. If you see code that is using volatile for something other than Memory Mapped Input/Output, it is probably a bug.

Alignment 
Each type has an alignment - a number of bytes such that, when a value of the type is loaded from or stored to memory, the memory address must be evenly divisible by this number. You can use @alignOf to find out this value for any type.

Alignment depends on the CPU architecture, but is always a power of two, and less than 1 << 29.

In Zig, a pointer type has an alignment value. If the value is equal to the alignment of the underlying type, it can be omitted from the type:

test_variable_alignment.zig
const std = @import("std");
const builtin = @import("builtin");
const expect = std.testing.expect;

test "variable alignment" {
    var x: i32 = 1234;
    const align_of_i32 = @alignOf(@TypeOf(x));
    try expect(@TypeOf(&x) == *i32);
    try expect(*i32 == *align(align_of_i32) i32);
    if (builtin.target.cpu.arch == .x86_64) {
        try expect(@typeInfo(*i32).pointer.alignment == 4);
    }
}
Shell
$ zig test test_variable_alignment.zig
1/1 test_variable_alignment.test.variable alignment...OK
All 1 tests passed.
In the same way that a *i32 can be coerced to a *const i32, a pointer with a larger alignment can be implicitly cast to a pointer with a smaller alignment, but not vice versa.

You can specify alignment on variables and functions. If you do this, then pointers to them get the specified alignment:

test_variable_func_alignment.zig
const expect = @import("std").testing.expect;

var foo: u8 align(4) = 100;

test "global variable alignment" {
    try expect(@typeInfo(@TypeOf(&foo)).pointer.alignment == 4);
    try expect(@TypeOf(&foo) == *align(4) u8);
    const as_pointer_to_array: *align(4) [1]u8 = &foo;
    const as_slice: []align(4) u8 = as_pointer_to_array;
    const as_unaligned_slice: []u8 = as_slice;
    try expect(as_unaligned_slice[0] == 100);
}

fn derp() align(@sizeOf(usize) * 2) i32 {
    return 1234;
}
fn noop1() align(1) void {}
fn noop4() align(4) void {}

test "function alignment" {
    try expect(derp() == 1234);
    try expect(@TypeOf(derp) == fn () i32);
    try expect(@TypeOf(&derp) == *align(@sizeOf(usize) * 2) const fn () i32);

    noop1();
    try expect(@TypeOf(noop1) == fn () void);
    try expect(@TypeOf(&noop1) == *align(1) const fn () void);

    noop4();
    try expect(@TypeOf(noop4) == fn () void);
    try expect(@TypeOf(&noop4) == *align(4) const fn () void);
}
Shell
$ zig test test_variable_func_alignment.zig
1/2 test_variable_func_alignment.test.global variable alignment...OK
2/2 test_variable_func_alignment.test.function alignment...OK
All 2 tests passed.
If you have a pointer or a slice that has a small alignment, but you know that it actually has a bigger alignment, use @alignCast to change the pointer into a more aligned pointer. This is a no-op at runtime, but inserts a safety check:

test_incorrect_pointer_alignment.zig
const std = @import("std");

test "pointer alignment safety" {
    var array align(4) = [_]u32{ 0x11111111, 0x11111111 };
    const bytes = std.mem.sliceAsBytes(array[0..]);
    try std.testing.expect(foo(bytes) == 0x11111111);
}
fn foo(bytes: []u8) u32 {
    const slice4 = bytes[1..5];
    const int_slice = std.mem.bytesAsSlice(u32, @as([]align(4) u8, @alignCast(slice4)));
    return int_slice[0];
}
Shell
$ zig test test_incorrect_pointer_alignment.zig
1/1 test_incorrect_pointer_alignment.test.pointer alignment safety...thread 3521392 panic: incorrect alignment
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_incorrect_pointer_alignment.zig:10:68: 0x102d292 in foo (test_incorrect_pointer_alignment.zig)
    const int_slice = std.mem.bytesAsSlice(u32, @as([]align(4) u8, @alignCast(slice4)));
                                                                   ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_incorrect_pointer_alignment.zig:6:31: 0x102d0d0 in test.pointer alignment safety (test_incorrect_pointer_alignment.zig)
    try std.testing.expect(foo(bytes) == 0x11111111);
                              ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1176193 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116c237 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x116536d in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1164c43 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/6895bed73767ab72cb423b3708410e3d/test --seed=0x754e4fc4
allowzero 
This pointer attribute allows a pointer to have address zero. This is only ever needed on the freestanding OS target, where the address zero is mappable. If you want to represent null pointers, use Optional Pointers instead. Optional Pointers with allowzero are not the same size as pointers. In this code example, if the pointer did not have the allowzero attribute, this would be a Pointer Cast Invalid Null panic:

test_allowzero.zig
const std = @import("std");
const expect = std.testing.expect;

test "allowzero" {
    var zero: usize = 0; // var to make to runtime-known
    _ = &zero; // suppress 'var is never mutated' error
    const ptr: *allowzero i32 = @ptrFromInt(zero);
    try expect(@intFromPtr(ptr) == 0);
}
Shell
$ zig test test_allowzero.zig
1/1 test_allowzero.test.allowzero...OK
All 1 tests passed.
Sentinel-Terminated Pointers 
The syntax [*:x]T describes a pointer that has a length determined by a sentinel value. This provides protection against buffer overflow and overreads.

sentinel-terminated_pointer.zig
const std = @import("std");

// This is also available as `std.c.printf`.
pub extern "c" fn printf(format: [*:0]const u8, ...) c_int;

pub fn main() anyerror!void {
    _ = printf("Hello, world!\n"); // OK

    const msg = "Hello, world!\n";
    const non_null_terminated_msg: [msg.len]u8 = msg.*;
    _ = printf(&non_null_terminated_msg);
}
Shell
$ zig build-exe sentinel-terminated_pointer.zig -lc
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/sentinel-terminated_pointer.zig:11:16: error: expected type '[*:0]const u8', found '*const [14]u8'
    _ = printf(&non_null_terminated_msg);
               ^~~~~~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/sentinel-terminated_pointer.zig:11:16: note: destination pointer requires '0' sentinel
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/sentinel-terminated_pointer.zig:4:34: note: parameter type declared here
pub extern "c" fn printf(format: [*:0]const u8, ...) c_int;
                                 ^~~~~~~~~~~~~
referenced by:
    callMain [inlined]: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:675:37
    callMainWithArgs [inlined]: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:635:20
    main: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:650:28
    1 reference(s) hidden; use '-freference-trace=4' to see all references

See also:

Sentinel-Terminated Slices
Sentinel-Terminated Arrays
Slices 
A slice is a pointer and a length. The difference between an array and a slice is that the array's length is part of the type and known at compile-time, whereas the slice's length is known at runtime. Both can be accessed with the len field.

test_basic_slices.zig
const expect = @import("std").testing.expect;
const expectEqualSlices = @import("std").testing.expectEqualSlices;

test "basic slices" {
    var array = [_]i32{ 1, 2, 3, 4 };
    var known_at_runtime_zero: usize = 0;
    _ = &known_at_runtime_zero;
    const slice = array[known_at_runtime_zero..array.len];

    // alternative initialization using result location
    const alt_slice: []const i32 = &.{ 1, 2, 3, 4 };

    try expectEqualSlices(i32, slice, alt_slice);

    try expect(@TypeOf(slice) == []i32);
    try expect(&slice[0] == &array[0]);
    try expect(slice.len == array.len);

    // If you slice with comptime-known start and end positions, the result is
    // a pointer to an array, rather than a slice.
    const array_ptr = array[0..array.len];
    try expect(@TypeOf(array_ptr) == *[array.len]i32);

    // You can perform a slice-by-length by slicing twice. This allows the compiler
    // to perform some optimisations like recognising a comptime-known length when
    // the start position is only known at runtime.
    var runtime_start: usize = 1;
    _ = &runtime_start;
    const length = 2;
    const array_ptr_len = array[runtime_start..][0..length];
    try expect(@TypeOf(array_ptr_len) == *[length]i32);

    // Using the address-of operator on a slice gives a single-item pointer.
    try expect(@TypeOf(&slice[0]) == *i32);
    // Using the `ptr` field gives a many-item pointer.
    try expect(@TypeOf(slice.ptr) == [*]i32);
    try expect(@intFromPtr(slice.ptr) == @intFromPtr(&slice[0]));

    // Slices have array bounds checking. If you try to access something out
    // of bounds, you'll get a safety check failure:
    slice[10] += 1;

    // Note that `slice.ptr` does not invoke safety checking, while `&slice[0]`
    // asserts that the slice has len > 0.

    // Empty slices can be created like this:
    const empty1 = &[0]u8{};
    // If the type is known you can use this short hand:
    const empty2: []u8 = &.{};
    try expect(empty1.len == 0);
    try expect(empty2.len == 0);

    // A zero-length initialization can always be used to create an empty slice, even if the slice is mutable.
    // This is because the pointed-to data is zero bits long, so its immutability is irrelevant.
}
Shell
$ zig test test_basic_slices.zig
1/1 test_basic_slices.test.basic slices...thread 3518990 panic: index out of bounds: index 10, len 4
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_basic_slices.zig:41:10: 0x10302c6 in test.basic slices (test_basic_slices.zig)
    slice[10] += 1;
         ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x117cb7b in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x1172c1f in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x116bd55 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x116b62b in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/8f94028ed29ea361af29f00dd94bbe1f/test --seed=0xf833652c
This is one reason we prefer slices to pointers.

test_slices.zig
const std = @import("std");
const expect = std.testing.expect;
const mem = std.mem;
const fmt = std.fmt;

test "using slices for strings" {
    // Zig has no concept of strings. String literals are const pointers
    // to null-terminated arrays of u8, and by convention parameters
    // that are "strings" are expected to be UTF-8 encoded slices of u8.
    // Here we coerce *const [5:0]u8 and *const [6:0]u8 to []const u8
    const hello: []const u8 = "hello";
    const world: []const u8 = "世界";

    var all_together: [100]u8 = undefined;
    // You can use slice syntax with at least one runtime-known index on an
    // array to convert an array into a slice.
    var start: usize = 0;
    _ = &start;
    const all_together_slice = all_together[start..];
    // String concatenation example.
    const hello_world = try fmt.bufPrint(all_together_slice, "{s} {s}", .{ hello, world });

    // Generally, you can use UTF-8 and not worry about whether something is a
    // string. If you don't need to deal with individual characters, no need
    // to decode.
    try expect(mem.eql(u8, hello_world, "hello 世界"));
}

test "slice pointer" {
    var array: [10]u8 = undefined;
    const ptr = &array;
    try expect(@TypeOf(ptr) == *[10]u8);

    // A pointer to an array can be sliced just like an array:
    var start: usize = 0;
    var end: usize = 5;
    _ = .{ &start, &end };
    const slice = ptr[start..end];
    // The slice is mutable because we sliced a mutable pointer.
    try expect(@TypeOf(slice) == []u8);
    slice[2] = 3;
    try expect(array[2] == 3);

    // Again, slicing with comptime-known indexes will produce another pointer
    // to an array:
    const ptr2 = slice[2..3];
    try expect(ptr2.len == 1);
    try expect(ptr2[0] == 3);
    try expect(@TypeOf(ptr2) == *[1]u8);
}
Shell
$ zig test test_slices.zig
1/2 test_slices.test.using slices for strings...OK
2/2 test_slices.test.slice pointer...OK
All 2 tests passed.
See also:

Pointers
for
Arrays
Sentinel-Terminated Slices 
The syntax [:x]T is a slice which has a runtime-known length and also guarantees a sentinel value at the element indexed by the length. The type does not guarantee that there are no sentinel elements before that. Sentinel-terminated slices allow element access to the len index.

test_null_terminated_slice.zig
const std = @import("std");
const expect = std.testing.expect;

test "0-terminated slice" {
    const slice: [:0]const u8 = "hello";

    try expect(slice.len == 5);
    try expect(slice[5] == 0);
}
Shell
$ zig test test_null_terminated_slice.zig
1/1 test_null_terminated_slice.test.0-terminated slice...OK
All 1 tests passed.
Sentinel-terminated slices can also be created using a variation of the slice syntax data[start..end :x], where data is a many-item pointer, array or slice and x is the sentinel value.

test_null_terminated_slicing.zig
const std = @import("std");
const expect = std.testing.expect;

test "0-terminated slicing" {
    var array = [_]u8{ 3, 2, 1, 0, 3, 2, 1, 0 };
    var runtime_length: usize = 3;
    _ = &runtime_length;
    const slice = array[0..runtime_length :0];

    try expect(@TypeOf(slice) == [:0]u8);
    try expect(slice.len == 3);
}
Shell
$ zig test test_null_terminated_slicing.zig
1/1 test_null_terminated_slicing.test.0-terminated slicing...OK
All 1 tests passed.
Sentinel-terminated slicing asserts that the element in the sentinel position of the backing data is actually the sentinel value. If this is not the case, safety-checked Illegal Behavior results.

test_sentinel_mismatch.zig
const std = @import("std");
const expect = std.testing.expect;

test "sentinel mismatch" {
    var array = [_]u8{ 3, 2, 1, 0 };

    // Creating a sentinel-terminated slice from the array with a length of 2
    // will result in the value `1` occupying the sentinel element position.
    // This does not match the indicated sentinel value of `0` and will lead
    // to a runtime panic.
    var runtime_length: usize = 2;
    _ = &runtime_length;
    const slice = array[0..runtime_length :0];

    _ = slice;
}
Shell
$ zig test test_sentinel_mismatch.zig
1/1 test_sentinel_mismatch.test.sentinel mismatch...thread 3521485 panic: sentinel mismatch: expected 0, found 1
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_sentinel_mismatch.zig:13:24: 0x102d117 in test.sentinel mismatch (test_sentinel_mismatch.zig)
    const slice = array[0..runtime_length :0];
                       ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1175f13 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116bfb7 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x11650ed in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x11649c3 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/052d806297c956feba13c0139dca61ef/test --seed=0x5de9a2
See also:

Sentinel-Terminated Pointers
Sentinel-Terminated Arrays
struct 
test_structs.zig
// Declare a struct.
// Zig gives no guarantees about the order of fields and the size of
// the struct but the fields are guaranteed to be ABI-aligned.
const Point = struct {
    x: f32,
    y: f32,
};

// Declare an instance of a struct.
const p: Point = .{
    .x = 0.12,
    .y = 0.34,
};

// Functions in the struct's namespace can be called with dot syntax.
const Vec3 = struct {
    x: f32,
    y: f32,
    z: f32,

    pub fn init(x: f32, y: f32, z: f32) Vec3 {
        return Vec3{
            .x = x,
            .y = y,
            .z = z,
        };
    }

    pub fn dot(self: Vec3, other: Vec3) f32 {
        return self.x * other.x + self.y * other.y + self.z * other.z;
    }
};

test "dot product" {
    const v1 = Vec3.init(1.0, 0.0, 0.0);
    const v2 = Vec3.init(0.0, 1.0, 0.0);
    try expect(v1.dot(v2) == 0.0);

    // Other than being available to call with dot syntax, struct methods are
    // not special. You can reference them as any other declaration inside
    // the struct:
    try expect(Vec3.dot(v1, v2) == 0.0);
}

// Structs can have declarations.
// Structs can have 0 fields.
const Empty = struct {
    pub const PI = 3.14;
};
test "struct namespaced variable" {
    try expect(Empty.PI == 3.14);
    try expect(@sizeOf(Empty) == 0);

    // Empty structs can be instantiated the same as usual.
    const does_nothing: Empty = .{};

    _ = does_nothing;
}

// Struct field order is determined by the compiler, however, a base pointer
// can be computed from a field pointer:
fn setYBasedOnX(x: *f32, y: f32) void {
    const point: *Point = @fieldParentPtr("x", x);
    point.y = y;
}
test "field parent pointer" {
    var point = Point{
        .x = 0.1234,
        .y = 0.5678,
    };
    setYBasedOnX(&point.x, 0.9);
    try expect(point.y == 0.9);
}

// Structs can be returned from functions.
fn LinkedList(comptime T: type) type {
    return struct {
        pub const Node = struct {
            prev: ?*Node,
            next: ?*Node,
            data: T,
        };

        first: ?*Node,
        last: ?*Node,
        len: usize,
    };
}

test "linked list" {
    // Functions called at compile-time are memoized.
    try expect(LinkedList(i32) == LinkedList(i32));

    const list = LinkedList(i32){
        .first = null,
        .last = null,
        .len = 0,
    };
    try expect(list.len == 0);

    // Since types are first class values you can instantiate the type
    // by assigning it to a variable:
    const ListOfInts = LinkedList(i32);
    try expect(ListOfInts == LinkedList(i32));

    var node = ListOfInts.Node{
        .prev = null,
        .next = null,
        .data = 1234,
    };
    const list2 = LinkedList(i32){
        .first = &node,
        .last = &node,
        .len = 1,
    };

    // When using a pointer to a struct, fields can be accessed directly,
    // without explicitly dereferencing the pointer.
    // So you can do
    try expect(list2.first.?.data == 1234);
    // instead of try expect(list2.first.?.*.data == 1234);
}

const expect = @import("std").testing.expect;
Shell
$ zig test test_structs.zig
1/4 test_structs.test.dot product...OK
2/4 test_structs.test.struct namespaced variable...OK
3/4 test_structs.test.field parent pointer...OK
4/4 test_structs.test.linked list...OK
All 4 tests passed.
Default Field Values 
Each struct field may have an expression indicating the default field value. Such expressions are executed at comptime, and allow the field to be omitted in a struct literal expression:

struct_default_field_values.zig
const Foo = struct {
    a: i32 = 1234,
    b: i32,
};

test "default struct initialization fields" {
    const x: Foo = .{
        .b = 5,
    };
    if (x.a + x.b != 1239) {
        comptime unreachable;
    }
}
Shell
$ zig test struct_default_field_values.zig
1/1 struct_default_field_values.test.default struct initialization fields...OK
All 1 tests passed.
Faulty Default Field Values 
Default field values are only appropriate when the data invariants of a struct cannot be violated by omitting that field from an initialization.

For example, here is an inappropriate use of default struct field initialization:

bad_default_value.zig
const Threshold = struct {
    minimum: f32 = 0.25,
    maximum: f32 = 0.75,

    const Category = enum { low, medium, high };

    fn categorize(t: Threshold, value: f32) Category {
        assert(t.maximum >= t.minimum);
        if (value < t.minimum) return .low;
        if (value > t.maximum) return .high;
        return .medium;
    }
};

pub fn main() !void {
    var threshold: Threshold = .{
        .maximum = 0.20,
    };
    const category = threshold.categorize(0.90);
    try std.io.getStdOut().writeAll(@tagName(category));
}

const std = @import("std");
const assert = std.debug.assert;
Shell
$ zig build-exe bad_default_value.zig
$ ./bad_default_value
thread 3521087 panic: reached unreachable code
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/debug.zig:548:14: 0x10307c9 in assert (std.zig)
    if (!ok) unreachable; // assertion failure
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/bad_default_value.zig:8:15: 0x11540b5 in categorize (bad_default_value.zig)
        assert(t.maximum >= t.minimum);
              ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/bad_default_value.zig:19:42: 0x11528f8 in main (bad_default_value.zig)
    const category = threshold.categorize(0.90);
                                         ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:675:37: 0x115310d in posixCallMainAndExit (std.zig)
            const result = root.main() catch |err| {
                                    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Above you can see the danger of ignoring this principle. The default field values caused the data invariant to be violated, causing illegal behavior.

To fix this, remove the default values from all the struct fields, and provide a named default value:

struct_default_value.zig
const Threshold = struct {
    minimum: f32,
    maximum: f32,

    const default: Threshold = .{
        .minimum = 0.25,
        .maximum = 0.75,
    };
};
If a struct value requires a runtime-known value in order to be initialized without violating data invariants, then use an initialization method that accepts those runtime values, and populates the remaining fields.

extern struct 
An extern struct has in-memory layout matching the C ABI for the target.

If well-defined in-memory layout is not required, struct is a better choice because it places fewer restrictions on the compiler.

See packed struct for a struct that has the ABI of its backing integer, which can be useful for modeling flags.

See also:

extern union
extern enum
packed struct 
packed structs, like enum, are based on the concept of interpreting integers differently. All packed structs have a backing integer, which is implicitly determined by the total bit count of fields, or explicitly specified. Packed structs have well-defined memory layout - exactly the same ABI as their backing integer.

Each field of a packed struct is interpreted as a logical sequence of bits, arranged from least to most significant. Allowed field types:

An integer field uses exactly as many bits as its bit width. For example, a u5 will use 5 bits of the backing integer.
A bool field uses exactly 1 bit.
An enum field uses exactly the bit width of its integer tag type.
A packed union field uses exactly the bit width of the union field with the largest bit width.
A packed struct field uses the bits of its backing integer.
This means that a packed struct can participate in a @bitCast or a @ptrCast to reinterpret memory. This even works at comptime:

test_packed_structs.zig
const std = @import("std");
const native_endian = @import("builtin").target.cpu.arch.endian();
const expect = std.testing.expect;

const Full = packed struct {
    number: u16,
};
const Divided = packed struct {
    half1: u8,
    quarter3: u4,
    quarter4: u4,
};

test "@bitCast between packed structs" {
    try doTheTest();
    try comptime doTheTest();
}

fn doTheTest() !void {
    try expect(@sizeOf(Full) == 2);
    try expect(@sizeOf(Divided) == 2);
    const full = Full{ .number = 0x1234 };
    const divided: Divided = @bitCast(full);
    try expect(divided.half1 == 0x34);
    try expect(divided.quarter3 == 0x2);
    try expect(divided.quarter4 == 0x1);

    const ordered: [2]u8 = @bitCast(full);
    switch (native_endian) {
        .big => {
            try expect(ordered[0] == 0x12);
            try expect(ordered[1] == 0x34);
        },
        .little => {
            try expect(ordered[0] == 0x34);
            try expect(ordered[1] == 0x12);
        },
    }
}
Shell
$ zig test test_packed_structs.zig
1/1 test_packed_structs.test.@bitCast between packed structs...OK
All 1 tests passed.
The backing integer can be inferred or explicitly provided. When inferred, it will be unsigned. When explicitly provided, its bit width will be enforced at compile time to exactly match the total bit width of the fields:

test_missized_packed_struct.zig
test "missized packed struct" {
    const S = packed struct(u32) { a: u16, b: u8 };
    _ = S{ .a = 4, .b = 2 };
}
Shell
$ zig test test_missized_packed_struct.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_missized_packed_struct.zig:2:29: error: backing integer type 'u32' has bit size 32 but the struct fields have a total bit size of 24
    const S = packed struct(u32) { a: u16, b: u8 };
                            ^~~
referenced by:
    test.missized packed struct: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_missized_packed_struct.zig:2:22

Zig allows the address to be taken of a non-byte-aligned field:

test_pointer_to_non-byte_aligned_field.zig
const std = @import("std");
const expect = std.testing.expect;

const BitField = packed struct {
    a: u3,
    b: u3,
    c: u2,
};

var foo = BitField{
    .a = 1,
    .b = 2,
    .c = 3,
};

test "pointer to non-byte-aligned field" {
    const ptr = &foo.b;
    try expect(ptr.* == 2);
}
Shell
$ zig test test_pointer_to_non-byte_aligned_field.zig
1/1 test_pointer_to_non-byte_aligned_field.test.pointer to non-byte-aligned field...OK
All 1 tests passed.
However, the pointer to a non-byte-aligned field has special properties and cannot be passed when a normal pointer is expected:

test_misaligned_pointer.zig
const std = @import("std");
const expect = std.testing.expect;

const BitField = packed struct {
    a: u3,
    b: u3,
    c: u2,
};

var bit_field = BitField{
    .a = 1,
    .b = 2,
    .c = 3,
};

test "pointer to non-byte-aligned field" {
    try expect(bar(&bit_field.b) == 2);
}

fn bar(x: *const u3) u3 {
    return x.*;
}
Shell
$ zig test test_misaligned_pointer.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_misaligned_pointer.zig:17:20: error: expected type '*const u3', found '*align(1:3:1) u3'
    try expect(bar(&bit_field.b) == 2);
                   ^~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_misaligned_pointer.zig:17:20: note: pointer host size '1' cannot cast into pointer host size '0'
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_misaligned_pointer.zig:17:20: note: pointer bit offset '3' cannot cast into pointer bit offset '0'
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_misaligned_pointer.zig:20:11: note: parameter type declared here
fn bar(x: *const u3) u3 {
          ^~~~~~~~~

In this case, the function bar cannot be called because the pointer to the non-ABI-aligned field mentions the bit offset, but the function expects an ABI-aligned pointer.

Pointers to non-ABI-aligned fields share the same address as the other fields within their host integer:

test_packed_struct_field_address.zig
const std = @import("std");
const expect = std.testing.expect;

const BitField = packed struct {
    a: u3,
    b: u3,
    c: u2,
};

var bit_field = BitField{
    .a = 1,
    .b = 2,
    .c = 3,
};

test "pointers of sub-byte-aligned fields share addresses" {
    try expect(@intFromPtr(&bit_field.a) == @intFromPtr(&bit_field.b));
    try expect(@intFromPtr(&bit_field.a) == @intFromPtr(&bit_field.c));
}
Shell
$ zig test test_packed_struct_field_address.zig
1/1 test_packed_struct_field_address.test.pointers of sub-byte-aligned fields share addresses...OK
All 1 tests passed.
This can be observed with @bitOffsetOf and offsetOf:

test_bitOffsetOf_offsetOf.zig
const std = @import("std");
const expect = std.testing.expect;

const BitField = packed struct {
    a: u3,
    b: u3,
    c: u2,
};

test "offsets of non-byte-aligned fields" {
    comptime {
        try expect(@bitOffsetOf(BitField, "a") == 0);
        try expect(@bitOffsetOf(BitField, "b") == 3);
        try expect(@bitOffsetOf(BitField, "c") == 6);

        try expect(@offsetOf(BitField, "a") == 0);
        try expect(@offsetOf(BitField, "b") == 0);
        try expect(@offsetOf(BitField, "c") == 0);
    }
}
Shell
$ zig test test_bitOffsetOf_offsetOf.zig
1/1 test_bitOffsetOf_offsetOf.test.offsets of non-byte-aligned fields...OK
All 1 tests passed.
Packed structs have the same alignment as their backing integer, however, overaligned pointers to packed structs can override this:

test_overaligned_packed_struct.zig
const std = @import("std");
const expect = std.testing.expect;

const S = packed struct {
    a: u32,
    b: u32,
};
test "overaligned pointer to packed struct" {
    var foo: S align(4) = .{ .a = 1, .b = 2 };
    const ptr: *align(4) S = &foo;
    const ptr_to_b: *u32 = &ptr.b;
    try expect(ptr_to_b.* == 2);
}
Shell
$ zig test test_overaligned_packed_struct.zig
1/1 test_overaligned_packed_struct.test.overaligned pointer to packed struct...OK
All 1 tests passed.
It's also possible to set alignment of struct fields:

test_aligned_struct_fields.zig
const std = @import("std");
const expectEqual = std.testing.expectEqual;

test "aligned struct fields" {
    const S = struct {
        a: u32 align(2),
        b: u32 align(64),
    };
    var foo = S{ .a = 1, .b = 2 };

    try expectEqual(64, @alignOf(S));
    try expectEqual(*align(2) u32, @TypeOf(&foo.a));
    try expectEqual(*align(64) u32, @TypeOf(&foo.b));
}
Shell
$ zig test test_aligned_struct_fields.zig
1/1 test_aligned_struct_fields.test.aligned struct fields...OK
All 1 tests passed.
Equating packed structs results in a comparison of the backing integer, and only works for the == and != Operators.

test_packed_struct_equality.zig
const std = @import("std");
const expect = std.testing.expect;

test "packed struct equality" {
    const S = packed struct {
        a: u4,
        b: u4,
    };
    const x: S = .{ .a = 1, .b = 2 };
    const y: S = .{ .b = 2, .a = 1 };
    try expect(x == y);
}
Shell
$ zig test test_packed_struct_equality.zig
1/1 test_packed_struct_equality.test.packed struct equality...OK
All 1 tests passed.
Field access and assignment can be understood as shorthand for bitshifts on the backing integer. These operations are not atomic, so beware using field access syntax when combined with memory-mapped input-output (MMIO). Instead of field access on volatile Pointers, construct a fully-formed new value first, then write that value to the volatile pointer.

packed_struct_mmio.zig
pub const GpioRegister = packed struct(u8) {
    GPIO0: bool,
    GPIO1: bool,
    GPIO2: bool,
    GPIO3: bool,
    reserved: u4 = 0,
};

const gpio: *volatile GpioRegister = @ptrFromInt(0x0123);

pub fn writeToGpio(new_states: GpioRegister) void {
    // Example of what not to do:
    // BAD! gpio.GPIO0 = true; BAD!

    // Instead, do this:
    gpio.* = new_states;
}
Struct Naming 
Since all structs are anonymous, Zig infers the type name based on a few rules.

If the struct is in the initialization expression of a variable, it gets named after that variable.
If the struct is in the return expression, it gets named after the function it is returning from, with the parameter values serialized.
Otherwise, the struct gets a name such as (filename.funcname__struct_ID).
If the struct is declared inside another struct, it gets named after both the parent struct and the name inferred by the previous rules, separated by a dot.
struct_name.zig
const std = @import("std");

pub fn main() void {
    const Foo = struct {};
    std.debug.print("variable: {s}\n", .{@typeName(Foo)});
    std.debug.print("anonymous: {s}\n", .{@typeName(struct {})});
    std.debug.print("function: {s}\n", .{@typeName(List(i32))});
}

fn List(comptime T: type) type {
    return struct {
        x: T,
    };
}
Shell
$ zig build-exe struct_name.zig
$ ./struct_name
variable: struct_name.main.Foo
anonymous: struct_name.main__struct_23311
function: struct_name.List(i32)
Anonymous Struct Literals 
Zig allows omitting the struct type of a literal. When the result is coerced, the struct literal will directly instantiate the result location, with no copy:

test_struct_result.zig
const std = @import("std");
const expect = std.testing.expect;

const Point = struct { x: i32, y: i32 };

test "anonymous struct literal" {
    const pt: Point = .{
        .x = 13,
        .y = 67,
    };
    try expect(pt.x == 13);
    try expect(pt.y == 67);
}
Shell
$ zig test test_struct_result.zig
1/1 test_struct_result.test.anonymous struct literal...OK
All 1 tests passed.
The struct type can be inferred. Here the result location does not include a type, and so Zig infers the type:

test_anonymous_struct.zig
const std = @import("std");
const expect = std.testing.expect;

test "fully anonymous struct" {
    try check(.{
        .int = @as(u32, 1234),
        .float = @as(f64, 12.34),
        .b = true,
        .s = "hi",
    });
}

fn check(args: anytype) !void {
    try expect(args.int == 1234);
    try expect(args.float == 12.34);
    try expect(args.b);
    try expect(args.s[0] == 'h');
    try expect(args.s[1] == 'i');
}
Shell
$ zig test test_anonymous_struct.zig
1/1 test_anonymous_struct.test.fully anonymous struct...OK
All 1 tests passed.
Tuples 
Anonymous structs can be created without specifying field names, and are referred to as "tuples". An empty tuple looks like .{} and can be seen in one of the Hello World examples.

The fields are implicitly named using numbers starting from 0. Because their names are integers, they cannot be accessed with . syntax without also wrapping them in @"". Names inside @"" are always recognised as identifiers.

Like arrays, tuples have a .len field, can be indexed (provided the index is comptime-known) and work with the ++ and ** operators. They can also be iterated over with inline for.

test_tuples.zig
const std = @import("std");
const expect = std.testing.expect;

test "tuple" {
    const values = .{
        @as(u32, 1234),
        @as(f64, 12.34),
        true,
        "hi",
    } ++ .{false} ** 2;
    try expect(values[0] == 1234);
    try expect(values[4] == false);
    inline for (values, 0..) |v, i| {
        if (i != 2) continue;
        try expect(v);
    }
    try expect(values.len == 6);
    try expect(values.@"3"[0] == 'h');
}
Shell
$ zig test test_tuples.zig
1/1 test_tuples.test.tuple...OK
All 1 tests passed.
Destructuring Tuples 
Tuples can be destructured.

Tuple destructuring is helpful for returning multiple values from a block:

destructuring_block.zig
const print = @import("std").debug.print;

pub fn main() void {
    const digits = [_]i8 { 3, 8, 9, 0, 7, 4, 1 };

    const min, const max = blk: {
        var min: i8 = 127;
        var max: i8 = -128;

        for (digits) |digit| {
            if (digit < min) min = digit;
            if (digit > max) max = digit;
        }

        break :blk .{ min, max };
    };

    print("min = {}", .{ min });
    print("max = {}", .{ max });
}
Shell
$ zig build-exe destructuring_block.zig
$ ./destructuring_block
min = 0max = 9
Tuple destructuring is helpful for dealing with functions and built-ins that return multiple values as a tuple:

destructuring_return_value.zig
const print = @import("std").debug.print;

fn divmod(numerator: u32, denominator: u32) struct { u32, u32 } {
    return .{ numerator / denominator, numerator % denominator };
}

pub fn main() void {
    const div, const mod = divmod(10, 3);

    print("10 / 3 = {}\n", .{div});
    print("10 % 3 = {}\n", .{mod});
}
Shell
$ zig build-exe destructuring_return_value.zig
$ ./destructuring_return_value
10 / 3 = 3
10 % 3 = 1
See also:

Destructuring
Destructuring Arrays
Destructuring Vectors
See also:

comptime
@fieldParentPtr
enum 
test_enums.zig
const expect = @import("std").testing.expect;
const mem = @import("std").mem;

// Declare an enum.
const Type = enum {
    ok,
    not_ok,
};

// Declare a specific enum field.
const c = Type.ok;

// If you want access to the ordinal value of an enum, you
// can specify the tag type.
const Value = enum(u2) {
    zero,
    one,
    two,
};
// Now you can cast between u2 and Value.
// The ordinal value starts from 0, counting up by 1 from the previous member.
test "enum ordinal value" {
    try expect(@intFromEnum(Value.zero) == 0);
    try expect(@intFromEnum(Value.one) == 1);
    try expect(@intFromEnum(Value.two) == 2);
}

// You can override the ordinal value for an enum.
const Value2 = enum(u32) {
    hundred = 100,
    thousand = 1000,
    million = 1000000,
};
test "set enum ordinal value" {
    try expect(@intFromEnum(Value2.hundred) == 100);
    try expect(@intFromEnum(Value2.thousand) == 1000);
    try expect(@intFromEnum(Value2.million) == 1000000);
}

// You can also override only some values.
const Value3 = enum(u4) {
    a,
    b = 8,
    c,
    d = 4,
    e,
};
test "enum implicit ordinal values and overridden values" {
    try expect(@intFromEnum(Value3.a) == 0);
    try expect(@intFromEnum(Value3.b) == 8);
    try expect(@intFromEnum(Value3.c) == 9);
    try expect(@intFromEnum(Value3.d) == 4);
    try expect(@intFromEnum(Value3.e) == 5);
}

// Enums can have methods, the same as structs and unions.
// Enum methods are not special, they are only namespaced
// functions that you can call with dot syntax.
const Suit = enum {
    clubs,
    spades,
    diamonds,
    hearts,

    pub fn isClubs(self: Suit) bool {
        return self == Suit.clubs;
    }
};
test "enum method" {
    const p = Suit.spades;
    try expect(!p.isClubs());
}

// An enum can be switched upon.
const Foo = enum {
    string,
    number,
    none,
};
test "enum switch" {
    const p = Foo.number;
    const what_is_it = switch (p) {
        Foo.string => "this is a string",
        Foo.number => "this is a number",
        Foo.none => "this is a none",
    };
    try expect(mem.eql(u8, what_is_it, "this is a number"));
}

// @typeInfo can be used to access the integer tag type of an enum.
const Small = enum {
    one,
    two,
    three,
    four,
};
test "std.meta.Tag" {
    try expect(@typeInfo(Small).@"enum".tag_type == u2);
}

// @typeInfo tells us the field count and the fields names:
test "@typeInfo" {
    try expect(@typeInfo(Small).@"enum".fields.len == 4);
    try expect(mem.eql(u8, @typeInfo(Small).@"enum".fields[1].name, "two"));
}

// @tagName gives a [:0]const u8 representation of an enum value:
test "@tagName" {
    try expect(mem.eql(u8, @tagName(Small.three), "three"));
}
Shell
$ zig test test_enums.zig
1/8 test_enums.test.enum ordinal value...OK
2/8 test_enums.test.set enum ordinal value...OK
3/8 test_enums.test.enum implicit ordinal values and overridden values...OK
4/8 test_enums.test.enum method...OK
5/8 test_enums.test.enum switch...OK
6/8 test_enums.test.std.meta.Tag...OK
7/8 test_enums.test.@typeInfo...OK
8/8 test_enums.test.@tagName...OK
All 8 tests passed.
See also:

@typeInfo
@tagName
@sizeOf
extern enum 
By default, enums are not guaranteed to be compatible with the C ABI:

enum_export_error.zig
const Foo = enum { a, b, c };
export fn entry(foo: Foo) void {
    _ = foo;
}
Shell
$ zig build-obj enum_export_error.zig -target x86_64-linux
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/enum_export_error.zig:2:17: error: parameter of type 'enum_export_error.Foo' not allowed in function with calling convention 'x86_64_sysv'
export fn entry(foo: Foo) void {
                ^~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/enum_export_error.zig:2:17: note: enum tag type 'u2' is not extern compatible
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/enum_export_error.zig:2:17: note: only integers with 0, 8, 16, 32, 64 and 128 bits are extern compatible
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/enum_export_error.zig:1:13: note: enum declared here
const Foo = enum { a, b, c };
            ^~~~~~~~~~~~~~~~
referenced by:
    root: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:3:22
    comptime: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:31:9
    2 reference(s) hidden; use '-freference-trace=4' to see all references

For a C-ABI-compatible enum, provide an explicit tag type to the enum:

enum_export.zig
const Foo = enum(c_int) { a, b, c };
export fn entry(foo: Foo) void {
    _ = foo;
}
Shell
$ zig build-obj enum_export.zig
Enum Literals 
Enum literals allow specifying the name of an enum field without specifying the enum type:

test_enum_literals.zig
const std = @import("std");
const expect = std.testing.expect;

const Color = enum {
    auto,
    off,
    on,
};

test "enum literals" {
    const color1: Color = .auto;
    const color2 = Color.auto;
    try expect(color1 == color2);
}

test "switch using enum literals" {
    const color = Color.on;
    const result = switch (color) {
        .auto => false,
        .on => true,
        .off => false,
    };
    try expect(result);
}
Shell
$ zig test test_enum_literals.zig
1/2 test_enum_literals.test.enum literals...OK
2/2 test_enum_literals.test.switch using enum literals...OK
All 2 tests passed.
Non-exhaustive enum 
A non-exhaustive enum can be created by adding a trailing _ field. The enum must specify a tag type and cannot consume every enumeration value.

@enumFromInt on a non-exhaustive enum involves the safety semantics of @intCast to the integer tag type, but beyond that always results in a well-defined enum value.

A switch on a non-exhaustive enum can include a _ prong as an alternative to an else prong. With a _ prong the compiler errors if all the known tag names are not handled by the switch.

test_switch_non-exhaustive.zig
const std = @import("std");
const expect = std.testing.expect;

const Number = enum(u8) {
    one,
    two,
    three,
    _,
};

test "switch on non-exhaustive enum" {
    const number = Number.one;
    const result = switch (number) {
        .one => true,
        .two, .three => false,
        _ => false,
    };
    try expect(result);
    const is_one = switch (number) {
        .one => true,
        else => false,
    };
    try expect(is_one);
}
Shell
$ zig test test_switch_non-exhaustive.zig
1/1 test_switch_non-exhaustive.test.switch on non-exhaustive enum...OK
All 1 tests passed.
union 
A bare union defines a set of possible types that a value can be as a list of fields. Only one field can be active at a time. The in-memory representation of bare unions is not guaranteed. Bare unions cannot be used to reinterpret memory. For that, use @ptrCast, or use an extern union or a packed union which have guaranteed in-memory layout. Accessing the non-active field is safety-checked Illegal Behavior:

test_wrong_union_access.zig
const Payload = union {
    int: i64,
    float: f64,
    boolean: bool,
};
test "simple union" {
    var payload = Payload{ .int = 1234 };
    payload.float = 12.34;
}
Shell
$ zig test test_wrong_union_access.zig
1/1 test_wrong_union_access.test.simple union...thread 3522146 panic: access of union field 'float' while field 'int' is active
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_wrong_union_access.zig:8:12: 0x102d083 in test.simple union (test_wrong_union_access.zig)
    payload.float = 12.34;
           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1176023 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116c0c7 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x11651fd in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1164ad3 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/d84c909152a51c7143e80c061415ea41/test --seed=0xb9d96e9
You can activate another field by assigning the entire union:

test_simple_union.zig
const std = @import("std");
const expect = std.testing.expect;

const Payload = union {
    int: i64,
    float: f64,
    boolean: bool,
};
test "simple union" {
    var payload = Payload{ .int = 1234 };
    try expect(payload.int == 1234);
    payload = Payload{ .float = 12.34 };
    try expect(payload.float == 12.34);
}
Shell
$ zig test test_simple_union.zig
1/1 test_simple_union.test.simple union...OK
All 1 tests passed.
In order to use switch with a union, it must be a Tagged union.

To initialize a union when the tag is a comptime-known name, see @unionInit.

Tagged union 
Unions can be declared with an enum tag type. This turns the union into a tagged union, which makes it eligible to use with switch expressions. Tagged unions coerce to their tag type: Type Coercion: Unions and Enums.

test_tagged_union.zig
const std = @import("std");
const expect = std.testing.expect;

const ComplexTypeTag = enum {
    ok,
    not_ok,
};
const ComplexType = union(ComplexTypeTag) {
    ok: u8,
    not_ok: void,
};

test "switch on tagged union" {
    const c = ComplexType{ .ok = 42 };
    try expect(@as(ComplexTypeTag, c) == ComplexTypeTag.ok);

    switch (c) {
        .ok => |value| try expect(value == 42),
        .not_ok => unreachable,
    }
}

test "get tag type" {
    try expect(std.meta.Tag(ComplexType) == ComplexTypeTag);
}
Shell
$ zig test test_tagged_union.zig
1/2 test_tagged_union.test.switch on tagged union...OK
2/2 test_tagged_union.test.get tag type...OK
All 2 tests passed.
In order to modify the payload of a tagged union in a switch expression, place a * before the variable name to make it a pointer:

test_switch_modify_tagged_union.zig
const std = @import("std");
const expect = std.testing.expect;

const ComplexTypeTag = enum {
    ok,
    not_ok,
};
const ComplexType = union(ComplexTypeTag) {
    ok: u8,
    not_ok: void,
};

test "modify tagged union in switch" {
    var c = ComplexType{ .ok = 42 };

    switch (c) {
        ComplexTypeTag.ok => |*value| value.* += 1,
        ComplexTypeTag.not_ok => unreachable,
    }

    try expect(c.ok == 43);
}
Shell
$ zig test test_switch_modify_tagged_union.zig
1/1 test_switch_modify_tagged_union.test.modify tagged union in switch...OK
All 1 tests passed.
Unions can be made to infer the enum tag type. Further, unions can have methods just like structs and enums.

test_union_method.zig
const std = @import("std");
const expect = std.testing.expect;

const Variant = union(enum) {
    int: i32,
    boolean: bool,

    // void can be omitted when inferring enum tag type.
    none,

    fn truthy(self: Variant) bool {
        return switch (self) {
            Variant.int => |x_int| x_int != 0,
            Variant.boolean => |x_bool| x_bool,
            Variant.none => false,
        };
    }
};

test "union method" {
    var v1: Variant = .{ .int = 1 };
    var v2: Variant = .{ .boolean = false };
    var v3: Variant = .none;

    try expect(v1.truthy());
    try expect(!v2.truthy());
    try expect(!v3.truthy());
}
Shell
$ zig test test_union_method.zig
1/1 test_union_method.test.union method...OK
All 1 tests passed.
@tagName can be used to return a comptime [:0]const u8 value representing the field name:

test_tagName.zig
const std = @import("std");
const expect = std.testing.expect;

const Small2 = union(enum) {
    a: i32,
    b: bool,
    c: u8,
};
test "@tagName" {
    try expect(std.mem.eql(u8, @tagName(Small2.a), "a"));
}
Shell
$ zig test test_tagName.zig
1/1 test_tagName.test.@tagName...OK
All 1 tests passed.
extern union 
An extern union has memory layout guaranteed to be compatible with the target C ABI.

See also:

extern struct
packed union 
A packed union has well-defined in-memory layout and is eligible to be in a packed struct.

Anonymous Union Literals 
Anonymous Struct Literals syntax can be used to initialize unions without specifying the type:

test_anonymous_union.zig
const std = @import("std");
const expect = std.testing.expect;

const Number = union {
    int: i32,
    float: f64,
};

test "anonymous union literal syntax" {
    const i: Number = .{ .int = 42 };
    const f = makeNumber();
    try expect(i.int == 42);
    try expect(f.float == 12.34);
}

fn makeNumber() Number {
    return .{ .float = 12.34 };
}
Shell
$ zig test test_anonymous_union.zig
1/1 test_anonymous_union.test.anonymous union literal syntax...OK
All 1 tests passed.
opaque 
opaque {} declares a new type with an unknown (but non-zero) size and alignment. It can contain declarations the same as structs, unions, and enums.

This is typically used for type safety when interacting with C code that does not expose struct details. Example:

test_opaque.zig
const Derp = opaque {};
const Wat = opaque {};

extern fn bar(d: *Derp) void;
fn foo(w: *Wat) callconv(.c) void {
    bar(w);
}

test "call foo" {
    foo(undefined);
}
Shell
$ zig test test_opaque.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:6:9: error: expected type '*test_opaque.Derp', found '*test_opaque.Wat'
    bar(w);
        ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:6:9: note: pointer type child 'test_opaque.Wat' cannot cast into pointer type child 'test_opaque.Derp'
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:2:13: note: opaque declared here
const Wat = opaque {};
            ^~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:1:14: note: opaque declared here
const Derp = opaque {};
             ^~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:4:18: note: parameter type declared here
extern fn bar(d: *Derp) void;
                 ^~~~~
referenced by:
    test.call foo: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_opaque.zig:10:8

Blocks 
Blocks are used to limit the scope of variable declarations:

test_blocks.zig
test "access variable after block scope" {
    {
        var x: i32 = 1;
        _ = &x;
    }
    x += 1;
}
Shell
$ zig test test_blocks.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_blocks.zig:6:5: error: use of undeclared identifier 'x'
    x += 1;
    ^

Blocks are expressions. When labeled, break can be used to return a value from the block:

test_labeled_break.zig
const std = @import("std");
const expect = std.testing.expect;

test "labeled break from labeled block expression" {
    var y: i32 = 123;

    const x = blk: {
        y += 1;
        break :blk y;
    };
    try expect(x == 124);
    try expect(y == 124);
}
Shell
$ zig test test_labeled_break.zig
1/1 test_labeled_break.test.labeled break from labeled block expression...OK
All 1 tests passed.
Here, blk can be any name.

See also:

Labeled while
Labeled for
Shadowing 
Identifiers are never allowed to "hide" other identifiers by using the same name:

test_shadowing.zig
const pi = 3.14;

test "inside test block" {
    // Let's even go inside another block
    {
        var pi: i32 = 1234;
    }
}
Shell
$ zig test test_shadowing.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_shadowing.zig:6:13: error: local variable shadows declaration of 'pi'
        var pi: i32 = 1234;
            ^~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_shadowing.zig:1:1: note: declared here
const pi = 3.14;
^~~~~~~~~~~~~~~

Because of this, when you read Zig code you can always rely on an identifier to consistently mean the same thing within the scope it is defined. Note that you can, however, use the same name if the scopes are separate:

test_scopes.zig
test "separate scopes" {
    {
        const pi = 3.14;
        _ = pi;
    }
    {
        var pi: bool = true;
        _ = &pi;
    }
}
Shell
$ zig test test_scopes.zig
1/1 test_scopes.test.separate scopes...OK
All 1 tests passed.
Empty Blocks 
An empty block is equivalent to void{}:

test_empty_block.zig
const std = @import("std");
const expect = std.testing.expect;

test {
    const a = {};
    const b = void{};
    try expect(@TypeOf(a) == void);
    try expect(@TypeOf(b) == void);
    try expect(a == b);
}
Shell
$ zig test test_empty_block.zig
1/1 test_empty_block.test_0...OK
All 1 tests passed.
switch 
test_switch.zig
const std = @import("std");
const builtin = @import("builtin");
const expect = std.testing.expect;

test "switch simple" {
    const a: u64 = 10;
    const zz: u64 = 103;

    // All branches of a switch expression must be able to be coerced to a
    // common type.
    //
    // Branches cannot fallthrough. If fallthrough behavior is desired, combine
    // the cases and use an if.
    const b = switch (a) {
        // Multiple cases can be combined via a ','
        1, 2, 3 => 0,

        // Ranges can be specified using the ... syntax. These are inclusive
        // of both ends.
        5...100 => 1,

        // Branches can be arbitrarily complex.
        101 => blk: {
            const c: u64 = 5;
            break :blk c * 2 + 1;
        },

        // Switching on arbitrary expressions is allowed as long as the
        // expression is known at compile-time.
        zz => zz,
        blk: {
            const d: u32 = 5;
            const e: u32 = 100;
            break :blk d + e;
        } => 107,

        // The else branch catches everything not already captured.
        // Else branches are mandatory unless the entire range of values
        // is handled.
        else => 9,
    };

    try expect(b == 1);
}

// Switch expressions can be used outside a function:
const os_msg = switch (builtin.target.os.tag) {
    .linux => "we found a linux user",
    else => "not a linux user",
};

// Inside a function, switch statements implicitly are compile-time
// evaluated if the target expression is compile-time known.
test "switch inside function" {
    switch (builtin.target.os.tag) {
        .fuchsia => {
            // On an OS other than fuchsia, block is not even analyzed,
            // so this compile error is not triggered.
            // On fuchsia this compile error would be triggered.
            @compileError("fuchsia not supported");
        },
        else => {},
    }
}
Shell
$ zig test test_switch.zig
1/2 test_switch.test.switch simple...OK
2/2 test_switch.test.switch inside function...OK
All 2 tests passed.
switch can be used to capture the field values of a Tagged union. Modifications to the field values can be done by placing a * before the capture variable name, turning it into a pointer.

test_switch_tagged_union.zig
const expect = @import("std").testing.expect;

test "switch on tagged union" {
    const Point = struct {
        x: u8,
        y: u8,
    };
    const Item = union(enum) {
        a: u32,
        c: Point,
        d,
        e: u32,
    };

    var a = Item{ .c = Point{ .x = 1, .y = 2 } };

    // Switching on more complex enums is allowed.
    const b = switch (a) {
        // A capture group is allowed on a match, and will return the enum
        // value matched. If the payload types of both cases are the same
        // they can be put into the same switch prong.
        Item.a, Item.e => |item| item,

        // A reference to the matched value can be obtained using `*` syntax.
        Item.c => |*item| blk: {
            item.*.x += 1;
            break :blk 6;
        },

        // No else is required if the types cases was exhaustively handled
        Item.d => 8,
    };

    try expect(b == 6);
    try expect(a.c.x == 2);
}
Shell
$ zig test test_switch_tagged_union.zig
1/1 test_switch_tagged_union.test.switch on tagged union...OK
All 1 tests passed.
See also:

comptime
enum
@compileError
Compile Variables
Exhaustive Switching 
When a switch expression does not have an else clause, it must exhaustively list all the possible values. Failure to do so is a compile error:

test_unhandled_enumeration_value.zig
const Color = enum {
    auto,
    off,
    on,
};

test "exhaustive switching" {
    const color = Color.off;
    switch (color) {
        Color.auto => {},
        Color.on => {},
    }
}
Shell
$ zig test test_unhandled_enumeration_value.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unhandled_enumeration_value.zig:9:5: error: switch must handle all possibilities
    switch (color) {
    ^~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unhandled_enumeration_value.zig:3:5: note: unhandled enumeration value: 'off'
    off,
    ^~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unhandled_enumeration_value.zig:1:15: note: enum 'test_unhandled_enumeration_value.Color' declared here
const Color = enum {
              ^~~~

Switching with Enum Literals 
Enum Literals can be useful to use with switch to avoid repetitively specifying enum or union types:

test_exhaustive_switch.zig
const std = @import("std");
const expect = std.testing.expect;

const Color = enum {
    auto,
    off,
    on,
};

test "enum literals with switch" {
    const color = Color.off;
    const result = switch (color) {
        .auto => false,
        .on => false,
        .off => true,
    };
    try expect(result);
}
Shell
$ zig test test_exhaustive_switch.zig
1/1 test_exhaustive_switch.test.enum literals with switch...OK
All 1 tests passed.
Labeled switch 
When a switch statement is labeled, it can be referenced from a break or continue. break will return a value from the switch.

A continue targeting a switch must have an operand. When executed, it will jump to the matching prong, as if the switch were executed again with the continue's operand replacing the initial switch value.

test_switch_continue.zig
const std = @import("std");

test "switch continue" {
    sw: switch (@as(i32, 5)) {
        5 => continue :sw 4,

        // `continue` can occur multiple times within a single switch prong.
        2...4 => |v| {
            if (v > 3) {
                continue :sw 2;
            } else if (v == 3) {

                // `break` can target labeled loops.
                break :sw;
            }

            continue :sw 1;
        },

        1 => return,

        else => unreachable,
    }
}
Shell
$ zig test test_switch_continue.zig
1/1 test_switch_continue.test.switch continue...OK
All 1 tests passed.
Semantically, this is equivalent to the following loop:

test_switch_continue_equivalent.zig
const std = @import("std");

test "switch continue, equivalent loop" {
    var sw: i32 = 5;
    while (true) {
        switch (sw) {
            5 => {
                sw = 4;
                continue;
            },
            2...4 => |v| {
                if (v > 3) {
                    sw = 2;
                    continue;
                } else if (v == 3) {
                    break;
                }

                sw = 1;
                continue;
            },
            1 => return,
            else => unreachable,
        }
    }
}
Shell
$ zig test test_switch_continue_equivalent.zig
1/1 test_switch_continue_equivalent.test.switch continue, equivalent loop...OK
All 1 tests passed.
This can improve clarity of (for example) state machines, where the syntax continue :sw .next_state is unambiguous, explicit, and immediately understandable.

However, the motivating example is a switch on each element of an array, where using a single switch can improve clarity and performance:

test_switch_dispatch_loop.zig
const std = @import("std");
const expectEqual = std.testing.expectEqual;

const Instruction = enum {
    add,
    mul,
    end,
};

fn evaluate(initial_stack: []const i32, code: []const Instruction) !i32 {
    var stack = try std.BoundedArray(i32, 8).fromSlice(initial_stack);
    var ip: usize = 0;

    return vm: switch (code[ip]) {
        // Because all code after `continue` is unreachable, this branch does
        // not provide a result.
        .add => {
            try stack.append(stack.pop().? + stack.pop().?);

            ip += 1;
            continue :vm code[ip];
        },
        .mul => {
            try stack.append(stack.pop().? * stack.pop().?);

            ip += 1;
            continue :vm code[ip];
        },
        .end => stack.pop().?,
    };
}

test "evaluate" {
    const result = try evaluate(&.{ 7, 2, -3 }, &.{ .mul, .add, .end });
    try expectEqual(1, result);
}
Shell
$ zig test test_switch_dispatch_loop.zig
1/1 test_switch_dispatch_loop.test.evaluate...OK
All 1 tests passed.
If the operand to continue is comptime-known, then it can be lowered to an unconditional branch to the relevant case. Such a branch is perfectly predicted, and hence typically very fast to execute.

If the operand is runtime-known, each continue can embed a conditional branch inline (ideally through a jump table), which allows a CPU to predict its target independently of any other prong. A loop-based lowering would force every branch through the same dispatch point, hindering branch prediction.

Inline Switch Prongs 
Switch prongs can be marked as inline to generate the prong's body for each possible value it could have, making the captured value comptime.

test_inline_switch.zig
const std = @import("std");
const expect = std.testing.expect;
const expectError = std.testing.expectError;

fn isFieldOptional(comptime T: type, field_index: usize) !bool {
    const fields = @typeInfo(T).@"struct".fields;
    return switch (field_index) {
        // This prong is analyzed twice with `idx` being a
        // comptime-known value each time.
        inline 0, 1 => |idx| @typeInfo(fields[idx].type) == .optional,
        else => return error.IndexOutOfBounds,
    };
}

const Struct1 = struct { a: u32, b: ?u32 };

test "using @typeInfo with runtime values" {
    var index: usize = 0;
    try expect(!try isFieldOptional(Struct1, index));
    index += 1;
    try expect(try isFieldOptional(Struct1, index));
    index += 1;
    try expectError(error.IndexOutOfBounds, isFieldOptional(Struct1, index));
}

// Calls to `isFieldOptional` on `Struct1` get unrolled to an equivalent
// of this function:
fn isFieldOptionalUnrolled(field_index: usize) !bool {
    return switch (field_index) {
        0 => false,
        1 => true,
        else => return error.IndexOutOfBounds,
    };
}
Shell
$ zig test test_inline_switch.zig
1/1 test_inline_switch.test.using @typeInfo with runtime values...OK
All 1 tests passed.
The inline keyword may also be combined with ranges:

inline_prong_range.zig
fn isFieldOptional(comptime T: type, field_index: usize) !bool {
    const fields = @typeInfo(T).@"struct".fields;
    return switch (field_index) {
        inline 0...fields.len - 1 => |idx| @typeInfo(fields[idx].type) == .optional,
        else => return error.IndexOutOfBounds,
    };
}
inline else prongs can be used as a type safe alternative to inline for loops:

test_inline_else.zig
const std = @import("std");
const expect = std.testing.expect;

const SliceTypeA = extern struct {
    len: usize,
    ptr: [*]u32,
};
const SliceTypeB = extern struct {
    ptr: [*]SliceTypeA,
    len: usize,
};
const AnySlice = union(enum) {
    a: SliceTypeA,
    b: SliceTypeB,
    c: []const u8,
    d: []AnySlice,
};

fn withFor(any: AnySlice) usize {
    const Tag = @typeInfo(AnySlice).@"union".tag_type.?;
    inline for (@typeInfo(Tag).@"enum".fields) |field| {
        // With `inline for` the function gets generated as
        // a series of `if` statements relying on the optimizer
        // to convert it to a switch.
        if (field.value == @intFromEnum(any)) {
            return @field(any, field.name).len;
        }
    }
    // When using `inline for` the compiler doesn't know that every
    // possible case has been handled requiring an explicit `unreachable`.
    unreachable;
}

fn withSwitch(any: AnySlice) usize {
    return switch (any) {
        // With `inline else` the function is explicitly generated
        // as the desired switch and the compiler can check that
        // every possible case is handled.
        inline else => |slice| slice.len,
    };
}

test "inline for and inline else similarity" {
    const any = AnySlice{ .c = "hello" };
    try expect(withFor(any) == 5);
    try expect(withSwitch(any) == 5);
}
Shell
$ zig test test_inline_else.zig
1/1 test_inline_else.test.inline for and inline else similarity...OK
All 1 tests passed.
When using an inline prong switching on an union an additional capture can be used to obtain the union's enum tag value.

test_inline_switch_union_tag.zig
const std = @import("std");
const expect = std.testing.expect;

const U = union(enum) {
    a: u32,
    b: f32,
};

fn getNum(u: U) u32 {
    switch (u) {
        // Here `num` is a runtime-known value that is either
        // `u.a` or `u.b` and `tag` is `u`'s comptime-known tag value.
        inline else => |num, tag| {
            if (tag == .b) {
                return @intFromFloat(num);
            }
            return num;
        },
    }
}

test "test" {
    const u = U{ .b = 42 };
    try expect(getNum(u) == 42);
}
Shell
$ zig test test_inline_switch_union_tag.zig
1/1 test_inline_switch_union_tag.test.test...OK
All 1 tests passed.
See also:

inline while
inline for
while 
A while loop is used to repeatedly execute an expression until some condition is no longer true.

test_while.zig
const expect = @import("std").testing.expect;

test "while basic" {
    var i: usize = 0;
    while (i < 10) {
        i += 1;
    }
    try expect(i == 10);
}
Shell
$ zig test test_while.zig
1/1 test_while.test.while basic...OK
All 1 tests passed.
Use break to exit a while loop early.

test_while_break.zig
const expect = @import("std").testing.expect;

test "while break" {
    var i: usize = 0;
    while (true) {
        if (i == 10)
            break;
        i += 1;
    }
    try expect(i == 10);
}
Shell
$ zig test test_while_break.zig
1/1 test_while_break.test.while break...OK
All 1 tests passed.
Use continue to jump back to the beginning of the loop.

test_while_continue.zig
const expect = @import("std").testing.expect;

test "while continue" {
    var i: usize = 0;
    while (true) {
        i += 1;
        if (i < 10)
            continue;
        break;
    }
    try expect(i == 10);
}
Shell
$ zig test test_while_continue.zig
1/1 test_while_continue.test.while continue...OK
All 1 tests passed.
While loops support a continue expression which is executed when the loop is continued. The continue keyword respects this expression.

test_while_continue_expression.zig
const expect = @import("std").testing.expect;

test "while loop continue expression" {
    var i: usize = 0;
    while (i < 10) : (i += 1) {}
    try expect(i == 10);
}

test "while loop continue expression, more complicated" {
    var i: usize = 1;
    var j: usize = 1;
    while (i * j < 2000) : ({
        i *= 2;
        j *= 3;
    }) {
        const my_ij = i * j;
        try expect(my_ij < 2000);
    }
}
Shell
$ zig test test_while_continue_expression.zig
1/2 test_while_continue_expression.test.while loop continue expression...OK
2/2 test_while_continue_expression.test.while loop continue expression, more complicated...OK
All 2 tests passed.
While loops are expressions. The result of the expression is the result of the else clause of a while loop, which is executed when the condition of the while loop is tested as false.

break, like return, accepts a value parameter. This is the result of the while expression. When you break from a while loop, the else branch is not evaluated.

test_while_else.zig
const expect = @import("std").testing.expect;

test "while else" {
    try expect(rangeHasNumber(0, 10, 5));
    try expect(!rangeHasNumber(0, 10, 15));
}

fn rangeHasNumber(begin: usize, end: usize, number: usize) bool {
    var i = begin;
    return while (i < end) : (i += 1) {
        if (i == number) {
            break true;
        }
    } else false;
}
Shell
$ zig test test_while_else.zig
1/1 test_while_else.test.while else...OK
All 1 tests passed.
Labeled while 
When a while loop is labeled, it can be referenced from a break or continue from within a nested loop:

test_while_nested_break.zig
test "nested break" {
    outer: while (true) {
        while (true) {
            break :outer;
        }
    }
}

test "nested continue" {
    var i: usize = 0;
    outer: while (i < 10) : (i += 1) {
        while (true) {
            continue :outer;
        }
    }
}
Shell
$ zig test test_while_nested_break.zig
1/2 test_while_nested_break.test.nested break...OK
2/2 test_while_nested_break.test.nested continue...OK
All 2 tests passed.
while with Optionals 
Just like if expressions, while loops can take an optional as the condition and capture the payload. When null is encountered the loop exits.

When the |x| syntax is present on a while expression, the while condition must have an Optional Type.

The else branch is allowed on optional iteration. In this case, it will be executed on the first null value encountered.

test_while_null_capture.zig
const expect = @import("std").testing.expect;

test "while null capture" {
    var sum1: u32 = 0;
    numbers_left = 3;
    while (eventuallyNullSequence()) |value| {
        sum1 += value;
    }
    try expect(sum1 == 3);

    // null capture with an else block
    var sum2: u32 = 0;
    numbers_left = 3;
    while (eventuallyNullSequence()) |value| {
        sum2 += value;
    } else {
        try expect(sum2 == 3);
    }

    // null capture with a continue expression
    var i: u32 = 0;
    var sum3: u32 = 0;
    numbers_left = 3;
    while (eventuallyNullSequence()) |value| : (i += 1) {
        sum3 += value;
    }
    try expect(i == 3);
}

var numbers_left: u32 = undefined;
fn eventuallyNullSequence() ?u32 {
    return if (numbers_left == 0) null else blk: {
        numbers_left -= 1;
        break :blk numbers_left;
    };
}
Shell
$ zig test test_while_null_capture.zig
1/1 test_while_null_capture.test.while null capture...OK
All 1 tests passed.
while with Error Unions 
Just like if expressions, while loops can take an error union as the condition and capture the payload or the error code. When the condition results in an error code the else branch is evaluated and the loop is finished.

When the else |x| syntax is present on a while expression, the while condition must have an Error Union Type.

test_while_error_capture.zig
const expect = @import("std").testing.expect;

test "while error union capture" {
    var sum1: u32 = 0;
    numbers_left = 3;
    while (eventuallyErrorSequence()) |value| {
        sum1 += value;
    } else |err| {
        try expect(err == error.ReachedZero);
    }
}

var numbers_left: u32 = undefined;

fn eventuallyErrorSequence() anyerror!u32 {
    return if (numbers_left == 0) error.ReachedZero else blk: {
        numbers_left -= 1;
        break :blk numbers_left;
    };
}
Shell
$ zig test test_while_error_capture.zig
1/1 test_while_error_capture.test.while error union capture...OK
All 1 tests passed.
inline while 
While loops can be inlined. This causes the loop to be unrolled, which allows the code to do some things which only work at compile time, such as use types as first class values.

test_inline_while.zig
const expect = @import("std").testing.expect;

test "inline while loop" {
    comptime var i = 0;
    var sum: usize = 0;
    inline while (i < 3) : (i += 1) {
        const T = switch (i) {
            0 => f32,
            1 => i8,
            2 => bool,
            else => unreachable,
        };
        sum += typeNameLength(T);
    }
    try expect(sum == 9);
}

fn typeNameLength(comptime T: type) usize {
    return @typeName(T).len;
}
Shell
$ zig test test_inline_while.zig
1/1 test_inline_while.test.inline while loop...OK
All 1 tests passed.
It is recommended to use inline loops only for one of these reasons:

You need the loop to execute at comptime for the semantics to work.
You have a benchmark to prove that forcibly unrolling the loop in this way is measurably faster.
See also:

if
Optionals
Errors
comptime
unreachable
for 
test_for.zig
const expect = @import("std").testing.expect;

test "for basics" {
    const items = [_]i32{ 4, 5, 3, 4, 0 };
    var sum: i32 = 0;

    // For loops iterate over slices and arrays.
    for (items) |value| {
        // Break and continue are supported.
        if (value == 0) {
            continue;
        }
        sum += value;
    }
    try expect(sum == 16);

    // To iterate over a portion of a slice, reslice.
    for (items[0..1]) |value| {
        sum += value;
    }
    try expect(sum == 20);

    // To access the index of iteration, specify a second condition as well
    // as a second capture value.
    var sum2: i32 = 0;
    for (items, 0..) |_, i| {
        try expect(@TypeOf(i) == usize);
        sum2 += @as(i32, @intCast(i));
    }
    try expect(sum2 == 10);

    // To iterate over consecutive integers, use the range syntax.
    // Unbounded range is always a compile error.
    var sum3: usize = 0;
    for (0..5) |i| {
        sum3 += i;
    }
    try expect(sum3 == 10);
}

test "multi object for" {
    const items = [_]usize{ 1, 2, 3 };
    const items2 = [_]usize{ 4, 5, 6 };
    var count: usize = 0;

    // Iterate over multiple objects.
    // All lengths must be equal at the start of the loop, otherwise detectable
    // illegal behavior occurs.
    for (items, items2) |i, j| {
        count += i + j;
    }

    try expect(count == 21);
}

test "for reference" {
    var items = [_]i32{ 3, 4, 2 };

    // Iterate over the slice by reference by
    // specifying that the capture value is a pointer.
    for (&items) |*value| {
        value.* += 1;
    }

    try expect(items[0] == 4);
    try expect(items[1] == 5);
    try expect(items[2] == 3);
}

test "for else" {
    // For allows an else attached to it, the same as a while loop.
    const items = [_]?i32{ 3, 4, null, 5 };

    // For loops can also be used as expressions.
    // Similar to while loops, when you break from a for loop, the else branch is not evaluated.
    var sum: i32 = 0;
    const result = for (items) |value| {
        if (value != null) {
            sum += value.?;
        }
    } else blk: {
        try expect(sum == 12);
        break :blk sum;
    };
    try expect(result == 12);
}
Shell
$ zig test test_for.zig
1/4 test_for.test.for basics...OK
2/4 test_for.test.multi object for...OK
3/4 test_for.test.for reference...OK
4/4 test_for.test.for else...OK
All 4 tests passed.
Labeled for 
When a for loop is labeled, it can be referenced from a break or continue from within a nested loop:

test_for_nested_break.zig
const std = @import("std");
const expect = std.testing.expect;

test "nested break" {
    var count: usize = 0;
    outer: for (1..6) |_| {
        for (1..6) |_| {
            count += 1;
            break :outer;
        }
    }
    try expect(count == 1);
}

test "nested continue" {
    var count: usize = 0;
    outer: for (1..9) |_| {
        for (1..6) |_| {
            count += 1;
            continue :outer;
        }
    }

    try expect(count == 8);
}
Shell
$ zig test test_for_nested_break.zig
1/2 test_for_nested_break.test.nested break...OK
2/2 test_for_nested_break.test.nested continue...OK
All 2 tests passed.
inline for 
For loops can be inlined. This causes the loop to be unrolled, which allows the code to do some things which only work at compile time, such as use types as first class values. The capture value and iterator value of inlined for loops are compile-time known.

test_inline_for.zig
const expect = @import("std").testing.expect;

test "inline for loop" {
    const nums = [_]i32{ 2, 4, 6 };
    var sum: usize = 0;
    inline for (nums) |i| {
        const T = switch (i) {
            2 => f32,
            4 => i8,
            6 => bool,
            else => unreachable,
        };
        sum += typeNameLength(T);
    }
    try expect(sum == 9);
}

fn typeNameLength(comptime T: type) usize {
    return @typeName(T).len;
}
Shell
$ zig test test_inline_for.zig
1/1 test_inline_for.test.inline for loop...OK
All 1 tests passed.
It is recommended to use inline loops only for one of these reasons:

You need the loop to execute at comptime for the semantics to work.
You have a benchmark to prove that forcibly unrolling the loop in this way is measurably faster.
See also:

while
comptime
Arrays
Slices
if 
test_if.zig
// If expressions have three uses, corresponding to the three types:
// * bool
// * ?T
// * anyerror!T

const expect = @import("std").testing.expect;

test "if expression" {
    // If expressions are used instead of a ternary expression.
    const a: u32 = 5;
    const b: u32 = 4;
    const result = if (a != b) 47 else 3089;
    try expect(result == 47);
}

test "if boolean" {
    // If expressions test boolean conditions.
    const a: u32 = 5;
    const b: u32 = 4;
    if (a != b) {
        try expect(true);
    } else if (a == 9) {
        unreachable;
    } else {
        unreachable;
    }
}

test "if error union" {
    // If expressions test for errors.
    // Note the |err| capture on the else.

    const a: anyerror!u32 = 0;
    if (a) |value| {
        try expect(value == 0);
    } else |err| {
        _ = err;
        unreachable;
    }

    const b: anyerror!u32 = error.BadValue;
    if (b) |value| {
        _ = value;
        unreachable;
    } else |err| {
        try expect(err == error.BadValue);
    }

    // The else and |err| capture is strictly required.
    if (a) |value| {
        try expect(value == 0);
    } else |_| {}

    // To check only the error value, use an empty block expression.
    if (b) |_| {} else |err| {
        try expect(err == error.BadValue);
    }

    // Access the value by reference using a pointer capture.
    var c: anyerror!u32 = 3;
    if (c) |*value| {
        value.* = 9;
    } else |_| {
        unreachable;
    }

    if (c) |value| {
        try expect(value == 9);
    } else |_| {
        unreachable;
    }
}
Shell
$ zig test test_if.zig
1/3 test_if.test.if expression...OK
2/3 test_if.test.if boolean...OK
3/3 test_if.test.if error union...OK
All 3 tests passed.
if with Optionals 
test_if_optionals.zig
const expect = @import("std").testing.expect;

test "if optional" {
    // If expressions test for null.

    const a: ?u32 = 0;
    if (a) |value| {
        try expect(value == 0);
    } else {
        unreachable;
    }

    const b: ?u32 = null;
    if (b) |_| {
        unreachable;
    } else {
        try expect(true);
    }

    // The else is not required.
    if (a) |value| {
        try expect(value == 0);
    }

    // To test against null only, use the binary equality operator.
    if (b == null) {
        try expect(true);
    }

    // Access the value by reference using a pointer capture.
    var c: ?u32 = 3;
    if (c) |*value| {
        value.* = 2;
    }

    if (c) |value| {
        try expect(value == 2);
    } else {
        unreachable;
    }
}

test "if error union with optional" {
    // If expressions test for errors before unwrapping optionals.
    // The |optional_value| capture's type is ?u32.

    const a: anyerror!?u32 = 0;
    if (a) |optional_value| {
        try expect(optional_value.? == 0);
    } else |err| {
        _ = err;
        unreachable;
    }

    const b: anyerror!?u32 = null;
    if (b) |optional_value| {
        try expect(optional_value == null);
    } else |_| {
        unreachable;
    }

    const c: anyerror!?u32 = error.BadValue;
    if (c) |optional_value| {
        _ = optional_value;
        unreachable;
    } else |err| {
        try expect(err == error.BadValue);
    }

    // Access the value by reference by using a pointer capture each time.
    var d: anyerror!?u32 = 3;
    if (d) |*optional_value| {
        if (optional_value.*) |*value| {
            value.* = 9;
        }
    } else |_| {
        unreachable;
    }

    if (d) |optional_value| {
        try expect(optional_value.? == 9);
    } else |_| {
        unreachable;
    }
}
Shell
$ zig test test_if_optionals.zig
1/2 test_if_optionals.test.if optional...OK
2/2 test_if_optionals.test.if error union with optional...OK
All 2 tests passed.
See also:

Optionals
Errors
defer 
Executes an expression unconditionally at scope exit.

test_defer.zig
const std = @import("std");
const expect = std.testing.expect;
const print = std.debug.print;

fn deferExample() !usize {
    var a: usize = 1;

    {
        defer a = 2;
        a = 1;
    }
    try expect(a == 2);

    a = 5;
    return a;
}

test "defer basics" {
    try expect((try deferExample()) == 5);
}
Shell
$ zig test test_defer.zig
1/1 test_defer.test.defer basics...OK
All 1 tests passed.
Defer expressions are evaluated in reverse order.

defer_unwind.zig
const std = @import("std");
const expect = std.testing.expect;
const print = std.debug.print;

test "defer unwinding" {
    print("\n", .{});

    defer {
        print("1 ", .{});
    }
    defer {
        print("2 ", .{});
    }
    if (false) {
        // defers are not run if they are never executed.
        defer {
            print("3 ", .{});
        }
    }
}
Shell
$ zig test defer_unwind.zig
1/1 defer_unwind.test.defer unwinding...
2 1 OK
All 1 tests passed.
Inside a defer expression the return statement is not allowed.

test_invalid_defer.zig
fn deferInvalidExample() !void {
    defer {
        return error.DeferError;
    }

    return error.DeferError;
}
Shell
$ zig test test_invalid_defer.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_invalid_defer.zig:3:9: error: cannot return from defer expression
        return error.DeferError;
        ^~~~~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_invalid_defer.zig:2:5: note: defer expression here
    defer {
    ^~~~~

See also:

Errors
unreachable 
In Debug and ReleaseSafe mode unreachable emits a call to panic with the message reached unreachable code.

In ReleaseFast and ReleaseSmall mode, the optimizer uses the assumption that unreachable code will never be hit to perform optimizations.

Basics 
test_unreachable.zig
// unreachable is used to assert that control flow will never reach a
// particular location:
test "basic math" {
    const x = 1;
    const y = 2;
    if (x + y != 3) {
        unreachable;
    }
}
Shell
$ zig test test_unreachable.zig
1/1 test_unreachable.test.basic math...OK
All 1 tests passed.
In fact, this is how std.debug.assert is implemented:

test_assertion_failure.zig
// This is how std.debug.assert is implemented
fn assert(ok: bool) void {
    if (!ok) unreachable; // assertion failure
}

// This test will fail because we hit unreachable.
test "this will fail" {
    assert(false);
}
Shell
$ zig test test_assertion_failure.zig
1/1 test_assertion_failure.test.this will fail...thread 3520263 panic: reached unreachable code
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_assertion_failure.zig:3:14: 0x102d036 in assert (test_assertion_failure.zig)
    if (!ok) unreachable; // assertion failure
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_assertion_failure.zig:8:11: 0x102d00e in test.this will fail (test_assertion_failure.zig)
    assert(false);
          ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1175dc3 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116be67 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1164f9d in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1164873 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/add3a625f9569b070979afb805f20fb5/test --seed=0xc5d84b99
At Compile-Time 
test_comptime_unreachable.zig
const assert = @import("std").debug.assert;

test "type of unreachable" {
    comptime {
        // The type of unreachable is noreturn.

        // However this assertion will still fail to compile because
        // unreachable expressions are compile errors.

        assert(@TypeOf(unreachable) == noreturn);
    }
}
Shell
$ zig test test_comptime_unreachable.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_unreachable.zig:10:16: error: unreachable code
        assert(@TypeOf(unreachable) == noreturn);
               ^~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_unreachable.zig:10:24: note: control flow is diverted here
        assert(@TypeOf(unreachable) == noreturn);
                       ^~~~~~~~~~~

See also:

Zig Test
Build Mode
comptime
noreturn 
noreturn is the type of:

break
continue
return
unreachable
while (true) {}
When resolving types together, such as if clauses or switch prongs, the noreturn type is compatible with every other type. Consider:

test_noreturn.zig
fn foo(condition: bool, b: u32) void {
    const a = if (condition) b else return;
    _ = a;
    @panic("do something with a");
}
test "noreturn" {
    foo(false, 1);
}
Shell
$ zig test test_noreturn.zig
1/1 test_noreturn.test.noreturn...OK
All 1 tests passed.
Another use case for noreturn is the exit function:

test_noreturn_from_exit.zig
const std = @import("std");
const builtin = @import("builtin");
const native_arch = builtin.cpu.arch;
const expect = std.testing.expect;

const WINAPI: std.builtin.CallingConvention = if (native_arch == .x86) .Stdcall else .C;
extern "kernel32" fn ExitProcess(exit_code: c_uint) callconv(WINAPI) noreturn;

test "foo" {
    const value = bar() catch ExitProcess(1);
    try expect(value == 1234);
}

fn bar() anyerror!u32 {
    return 1234;
}
Shell
$ zig test test_noreturn_from_exit.zig -target x86_64-windows --test-no-exec
Functions 
test_functions.zig
const std = @import("std");
const builtin = @import("builtin");
const native_arch = builtin.cpu.arch;
const expect = std.testing.expect;

// Functions are declared like this
fn add(a: i8, b: i8) i8 {
    if (a == 0) {
        return b;
    }

    return a + b;
}

// The export specifier makes a function externally visible in the generated
// object file, and makes it use the C ABI.
export fn sub(a: i8, b: i8) i8 {
    return a - b;
}

// The extern specifier is used to declare a function that will be resolved
// at link time, when linking statically, or at runtime, when linking
// dynamically. The quoted identifier after the extern keyword specifies
// the library that has the function. (e.g. "c" -> libc.so)
// The callconv specifier changes the calling convention of the function.
extern "kernel32" fn ExitProcess(exit_code: u32) callconv(.winapi) noreturn;
extern "c" fn atan2(a: f64, b: f64) f64;

// The @branchHint builtin can be used to tell the optimizer that a function is rarely called ("cold").
fn abort() noreturn {
    @branchHint(.cold);
    while (true) {}
}

// The naked calling convention makes a function not have any function prologue or epilogue.
// This can be useful when integrating with assembly.
fn _start() callconv(.naked) noreturn {
    abort();
}

// The inline calling convention forces a function to be inlined at all call sites.
// If the function cannot be inlined, it is a compile-time error.
inline fn shiftLeftOne(a: u32) u32 {
    return a << 1;
}

// The pub specifier allows the function to be visible when importing.
// Another file can use @import and call sub2
pub fn sub2(a: i8, b: i8) i8 {
    return a - b;
}

// Function pointers are prefixed with `*const `.
const Call2Op = *const fn (a: i8, b: i8) i8;
fn doOp(fnCall: Call2Op, op1: i8, op2: i8) i8 {
    return fnCall(op1, op2);
}

test "function" {
    try expect(doOp(add, 5, 6) == 11);
    try expect(doOp(sub2, 5, 6) == -1);
}
Shell
$ zig test test_functions.zig
1/1 test_functions.test.function...OK
All 1 tests passed.
There is a difference between a function body and a function pointer. Function bodies are comptime-only types while function Pointers may be runtime-known.

Pass-by-value Parameters 
Primitive types such as Integers and Floats passed as parameters are copied, and then the copy is available in the function body. This is called "passing by value". Copying a primitive type is essentially free and typically involves nothing more than setting a register.

Structs, unions, and arrays can sometimes be more efficiently passed as a reference, since a copy could be arbitrarily expensive depending on the size. When these types are passed as parameters, Zig may choose to copy and pass by value, or pass by reference, whichever way Zig decides will be faster. This is made possible, in part, by the fact that parameters are immutable.

test_pass_by_reference_or_value.zig
const Point = struct {
    x: i32,
    y: i32,
};

fn foo(point: Point) i32 {
    // Here, `point` could be a reference, or a copy. The function body
    // can ignore the difference and treat it as a value. Be very careful
    // taking the address of the parameter - it should be treated as if
    // the address will become invalid when the function returns.
    return point.x + point.y;
}

const expect = @import("std").testing.expect;

test "pass struct to function" {
    try expect(foo(Point{ .x = 1, .y = 2 }) == 3);
}
Shell
$ zig test test_pass_by_reference_or_value.zig
1/1 test_pass_by_reference_or_value.test.pass struct to function...OK
All 1 tests passed.
For extern functions, Zig follows the C ABI for passing structs and unions by value.

Function Parameter Type Inference 
Function parameters can be declared with anytype in place of the type. In this case the parameter types will be inferred when the function is called. Use @TypeOf and @typeInfo to get information about the inferred type.

test_fn_type_inference.zig
const expect = @import("std").testing.expect;

fn addFortyTwo(x: anytype) @TypeOf(x) {
    return x + 42;
}

test "fn type inference" {
    try expect(addFortyTwo(1) == 43);
    try expect(@TypeOf(addFortyTwo(1)) == comptime_int);
    const y: i64 = 2;
    try expect(addFortyTwo(y) == 44);
    try expect(@TypeOf(addFortyTwo(y)) == i64);
}
Shell
$ zig test test_fn_type_inference.zig
1/1 test_fn_type_inference.test.fn type inference...OK
All 1 tests passed.
inline fn 
Adding the inline keyword to a function definition makes that function become semantically inlined at the callsite. This is not a hint to be possibly observed by optimization passes, but has implications on the types and values involved in the function call.

Unlike normal function calls, arguments at an inline function callsite which are compile-time known are treated as Compile Time Parameters. This can potentially propagate all the way to the return value:

inline_call.zig
test "inline function call" {
    if (foo(1200, 34) != 1234) {
        @compileError("bad");
    }
}

inline fn foo(a: i32, b: i32) i32 {
    return a + b;
}
Shell
$ zig test inline_call.zig
1/1 inline_call.test.inline function call...OK
All 1 tests passed.
If inline is removed, the test fails with the compile error instead of passing.

It is generally better to let the compiler decide when to inline a function, except for these scenarios:

To change how many stack frames are in the call stack, for debugging purposes.
To force comptime-ness of the arguments to propagate to the return value of the function, as in the above example.
Real world performance measurements demand it.
Note that inline actually restricts what the compiler is allowed to do. This can harm binary size, compilation speed, and even runtime performance.

Function Reflection 
test_fn_reflection.zig
const std = @import("std");
const math = std.math;
const testing = std.testing;

test "fn reflection" {
    try testing.expect(@typeInfo(@TypeOf(testing.expect)).@"fn".params[0].type.? == bool);
    try testing.expect(@typeInfo(@TypeOf(testing.tmpDir)).@"fn".return_type.? == testing.TmpDir);

    try testing.expect(@typeInfo(@TypeOf(math.Log2Int)).@"fn".is_generic);
}
Shell
$ zig test test_fn_reflection.zig
1/1 test_fn_reflection.test.fn reflection...OK
All 1 tests passed.
Errors 
Error Set Type 
An error set is like an enum. However, each error name across the entire compilation gets assigned an unsigned integer greater than 0. You are allowed to declare the same error name more than once, and if you do, it gets assigned the same integer value.

The error set type defaults to a u16, though if the maximum number of distinct error values is provided via the --error-limit [num] command line parameter an integer type with the minimum number of bits required to represent all of the error values will be used.

You can coerce an error from a subset to a superset:

test_coerce_error_subset_to_superset.zig
const std = @import("std");

const FileOpenError = error{
    AccessDenied,
    OutOfMemory,
    FileNotFound,
};

const AllocationError = error{
    OutOfMemory,
};

test "coerce subset to superset" {
    const err = foo(AllocationError.OutOfMemory);
    try std.testing.expect(err == FileOpenError.OutOfMemory);
}

fn foo(err: AllocationError) FileOpenError {
    return err;
}
Shell
$ zig test test_coerce_error_subset_to_superset.zig
1/1 test_coerce_error_subset_to_superset.test.coerce subset to superset...OK
All 1 tests passed.
But you cannot coerce an error from a superset to a subset:

test_coerce_error_superset_to_subset.zig
const FileOpenError = error{
    AccessDenied,
    OutOfMemory,
    FileNotFound,
};

const AllocationError = error{
    OutOfMemory,
};

test "coerce superset to subset" {
    foo(FileOpenError.OutOfMemory) catch {};
}

fn foo(err: FileOpenError) AllocationError {
    return err;
}
Shell
$ zig test test_coerce_error_superset_to_subset.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_coerce_error_superset_to_subset.zig:16:12: error: expected type 'error{OutOfMemory}', found 'error{AccessDenied,OutOfMemory,FileNotFound}'
    return err;
           ^~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_coerce_error_superset_to_subset.zig:16:12: note: 'error.AccessDenied' not a member of destination error set
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_coerce_error_superset_to_subset.zig:16:12: note: 'error.FileNotFound' not a member of destination error set
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_coerce_error_superset_to_subset.zig:15:28: note: function return type declared here
fn foo(err: FileOpenError) AllocationError {
                           ^~~~~~~~~~~~~~~
referenced by:
    test.coerce superset to subset: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_coerce_error_superset_to_subset.zig:12:8

There is a shortcut for declaring an error set with only 1 value, and then getting that value:

single_value_error_set_shortcut.zig
const err = error.FileNotFound;
This is equivalent to:

single_value_error_set.zig
const err = (error{FileNotFound}).FileNotFound;
This becomes useful when using Inferred Error Sets.

The Global Error Set 
anyerror refers to the global error set. This is the error set that contains all errors in the entire compilation unit, i.e. it is the union of all other error sets.

You can coerce any error set to the global one, and you can explicitly cast an error of the global error set to a non-global one. This inserts a language-level assert to make sure the error value is in fact in the destination error set.

The global error set should generally be avoided because it prevents the compiler from knowing what errors are possible at compile-time. Knowing the error set at compile-time is better for generated documentation and helpful error messages, such as forgetting a possible error value in a switch.

Error Union Type 
An error set type and normal type can be combined with the ! binary operator to form an error union type. You are likely to use an error union type more often than an error set type by itself.

Here is a function to parse a string into a 64-bit integer:

error_union_parsing_u64.zig
const std = @import("std");
const maxInt = std.math.maxInt;

pub fn parseU64(buf: []const u8, radix: u8) !u64 {
    var x: u64 = 0;

    for (buf) |c| {
        const digit = charToDigit(c);

        if (digit >= radix) {
            return error.InvalidChar;
        }

        // x *= radix
        var ov = @mulWithOverflow(x, radix);
        if (ov[1] != 0) return error.OverFlow;

        // x += digit
        ov = @addWithOverflow(ov[0], digit);
        if (ov[1] != 0) return error.OverFlow;
        x = ov[0];
    }

    return x;
}

fn charToDigit(c: u8) u8 {
    return switch (c) {
        '0'...'9' => c - '0',
        'A'...'Z' => c - 'A' + 10,
        'a'...'z' => c - 'a' + 10,
        else => maxInt(u8),
    };
}

test "parse u64" {
    const result = try parseU64("1234", 10);
    try std.testing.expect(result == 1234);
}
Shell
$ zig test error_union_parsing_u64.zig
1/1 error_union_parsing_u64.test.parse u64...OK
All 1 tests passed.
Notice the return type is !u64. This means that the function either returns an unsigned 64 bit integer, or an error. We left off the error set to the left of the !, so the error set is inferred.

Within the function definition, you can see some return statements that return an error, and at the bottom a return statement that returns a u64. Both types coerce to anyerror!u64.

What it looks like to use this function varies depending on what you're trying to do. One of the following:

You want to provide a default value if it returned an error.
If it returned an error then you want to return the same error.
You know with complete certainty it will not return an error, so want to unconditionally unwrap it.
You want to take a different action for each possible error.
catch 
If you want to provide a default value, you can use the catch binary operator:

catch.zig
const parseU64 = @import("error_union_parsing_u64.zig").parseU64;

fn doAThing(str: []u8) void {
    const number = parseU64(str, 10) catch 13;
    _ = number; // ...
}
In this code, number will be equal to the successfully parsed string, or a default value of 13. The type of the right hand side of the binary catch operator must match the unwrapped error union type, or be of type noreturn.

If you want to provide a default value with catch after performing some logic, you can combine catch with named Blocks:

handle_error_with_catch_block.zig.zig
const parseU64 = @import("error_union_parsing_u64.zig").parseU64;

fn doAThing(str: []u8) void {
    const number = parseU64(str, 10) catch blk: {
        // do things
        break :blk 13;
    };
    _ = number; // number is now initialized
}
try 
Let's say you wanted to return the error if you got one, otherwise continue with the function logic:

catch_err_return.zig
const parseU64 = @import("error_union_parsing_u64.zig").parseU64;

fn doAThing(str: []u8) !void {
    const number = parseU64(str, 10) catch |err| return err;
    _ = number; // ...
}
There is a shortcut for this. The try expression:

try.zig
const parseU64 = @import("error_union_parsing_u64.zig").parseU64;

fn doAThing(str: []u8) !void {
    const number = try parseU64(str, 10);
    _ = number; // ...
}
try evaluates an error union expression. If it is an error, it returns from the current function with the same error. Otherwise, the expression results in the unwrapped value.

Maybe you know with complete certainty that an expression will never be an error. In this case you can do this:

const number = parseU64("1234", 10) catch unreachable;
Here we know for sure that "1234" will parse successfully. So we put the unreachable value on the right hand side. unreachable invokes safety-checked Illegal Behavior, so in Debug and ReleaseSafe, triggers a safety panic by default. So, while we're debugging the application, if there was a surprise error here, the application would crash appropriately.

You may want to take a different action for every situation. For that, we combine the if and switch expression:

handle_all_error_scenarios.zig
fn doAThing(str: []u8) void {
    if (parseU64(str, 10)) |number| {
        doSomethingWithNumber(number);
    } else |err| switch (err) {
        error.Overflow => {
            // handle overflow...
        },
        // we promise that InvalidChar won't happen (or crash in debug mode if it does)
        error.InvalidChar => unreachable,
    }
}
Finally, you may want to handle only some errors. For that, you can capture the unhandled errors in the else case, which now contains a narrower error set:

handle_some_error_scenarios.zig
fn doAnotherThing(str: []u8) error{InvalidChar}!void {
    if (parseU64(str, 10)) |number| {
        doSomethingWithNumber(number);
    } else |err| switch (err) {
        error.Overflow => {
            // handle overflow...
        },
        else => |leftover_err| return leftover_err,
    }
}
You must use the variable capture syntax. If you don't need the variable, you can capture with _ and avoid the switch.

handle_no_error_scenarios.zig
fn doADifferentThing(str: []u8) void {
    if (parseU64(str, 10)) |number| {
        doSomethingWithNumber(number);
    } else |_| {
        // do as you'd like
    }
}
errdefer 
The other component to error handling is defer statements. In addition to an unconditional defer, Zig has errdefer, which evaluates the deferred expression on block exit path if and only if the function returned with an error from the block.

Example:

errdefer_example.zig
fn createFoo(param: i32) !Foo {
    const foo = try tryToAllocateFoo();
    // now we have allocated foo. we need to free it if the function fails.
    // but we want to return it if the function succeeds.
    errdefer deallocateFoo(foo);

    const tmp_buf = allocateTmpBuffer() orelse return error.OutOfMemory;
    // tmp_buf is truly a temporary resource, and we for sure want to clean it up
    // before this block leaves scope
    defer deallocateTmpBuffer(tmp_buf);

    if (param > 1337) return error.InvalidParam;

    // here the errdefer will not run since we're returning success from the function.
    // but the defer will run!
    return foo;
}
The neat thing about this is that you get robust error handling without the verbosity and cognitive overhead of trying to make sure every exit path is covered. The deallocation code is always directly following the allocation code.

The errdefer statement can optionally capture the error:

test_errdefer_capture.zig
const std = @import("std");

fn captureError(captured: *?anyerror) !void {
    errdefer |err| {
        captured.* = err;
    }
    return error.GeneralFailure;
}

test "errdefer capture" {
    var captured: ?anyerror = null;

    if (captureError(&captured)) unreachable else |err| {
        try std.testing.expectEqual(error.GeneralFailure, captured.?);
        try std.testing.expectEqual(error.GeneralFailure, err);
    }
}
Shell
$ zig test test_errdefer_capture.zig
1/1 test_errdefer_capture.test.errdefer capture...OK
All 1 tests passed.
A couple of other tidbits about error handling:

These primitives give enough expressiveness that it's completely practical to have failing to check for an error be a compile error. If you really want to ignore the error, you can add catch unreachable and get the added benefit of crashing in Debug and ReleaseSafe modes if your assumption was wrong.
Since Zig understands error types, it can pre-weight branches in favor of errors not occurring. Just a small optimization benefit that is not available in other languages.
See also:

defer
if
switch
An error union is created with the ! binary operator. You can use compile-time reflection to access the child type of an error union:

test_error_union.zig
const expect = @import("std").testing.expect;

test "error union" {
    var foo: anyerror!i32 = undefined;

    // Coerce from child type of an error union:
    foo = 1234;

    // Coerce from an error set:
    foo = error.SomeError;

    // Use compile-time reflection to access the payload type of an error union:
    try comptime expect(@typeInfo(@TypeOf(foo)).error_union.payload == i32);

    // Use compile-time reflection to access the error set type of an error union:
    try comptime expect(@typeInfo(@TypeOf(foo)).error_union.error_set == anyerror);
}
Shell
$ zig test test_error_union.zig
1/1 test_error_union.test.error union...OK
All 1 tests passed.
Merging Error Sets 
Use the || operator to merge two error sets together. The resulting error set contains the errors of both error sets. Doc comments from the left-hand side override doc comments from the right-hand side. In this example, the doc comments for C.PathNotFound is A doc comment.

This is especially useful for functions which return different error sets depending on comptime branches. For example, the Zig standard library uses LinuxFileOpenError || WindowsFileOpenError for the error set of opening files.

test_merging_error_sets.zig
const A = error{
    NotDir,

    /// A doc comment
    PathNotFound,
};
const B = error{
    OutOfMemory,

    /// B doc comment
    PathNotFound,
};

const C = A || B;

fn foo() C!void {
    return error.NotDir;
}

test "merge error sets" {
    if (foo()) {
        @panic("unexpected");
    } else |err| switch (err) {
        error.OutOfMemory => @panic("unexpected"),
        error.PathNotFound => @panic("unexpected"),
        error.NotDir => {},
    }
}
Shell
$ zig test test_merging_error_sets.zig
1/1 test_merging_error_sets.test.merge error sets...OK
All 1 tests passed.
Inferred Error Sets 
Because many functions in Zig return a possible error, Zig supports inferring the error set. To infer the error set for a function, prepend the ! operator to the function’s return type, like !T:

test_inferred_error_sets.zig
// With an inferred error set
pub fn add_inferred(comptime T: type, a: T, b: T) !T {
    const ov = @addWithOverflow(a, b);
    if (ov[1] != 0) return error.Overflow;
    return ov[0];
}

// With an explicit error set
pub fn add_explicit(comptime T: type, a: T, b: T) Error!T {
    const ov = @addWithOverflow(a, b);
    if (ov[1] != 0) return error.Overflow;
    return ov[0];
}

const Error = error{
    Overflow,
};

const std = @import("std");

test "inferred error set" {
    if (add_inferred(u8, 255, 1)) |_| unreachable else |err| switch (err) {
        error.Overflow => {}, // ok
    }
}
Shell
$ zig test test_inferred_error_sets.zig
1/1 test_inferred_error_sets.test.inferred error set...OK
All 1 tests passed.
When a function has an inferred error set, that function becomes generic and thus it becomes trickier to do certain things with it, such as obtain a function pointer, or have an error set that is consistent across different build targets. Additionally, inferred error sets are incompatible with recursion.

In these situations, it is recommended to use an explicit error set. You can generally start with an empty error set and let compile errors guide you toward completing the set.

These limitations may be overcome in a future version of Zig.

Error Return Traces 
Error Return Traces show all the points in the code that an error was returned to the calling function. This makes it practical to use try everywhere and then still be able to know what happened if an error ends up bubbling all the way out of your application.

error_return_trace.zig
pub fn main() !void {
    try foo(12);
}

fn foo(x: i32) !void {
    if (x >= 5) {
        try bar();
    } else {
        try bang2();
    }
}

fn bar() !void {
    if (baz()) {
        try quux();
    } else |err| switch (err) {
        error.FileNotFound => try hello(),
    }
}

fn baz() !void {
    try bang1();
}

fn quux() !void {
    try bang2();
}

fn hello() !void {
    try bang2();
}

fn bang1() !void {
    return error.FileNotFound;
}

fn bang2() !void {
    return error.PermissionDenied;
}
Shell
$ zig build-exe error_return_trace.zig
$ ./error_return_trace
error: PermissionDenied
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:34:5: 0x115384f in bang1 (error_return_trace.zig)
    return error.FileNotFound;
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:22:5: 0x1153896 in baz (error_return_trace.zig)
    try bang1();
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:38:5: 0x11538cc in bang2 (error_return_trace.zig)
    return error.PermissionDenied;
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:30:5: 0x1153973 in hello (error_return_trace.zig)
    try bang2();
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:17:31: 0x1153a4b in bar (error_return_trace.zig)
        error.FileNotFound => try hello(),
                              ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:7:9: 0x1153b27 in foo (error_return_trace.zig)
        try bar();
        ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/error_return_trace.zig:2:5: 0x1153bec in main (error_return_trace.zig)
    try foo(12);
    ^
Look closely at this example. This is no stack trace.

You can see that the final error bubbled up was PermissionDenied, but the original error that started this whole thing was FileNotFound. In the bar function, the code handles the original error code, and then returns another one, from the switch statement. Error Return Traces make this clear, whereas a stack trace would look like this:

stack_trace.zig
pub fn main() void {
    foo(12);
}

fn foo(x: i32) void {
    if (x >= 5) {
        bar();
    } else {
        bang2();
    }
}

fn bar() void {
    if (baz()) {
        quux();
    } else {
        hello();
    }
}

fn baz() bool {
    return bang1();
}

fn quux() void {
    bang2();
}

fn hello() void {
    bang2();
}

fn bang1() bool {
    return false;
}

fn bang2() void {
    @panic("PermissionDenied");
}
Shell
$ zig build-exe stack_trace.zig
$ ./stack_trace
thread 3518529 panic: PermissionDenied
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/stack_trace.zig:38:5: 0x115629d in bang2 (stack_trace.zig)
    @panic("PermissionDenied");
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/stack_trace.zig:30:10: 0x1157525 in hello (stack_trace.zig)
    bang2();
         ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/stack_trace.zig:17:14: 0x1156257 in bar (stack_trace.zig)
        hello();
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/stack_trace.zig:7:12: 0x1155f13 in foo (stack_trace.zig)
        bar();
           ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/stack_trace.zig:2:8: 0x1154d14 in main (stack_trace.zig)
    foo(12);
       ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1153f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115383a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Here, the stack trace does not explain how the control flow in bar got to the hello() call. One would have to open a debugger or further instrument the application in order to find out. The error return trace, on the other hand, shows exactly how the error bubbled up.

This debugging feature makes it easier to iterate quickly on code that robustly handles all error conditions. This means that Zig developers will naturally find themselves writing correct, robust code in order to increase their development pace.

Error Return Traces are enabled by default in Debug and ReleaseSafe builds and disabled by default in ReleaseFast and ReleaseSmall builds.

There are a few ways to activate this error return tracing feature:

Return an error from main
An error makes its way to catch unreachable and you have not overridden the default panic handler
Use errorReturnTrace to access the current return trace. You can use std.debug.dumpStackTrace to print it. This function returns comptime-known null when building without error return tracing support.
Implementation Details 
To analyze performance cost, there are two cases:

when no errors are returned
when returning errors
For the case when no errors are returned, the cost is a single memory write operation, only in the first non-failable function in the call graph that calls a failable function, i.e. when a function returning void calls a function returning error. This is to initialize this struct in the stack memory:

stack_trace_struct.zig
pub const StackTrace = struct {
    index: usize,
    instruction_addresses: [N]usize,
};
Here, N is the maximum function call depth as determined by call graph analysis. Recursion is ignored and counts for 2.

A pointer to StackTrace is passed as a secret parameter to every function that can return an error, but it's always the first parameter, so it can likely sit in a register and stay there.

That's it for the path when no errors occur. It's practically free in terms of performance.

When generating the code for a function that returns an error, just before the return statement (only for the return statements that return errors), Zig generates a call to this function:

zig_return_error_fn.zig
// marked as "no-inline" in LLVM IR
fn __zig_return_error(stack_trace: *StackTrace) void {
    stack_trace.instruction_addresses[stack_trace.index] = @returnAddress();
    stack_trace.index = (stack_trace.index + 1) % N;
}
The cost is 2 math operations plus some memory reads and writes. The memory accessed is constrained and should remain cached for the duration of the error return bubbling.

As for code size cost, 1 function call before a return statement is no big deal. Even so, I have a plan to make the call to __zig_return_error a tail call, which brings the code size cost down to actually zero. What is a return statement in code without error return tracing can become a jump instruction in code with error return tracing.

Optionals 
One area that Zig provides safety without compromising efficiency or readability is with the optional type.

The question mark symbolizes the optional type. You can convert a type to an optional type by putting a question mark in front of it, like this:

optional_integer.zig
// normal integer
const normal_int: i32 = 1234;

// optional integer
const optional_int: ?i32 = 5678;
Now the variable optional_int could be an i32, or null.

Instead of integers, let's talk about pointers. Null references are the source of many runtime exceptions, and even stand accused of being the worst mistake of computer science.

Zig does not have them.

Instead, you can use an optional pointer. This secretly compiles down to a normal pointer, since we know we can use 0 as the null value for the optional type. But the compiler can check your work and make sure you don't assign null to something that can't be null.

Typically the downside of not having null is that it makes the code more verbose to write. But, let's compare some equivalent C code and Zig code.

Task: call malloc, if the result is null, return null.

C code

call_malloc_in_c.c
// malloc prototype included for reference
void *malloc(size_t size);

struct Foo *do_a_thing(void) {
    char *ptr = malloc(1234);
    if (!ptr) return NULL;
    // ...
}
Zig code

call_malloc_from_zig.zig
// malloc prototype included for reference
extern fn malloc(size: usize) ?[*]u8;

fn doAThing() ?*Foo {
    const ptr = malloc(1234) orelse return null;
    _ = ptr; // ...
}
Here, Zig is at least as convenient, if not more, than C. And, the type of "ptr" is [*]u8 not ?[*]u8. The orelse keyword unwrapped the optional type and therefore ptr is guaranteed to be non-null everywhere it is used in the function.

The other form of checking against NULL you might see looks like this:

checking_null_in_c.c
void do_a_thing(struct Foo *foo) {
    // do some stuff

    if (foo) {
        do_something_with_foo(foo);
    }

    // do some stuff
}
In Zig you can accomplish the same thing:

checking_null_in_zig.zig
const Foo = struct {};
fn doSomethingWithFoo(foo: *Foo) void {
    _ = foo;
}

fn doAThing(optional_foo: ?*Foo) void {
    // do some stuff

    if (optional_foo) |foo| {
        doSomethingWithFoo(foo);
    }

    // do some stuff
}
Once again, the notable thing here is that inside the if block, foo is no longer an optional pointer, it is a pointer, which cannot be null.

One benefit to this is that functions which take pointers as arguments can be annotated with the "nonnull" attribute - __attribute__((nonnull)) in GCC. The optimizer can sometimes make better decisions knowing that pointer arguments cannot be null.

Optional Type 
An optional is created by putting ? in front of a type. You can use compile-time reflection to access the child type of an optional:

test_optional_type.zig
const expect = @import("std").testing.expect;

test "optional type" {
    // Declare an optional and coerce from null:
    var foo: ?i32 = null;

    // Coerce from child type of an optional
    foo = 1234;

    // Use compile-time reflection to access the child type of the optional:
    try comptime expect(@typeInfo(@TypeOf(foo)).optional.child == i32);
}
Shell
$ zig test test_optional_type.zig
1/1 test_optional_type.test.optional type...OK
All 1 tests passed.
null 
Just like undefined, null has its own type, and the only way to use it is to cast it to a different type:

null.zig
const optional_value: ?i32 = null;
Optional Pointers 
An optional pointer is guaranteed to be the same size as a pointer. The null of the optional is guaranteed to be address 0.

test_optional_pointer.zig
const expect = @import("std").testing.expect;

test "optional pointers" {
    // Pointers cannot be null. If you want a null pointer, use the optional
    // prefix `?` to make the pointer type optional.
    var ptr: ?*i32 = null;

    var x: i32 = 1;
    ptr = &x;

    try expect(ptr.?.* == 1);

    // Optional pointers are the same size as normal pointers, because pointer
    // value 0 is used as the null value.
    try expect(@sizeOf(?*i32) == @sizeOf(*i32));
}
Shell
$ zig test test_optional_pointer.zig
1/1 test_optional_pointer.test.optional pointers...OK
All 1 tests passed.
See also:

while with Optionals
if with Optionals
Casting 
A type cast converts a value of one type to another. Zig has Type Coercion for conversions that are known to be completely safe and unambiguous, and Explicit Casts for conversions that one would not want to happen on accident. There is also a third kind of type conversion called Peer Type Resolution for the case when a result type must be decided given multiple operand types.

Type Coercion 
Type coercion occurs when one type is expected, but different type is provided:

test_type_coercion.zig
test "type coercion - variable declaration" {
    const a: u8 = 1;
    const b: u16 = a;
    _ = b;
}

test "type coercion - function call" {
    const a: u8 = 1;
    foo(a);
}

fn foo(b: u16) void {
    _ = b;
}

test "type coercion - @as builtin" {
    const a: u8 = 1;
    const b = @as(u16, a);
    _ = b;
}
Shell
$ zig test test_type_coercion.zig
1/3 test_type_coercion.test.type coercion - variable declaration...OK
2/3 test_type_coercion.test.type coercion - function call...OK
3/3 test_type_coercion.test.type coercion - @as builtin...OK
All 3 tests passed.
Type coercions are only allowed when it is completely unambiguous how to get from one type to another, and the transformation is guaranteed to be safe. There is one exception, which is C Pointers.

Type Coercion: Stricter Qualification 
Values which have the same representation at runtime can be cast to increase the strictness of the qualifiers, no matter how nested the qualifiers are:

const - non-const to const is allowed
volatile - non-volatile to volatile is allowed
align - bigger to smaller alignment is allowed
error sets to supersets is allowed
These casts are no-ops at runtime since the value representation does not change.

test_no_op_casts.zig
test "type coercion - const qualification" {
    var a: i32 = 1;
    const b: *i32 = &a;
    foo(b);
}

fn foo(_: *const i32) void {}
Shell
$ zig test test_no_op_casts.zig
1/1 test_no_op_casts.test.type coercion - const qualification...OK
All 1 tests passed.
In addition, pointers coerce to const optional pointers:

test_pointer_coerce_const_optional.zig
const std = @import("std");
const expect = std.testing.expect;
const mem = std.mem;

test "cast *[1][*:0]const u8 to []const ?[*:0]const u8" {
    const window_name = [1][*:0]const u8{"window name"};
    const x: []const ?[*:0]const u8 = &window_name;
    try expect(mem.eql(u8, mem.span(x[0].?), "window name"));
}
Shell
$ zig test test_pointer_coerce_const_optional.zig
1/1 test_pointer_coerce_const_optional.test.cast *[1][*:0]const u8 to []const ?[*:0]const u8...OK
All 1 tests passed.
Type Coercion: Integer and Float Widening 
Integers coerce to integer types which can represent every value of the old type, and likewise Floats coerce to float types which can represent every value of the old type.

test_integer_widening.zig
const std = @import("std");
const builtin = @import("builtin");
const expect = std.testing.expect;
const mem = std.mem;

test "integer widening" {
    const a: u8 = 250;
    const b: u16 = a;
    const c: u32 = b;
    const d: u64 = c;
    const e: u64 = d;
    const f: u128 = e;
    try expect(f == a);
}

test "implicit unsigned integer to signed integer" {
    const a: u8 = 250;
    const b: i16 = a;
    try expect(b == 250);
}

test "float widening" {
    const a: f16 = 12.34;
    const b: f32 = a;
    const c: f64 = b;
    const d: f128 = c;
    try expect(d == a);
}
Shell
$ zig test test_integer_widening.zig
1/3 test_integer_widening.test.integer widening...OK
2/3 test_integer_widening.test.implicit unsigned integer to signed integer...OK
3/3 test_integer_widening.test.float widening...OK
All 3 tests passed.
Type Coercion: Float to Int 
A compiler error is appropriate because this ambiguous expression leaves the compiler two choices about the coercion.

Cast 54.0 to comptime_int resulting in @as(comptime_int, 10), which is casted to @as(f32, 10)
Cast 5 to comptime_float resulting in @as(comptime_float, 10.8), which is casted to @as(f32, 10.8)
test_ambiguous_coercion.zig
// Compile time coercion of float to int
test "implicit cast to comptime_int" {
    const f: f32 = 54.0 / 5;
    _ = f;
}
Shell
$ zig test test_ambiguous_coercion.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_ambiguous_coercion.zig:3:25: error: ambiguous coercion of division operands 'comptime_float' and 'comptime_int'; non-zero remainder '4'
    const f: f32 = 54.0 / 5;
                   ~~~~~^~~

Type Coercion: Slices, Arrays and Pointers 
test_coerce_slices_arrays_and_pointers.zig
const std = @import("std");
const expect = std.testing.expect;

// You can assign constant pointers to arrays to a slice with
// const modifier on the element type. Useful in particular for
// String literals.
test "*const [N]T to []const T" {
    const x1: []const u8 = "hello";
    const x2: []const u8 = &[5]u8{ 'h', 'e', 'l', 'l', 111 };
    try expect(std.mem.eql(u8, x1, x2));

    const y: []const f32 = &[2]f32{ 1.2, 3.4 };
    try expect(y[0] == 1.2);
}

// Likewise, it works when the destination type is an error union.
test "*const [N]T to E![]const T" {
    const x1: anyerror![]const u8 = "hello";
    const x2: anyerror![]const u8 = &[5]u8{ 'h', 'e', 'l', 'l', 111 };
    try expect(std.mem.eql(u8, try x1, try x2));

    const y: anyerror![]const f32 = &[2]f32{ 1.2, 3.4 };
    try expect((try y)[0] == 1.2);
}

// Likewise, it works when the destination type is an optional.
test "*const [N]T to ?[]const T" {
    const x1: ?[]const u8 = "hello";
    const x2: ?[]const u8 = &[5]u8{ 'h', 'e', 'l', 'l', 111 };
    try expect(std.mem.eql(u8, x1.?, x2.?));

    const y: ?[]const f32 = &[2]f32{ 1.2, 3.4 };
    try expect(y.?[0] == 1.2);
}

// In this cast, the array length becomes the slice length.
test "*[N]T to []T" {
    var buf: [5]u8 = "hello".*;
    const x: []u8 = &buf;
    try expect(std.mem.eql(u8, x, "hello"));

    const buf2 = [2]f32{ 1.2, 3.4 };
    const x2: []const f32 = &buf2;
    try expect(std.mem.eql(f32, x2, &[2]f32{ 1.2, 3.4 }));
}

// Single-item pointers to arrays can be coerced to many-item pointers.
test "*[N]T to [*]T" {
    var buf: [5]u8 = "hello".*;
    const x: [*]u8 = &buf;
    try expect(x[4] == 'o');
    // x[5] would be an uncaught out of bounds pointer dereference!
}

// Likewise, it works when the destination type is an optional.
test "*[N]T to ?[*]T" {
    var buf: [5]u8 = "hello".*;
    const x: ?[*]u8 = &buf;
    try expect(x.?[4] == 'o');
}

// Single-item pointers can be cast to len-1 single-item arrays.
test "*T to *[1]T" {
    var x: i32 = 1234;
    const y: *[1]i32 = &x;
    const z: [*]i32 = y;
    try expect(z[0] == 1234);
}
Shell
$ zig test test_coerce_slices_arrays_and_pointers.zig
1/7 test_coerce_slices_arrays_and_pointers.test.*const [N]T to []const T...OK
2/7 test_coerce_slices_arrays_and_pointers.test.*const [N]T to E![]const T...OK
3/7 test_coerce_slices_arrays_and_pointers.test.*const [N]T to ?[]const T...OK
4/7 test_coerce_slices_arrays_and_pointers.test.*[N]T to []T...OK
5/7 test_coerce_slices_arrays_and_pointers.test.*[N]T to [*]T...OK
6/7 test_coerce_slices_arrays_and_pointers.test.*[N]T to ?[*]T...OK
7/7 test_coerce_slices_arrays_and_pointers.test.*T to *[1]T...OK
All 7 tests passed.
See also:

C Pointers
Type Coercion: Optionals 
The payload type of Optionals, as well as null, coerce to the optional type.

test_coerce_optionals.zig
const std = @import("std");
const expect = std.testing.expect;

test "coerce to optionals" {
    const x: ?i32 = 1234;
    const y: ?i32 = null;

    try expect(x.? == 1234);
    try expect(y == null);
}
Shell
$ zig test test_coerce_optionals.zig
1/1 test_coerce_optionals.test.coerce to optionals...OK
All 1 tests passed.
Optionals work nested inside the Error Union Type, too:

test_coerce_optional_wrapped_error_union.zig
const std = @import("std");
const expect = std.testing.expect;

test "coerce to optionals wrapped in error union" {
    const x: anyerror!?i32 = 1234;
    const y: anyerror!?i32 = null;

    try expect((try x).? == 1234);
    try expect((try y) == null);
}
Shell
$ zig test test_coerce_optional_wrapped_error_union.zig
1/1 test_coerce_optional_wrapped_error_union.test.coerce to optionals wrapped in error union...OK
All 1 tests passed.
Type Coercion: Error Unions 
The payload type of an Error Union Type as well as the Error Set Type coerce to the error union type:

test_coerce_to_error_union.zig
const std = @import("std");
const expect = std.testing.expect;

test "coercion to error unions" {
    const x: anyerror!i32 = 1234;
    const y: anyerror!i32 = error.Failure;

    try expect((try x) == 1234);
    try std.testing.expectError(error.Failure, y);
}
Shell
$ zig test test_coerce_to_error_union.zig
1/1 test_coerce_to_error_union.test.coercion to error unions...OK
All 1 tests passed.
Type Coercion: Compile-Time Known Numbers 
When a number is comptime-known to be representable in the destination type, it may be coerced:

test_coerce_large_to_small.zig
const std = @import("std");
const expect = std.testing.expect;

test "coercing large integer type to smaller one when value is comptime-known to fit" {
    const x: u64 = 255;
    const y: u8 = x;
    try expect(y == 255);
}
Shell
$ zig test test_coerce_large_to_small.zig
1/1 test_coerce_large_to_small.test.coercing large integer type to smaller one when value is comptime-known to fit...OK
All 1 tests passed.
Type Coercion: Unions and Enums 
Tagged unions can be coerced to enums, and enums can be coerced to tagged unions when they are comptime-known to be a field of the union that has only one possible value, such as void:

test_coerce_unions_enums.zig
const std = @import("std");
const expect = std.testing.expect;

const E = enum {
    one,
    two,
    three,
};

const U = union(E) {
    one: i32,
    two: f32,
    three,
};

const U2 = union(enum) {
    a: void,
    b: f32,

    fn tag(self: U2) usize {
        switch (self) {
            .a => return 1,
            .b => return 2,
        }
    }
};

test "coercion between unions and enums" {
    const u = U{ .two = 12.34 };
    const e: E = u; // coerce union to enum
    try expect(e == E.two);

    const three = E.three;
    const u_2: U = three; // coerce enum to union
    try expect(u_2 == E.three);

    const u_3: U = .three; // coerce enum literal to union
    try expect(u_3 == E.three);

    const u_4: U2 = .a; // coerce enum literal to union with inferred enum tag type.
    try expect(u_4.tag() == 1);

    // The following example is invalid.
    // error: coercion from enum '@TypeOf(.enum_literal)' to union 'test_coerce_unions_enum.U2' must initialize 'f32' field 'b'
    //var u_5: U2 = .b;
    //try expect(u_5.tag() == 2);
}
Shell
$ zig test test_coerce_unions_enums.zig
1/1 test_coerce_unions_enums.test.coercion between unions and enums...OK
All 1 tests passed.
See also:

union
enum
Type Coercion: undefined 
undefined can be coerced to any type.

Type Coercion: Tuples to Arrays 
Tuples can be coerced to arrays, if all of the fields have the same type.

test_coerce_tuples_arrays.zig
const std = @import("std");
const expect = std.testing.expect;

const Tuple = struct { u8, u8 };
test "coercion from homogeneous tuple to array" {
    const tuple: Tuple = .{ 5, 6 };
    const array: [2]u8 = tuple;
    _ = array;
}
Shell
$ zig test test_coerce_tuples_arrays.zig
1/1 test_coerce_tuples_arrays.test.coercion from homogeneous tuple to array...OK
All 1 tests passed.
Explicit Casts 
Explicit casts are performed via Builtin Functions. Some explicit casts are safe; some are not. Some explicit casts perform language-level assertions; some do not. Some explicit casts are no-ops at runtime; some are not.

@bitCast - change type but maintain bit representation
@alignCast - make a pointer have more alignment
@enumFromInt - obtain an enum value based on its integer tag value
@errorFromInt - obtain an error code based on its integer value
@errorCast - convert to a smaller error set
@floatCast - convert a larger float to a smaller float
@floatFromInt - convert an integer to a float value
@intCast - convert between integer types
@intFromBool - convert true to 1 and false to 0
@intFromEnum - obtain the integer tag value of an enum or tagged union
@intFromError - obtain the integer value of an error code
@intFromFloat - obtain the integer part of a float value
@intFromPtr - obtain the address of a pointer
@ptrFromInt - convert an address to a pointer
@ptrCast - convert between pointer types
@truncate - convert between integer types, chopping off bits
Peer Type Resolution 
Peer Type Resolution occurs in these places:

switch expressions
if expressions
while expressions
for expressions
Multiple break statements in a block
Some binary operations
This kind of type resolution chooses a type that all peer types can coerce into. Here are some examples:

test_peer_type_resolution.zig
const std = @import("std");
const expect = std.testing.expect;
const mem = std.mem;

test "peer resolve int widening" {
    const a: i8 = 12;
    const b: i16 = 34;
    const c = a + b;
    try expect(c == 46);
    try expect(@TypeOf(c) == i16);
}

test "peer resolve arrays of different size to const slice" {
    try expect(mem.eql(u8, boolToStr(true), "true"));
    try expect(mem.eql(u8, boolToStr(false), "false"));
    try comptime expect(mem.eql(u8, boolToStr(true), "true"));
    try comptime expect(mem.eql(u8, boolToStr(false), "false"));
}
fn boolToStr(b: bool) []const u8 {
    return if (b) "true" else "false";
}

test "peer resolve array and const slice" {
    try testPeerResolveArrayConstSlice(true);
    try comptime testPeerResolveArrayConstSlice(true);
}
fn testPeerResolveArrayConstSlice(b: bool) !void {
    const value1 = if (b) "aoeu" else @as([]const u8, "zz");
    const value2 = if (b) @as([]const u8, "zz") else "aoeu";
    try expect(mem.eql(u8, value1, "aoeu"));
    try expect(mem.eql(u8, value2, "zz"));
}

test "peer type resolution: ?T and T" {
    try expect(peerTypeTAndOptionalT(true, false).? == 0);
    try expect(peerTypeTAndOptionalT(false, false).? == 3);
    comptime {
        try expect(peerTypeTAndOptionalT(true, false).? == 0);
        try expect(peerTypeTAndOptionalT(false, false).? == 3);
    }
}
fn peerTypeTAndOptionalT(c: bool, b: bool) ?usize {
    if (c) {
        return if (b) null else @as(usize, 0);
    }

    return @as(usize, 3);
}

test "peer type resolution: *[0]u8 and []const u8" {
    try expect(peerTypeEmptyArrayAndSlice(true, "hi").len == 0);
    try expect(peerTypeEmptyArrayAndSlice(false, "hi").len == 1);
    comptime {
        try expect(peerTypeEmptyArrayAndSlice(true, "hi").len == 0);
        try expect(peerTypeEmptyArrayAndSlice(false, "hi").len == 1);
    }
}
fn peerTypeEmptyArrayAndSlice(a: bool, slice: []const u8) []const u8 {
    if (a) {
        return &[_]u8{};
    }

    return slice[0..1];
}
test "peer type resolution: *[0]u8, []const u8, and anyerror![]u8" {
    {
        var data = "hi".*;
        const slice = data[0..];
        try expect((try peerTypeEmptyArrayAndSliceAndError(true, slice)).len == 0);
        try expect((try peerTypeEmptyArrayAndSliceAndError(false, slice)).len == 1);
    }
    comptime {
        var data = "hi".*;
        const slice = data[0..];
        try expect((try peerTypeEmptyArrayAndSliceAndError(true, slice)).len == 0);
        try expect((try peerTypeEmptyArrayAndSliceAndError(false, slice)).len == 1);
    }
}
fn peerTypeEmptyArrayAndSliceAndError(a: bool, slice: []u8) anyerror![]u8 {
    if (a) {
        return &[_]u8{};
    }

    return slice[0..1];
}

test "peer type resolution: *const T and ?*T" {
    const a: *const usize = @ptrFromInt(0x123456780);
    const b: ?*usize = @ptrFromInt(0x123456780);
    try expect(a == b);
    try expect(b == a);
}

test "peer type resolution: error union switch" {
    // The non-error and error cases are only peers if the error case is just a switch expression;
    // the pattern `if (x) {...} else |err| blk: { switch (err) {...} }` does not consider the
    // non-error and error case to be peers.
    var a: error{ A, B, C }!u32 = 0;
    _ = &a;
    const b = if (a) |x|
        x + 3
    else |err| switch (err) {
        error.A => 0,
        error.B => 1,
        error.C => null,
    };
    try expect(@TypeOf(b) == ?u32);

    // The non-error and error cases are only peers if the error case is just a switch expression;
    // the pattern `x catch |err| blk: { switch (err) {...} }` does not consider the unwrapped `x`
    // and error case to be peers.
    const c = a catch |err| switch (err) {
        error.A => 0,
        error.B => 1,
        error.C => null,
    };
    try expect(@TypeOf(c) == ?u32);
}
Shell
$ zig test test_peer_type_resolution.zig
1/8 test_peer_type_resolution.test.peer resolve int widening...OK
2/8 test_peer_type_resolution.test.peer resolve arrays of different size to const slice...OK
3/8 test_peer_type_resolution.test.peer resolve array and const slice...OK
4/8 test_peer_type_resolution.test.peer type resolution: ?T and T...OK
5/8 test_peer_type_resolution.test.peer type resolution: *[0]u8 and []const u8...OK
6/8 test_peer_type_resolution.test.peer type resolution: *[0]u8, []const u8, and anyerror![]u8...OK
7/8 test_peer_type_resolution.test.peer type resolution: *const T and ?*T...OK
8/8 test_peer_type_resolution.test.peer type resolution: error union switch...OK
All 8 tests passed.
Zero Bit Types 
For some types, @sizeOf is 0:

void
The Integers u0 and i0.
Arrays and Vectors with len 0, or with an element type that is a zero bit type.
An enum with only 1 tag.
A struct with all fields being zero bit types.
A union with only 1 field which is a zero bit type.
These types can only ever have one possible value, and thus require 0 bits to represent. Code that makes use of these types is not included in the final generated code:

zero_bit_types.zig
export fn entry() void {
    var x: void = {};
    var y: void = {};
    x = y;
    y = x;
}
When this turns into machine code, there is no code generated in the body of entry, even in Debug mode. For example, on x86_64:

0000000000000010 <entry>:
  10:	55                   	push   %rbp
  11:	48 89 e5             	mov    %rsp,%rbp
  14:	5d                   	pop    %rbp
  15:	c3                   	retq   
These assembly instructions do not have any code associated with the void values - they only perform the function call prologue and epilogue.

void 
void can be useful for instantiating generic types. For example, given a Map(Key, Value), one can pass void for the Value type to make it into a Set:

test_void_in_hashmap.zig
const std = @import("std");
const expect = std.testing.expect;

test "turn HashMap into a set with void" {
    var map = std.AutoHashMap(i32, void).init(std.testing.allocator);
    defer map.deinit();

    try map.put(1, {});
    try map.put(2, {});

    try expect(map.contains(2));
    try expect(!map.contains(3));

    _ = map.remove(2);
    try expect(!map.contains(2));
}
Shell
$ zig test test_void_in_hashmap.zig
1/1 test_void_in_hashmap.test.turn HashMap into a set with void...OK
All 1 tests passed.
Note that this is different from using a dummy value for the hash map value. By using void as the type of the value, the hash map entry type has no value field, and thus the hash map takes up less space. Further, all the code that deals with storing and loading the value is deleted, as seen above.

void is distinct from anyopaque. void has a known size of 0 bytes, and anyopaque has an unknown, but non-zero, size.

Expressions of type void are the only ones whose value can be ignored. For example, ignoring a non-void expression is a compile error:

test_expression_ignored.zig
test "ignoring expression value" {
    foo();
}

fn foo() i32 {
    return 1234;
}
Shell
$ zig test test_expression_ignored.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_expression_ignored.zig:2:8: error: value of type 'i32' ignored
    foo();
    ~~~^~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_expression_ignored.zig:2:8: note: all non-void values must be used
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_expression_ignored.zig:2:8: note: to discard the value, assign it to '_'

However, if the expression has type void, there will be no error. Expression results can be explicitly ignored by assigning them to _.

test_void_ignored.zig
test "void is ignored" {
    returnsVoid();
}

test "explicitly ignoring expression value" {
    _ = foo();
}

fn returnsVoid() void {}

fn foo() i32 {
    return 1234;
}
Shell
$ zig test test_void_ignored.zig
1/2 test_void_ignored.test.void is ignored...OK
2/2 test_void_ignored.test.explicitly ignoring expression value...OK
All 2 tests passed.
Result Location Semantics 
During compilation, every Zig expression and sub-expression is assigned optional result location information. This information dictates what type the expression should have (its result type), and where the resulting value should be placed in memory (its result location). The information is optional in the sense that not every expression has this information: assignment to _, for instance, does not provide any information about the type of an expression, nor does it provide a concrete memory location to place it in.

As a motivating example, consider the statement const x: u32 = 42;. The type annotation here provides a result type of u32 to the initialization expression 42, instructing the compiler to coerce this integer (initially of type comptime_int) to this type. We will see more examples shortly.

This is not an implementation detail: the logic outlined above is codified into the Zig language specification, and is the primary mechanism of type inference in the language. This system is collectively referred to as "Result Location Semantics".

Result Types 
Result types are propagated recursively through expressions where possible. For instance, if the expression &e has result type *u32, then e is given a result type of u32, allowing the language to perform this coercion before taking a reference.

The result type mechanism is utilized by casting builtins such as @intCast. Rather than taking as an argument the type to cast to, these builtins use their result type to determine this information. The result type is often known from context; where it is not, the @as builtin can be used to explicitly provide a result type.

We can break down the result types for each component of a simple expression as follows:

result_type_propagation.zig
const expectEqual = @import("std").testing.expectEqual;
test "result type propagates through struct initializer" {
    const S = struct { x: u32 };
    const val: u64 = 123;
    const s: S = .{ .x = @intCast(val) };
    // .{ .x = @intCast(val) }   has result type `S` due to the type annotation
    //         @intCast(val)     has result type `u32` due to the type of the field `S.x`
    //                  val      has no result type, as it is permitted to be any integer type
    try expectEqual(@as(u32, 123), s.x);
}
Shell
$ zig test result_type_propagation.zig
1/1 result_type_propagation.test.result type propagates through struct initializer...OK
All 1 tests passed.
This result type information is useful for the aforementioned cast builtins, as well as to avoid the construction of pre-coercion values, and to avoid the need for explicit type coercions in some cases. The following table details how some common expressions propagate result types, where x and y are arbitrary sub-expressions.

Expression	Parent Result Type	Sub-expression Result Type
const val: T = x	-	x is a T
var val: T = x	-	x is a T
val = x	-	x is a @TypeOf(val)
@as(T, x)	-	x is a T
&x	*T	x is a T
&x	[]T	x is some array of T
f(x)	-	x has the type of the first parameter of f
.{x}	T	x is a @FieldType(T, "0")
.{ .a = x }	T	x is a @FieldType(T, "a")
T{x}	-	x is a @FieldType(T, "0")
T{ .a = x }	-	x is a @FieldType(T, "a")
@Type(x)	-	x is a std.builtin.Type
@typeInfo(x)	-	x is a type
x << y	-	y is a std.math.Log2IntCeil(@TypeOf(x))
Result Locations 
In addition to result type information, every expression may be optionally assigned a result location: a pointer to which the value must be directly written. This system can be used to prevent intermediate copies when initializing data structures, which can be important for types which must have a fixed memory address ("pinned" types).

When compiling the simple assignment expression x = e, many languages would create the temporary value e on the stack, and then assign it to x, potentially performing a type coercion in the process. Zig approaches this differently. The expression e is given a result type matching the type of x, and a result location of &x. For many syntactic forms of e, this has no practical impact. However, it can have important semantic effects when working with more complex syntax forms.

For instance, if the expression .{ .a = x, .b = y } has a result location of ptr, then x is given a result location of &ptr.a, and y a result location of &ptr.b. Without this system, this expression would construct a temporary struct value entirely on the stack, and only then copy it to the destination address. In essence, Zig desugars the assignment foo = .{ .a = x, .b = y } to the two statements foo.a = x; foo.b = y;.

This can sometimes be important when assigning an aggregate value where the initialization expression depends on the previous value of the aggregate. The easiest way to demonstrate this is by attempting to swap fields of a struct or array - the following logic looks sound, but in fact is not:

result_location_interfering_with_swap.zig
const expect = @import("std").testing.expect;
test "attempt to swap array elements with array initializer" {
    var arr: [2]u32 = .{ 1, 2 };
    arr = .{ arr[1], arr[0] };
    // The previous line is equivalent to the following two lines:
    //   arr[0] = arr[1];
    //   arr[1] = arr[0];
    // So this fails!
    try expect(arr[0] == 2); // succeeds
    try expect(arr[1] == 1); // fails
}
Shell
$ zig test result_location_interfering_with_swap.zig
1/1 result_location_interfering_with_swap.test.attempt to swap array elements with array initializer...FAIL (TestUnexpectedResult)
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/testing.zig:586:14: 0x1032019 in expect (std.zig)
    if (!ok) return error.TestUnexpectedResult;
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/result_location_interfering_with_swap.zig:10:5: 0x103214c in test.attempt to swap array elements with array initializer (result_location_interfering_with_swap.zig)
    try expect(arr[1] == 1); // fails
    ^
0 passed; 0 skipped; 1 failed.
error: the following test command failed with exit code 1:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/a73bf3b545ef0014e2bacb229b14c99b/test --seed=0x9b3eb00a
The following table details how some common expressions propagate result locations, where x and y are arbitrary sub-expressions. Note that some expressions cannot provide meaningful result locations to sub-expressions, even if they themselves have a result location.

Expression	Result Location	Sub-expression Result Locations
const val: T = x	-	x has result location &val
var val: T = x	-	x has result location &val
val = x	-	x has result location &val
@as(T, x)	ptr	x has no result location
&x	ptr	x has no result location
f(x)	ptr	x has no result location
.{x}	ptr	x has result location &ptr[0]
.{ .a = x }	ptr	x has result location &ptr.a
T{x}	ptr	x has no result location (typed initializers do not propagate result locations)
T{ .a = x }	ptr	x has no result location (typed initializers do not propagate result locations)
@Type(x)	ptr	x has no result location
@typeInfo(x)	ptr	x has no result location
x << y	ptr	x and y do not have result locations
usingnamespace 
usingnamespace is a declaration that mixes all the public declarations of the operand, which must be a struct, union, enum, or opaque, into the namespace:

test_usingnamespace.zig
test "using std namespace" {
    const S = struct {
        usingnamespace @import("std");
    };
    try S.testing.expect(true);
}
Shell
$ zig test test_usingnamespace.zig
1/1 test_usingnamespace.test.using std namespace...OK
All 1 tests passed.
usingnamespace has an important use case when organizing the public API of a file or package. For example, one might have c.zig with all of the C imports:

c.zig
pub usingnamespace @cImport({
    @cInclude("epoxy/gl.h");
    @cInclude("GLFW/glfw3.h");
    @cDefine("STBI_ONLY_PNG", "");
    @cDefine("STBI_NO_STDIO", "");
    @cInclude("stb_image.h");
});
The above example demonstrates using pub to qualify the usingnamespace additionally makes the imported declarations pub. This can be used to forward declarations, giving precise control over what declarations a given file exposes.

comptime 
Zig places importance on the concept of whether an expression is known at compile-time. There are a few different places this concept is used, and these building blocks are used to keep the language small, readable, and powerful.

Introducing the Compile-Time Concept 
Compile-Time Parameters 
Compile-time parameters is how Zig implements generics. It is compile-time duck typing.

compile-time_duck_typing.zig
fn max(comptime T: type, a: T, b: T) T {
    return if (a > b) a else b;
}
fn gimmeTheBiggerFloat(a: f32, b: f32) f32 {
    return max(f32, a, b);
}
fn gimmeTheBiggerInteger(a: u64, b: u64) u64 {
    return max(u64, a, b);
}
In Zig, types are first-class citizens. They can be assigned to variables, passed as parameters to functions, and returned from functions. However, they can only be used in expressions which are known at compile-time, which is why the parameter T in the above snippet must be marked with comptime.

A comptime parameter means that:

At the callsite, the value must be known at compile-time, or it is a compile error.
In the function definition, the value is known at compile-time.
For example, if we were to introduce another function to the above snippet:

test_unresolved_comptime_value.zig
fn max(comptime T: type, a: T, b: T) T {
    return if (a > b) a else b;
}
test "try to pass a runtime type" {
    foo(false);
}
fn foo(condition: bool) void {
    const result = max(if (condition) f32 else u64, 1234, 5678);
    _ = result;
}
Shell
$ zig test test_unresolved_comptime_value.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unresolved_comptime_value.zig:8:28: error: unable to resolve comptime value
    const result = max(if (condition) f32 else u64, 1234, 5678);
                           ^~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unresolved_comptime_value.zig:8:24: note: argument to comptime parameter must be comptime-known
    const result = max(if (condition) f32 else u64, 1234, 5678);
                       ^~~~~~~~~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unresolved_comptime_value.zig:1:8: note: parameter declared comptime here
fn max(comptime T: type, a: T, b: T) T {
       ^~~~~~~~
referenced by:
    test.try to pass a runtime type: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_unresolved_comptime_value.zig:5:8

This is an error because the programmer attempted to pass a value only known at run-time to a function which expects a value known at compile-time.

Another way to get an error is if we pass a type that violates the type checker when the function is analyzed. This is what it means to have compile-time duck typing.

For example:

test_comptime_mismatched_type.zig
fn max(comptime T: type, a: T, b: T) T {
    return if (a > b) a else b;
}
test "try to compare bools" {
    _ = max(bool, true, false);
}
Shell
$ zig test test_comptime_mismatched_type.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_mismatched_type.zig:2:18: error: operator > not allowed for type 'bool'
    return if (a > b) a else b;
               ~~^~~
referenced by:
    test.try to compare bools: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_mismatched_type.zig:5:12

On the flip side, inside the function definition with the comptime parameter, the value is known at compile-time. This means that we actually could make this work for the bool type if we wanted to:

test_comptime_max_with_bool.zig
fn max(comptime T: type, a: T, b: T) T {
    if (T == bool) {
        return a or b;
    } else if (a > b) {
        return a;
    } else {
        return b;
    }
}
test "try to compare bools" {
    try @import("std").testing.expect(max(bool, false, true) == true);
}
Shell
$ zig test test_comptime_max_with_bool.zig
1/1 test_comptime_max_with_bool.test.try to compare bools...OK
All 1 tests passed.
This works because Zig implicitly inlines if expressions when the condition is known at compile-time, and the compiler guarantees that it will skip analysis of the branch not taken.

This means that the actual function generated for max in this situation looks like this:

compiler_generated_function.zig
fn max(a: bool, b: bool) bool {
    {
        return a or b;
    }
}
All the code that dealt with compile-time known values is eliminated and we are left with only the necessary run-time code to accomplish the task.

This works the same way for switch expressions - they are implicitly inlined when the target expression is compile-time known.

Compile-Time Variables 
In Zig, the programmer can label variables as comptime. This guarantees to the compiler that every load and store of the variable is performed at compile-time. Any violation of this results in a compile error.

This combined with the fact that we can inline loops allows us to write a function which is partially evaluated at compile-time and partially at run-time.

For example:

test_comptime_evaluation.zig
const expect = @import("std").testing.expect;

const CmdFn = struct {
    name: []const u8,
    func: fn (i32) i32,
};

const cmd_fns = [_]CmdFn{
    CmdFn{ .name = "one", .func = one },
    CmdFn{ .name = "two", .func = two },
    CmdFn{ .name = "three", .func = three },
};
fn one(value: i32) i32 {
    return value + 1;
}
fn two(value: i32) i32 {
    return value + 2;
}
fn three(value: i32) i32 {
    return value + 3;
}

fn performFn(comptime prefix_char: u8, start_value: i32) i32 {
    var result: i32 = start_value;
    comptime var i = 0;
    inline while (i < cmd_fns.len) : (i += 1) {
        if (cmd_fns[i].name[0] == prefix_char) {
            result = cmd_fns[i].func(result);
        }
    }
    return result;
}

test "perform fn" {
    try expect(performFn('t', 1) == 6);
    try expect(performFn('o', 0) == 1);
    try expect(performFn('w', 99) == 99);
}
Shell
$ zig test test_comptime_evaluation.zig
1/1 test_comptime_evaluation.test.perform fn...OK
All 1 tests passed.
This example is a bit contrived, because the compile-time evaluation component is unnecessary; this code would work fine if it was all done at run-time. But it does end up generating different code. In this example, the function performFn is generated three different times, for the different values of prefix_char provided:

performFn_1
// From the line:
// expect(performFn('t', 1) == 6);
fn performFn(start_value: i32) i32 {
    var result: i32 = start_value;
    result = two(result);
    result = three(result);
    return result;
}
performFn_2
// From the line:
// expect(performFn('o', 0) == 1);
fn performFn(start_value: i32) i32 {
    var result: i32 = start_value;
    result = one(result);
    return result;
}
performFn_3
// From the line:
// expect(performFn('w', 99) == 99);
fn performFn(start_value: i32) i32 {
    var result: i32 = start_value;
    _ = &result;
    return result;
}
Note that this happens even in a debug build. This is not a way to write more optimized code, but it is a way to make sure that what should happen at compile-time, does happen at compile-time. This catches more errors and allows expressiveness that in other languages requires using macros, generated code, or a preprocessor to accomplish.

Compile-Time Expressions 
In Zig, it matters whether a given expression is known at compile-time or run-time. A programmer can use a comptime expression to guarantee that the expression will be evaluated at compile-time. If this cannot be accomplished, the compiler will emit an error. For example:

test_comptime_call_extern_function.zig
extern fn exit() noreturn;

test "foo" {
    comptime {
        exit();
    }
}
Shell
$ zig test test_comptime_call_extern_function.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_call_extern_function.zig:5:13: error: comptime call of extern function
        exit();
        ~~~~^~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_call_extern_function.zig:4:5: note: 'comptime' keyword forces comptime evaluation
    comptime {
    ^~~~~~~~

It doesn't make sense that a program could call exit() (or any other external function) at compile-time, so this is a compile error. However, a comptime expression does much more than sometimes cause a compile error.

Within a comptime expression:

All variables are comptime variables.
All if, while, for, and switch expressions are evaluated at compile-time, or emit a compile error if this is not possible.
All return and try expressions are invalid (unless the function itself is called at compile-time).
All code with runtime side effects or depending on runtime values emits a compile error.
All function calls cause the compiler to interpret the function at compile-time, emitting a compile error if the function tries to do something that has global runtime side effects.
This means that a programmer can create a function which is called both at compile-time and run-time, with no modification to the function required.

Let's look at an example:

test_fibonacci_recursion.zig
const expect = @import("std").testing.expect;

fn fibonacci(index: u32) u32 {
    if (index < 2) return index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

test "fibonacci" {
    // test fibonacci at run-time
    try expect(fibonacci(7) == 13);

    // test fibonacci at compile-time
    try comptime expect(fibonacci(7) == 13);
}
Shell
$ zig test test_fibonacci_recursion.zig
1/1 test_fibonacci_recursion.test.fibonacci...OK
All 1 tests passed.
Imagine if we had forgotten the base case of the recursive function and tried to run the tests:

test_fibonacci_comptime_overflow.zig
const expect = @import("std").testing.expect;

fn fibonacci(index: u32) u32 {
    //if (index < 2) return index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

test "fibonacci" {
    try comptime expect(fibonacci(7) == 13);
}
Shell
$ zig test test_fibonacci_comptime_overflow.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_fibonacci_comptime_overflow.zig:5:28: error: overflow of integer type 'u32' with value '-1'
    return fibonacci(index - 1) + fibonacci(index - 2);
                     ~~~~~~^~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_fibonacci_comptime_overflow.zig:5:21: note: called at comptime here (7 times)
    return fibonacci(index - 1) + fibonacci(index - 2);
           ~~~~~~~~~^~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_fibonacci_comptime_overflow.zig:9:34: note: called at comptime here
    try comptime expect(fibonacci(7) == 13);
                        ~~~~~~~~~^~~

The compiler produces an error which is a stack trace from trying to evaluate the function at compile-time.

Luckily, we used an unsigned integer, and so when we tried to subtract 1 from 0, it triggered Illegal Behavior, which is always a compile error if the compiler knows it happened. But what would have happened if we used a signed integer?

fibonacci_comptime_infinite_recursion.zig
const assert = @import("std").debug.assert;

fn fibonacci(index: i32) i32 {
    //if (index < 2) return index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

test "fibonacci" {
    try comptime assert(fibonacci(7) == 13);
}
The compiler is supposed to notice that evaluating this function at compile-time took more than 1000 branches, and thus emits an error and gives up. If the programmer wants to increase the budget for compile-time computation, they can use a built-in function called @setEvalBranchQuota to change the default number 1000 to something else.

However, there is a design flaw in the compiler causing it to stack overflow instead of having the proper behavior here. I'm terribly sorry about that. I hope to get this resolved before the next release.

What if we fix the base case, but put the wrong value in the expect line?

test_fibonacci_comptime_unreachable.zig
const assert = @import("std").debug.assert;

fn fibonacci(index: i32) i32 {
    if (index < 2) return index;
    return fibonacci(index - 1) + fibonacci(index - 2);
}

test "fibonacci" {
    try comptime assert(fibonacci(7) == 99999);
}
Shell
$ zig test test_fibonacci_comptime_unreachable.zig
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/debug.zig:548:14: error: reached unreachable code
    if (!ok) unreachable; // assertion failure
             ^~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_fibonacci_comptime_unreachable.zig:9:24: note: called at comptime here
    try comptime assert(fibonacci(7) == 99999);
                 ~~~~~~^~~~~~~~~~~~~~~~~~~~~~~

At container level (outside of any function), all expressions are implicitly comptime expressions. This means that we can use functions to initialize complex static data. For example:

test_container-level_comptime_expressions.zig
const first_25_primes = firstNPrimes(25);
const sum_of_first_25_primes = sum(&first_25_primes);

fn firstNPrimes(comptime n: usize) [n]i32 {
    var prime_list: [n]i32 = undefined;
    var next_index: usize = 0;
    var test_number: i32 = 2;
    while (next_index < prime_list.len) : (test_number += 1) {
        var test_prime_index: usize = 0;
        var is_prime = true;
        while (test_prime_index < next_index) : (test_prime_index += 1) {
            if (test_number % prime_list[test_prime_index] == 0) {
                is_prime = false;
                break;
            }
        }
        if (is_prime) {
            prime_list[next_index] = test_number;
            next_index += 1;
        }
    }
    return prime_list;
}

fn sum(numbers: []const i32) i32 {
    var result: i32 = 0;
    for (numbers) |x| {
        result += x;
    }
    return result;
}

test "variable values" {
    try @import("std").testing.expect(sum_of_first_25_primes == 1060);
}
Shell
$ zig test test_container-level_comptime_expressions.zig
1/1 test_container-level_comptime_expressions.test.variable values...OK
All 1 tests passed.
When we compile this program, Zig generates the constants with the answer pre-computed. Here are the lines from the generated LLVM IR:

@0 = internal unnamed_addr constant [25 x i32] [i32 2, i32 3, i32 5, i32 7, i32 11, i32 13, i32 17, i32 19, i32 23, i32 29, i32 31, i32 37, i32 41, i32 43, i32 47, i32 53, i32 59, i32 61, i32 67, i32 71, i32 73, i32 79, i32 83, i32 89, i32 97]
@1 = internal unnamed_addr constant i32 1060
Note that we did not have to do anything special with the syntax of these functions. For example, we could call the sum function as is with a slice of numbers whose length and values were only known at run-time.

Generic Data Structures 
Zig uses comptime capabilities to implement generic data structures without introducing any special-case syntax.

Here is an example of a generic List data structure.

generic_data_structure.zig
fn List(comptime T: type) type {
    return struct {
        items: []T,
        len: usize,
    };
}

// The generic List data structure can be instantiated by passing in a type:
var buffer: [10]i32 = undefined;
var list = List(i32){
    .items = &buffer,
    .len = 0,
};
That's it. It's a function that returns an anonymous struct. For the purposes of error messages and debugging, Zig infers the name "List(i32)" from the function name and parameters invoked when creating the anonymous struct.

To explicitly give a type a name, we assign it to a constant.

anonymous_struct_name.zig
const Node = struct {
    next: ?*Node,
    name: []const u8,
};

var node_a = Node{
    .next = null,
    .name = "Node A",
};

var node_b = Node{
    .next = &node_a,
    .name = "Node B",
};
In this example, the Node struct refers to itself. This works because all top level declarations are order-independent. As long as the compiler can determine the size of the struct, it is free to refer to itself. In this case, Node refers to itself as a pointer, which has a well-defined size at compile time, so it works fine.

Case Study: print in Zig 
Putting all of this together, let's see how print works in Zig.

print.zig
const print = @import("std").debug.print;

const a_number: i32 = 1234;
const a_string = "foobar";

pub fn main() void {
    print("here is a string: '{s}' here is a number: {}\n", .{ a_string, a_number });
}
Shell
$ zig build-exe print.zig
$ ./print
here is a string: 'foobar' here is a number: 1234
Let's crack open the implementation of this and see how it works:

poc_print_fn.zig
const Writer = struct {
    /// Calls print and then flushes the buffer.
    pub fn print(self: *Writer, comptime format: []const u8, args: anytype) anyerror!void {
        const State = enum {
            start,
            open_brace,
            close_brace,
        };

        comptime var start_index: usize = 0;
        comptime var state = State.start;
        comptime var next_arg: usize = 0;

        inline for (format, 0..) |c, i| {
            switch (state) {
                State.start => switch (c) {
                    '{' => {
                        if (start_index < i) try self.write(format[start_index..i]);
                        state = State.open_brace;
                    },
                    '}' => {
                        if (start_index < i) try self.write(format[start_index..i]);
                        state = State.close_brace;
                    },
                    else => {},
                },
                State.open_brace => switch (c) {
                    '{' => {
                        state = State.start;
                        start_index = i;
                    },
                    '}' => {
                        try self.printValue(args[next_arg]);
                        next_arg += 1;
                        state = State.start;
                        start_index = i + 1;
                    },
                    's' => {
                        continue;
                    },
                    else => @compileError("Unknown format character: " ++ [1]u8{c}),
                },
                State.close_brace => switch (c) {
                    '}' => {
                        state = State.start;
                        start_index = i;
                    },
                    else => @compileError("Single '}' encountered in format string"),
                },
            }
        }
        comptime {
            if (args.len != next_arg) {
                @compileError("Unused arguments");
            }
            if (state != State.start) {
                @compileError("Incomplete format string: " ++ format);
            }
        }
        if (start_index < format.len) {
            try self.write(format[start_index..format.len]);
        }
        try self.flush();
    }

    fn write(self: *Writer, value: []const u8) !void {
        _ = self;
        _ = value;
    }
    pub fn printValue(self: *Writer, value: anytype) !void {
        _ = self;
        _ = value;
    }
    fn flush(self: *Writer) !void {
        _ = self;
    }
};
This is a proof of concept implementation; the actual function in the standard library has more formatting capabilities.

Note that this is not hard-coded into the Zig compiler; this is userland code in the standard library.

When this function is analyzed from our example code above, Zig partially evaluates the function and emits a function that actually looks like this:

Emitted print Function
pub fn print(self: *Writer, arg0: []const u8, arg1: i32) !void {
    try self.write("here is a string: '");
    try self.printValue(arg0);
    try self.write("' here is a number: ");
    try self.printValue(arg1);
    try self.write("\n");
    try self.flush();
}
printValue is a function that takes a parameter of any type, and does different things depending on the type:

poc_printValue_fn.zig
const Writer = struct {
    pub fn printValue(self: *Writer, value: anytype) !void {
        switch (@typeInfo(@TypeOf(value))) {
            .int => {
                return self.writeInt(value);
            },
            .float => {
                return self.writeFloat(value);
            },
            .pointer => {
                return self.write(value);
            },
            else => {
                @compileError("Unable to print type '" ++ @typeName(@TypeOf(value)) ++ "'");
            },
        }
    }

    fn write(self: *Writer, value: []const u8) !void {
        _ = self;
        _ = value;
    }
    fn writeInt(self: *Writer, value: anytype) !void {
        _ = self;
        _ = value;
    }
    fn writeFloat(self: *Writer, value: anytype) !void {
        _ = self;
        _ = value;
    }
};
And now, what happens if we give too many arguments to print?

test_print_too_many_args.zig
const print = @import("std").debug.print;

const a_number: i32 = 1234;
const a_string = "foobar";

test "print too many arguments" {
    print("here is a string: '{s}' here is a number: {}\n", .{
        a_string,
        a_number,
        a_number,
    });
}
Shell
$ zig test test_print_too_many_args.zig
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/fmt.zig:211:18: error: unused argument in 'here is a string: '{s}' here is a number: {}
                                                                                        '
            1 => @compileError("unused argument in '" ++ fmt ++ "'"),
                 ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
referenced by:
    print__anon_711: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/io/Writer.zig:24:26
    print [inlined]: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/io.zig:312:47
    print__anon_455: /home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/debug.zig:213:27

Zig gives programmers the tools needed to protect themselves against their own mistakes.

Zig doesn't care whether the format argument is a string literal, only that it is a compile-time known value that can be coerced to a []const u8:

print_comptime-known_format.zig
const print = @import("std").debug.print;

const a_number: i32 = 1234;
const a_string = "foobar";
const fmt = "here is a string: '{s}' here is a number: {}\n";

pub fn main() void {
    print(fmt, .{ a_string, a_number });
}
Shell
$ zig build-exe print_comptime-known_format.zig
$ ./print_comptime-known_format
here is a string: 'foobar' here is a number: 1234
This works fine.

Zig does not special case string formatting in the compiler and instead exposes enough power to accomplish this task in userland. It does so without introducing another language on top of Zig, such as a macro language or a preprocessor language. It's Zig all the way down.

See also:

inline while
inline for
Assembly 
For some use cases, it may be necessary to directly control the machine code generated by Zig programs, rather than relying on Zig's code generation. For these cases, one can use inline assembly. Here is an example of implementing Hello, World on x86_64 Linux using inline assembly:

inline_assembly.zig
pub fn main() noreturn {
    const msg = "hello world\n";
    _ = syscall3(SYS_write, STDOUT_FILENO, @intFromPtr(msg), msg.len);
    _ = syscall1(SYS_exit, 0);
    unreachable;
}

pub const SYS_write = 1;
pub const SYS_exit = 60;

pub const STDOUT_FILENO = 1;

pub fn syscall1(number: usize, arg1: usize) usize {
    return asm volatile ("syscall"
        : [ret] "={rax}" (-> usize),
        : [number] "{rax}" (number),
          [arg1] "{rdi}" (arg1),
        : "rcx", "r11"
    );
}

pub fn syscall3(number: usize, arg1: usize, arg2: usize, arg3: usize) usize {
    return asm volatile ("syscall"
        : [ret] "={rax}" (-> usize),
        : [number] "{rax}" (number),
          [arg1] "{rdi}" (arg1),
          [arg2] "{rsi}" (arg2),
          [arg3] "{rdx}" (arg3),
        : "rcx", "r11"
    );
}
Shell
$ zig build-exe inline_assembly.zig -target x86_64-linux
$ ./inline_assembly
hello world
Dissecting the syntax:

Assembly Syntax Explained.zig
pub fn syscall1(number: usize, arg1: usize) usize {
    // Inline assembly is an expression which returns a value.
    // the `asm` keyword begins the expression.
    return asm
    // `volatile` is an optional modifier that tells Zig this
    // inline assembly expression has side-effects. Without
    // `volatile`, Zig is allowed to delete the inline assembly
    // code if the result is unused.
    volatile (
    // Next is a comptime string which is the assembly code.
    // Inside this string one may use `%[ret]`, `%[number]`,
    // or `%[arg1]` where a register is expected, to specify
    // the register that Zig uses for the argument or return value,
    // if the register constraint strings are used. However in
    // the below code, this is not used. A literal `%` can be
    // obtained by escaping it with a double percent: `%%`.
    // Often multiline string syntax comes in handy here.
        \\syscall
        // Next is the output. It is possible in the future Zig will
        // support multiple outputs, depending on how
        // https://github.com/ziglang/zig/issues/215 is resolved.
        // It is allowed for there to be no outputs, in which case
        // this colon would be directly followed by the colon for the inputs.
        :
        // This specifies the name to be used in `%[ret]` syntax in
        // the above assembly string. This example does not use it,
        // but the syntax is mandatory.
          [ret]
          // Next is the output constraint string. This feature is still
          // considered unstable in Zig, and so LLVM/GCC documentation
          // must be used to understand the semantics.
          // http://releases.llvm.org/10.0.0/docs/LangRef.html#inline-asm-constraint-string
          // https://gcc.gnu.org/onlinedocs/gcc/Extended-Asm.html
          // In this example, the constraint string means "the result value of
          // this inline assembly instruction is whatever is in $rax".
          "={rax}"
          // Next is either a value binding, or `->` and then a type. The
          // type is the result type of the inline assembly expression.
          // If it is a value binding, then `%[ret]` syntax would be used
          // to refer to the register bound to the value.
          (-> usize),
          // Next is the list of inputs.
          // The constraint for these inputs means, "when the assembly code is
          // executed, $rax shall have the value of `number` and $rdi shall have
          // the value of `arg1`". Any number of input parameters is allowed,
          // including none.
        : [number] "{rax}" (number),
          [arg1] "{rdi}" (arg1),
          // Next is the list of clobbers. These declare a set of registers whose
          // values will not be preserved by the execution of this assembly code.
          // These do not include output or input registers. The special clobber
          // value of "memory" means that the assembly writes to arbitrary undeclared
          // memory locations - not only the memory pointed to by a declared indirect
          // output. In this example we list $rcx and $r11 because it is known the
          // kernel syscall does not preserve these registers.
        : "rcx", "r11"
    );
}
For x86 and x86_64 targets, the syntax is AT&T syntax, rather than the more popular Intel syntax. This is due to technical constraints; assembly parsing is provided by LLVM and its support for Intel syntax is buggy and not well tested.

Some day Zig may have its own assembler. This would allow it to integrate more seamlessly into the language, as well as be compatible with the popular NASM syntax. This documentation section will be updated before 1.0.0 is released, with a conclusive statement about the status of AT&T vs Intel/NASM syntax.

Output Constraints 
Output constraints are still considered to be unstable in Zig, and so LLVM documentation and GCC documentation must be used to understand the semantics.

Note that some breaking changes to output constraints are planned with issue #215.

Input Constraints 
Input constraints are still considered to be unstable in Zig, and so LLVM documentation and GCC documentation must be used to understand the semantics.

Note that some breaking changes to input constraints are planned with issue #215.

Clobbers 
Clobbers are the set of registers whose values will not be preserved by the execution of the assembly code. These do not include output or input registers. The special clobber value of "memory" means that the assembly causes writes to arbitrary undeclared memory locations - not only the memory pointed to by a declared indirect output.

Failure to declare the full set of clobbers for a given inline assembly expression is unchecked Illegal Behavior.

Global Assembly 
When an assembly expression occurs in a container level comptime block, this is global assembly.

This kind of assembly has different rules than inline assembly. First, volatile is not valid because all global assembly is unconditionally included. Second, there are no inputs, outputs, or clobbers. All global assembly is concatenated verbatim into one long string and assembled together. There are no template substitution rules regarding % as there are in inline assembly expressions.

test_global_assembly.zig
const std = @import("std");
const expect = std.testing.expect;

comptime {
    asm (
        \\.global my_func;
        \\.type my_func, @function;
        \\my_func:
        \\  lea (%rdi,%rsi,1),%eax
        \\  retq
    );
}

extern fn my_func(a: i32, b: i32) i32;

test "global assembly" {
    try expect(my_func(12, 34) == 46);
}
Shell
$ zig test test_global_assembly.zig -target x86_64-linux -fllvm
1/1 test_global_assembly.test.global assembly...OK
All 1 tests passed.
Atomics 
TODO: @atomic rmw

TODO: builtin atomic memory ordering enum

See also:

@atomicLoad
@atomicStore
@atomicRmw
@cmpxchgWeak
@cmpxchgStrong
Async Functions 
Async functions regressed with the release of 0.11.0. Their future in the Zig language is unclear due to multiple unsolved problems:

LLVM's lack of ability to optimize them.
Third-party debuggers' lack of ability to debug them.
The cancellation problem.
Async function pointers preventing the stack size from being known.
These problems are surmountable, but it will take time. The Zig team is currently focused on other priorities.

Builtin Functions 
Builtin functions are provided by the compiler and are prefixed with @. The comptime keyword on a parameter means that the parameter must be known at compile time.

@addrSpaceCast 
@addrSpaceCast(ptr: anytype) anytype
Converts a pointer from one address space to another. The new address space is inferred based on the result type. Depending on the current target and address spaces, this cast may be a no-op, a complex operation, or illegal. If the cast is legal, then the resulting pointer points to the same memory location as the pointer operand. It is always valid to cast a pointer between the same address spaces.

@addWithOverflow 
@addWithOverflow(a: anytype, b: anytype) struct { @TypeOf(a, b), u1 }
Performs a + b and returns a tuple with the result and a possible overflow bit.

@alignCast 
@alignCast(ptr: anytype) anytype
ptr can be *T, ?*T, or []T. Changes the alignment of a pointer. The alignment to use is inferred based on the result type.

A pointer alignment safety check is added to the generated code to make sure the pointer is aligned as promised.

@alignOf 
@alignOf(comptime T: type) comptime_int
This function returns the number of bytes that this type should be aligned to for the current target to match the C ABI. When the child type of a pointer has this alignment, the alignment can be omitted from the type.

const assert = @import("std").debug.assert;
comptime {
    assert(*u32 == *align(@alignOf(u32)) u32);
}
The result is a target-specific compile time constant. It is guaranteed to be less than or equal to @sizeOf(T).

See also:

Alignment
@as 
@as(comptime T: type, expression) T
Performs Type Coercion. This cast is allowed when the conversion is unambiguous and safe, and is the preferred way to convert between types, whenever possible.

@atomicLoad 
@atomicLoad(comptime T: type, ptr: *const T, comptime ordering: AtomicOrder) T
This builtin function atomically dereferences a pointer to a T and returns the value.

T must be a pointer, a bool, a float, an integer or an enum.

AtomicOrder can be found with @import("std").builtin.AtomicOrder.

See also:

@atomicStore
@atomicRmw
@cmpxchgWeak
@cmpxchgStrong
@atomicRmw 
@atomicRmw(comptime T: type, ptr: *T, comptime op: AtomicRmwOp, operand: T, comptime ordering: AtomicOrder) T
This builtin function dereferences a pointer to a T and atomically modifies the value and returns the previous value.

T must be a pointer, a bool, a float, an integer or an enum.

AtomicOrder can be found with @import("std").builtin.AtomicOrder.

AtomicRmwOp can be found with @import("std").builtin.AtomicRmwOp.

See also:

@atomicStore
@atomicLoad
@cmpxchgWeak
@cmpxchgStrong
@atomicStore 
@atomicStore(comptime T: type, ptr: *T, value: T, comptime ordering: AtomicOrder) void
This builtin function dereferences a pointer to a T and atomically stores the given value.

T must be a pointer, a bool, a float, an integer or an enum.

AtomicOrder can be found with @import("std").builtin.AtomicOrder.

See also:

@atomicLoad
@atomicRmw
@cmpxchgWeak
@cmpxchgStrong
@bitCast 
@bitCast(value: anytype) anytype
Converts a value of one type to another type. The return type is the inferred result type.

Asserts that @sizeOf(@TypeOf(value)) == @sizeOf(DestType).

Asserts that @typeInfo(DestType) != .pointer. Use @ptrCast or @ptrFromInt if you need this.

Can be used for these things for example:

Convert f32 to u32 bits
Convert i32 to u32 preserving twos complement
Works at compile-time if value is known at compile time. It's a compile error to bitcast a value of undefined layout; this means that, besides the restriction from types which possess dedicated casting builtins (enums, pointers, error sets), bare structs, error unions, slices, optionals, and any other type without a well-defined memory layout, also cannot be used in this operation.

@bitOffsetOf 
@bitOffsetOf(comptime T: type, comptime field_name: []const u8) comptime_int
Returns the bit offset of a field relative to its containing struct.

For non packed structs, this will always be divisible by 8. For packed structs, non-byte-aligned fields will share a byte offset, but they will have different bit offsets.

See also:

@offsetOf
@bitSizeOf 
@bitSizeOf(comptime T: type) comptime_int
This function returns the number of bits it takes to store T in memory if the type were a field in a packed struct/union. The result is a target-specific compile time constant.

This function measures the size at runtime. For types that are disallowed at runtime, such as comptime_int and type, the result is 0.

See also:

@sizeOf
@typeInfo
@branchHint 
@branchHint(hint: BranchHint) void
Hints to the optimizer how likely a given branch of control flow is to be reached.

BranchHint can be found with @import("std").builtin.BranchHint.

This function is only valid as the first statement in a control flow branch, or the first statement in a function.

@breakpoint 
@breakpoint() void
This function inserts a platform-specific debug trap instruction which causes debuggers to break there. Unlike for @trap(), execution may continue after this point if the program is resumed.

This function is only valid within function scope.

See also:

@trap
@mulAdd 
@mulAdd(comptime T: type, a: T, b: T, c: T) T
Fused multiply-add, similar to (a * b) + c, except only rounds once, and is thus more accurate.

Supports Floats and Vectors of floats.

@byteSwap 
@byteSwap(operand: anytype) T
@TypeOf(operand) must be an integer type or an integer vector type with bit count evenly divisible by 8.

operand may be an integer or vector.

Swaps the byte order of the integer. This converts a big endian integer to a little endian integer, and converts a little endian integer to a big endian integer.

Note that for the purposes of memory layout with respect to endianness, the integer type should be related to the number of bytes reported by @sizeOf bytes. This is demonstrated with u24. @sizeOf(u24) == 4, which means that a u24 stored in memory takes 4 bytes, and those 4 bytes are what are swapped on a little vs big endian system. On the other hand, if T is specified to be u24, then only 3 bytes are reversed.

@bitReverse 
@bitReverse(integer: anytype) T
@TypeOf(anytype) accepts any integer type or integer vector type.

Reverses the bitpattern of an integer value, including the sign bit if applicable.

For example 0b10110110 (u8 = 182, i8 = -74) becomes 0b01101101 (u8 = 109, i8 = 109).

@offsetOf 
@offsetOf(comptime T: type, comptime field_name: []const u8) comptime_int
Returns the byte offset of a field relative to its containing struct.

See also:

@bitOffsetOf
@call 
@call(modifier: std.builtin.CallModifier, function: anytype, args: anytype) anytype
Calls a function, in the same way that invoking an expression with parentheses does:

test_call_builtin.zig
const expect = @import("std").testing.expect;

test "noinline function call" {
    try expect(@call(.auto, add, .{ 3, 9 }) == 12);
}

fn add(a: i32, b: i32) i32 {
    return a + b;
}
Shell
$ zig test test_call_builtin.zig
1/1 test_call_builtin.test.noinline function call...OK
All 1 tests passed.
@call allows more flexibility than normal function call syntax does. The CallModifier enum is reproduced here:

builtin.CallModifier struct.zig
pub const CallModifier = enum {
    /// Equivalent to function call syntax.
    auto,

    /// Equivalent to async keyword used with function call syntax.
    async_kw,

    /// Prevents tail call optimization. This guarantees that the return
    /// address will point to the callsite, as opposed to the callsite's
    /// callsite. If the call is otherwise required to be tail-called
    /// or inlined, a compile error is emitted instead.
    never_tail,

    /// Guarantees that the call will not be inlined. If the call is
    /// otherwise required to be inlined, a compile error is emitted instead.
    never_inline,

    /// Asserts that the function call will not suspend. This allows a
    /// non-async function to call an async function.
    no_async,

    /// Guarantees that the call will be generated with tail call optimization.
    /// If this is not possible, a compile error is emitted instead.
    always_tail,

    /// Guarantees that the call will be inlined at the callsite.
    /// If this is not possible, a compile error is emitted instead.
    always_inline,

    /// Evaluates the call at compile-time. If the call cannot be completed at
    /// compile-time, a compile error is emitted instead.
    compile_time,
};
@cDefine 
@cDefine(comptime name: []const u8, value) void
This function can only occur inside @cImport.

This appends #define $name $value to the @cImport temporary buffer.

To define without a value, like this:

#define _GNU_SOURCE
Use the void value, like this:

@cDefine("_GNU_SOURCE", {})
See also:

Import from C Header File
@cInclude
@cImport
@cUndef
void
@cImport 
@cImport(expression) type
This function parses C code and imports the functions, types, variables, and compatible macro definitions into a new empty struct type, and then returns that type.

expression is interpreted at compile time. The builtin functions @cInclude, @cDefine, and @cUndef work within this expression, appending to a temporary buffer which is then parsed as C code.

Usually you should only have one @cImport in your entire application, because it saves the compiler from invoking clang multiple times, and prevents inline functions from being duplicated.

Reasons for having multiple @cImport expressions would be:

To avoid a symbol collision, for example if foo.h and bar.h both #define CONNECTION_COUNT
To analyze the C code with different preprocessor defines
See also:

Import from C Header File
@cInclude
@cDefine
@cUndef
@cInclude 
@cInclude(comptime path: []const u8) void
This function can only occur inside @cImport.

This appends #include <$path>\n to the c_import temporary buffer.

See also:

Import from C Header File
@cImport
@cDefine
@cUndef
@clz 
@clz(operand: anytype) anytype
@TypeOf(operand) must be an integer type or an integer vector type.

operand may be an integer or vector.

Counts the number of most-significant (leading in a big-endian sense) zeroes in an integer - "count leading zeroes".

The return type is an unsigned integer or vector of unsigned integers with the minimum number of bits that can represent the bit count of the integer type.

If operand is zero, @clz returns the bit width of integer type T.

See also:

@ctz
@popCount
@cmpxchgStrong 
@cmpxchgStrong(comptime T: type, ptr: *T, expected_value: T, new_value: T, success_order: AtomicOrder, fail_order: AtomicOrder) ?T
This function performs a strong atomic compare-and-exchange operation, returning null if the current value is the given expected value. It's the equivalent of this code, except atomic:

not_atomic_cmpxchgStrong.zig
fn cmpxchgStrongButNotAtomic(comptime T: type, ptr: *T, expected_value: T, new_value: T) ?T {
    const old_value = ptr.*;
    if (old_value == expected_value) {
        ptr.* = new_value;
        return null;
    } else {
        return old_value;
    }
}
If you are using cmpxchg in a retry loop, @cmpxchgWeak is the better choice, because it can be implemented more efficiently in machine instructions.

T must be a pointer, a bool, a float, an integer or an enum.

@typeInfo(@TypeOf(ptr)).pointer.alignment must be >= @sizeOf(T).

AtomicOrder can be found with @import("std").builtin.AtomicOrder.

See also:

@atomicStore
@atomicLoad
@atomicRmw
@cmpxchgWeak
@cmpxchgWeak 
@cmpxchgWeak(comptime T: type, ptr: *T, expected_value: T, new_value: T, success_order: AtomicOrder, fail_order: AtomicOrder) ?T
This function performs a weak atomic compare-and-exchange operation, returning null if the current value is the given expected value. It's the equivalent of this code, except atomic:

cmpxchgWeakButNotAtomic
fn cmpxchgWeakButNotAtomic(comptime T: type, ptr: *T, expected_value: T, new_value: T) ?T {
    const old_value = ptr.*;
    if (old_value == expected_value and usuallyTrueButSometimesFalse()) {
        ptr.* = new_value;
        return null;
    } else {
        return old_value;
    }
}
If you are using cmpxchg in a retry loop, the sporadic failure will be no problem, and cmpxchgWeak is the better choice, because it can be implemented more efficiently in machine instructions. However if you need a stronger guarantee, use @cmpxchgStrong.

T must be a pointer, a bool, a float, an integer or an enum.

@typeInfo(@TypeOf(ptr)).pointer.alignment must be >= @sizeOf(T).

AtomicOrder can be found with @import("std").builtin.AtomicOrder.

See also:

@atomicStore
@atomicLoad
@atomicRmw
@cmpxchgStrong
@compileError 
@compileError(comptime msg: []const u8) noreturn
This function, when semantically analyzed, causes a compile error with the message msg.

There are several ways that code avoids being semantically checked, such as using if or switch with compile time constants, and comptime functions.

@compileLog 
@compileLog(...) void
This function prints the arguments passed to it at compile-time.

To prevent accidentally leaving compile log statements in a codebase, a compilation error is added to the build, pointing to the compile log statement. This error prevents code from being generated, but does not otherwise interfere with analysis.

This function can be used to do "printf debugging" on compile-time executing code.

test_compileLog_builtin.zig
const print = @import("std").debug.print;

const num1 = blk: {
    var val1: i32 = 99;
    @compileLog("comptime val1 = ", val1);
    val1 = val1 + 1;
    break :blk val1;
};

test "main" {
    @compileLog("comptime in main");

    print("Runtime in main, num1 = {}.\n", .{num1});
}
Shell
$ zig test test_compileLog_builtin.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_compileLog_builtin.zig:5:5: error: found compile log statement
    @compileLog("comptime val1 = ", val1);
    ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_compileLog_builtin.zig:11:5: note: also here
    @compileLog("comptime in main");
    ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
referenced by:
    test.main: /home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_compileLog_builtin.zig:13:46

Compile Log Output:
@as(*const [16:0]u8, "comptime val1 = "), @as(i32, 99)
@as(*const [16:0]u8, "comptime in main")
@constCast 
@constCast(value: anytype) DestType
Remove const qualifier from a pointer.

@ctz 
@ctz(operand: anytype) anytype
@TypeOf(operand) must be an integer type or an integer vector type.

operand may be an integer or vector.

Counts the number of least-significant (trailing in a big-endian sense) zeroes in an integer - "count trailing zeroes".

The return type is an unsigned integer or vector of unsigned integers with the minimum number of bits that can represent the bit count of the integer type.

If operand is zero, @ctz returns the bit width of integer type T.

See also:

@clz
@popCount
@cUndef 
@cUndef(comptime name: []const u8) void
This function can only occur inside @cImport.

This appends #undef $name to the @cImport temporary buffer.

See also:

Import from C Header File
@cImport
@cDefine
@cInclude
@cVaArg 
@cVaArg(operand: *std.builtin.VaList, comptime T: type) T
Implements the C macro va_arg.

See also:

@cVaCopy
@cVaEnd
@cVaStart
@cVaCopy 
@cVaCopy(src: *std.builtin.VaList) std.builtin.VaList
Implements the C macro va_copy.

See also:

@cVaArg
@cVaEnd
@cVaStart
@cVaEnd 
@cVaEnd(src: *std.builtin.VaList) void
Implements the C macro va_end.

See also:

@cVaArg
@cVaCopy
@cVaStart
@cVaStart 
@cVaStart() std.builtin.VaList
Implements the C macro va_start. Only valid inside a variadic function.

See also:

@cVaArg
@cVaCopy
@cVaEnd
@divExact 
@divExact(numerator: T, denominator: T) T
Exact division. Caller guarantees denominator != 0 and @divTrunc(numerator, denominator) * denominator == numerator.

@divExact(6, 3) == 2
@divExact(a, b) * b == a
For a function that returns a possible error code, use @import("std").math.divExact.

See also:

@divTrunc
@divFloor
@divFloor 
@divFloor(numerator: T, denominator: T) T
Floored division. Rounds toward negative infinity. For unsigned integers it is the same as numerator / denominator. Caller guarantees denominator != 0 and !(@typeInfo(T) == .int and T.is_signed and numerator == std.math.minInt(T) and denominator == -1).

@divFloor(-5, 3) == -2
(@divFloor(a, b) * b) + @mod(a, b) == a
For a function that returns a possible error code, use @import("std").math.divFloor.

See also:

@divTrunc
@divExact
@divTrunc 
@divTrunc(numerator: T, denominator: T) T
Truncated division. Rounds toward zero. For unsigned integers it is the same as numerator / denominator. Caller guarantees denominator != 0 and !(@typeInfo(T) == .int and T.is_signed and numerator == std.math.minInt(T) and denominator == -1).

@divTrunc(-5, 3) == -1
(@divTrunc(a, b) * b) + @rem(a, b) == a
For a function that returns a possible error code, use @import("std").math.divTrunc.

See also:

@divFloor
@divExact
@embedFile 
@embedFile(comptime path: []const u8) *const [N:0]u8
This function returns a compile time constant pointer to null-terminated, fixed-size array with length equal to the byte count of the file given by path. The contents of the array are the contents of the file. This is equivalent to a string literal with the file contents.

path is absolute or relative to the current file, just like @import.

See also:

@import
@enumFromInt 
@enumFromInt(integer: anytype) anytype
Converts an integer into an enum value. The return type is the inferred result type.

Attempting to convert an integer with no corresponding value in the enum invokes safety-checked Illegal Behavior. Note that a non-exhaustive enum has corresponding values for all integers in the enum's integer tag type: the _ value represents all the remaining unnamed integers in the enum's tag type.

See also:

@intFromEnum
@errorFromInt 
@errorFromInt(value: std.meta.Int(.unsigned, @bitSizeOf(anyerror))) anyerror
Converts from the integer representation of an error into The Global Error Set type.

It is generally recommended to avoid this cast, as the integer representation of an error is not stable across source code changes.

Attempting to convert an integer that does not correspond to any error results in safety-checked Illegal Behavior.

See also:

@intFromError
@errorName 
@errorName(err: anyerror) [:0]const u8
This function returns the string representation of an error. The string representation of error.OutOfMem is "OutOfMem".

If there are no calls to @errorName in an entire application, or all calls have a compile-time known value for err, then no error name table will be generated.

@errorReturnTrace 
@errorReturnTrace() ?*builtin.StackTrace
If the binary is built with error return tracing, and this function is invoked in a function that calls a function with an error or error union return type, returns a stack trace object. Otherwise returns null.

@errorCast 
@errorCast(value: anytype) anytype
Converts an error set or error union value from one error set to another error set. The return type is the inferred result type. Attempting to convert an error which is not in the destination error set results in safety-checked Illegal Behavior.

@export 
@export(comptime ptr: *const anyopaque, comptime options: std.builtin.ExportOptions) void
Creates a symbol in the output object file which refers to the target of ptr.

ptr must point to a global variable or a comptime-known constant.

This builtin can be called from a comptime block to conditionally export symbols. When ptr points to a function with the C calling convention and options.linkage is .Strong, this is equivalent to the export keyword used on a function:

export_builtin.zig
comptime {
    @export(&internalName, .{ .name = "foo", .linkage = .strong });
}

fn internalName() callconv(.c) void {}
Shell
$ zig build-obj export_builtin.zig
This is equivalent to:

export_builtin_equivalent_code.zig
export fn foo() void {}
Shell
$ zig build-obj export_builtin_equivalent_code.zig
Note that even when using export, the @"foo" syntax for identifiers can be used to choose any string for the symbol name:

export_any_symbol_name.zig
export fn @"A function name that is a complete sentence."() void {}
Shell
$ zig build-obj export_any_symbol_name.zig
When looking at the resulting object, you can see the symbol is used verbatim:

00000000000001f0 T A function name that is a complete sentence.
See also:

Exporting a C Library
@extern 
@extern(T: type, comptime options: std.builtin.ExternOptions) T
Creates a reference to an external symbol in the output object file. T must be a pointer type.

See also:

@export
@field 
@field(lhs: anytype, comptime field_name: []const u8) (field)
Performs field access by a compile-time string. Works on both fields and declarations.

test_field_builtin.zig
const std = @import("std");

const Point = struct {
    x: u32,
    y: u32,

    pub var z: u32 = 1;
};

test "field access by string" {
    const expect = std.testing.expect;
    var p = Point{ .x = 0, .y = 0 };

    @field(p, "x") = 4;
    @field(p, "y") = @field(p, "x") + 1;

    try expect(@field(p, "x") == 4);
    try expect(@field(p, "y") == 5);
}

test "decl access by string" {
    const expect = std.testing.expect;

    try expect(@field(Point, "z") == 1);

    @field(Point, "z") = 2;
    try expect(@field(Point, "z") == 2);
}
Shell
$ zig test test_field_builtin.zig
1/2 test_field_builtin.test.field access by string...OK
2/2 test_field_builtin.test.decl access by string...OK
All 2 tests passed.
@fieldParentPtr 
@fieldParentPtr(comptime field_name: []const u8, field_ptr: *T) anytype
Given a pointer to a struct field, returns a pointer to the struct containing that field. The return type (and struct in question) is the inferred result type.

If field_ptr does not point to the field_name field of an instance of the result type, and the result type has ill-defined layout, invokes unchecked Illegal Behavior.

@FieldType 
@FieldType(comptime Type: type, comptime field_name: []const u8) type
Given a type and the name of one of its fields, returns the type of that field.

@floatCast 
@floatCast(value: anytype) anytype
Convert from one float type to another. This cast is safe, but may cause the numeric value to lose precision. The return type is the inferred result type.

@floatFromInt 
@floatFromInt(int: anytype) anytype
Converts an integer to the closest floating point representation. The return type is the inferred result type. To convert the other way, use @intFromFloat. This operation is legal for all values of all integer types.

@frameAddress 
@frameAddress() usize
This function returns the base pointer of the current stack frame.

The implications of this are target-specific and not consistent across all platforms. The frame address may not be available in release mode due to aggressive optimizations.

This function is only valid within function scope.

@hasDecl 
@hasDecl(comptime Container: type, comptime name: []const u8) bool
Returns whether or not a container has a declaration matching name.

test_hasDecl_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

const Foo = struct {
    nope: i32,

    pub var blah = "xxx";
    const hi = 1;
};

test "@hasDecl" {
    try expect(@hasDecl(Foo, "blah"));

    // Even though `hi` is private, @hasDecl returns true because this test is
    // in the same file scope as Foo. It would return false if Foo was declared
    // in a different file.
    try expect(@hasDecl(Foo, "hi"));

    // @hasDecl is for declarations; not fields.
    try expect(!@hasDecl(Foo, "nope"));
    try expect(!@hasDecl(Foo, "nope1234"));
}
Shell
$ zig test test_hasDecl_builtin.zig
1/1 test_hasDecl_builtin.test.@hasDecl...OK
All 1 tests passed.
See also:

@hasField
@hasField 
@hasField(comptime Container: type, comptime name: []const u8) bool
Returns whether the field name of a struct, union, or enum exists.

The result is a compile time constant.

It does not include functions, variables, or constants.

See also:

@hasDecl
@import 
@import(comptime path: []const u8) type
This function finds a zig file corresponding to path and adds it to the build, if it is not already added.

Zig source files are implicitly structs, with a name equal to the file's basename with the extension truncated. @import returns the struct type corresponding to the file.

Declarations which have the pub keyword may be referenced from a different source file than the one they are declared in.

path can be a relative path or it can be the name of a package. If it is a relative path, it is relative to the file that contains the @import function call.

The following packages are always available:

@import("std") - Zig Standard Library
@import("builtin") - Target-specific information The command zig build-exe --show-builtin outputs the source to stdout for reference.
@import("root") - Root source file This is usually src/main.zig but depends on what file is built.
See also:

Compile Variables
@embedFile
@inComptime 
@inComptime() bool
Returns whether the builtin was run in a comptime context. The result is a compile-time constant.

This can be used to provide alternative, comptime-friendly implementations of functions. It should not be used, for instance, to exclude certain functions from being evaluated at comptime.

See also:

comptime
@intCast 
@intCast(int: anytype) anytype
Converts an integer to another integer while keeping the same numerical value. The return type is the inferred result type. Attempting to convert a number which is out of range of the destination type results in safety-checked Illegal Behavior.

test_intCast_builtin.zig
test "integer cast panic" {
    var a: u16 = 0xabcd; // runtime-known
    _ = &a;
    const b: u8 = @intCast(a);
    _ = b;
}
Shell
$ zig test test_intCast_builtin.zig
1/1 test_intCast_builtin.test.integer cast panic...thread 3521217 panic: integer does not fit in destination type
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_intCast_builtin.zig:4:19: 0x102d020 in test.integer cast panic (test_intCast_builtin.zig)
    const b: u8 = @intCast(a);
                  ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1175db3 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116be57 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1164f8d in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1164863 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/42175105b1664cf54a6dcb11952d99d3/test --seed=0xa40b7fe
To truncate the significant bits of a number out of range of the destination type, use @truncate.

If T is comptime_int, then this is semantically equivalent to Type Coercion.

@intFromBool 
@intFromBool(value: bool) u1
Converts true to @as(u1, 1) and false to @as(u1, 0).

@intFromEnum 
@intFromEnum(enum_or_tagged_union: anytype) anytype
Converts an enumeration value into its integer tag type. When a tagged union is passed, the tag value is used as the enumeration value.

If there is only one possible enum value, the result is a comptime_int known at comptime.

See also:

@enumFromInt
@intFromError 
@intFromError(err: anytype) std.meta.Int(.unsigned, @bitSizeOf(anyerror))
Supports the following types:

The Global Error Set
Error Set Type
Error Union Type
Converts an error to the integer representation of an error.

It is generally recommended to avoid this cast, as the integer representation of an error is not stable across source code changes.

See also:

@errorFromInt
@intFromFloat 
@intFromFloat(float: anytype) anytype
Converts the integer part of a floating point number to the inferred result type.

If the integer part of the floating point number cannot fit in the destination type, it invokes safety-checked Illegal Behavior.

See also:

@floatFromInt
@intFromPtr 
@intFromPtr(value: anytype) usize
Converts value to a usize which is the address of the pointer. value can be *T or ?*T.

To convert the other way, use @ptrFromInt

@max 
@max(...) T
Takes two or more arguments and returns the biggest value included (the maximum). This builtin accepts integers, floats, and vectors of either. In the latter case, the operation is performed element wise.

NaNs are handled as follows: return the biggest non-NaN value included. If all operands are NaN, return NaN.

See also:

@min
Vectors
@memcpy 
@memcpy(noalias dest, noalias source) void
This function copies bytes from one region of memory to another.

dest must be a mutable slice, a mutable pointer to an array, or a mutable many-item pointer. It may have any alignment, and it may have any element type.

source must be a slice, a pointer to an array, or a many-item pointer. It may have any alignment, and it may have any element type.

The source element type must have the same in-memory representation as the dest element type.

Similar to for loops, at least one of source and dest must provide a length, and if two lengths are provided, they must be equal.

Finally, the two memory regions must not overlap.

@memset 
@memset(dest, elem) void
This function sets all the elements of a memory region to elem.

dest must be a mutable slice or a mutable pointer to an array. It may have any alignment, and it may have any element type.

elem is coerced to the element type of dest.

For securely zeroing out sensitive contents from memory, you should use std.crypto.secureZero

@memmove 
@memmove(dest, source) void
This function copies bytes from one region of memory to another, but unlike @memcpy the regions may overlap.

dest must be a mutable slice, a mutable pointer to an array, or a mutable many-item pointer. It may have any alignment, and it may have any element type.

source must be a slice, a pointer to an array, or a many-item pointer. It may have any alignment, and it may have any element type.

The source element type must have the same in-memory representation as the dest element type.

Similar to for loops, at least one of source and dest must provide a length, and if two lengths are provided, they must be equal.

@min 
@min(...) T
Takes two or more arguments and returns the smallest value included (the minimum). This builtin accepts integers, floats, and vectors of either. In the latter case, the operation is performed element wise.

NaNs are handled as follows: return the smallest non-NaN value included. If all operands are NaN, return NaN.

See also:

@max
Vectors
@wasmMemorySize 
@wasmMemorySize(index: u32) usize
This function returns the size of the Wasm memory identified by index as an unsigned value in units of Wasm pages. Note that each Wasm page is 64KB in size.

This function is a low level intrinsic with no safety mechanisms usually useful for allocator designers targeting Wasm. So unless you are writing a new allocator from scratch, you should use something like @import("std").heap.WasmPageAllocator.

See also:

@wasmMemoryGrow
@wasmMemoryGrow 
@wasmMemoryGrow(index: u32, delta: usize) isize
This function increases the size of the Wasm memory identified by index by delta in units of unsigned number of Wasm pages. Note that each Wasm page is 64KB in size. On success, returns previous memory size; on failure, if the allocation fails, returns -1.

This function is a low level intrinsic with no safety mechanisms usually useful for allocator designers targeting Wasm. So unless you are writing a new allocator from scratch, you should use something like @import("std").heap.WasmPageAllocator.

test_wasmMemoryGrow_builtin.zig
const std = @import("std");
const native_arch = @import("builtin").target.cpu.arch;
const expect = std.testing.expect;

test "@wasmMemoryGrow" {
    if (native_arch != .wasm32) return error.SkipZigTest;

    const prev = @wasmMemorySize(0);
    try expect(prev == @wasmMemoryGrow(0, 1));
    try expect(prev + 1 == @wasmMemorySize(0));
}
Shell
$ zig test test_wasmMemoryGrow_builtin.zig
1/1 test_wasmMemoryGrow_builtin.test.@wasmMemoryGrow...SKIP
0 passed; 1 skipped; 0 failed.
See also:

@wasmMemorySize
@mod 
@mod(numerator: T, denominator: T) T
Modulus division. For unsigned integers this is the same as numerator % denominator. Caller guarantees denominator > 0, otherwise the operation will result in a Remainder Division by Zero when runtime safety checks are enabled.

@mod(-5, 3) == 1
(@divFloor(a, b) * b) + @mod(a, b) == a
For a function that returns an error code, see @import("std").math.mod.

See also:

@rem
@mulWithOverflow 
@mulWithOverflow(a: anytype, b: anytype) struct { @TypeOf(a, b), u1 }
Performs a * b and returns a tuple with the result and a possible overflow bit.

@panic 
@panic(message: []const u8) noreturn
Invokes the panic handler function. By default the panic handler function calls the public panic function exposed in the root source file, or if there is not one specified, the std.builtin.default_panic function from std/builtin.zig.

Generally it is better to use @import("std").debug.panic. However, @panic can be useful for 2 scenarios:

From library code, calling the programmer's panic function if they exposed one in the root source file.
When mixing C and Zig code, calling the canonical panic implementation across multiple .o files.
See also:

Panic Handler
@popCount 
@popCount(operand: anytype) anytype
@TypeOf(operand) must be an integer type.

operand may be an integer or vector.

Counts the number of bits set in an integer - "population count".

The return type is an unsigned integer or vector of unsigned integers with the minimum number of bits that can represent the bit count of the integer type.

See also:

@ctz
@clz
@prefetch 
@prefetch(ptr: anytype, comptime options: PrefetchOptions) void
This builtin tells the compiler to emit a prefetch instruction if supported by the target CPU. If the target CPU does not support the requested prefetch instruction, this builtin is a no-op. This function has no effect on the behavior of the program, only on the performance characteristics.

The ptr argument may be any pointer type and determines the memory address to prefetch. This function does not dereference the pointer, it is perfectly legal to pass a pointer to invalid memory to this function and no Illegal Behavior will result.

PrefetchOptions can be found with @import("std").builtin.PrefetchOptions.

@ptrCast 
@ptrCast(value: anytype) anytype
Converts a pointer of one type to a pointer of another type. The return type is the inferred result type.

Optional Pointers are allowed. Casting an optional pointer which is null to a non-optional pointer invokes safety-checked Illegal Behavior.

@ptrCast cannot be used for:

Removing const qualifier, use @constCast.
Removing volatile qualifier, use @volatileCast.
Changing pointer address space, use @addrSpaceCast.
Increasing pointer alignment, use @alignCast.
Casting a non-slice pointer to a slice, use slicing syntax ptr[start..end].
@ptrFromInt 
@ptrFromInt(address: usize) anytype
Converts an integer to a pointer. The return type is the inferred result type. To convert the other way, use @intFromPtr. Casting an address of 0 to a destination type which in not optional and does not have the allowzero attribute will result in a Pointer Cast Invalid Null panic when runtime safety checks are enabled.

If the destination pointer type does not allow address zero and address is zero, this invokes safety-checked Illegal Behavior.

@rem 
@rem(numerator: T, denominator: T) T
Remainder division. For unsigned integers this is the same as numerator % denominator. Caller guarantees denominator > 0, otherwise the operation will result in a Remainder Division by Zero when runtime safety checks are enabled.

@rem(-5, 3) == -2
(@divTrunc(a, b) * b) + @rem(a, b) == a
For a function that returns an error code, see @import("std").math.rem.

See also:

@mod
@returnAddress 
@returnAddress() usize
This function returns the address of the next machine code instruction that will be executed when the current function returns.

The implications of this are target-specific and not consistent across all platforms.

This function is only valid within function scope. If the function gets inlined into a calling function, the returned address will apply to the calling function.

@select 
@select(comptime T: type, pred: @Vector(len, bool), a: @Vector(len, T), b: @Vector(len, T)) @Vector(len, T)
Selects values element-wise from a or b based on pred. If pred[i] is true, the corresponding element in the result will be a[i] and otherwise b[i].

See also:

Vectors
@setEvalBranchQuota 
@setEvalBranchQuota(comptime new_quota: u32) void
Increase the maximum number of backwards branches that compile-time code execution can use before giving up and making a compile error.

If the new_quota is smaller than the default quota (1000) or a previously explicitly set quota, it is ignored.

Example:

test_without_setEvalBranchQuota_builtin.zig
test "foo" {
    comptime {
        var i = 0;
        while (i < 1001) : (i += 1) {}
    }
}
Shell
$ zig test test_without_setEvalBranchQuota_builtin.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_without_setEvalBranchQuota_builtin.zig:4:9: error: evaluation exceeded 1000 backwards branches
        while (i < 1001) : (i += 1) {}
        ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_without_setEvalBranchQuota_builtin.zig:4:9: note: use @setEvalBranchQuota() to raise the branch limit from 1000

Now we use @setEvalBranchQuota:

test_setEvalBranchQuota_builtin.zig
test "foo" {
    comptime {
        @setEvalBranchQuota(1001);
        var i = 0;
        while (i < 1001) : (i += 1) {}
    }
}
Shell
$ zig test test_setEvalBranchQuota_builtin.zig
1/1 test_setEvalBranchQuota_builtin.test.foo...OK
All 1 tests passed.
See also:

comptime
@setFloatMode 
@setFloatMode(comptime mode: FloatMode) void
Changes the current scope's rules about how floating point operations are defined.

Strict (default) - Floating point operations follow strict IEEE compliance.
Optimized - Floating point operations may do all of the following:
Assume the arguments and result are not NaN. Optimizations are required to retain legal behavior over NaNs, but the value of the result is undefined.
Assume the arguments and result are not +/-Inf. Optimizations are required to retain legal behavior over +/-Inf, but the value of the result is undefined.
Treat the sign of a zero argument or result as insignificant.
Use the reciprocal of an argument rather than perform division.
Perform floating-point contraction (e.g. fusing a multiply followed by an addition into a fused multiply-add).
Perform algebraically equivalent transformations that may change results in floating point (e.g. reassociate).
This is equivalent to -ffast-math in GCC.
The floating point mode is inherited by child scopes, and can be overridden in any scope. You can set the floating point mode in a struct or module scope by using a comptime block.

FloatMode can be found with @import("std").builtin.FloatMode.

See also:

Floating Point Operations
@setRuntimeSafety 
@setRuntimeSafety(comptime safety_on: bool) void
Sets whether runtime safety checks are enabled for the scope that contains the function call.

test_setRuntimeSafety_builtin.zig
test "@setRuntimeSafety" {
    // The builtin applies to the scope that it is called in. So here, integer overflow
    // will not be caught in ReleaseFast and ReleaseSmall modes:
    // var x: u8 = 255;
    // x += 1; // Unchecked Illegal Behavior in ReleaseFast/ReleaseSmall modes.
    {
        // However this block has safety enabled, so safety checks happen here,
        // even in ReleaseFast and ReleaseSmall modes.
        @setRuntimeSafety(true);
        var x: u8 = 255;
        x += 1;

        {
            // The value can be overridden at any scope. So here integer overflow
            // would not be caught in any build mode.
            @setRuntimeSafety(false);
            // var x: u8 = 255;
            // x += 1; // Unchecked Illegal Behavior in all build modes.
        }
    }
}
Shell
$ zig test test_setRuntimeSafety_builtin.zig -OReleaseFast
1/1 test_setRuntimeSafety_builtin.test.@setRuntimeSafety...thread 3522332 panic: integer overflow
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_setRuntimeSafety_builtin.zig:11:11: 0x10362f8 in test.@setRuntimeSafety (test)
        x += 1;
          ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1030b82 in main (test)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x102f32d in posixCallMainAndExit (test)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x102f01d in _start (test)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/b88d578192c07164966e53e7013075b3/test --seed=0x4679a8bf
Note: it is planned to replace @setRuntimeSafety with @optimizeFor

@shlExact 
@shlExact(value: T, shift_amt: Log2T) T
Performs the left shift operation (<<). For unsigned integers, the result is undefined if any 1 bits are shifted out. For signed integers, the result is undefined if any bits that disagree with the resultant sign bit are shifted out.

The type of shift_amt is an unsigned integer with log2(@typeInfo(T).int.bits) bits. This is because shift_amt >= @typeInfo(T).int.bits triggers safety-checked Illegal Behavior.

comptime_int is modeled as an integer with an infinite number of bits, meaning that in such case, @shlExact always produces a result and cannot produce a compile error.

See also:

@shrExact
@shlWithOverflow
@shlWithOverflow 
@shlWithOverflow(a: anytype, shift_amt: Log2T) struct { @TypeOf(a), u1 }
Performs a << b and returns a tuple with the result and a possible overflow bit.

The type of shift_amt is an unsigned integer with log2(@typeInfo(@TypeOf(a)).int.bits) bits. This is because shift_amt >= @typeInfo(@TypeOf(a)).int.bits triggers safety-checked Illegal Behavior.

See also:

@shlExact
@shrExact
@shrExact 
@shrExact(value: T, shift_amt: Log2T) T
Performs the right shift operation (>>). Caller guarantees that the shift will not shift any 1 bits out.

The type of shift_amt is an unsigned integer with log2(@typeInfo(T).int.bits) bits. This is because shift_amt >= @typeInfo(T).int.bits triggers safety-checked Illegal Behavior.

See also:

@shlExact
@shlWithOverflow
@shuffle 
@shuffle(comptime E: type, a: @Vector(a_len, E), b: @Vector(b_len, E), comptime mask: @Vector(mask_len, i32)) @Vector(mask_len, E)
Constructs a new vector by selecting elements from a and b based on mask.

Each element in mask selects an element from either a or b. Positive numbers select from a starting at 0. Negative values select from b, starting at -1 and going down. It is recommended to use the ~ operator for indexes from b so that both indexes can start from 0 (i.e. ~@as(i32, 0) is -1).

For each element of mask, if it or the selected value from a or b is undefined, then the resulting element is undefined.

a_len and b_len may differ in length. Out-of-bounds element indexes in mask result in compile errors.

If a or b is undefined, it is equivalent to a vector of all undefined with the same length as the other vector. If both vectors are undefined, @shuffle returns a vector with all elements undefined.

E must be an integer, float, pointer, or bool. The mask may be any vector length, and its length determines the result length.

test_shuffle_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "vector @shuffle" {
    const a = @Vector(7, u8){ 'o', 'l', 'h', 'e', 'r', 'z', 'w' };
    const b = @Vector(4, u8){ 'w', 'd', '!', 'x' };

    // To shuffle within a single vector, pass undefined as the second argument.
    // Notice that we can re-order, duplicate, or omit elements of the input vector
    const mask1 = @Vector(5, i32){ 2, 3, 1, 1, 0 };
    const res1: @Vector(5, u8) = @shuffle(u8, a, undefined, mask1);
    try expect(std.mem.eql(u8, &@as([5]u8, res1), "hello"));

    // Combining two vectors
    const mask2 = @Vector(6, i32){ -1, 0, 4, 1, -2, -3 };
    const res2: @Vector(6, u8) = @shuffle(u8, a, b, mask2);
    try expect(std.mem.eql(u8, &@as([6]u8, res2), "world!"));
}
Shell
$ zig test test_shuffle_builtin.zig
1/1 test_shuffle_builtin.test.vector @shuffle...OK
All 1 tests passed.
See also:

Vectors
@sizeOf 
@sizeOf(comptime T: type) comptime_int
This function returns the number of bytes it takes to store T in memory. The result is a target-specific compile time constant.

This size may contain padding bytes. If there were two consecutive T in memory, the padding would be the offset in bytes between element at index 0 and the element at index 1. For integer, consider whether you want to use @sizeOf(T) or @typeInfo(T).int.bits.

This function measures the size at runtime. For types that are disallowed at runtime, such as comptime_int and type, the result is 0.

See also:

@bitSizeOf
@typeInfo
@splat 
@splat(scalar: anytype) anytype
Produces an array or vector where each element is the value scalar. The return type and thus the length of the vector is inferred.

test_splat_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "vector @splat" {
    const scalar: u32 = 5;
    const result: @Vector(4, u32) = @splat(scalar);
    try expect(std.mem.eql(u32, &@as([4]u32, result), &[_]u32{ 5, 5, 5, 5 }));
}

test "array @splat" {
    const scalar: u32 = 5;
    const result: [4]u32 = @splat(scalar);
    try expect(std.mem.eql(u32, &@as([4]u32, result), &[_]u32{ 5, 5, 5, 5 }));
}
Shell
$ zig test test_splat_builtin.zig
1/2 test_splat_builtin.test.vector @splat...OK
2/2 test_splat_builtin.test.array @splat...OK
All 2 tests passed.
scalar must be an integer, bool, float, or pointer.

See also:

Vectors
@shuffle
@reduce 
@reduce(comptime op: std.builtin.ReduceOp, value: anytype) E
Transforms a vector into a scalar value (of type E) by performing a sequential horizontal reduction of its elements using the specified operator op.

Not every operator is available for every vector element type:

Every operator is available for integer vectors.
.And, .Or, .Xor are additionally available for bool vectors,
.Min, .Max, .Add, .Mul are additionally available for floating point vectors,
Note that .Add and .Mul reductions on integral types are wrapping; when applied on floating point types the operation associativity is preserved, unless the float mode is set to Optimized.

test_reduce_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "vector @reduce" {
    const V = @Vector(4, i32);
    const value = V{ 1, -1, 1, -1 };
    const result = value > @as(V, @splat(0));
    // result is { true, false, true, false };
    try comptime expect(@TypeOf(result) == @Vector(4, bool));
    const is_all_true = @reduce(.And, result);
    try comptime expect(@TypeOf(is_all_true) == bool);
    try expect(is_all_true == false);
}
Shell
$ zig test test_reduce_builtin.zig
1/1 test_reduce_builtin.test.vector @reduce...OK
All 1 tests passed.
See also:

Vectors
@setFloatMode
@src 
@src() std.builtin.SourceLocation
Returns a SourceLocation struct representing the function's name and location in the source code. This must be called in a function.

test_src_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "@src" {
    try doTheTest();
}

fn doTheTest() !void {
    const src = @src();

    try expect(src.line == 9);
    try expect(src.column == 17);
    try expect(std.mem.endsWith(u8, src.fn_name, "doTheTest"));
    try expect(std.mem.endsWith(u8, src.file, "test_src_builtin.zig"));
}
Shell
$ zig test test_src_builtin.zig
1/1 test_src_builtin.test.@src...OK
All 1 tests passed.
@sqrt 
@sqrt(value: anytype) @TypeOf(value)
Performs the square root of a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@sin 
@sin(value: anytype) @TypeOf(value)
Sine trigonometric function on a floating point number in radians. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@cos 
@cos(value: anytype) @TypeOf(value)
Cosine trigonometric function on a floating point number in radians. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@tan 
@tan(value: anytype) @TypeOf(value)
Tangent trigonometric function on a floating point number in radians. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@exp 
@exp(value: anytype) @TypeOf(value)
Base-e exponential function on a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@exp2 
@exp2(value: anytype) @TypeOf(value)
Base-2 exponential function on a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@log 
@log(value: anytype) @TypeOf(value)
Returns the natural logarithm of a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@log2 
@log2(value: anytype) @TypeOf(value)
Returns the logarithm to the base 2 of a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@log10 
@log10(value: anytype) @TypeOf(value)
Returns the logarithm to the base 10 of a floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@abs 
@abs(value: anytype) anytype
Returns the absolute value of an integer or a floating point number. Uses a dedicated hardware instruction when available. The return type is always an unsigned integer of the same bit width as the operand if the operand is an integer. Unsigned integer operands are supported. The builtin cannot overflow for signed integer operands.

Supports Floats, Integers and Vectors of floats or integers.

@floor 
@floor(value: anytype) @TypeOf(value)
Returns the largest integral value not greater than the given floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@ceil 
@ceil(value: anytype) @TypeOf(value)
Returns the smallest integral value not less than the given floating point number. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@trunc 
@trunc(value: anytype) @TypeOf(value)
Rounds the given floating point number to an integer, towards zero. Uses a dedicated hardware instruction when available.

Supports Floats and Vectors of floats.

@round 
@round(value: anytype) @TypeOf(value)
Rounds the given floating point number to the nearest integer. If two integers are equally close, rounds away from zero. Uses a dedicated hardware instruction when available.

test_round_builtin.zig
const expect = @import("std").testing.expect;

test "@round" {
    try expect(@round(1.4) == 1);
    try expect(@round(1.5) == 2);
    try expect(@round(-1.4) == -1);
    try expect(@round(-2.5) == -3);
}
Shell
$ zig test test_round_builtin.zig
1/1 test_round_builtin.test.@round...OK
All 1 tests passed.
Supports Floats and Vectors of floats.

@subWithOverflow 
@subWithOverflow(a: anytype, b: anytype) struct { @TypeOf(a, b), u1 }
Performs a - b and returns a tuple with the result and a possible overflow bit.

@tagName 
@tagName(value: anytype) [:0]const u8
Converts an enum value or union value to a string literal representing the name.

If the enum is non-exhaustive and the tag value does not map to a name, it invokes safety-checked Illegal Behavior.

@This 
@This() type
Returns the innermost struct, enum, or union that this function call is inside. This can be useful for an anonymous struct that needs to refer to itself:

test_this_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "@This()" {
    var items = [_]i32{ 1, 2, 3, 4 };
    const list = List(i32){ .items = items[0..] };
    try expect(list.length() == 4);
}

fn List(comptime T: type) type {
    return struct {
        const Self = @This();

        items: []T,

        fn length(self: Self) usize {
            return self.items.len;
        }
    };
}
Shell
$ zig test test_this_builtin.zig
1/1 test_this_builtin.test.@This()...OK
All 1 tests passed.
When @This() is used at file scope, it returns a reference to the struct that corresponds to the current file.

@trap 
@trap() noreturn
This function inserts a platform-specific trap/jam instruction which can be used to exit the program abnormally. This may be implemented by explicitly emitting an invalid instruction which may cause an illegal instruction exception of some sort. Unlike for @breakpoint(), execution does not continue after this point.

Outside function scope, this builtin causes a compile error.

See also:

@breakpoint
@truncate 
@truncate(integer: anytype) anytype
This function truncates bits from an integer type, resulting in a smaller or same-sized integer type. The return type is the inferred result type.

This function always truncates the significant bits of the integer, regardless of endianness on the target platform.

Calling @truncate on a number out of range of the destination type is well defined and working code:

test_truncate_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "integer truncation" {
    const a: u16 = 0xabcd;
    const b: u8 = @truncate(a);
    try expect(b == 0xcd);
}
Shell
$ zig test test_truncate_builtin.zig
1/1 test_truncate_builtin.test.integer truncation...OK
All 1 tests passed.
Use @intCast to convert numbers guaranteed to fit the destination type.

@Type 
@Type(comptime info: std.builtin.Type) type
This function is the inverse of @typeInfo. It reifies type information into a type.

It is available for the following types:

type
noreturn
void
bool
Integers - The maximum bit count for an integer type is 65535.
Floats
Pointers
comptime_int
comptime_float
@TypeOf(undefined)
@TypeOf(null)
Arrays
Optionals
Error Set Type
Error Union Type
Vectors
opaque
anyframe
struct
enum
Enum Literals
union
Functions
@typeInfo 
@typeInfo(comptime T: type) std.builtin.Type
Provides type reflection.

Type information of structs, unions, enums, and error sets has fields which are guaranteed to be in the same order as appearance in the source file.

Type information of structs, unions, enums, and opaques has declarations, which are also guaranteed to be in the same order as appearance in the source file.

@typeName 
@typeName(T: type) *const [N:0]u8
This function returns the string representation of a type, as an array. It is equivalent to a string literal of the type name. The returned type name is fully qualified with the parent namespace included as part of the type name with a series of dots.

@TypeOf 
@TypeOf(...) type
@TypeOf is a special builtin function that takes any (non-zero) number of expressions as parameters and returns the type of the result, using Peer Type Resolution.

The expressions are evaluated, however they are guaranteed to have no runtime side-effects:

test_TypeOf_builtin.zig
const std = @import("std");
const expect = std.testing.expect;

test "no runtime side effects" {
    var data: i32 = 0;
    const T = @TypeOf(foo(i32, &data));
    try comptime expect(T == i32);
    try expect(data == 0);
}

fn foo(comptime T: type, ptr: *T) T {
    ptr.* += 1;
    return ptr.*;
}
Shell
$ zig test test_TypeOf_builtin.zig
1/1 test_TypeOf_builtin.test.no runtime side effects...OK
All 1 tests passed.
@unionInit 
@unionInit(comptime Union: type, comptime active_field_name: []const u8, init_expr) Union
This is the same thing as union initialization syntax, except that the field name is a comptime-known value rather than an identifier token.

@unionInit forwards its result location to init_expr.

@Vector 
@Vector(len: comptime_int, Element: type) type
Creates Vectors.

@volatileCast 
@volatileCast(value: anytype) DestType
Remove volatile qualifier from a pointer.

@workGroupId 
@workGroupId(comptime dimension: u32) u32
Returns the index of the work group in the current kernel invocation in dimension dimension.

@workGroupSize 
@workGroupSize(comptime dimension: u32) u32
Returns the number of work items that a work group has in dimension dimension.

@workItemId 
@workItemId(comptime dimension: u32) u32
Returns the index of the work item in the work group in dimension dimension. This function returns values between 0 (inclusive) and @workGroupSize(dimension) (exclusive).

Build Mode 
Zig has four build modes:

Debug (default)
ReleaseFast
ReleaseSafe
ReleaseSmall
To add standard build options to a build.zig file:

build.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const optimize = b.standardOptimizeOption(.{});
    const exe = b.addExecutable(.{
        .name = "example",
        .root_source_file = b.path("example.zig"),
        .optimize = optimize,
    });
    b.default_step.dependOn(&exe.step);
}
This causes these options to be available:

-Doptimize=Debug
Optimizations off and safety on (default)
-Doptimize=ReleaseSafe
Optimizations on and safety on
-Doptimize=ReleaseFast
Optimizations on and safety off
-Doptimize=ReleaseSmall
Size optimizations on and safety off
Debug 
Shell
$ zig build-exe example.zig
Fast compilation speed
Safety checks enabled
Slow runtime performance
Large binary size
No reproducible build requirement
ReleaseFast 
Shell
$ zig build-exe example.zig -O ReleaseFast
Fast runtime performance
Safety checks disabled
Slow compilation speed
Large binary size
Reproducible build
ReleaseSafe 
Shell
$ zig build-exe example.zig -O ReleaseSafe
Medium runtime performance
Safety checks enabled
Slow compilation speed
Large binary size
Reproducible build
ReleaseSmall 
Shell
$ zig build-exe example.zig -O ReleaseSmall
Medium runtime performance
Safety checks disabled
Slow compilation speed
Small binary size
Reproducible build
See also:

Compile Variables
Zig Build System
Illegal Behavior
Single Threaded Builds 
Zig has a compile option -fsingle-threaded which has the following effects:

All Thread Local Variables are treated as regular Container Level Variables.
The overhead of Async Functions becomes equivalent to function call overhead.
The @import("builtin").single_threaded becomes true and therefore various userland APIs which read this variable become more efficient. For example std.Mutex becomes an empty data structure and all of its functions become no-ops.
Illegal Behavior 
Many operations in Zig trigger what is known as "Illegal Behavior" (IB). If Illegal Behavior is detected at compile-time, Zig emits a compile error and refuses to continue. Otherwise, when Illegal Behavior is not caught at compile-time, it falls into one of two categories.

Some Illegal Behavior is safety-checked: this means that the compiler will insert "safety checks" anywhere that the Illegal Behavior may occur at runtime, to determine whether it is about to happen. If it is, the safety check "fails", which triggers a panic.

All other Illegal Behavior is unchecked, meaning the compiler is unable to insert safety checks for it. If Unchecked Illegal Behavior is invoked at runtime, anything can happen: usually that will be some kind of crash, but the optimizer is free to make Unchecked Illegal Behavior do anything, such as calling arbitrary functions or clobbering arbitrary data. This is similar to the concept of "undefined behavior" in some other languages. Note that Unchecked Illegal Behavior still always results in a compile error if evaluated at comptime, because the Zig compiler is able to perform more sophisticated checks at compile-time than at runtime.

Most Illegal Behavior is safety-checked. However, to facilitate optimizations, safety checks are disabled by default in the ReleaseFast and ReleaseSmall optimization modes. Safety checks can also be enabled or disabled on a per-block basis, overriding the default for the current optimization mode, using @setRuntimeSafety. When safety checks are disabled, Safety-Checked Illegal Behavior behaves like Unchecked Illegal Behavior; that is, any behavior may result from invoking it.

When a safety check fails, Zig's default panic handler crashes with a stack trace, like this:

test_illegal_behavior.zig
test "safety check" {
    unreachable;
}
Shell
$ zig test test_illegal_behavior.zig
1/1 test_illegal_behavior.test.safety check...thread 3521468 panic: reached unreachable code
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_illegal_behavior.zig:2:5: 0x102d00c in test.safety check (test_illegal_behavior.zig)
    unreachable;
    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:216:25: 0x1175d83 in mainTerminal (test_runner.zig)
        if (test_fn.func()) |_| {
                        ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/compiler/test_runner.zig:64:28: 0x116be27 in main (test_runner.zig)
        return mainTerminal();
                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1164f5d in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x1164833 in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
error: the following test command crashed:
/home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/0664fee98116754e7caccc13c16fedf6/test --seed=0x8ab6545a
Reaching Unreachable Code 
At compile-time:

test_comptime_reaching_unreachable.zig
comptime {
    assert(false);
}
fn assert(ok: bool) void {
    if (!ok) unreachable; // assertion failure
}
Shell
$ zig test test_comptime_reaching_unreachable.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_reaching_unreachable.zig:5:14: error: reached unreachable code
    if (!ok) unreachable; // assertion failure
             ^~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_reaching_unreachable.zig:2:11: note: called at comptime here
    assert(false);
    ~~~~~~^~~~~~~

At runtime:

runtime_reaching_unreachable.zig
const std = @import("std");

pub fn main() void {
    std.debug.assert(false);
}
Shell
$ zig build-exe runtime_reaching_unreachable.zig
$ ./runtime_reaching_unreachable
thread 3518357 panic: reached unreachable code
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/debug.zig:548:14: 0x10307c9 in assert (std.zig)
    if (!ok) unreachable; // assertion failure
             ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_reaching_unreachable.zig:4:21: 0x1153d11 in main (runtime_reaching_unreachable.zig)
    std.debug.assert(false);
                    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Index out of Bounds 
At compile-time:

test_comptime_index_out_of_bounds.zig
comptime {
    const array: [5]u8 = "hello".*;
    const garbage = array[5];
    _ = garbage;
}
Shell
$ zig test test_comptime_index_out_of_bounds.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_index_out_of_bounds.zig:3:27: error: index 5 outside array of length 5
    const garbage = array[5];
                          ^

At runtime:

runtime_index_out_of_bounds.zig
pub fn main() void {
    const x = foo("hello");
    _ = x;
}

fn foo(x: []const u8) u8 {
    return x[5];
}
Shell
$ zig build-exe runtime_index_out_of_bounds.zig
$ ./runtime_index_out_of_bounds
thread 3521671 panic: index out of bounds: index 5, len 5
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_index_out_of_bounds.zig:7:13: 0x1154f41 in foo (runtime_index_out_of_bounds.zig)
    return x[5];
            ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_index_out_of_bounds.zig:2:18: 0x1153d1d in main (runtime_index_out_of_bounds.zig)
    const x = foo("hello");
                 ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Cast Negative Number to Unsigned Integer 
At compile-time:

test_comptime_invalid_cast.zig
comptime {
    const value: i32 = -1;
    const unsigned: u32 = @intCast(value);
    _ = unsigned;
}
Shell
$ zig test test_comptime_invalid_cast.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_cast.zig:3:36: error: type 'u32' cannot represent integer value '-1'
    const unsigned: u32 = @intCast(value);
                                   ^~~~~

At runtime:

runtime_invalid_cast.zig
const std = @import("std");

pub fn main() void {
    var value: i32 = -1; // runtime-known
    _ = &value;
    const unsigned: u32 = @intCast(value);
    std.debug.print("value: {}\n", .{unsigned});
}
Shell
$ zig build-exe runtime_invalid_cast.zig
$ ./runtime_invalid_cast
thread 3521135 panic: integer does not fit in destination type
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_cast.zig:6:27: 0x1153d22 in main (runtime_invalid_cast.zig)
    const unsigned: u32 = @intCast(value);
                          ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
To obtain the maximum value of an unsigned integer, use std.math.maxInt.

Cast Truncates Data 
At compile-time:

test_comptime_invalid_cast_truncate.zig
comptime {
    const spartan_count: u16 = 300;
    const byte: u8 = @intCast(spartan_count);
    _ = byte;
}
Shell
$ zig test test_comptime_invalid_cast_truncate.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_cast_truncate.zig:3:31: error: type 'u8' cannot represent integer value '300'
    const byte: u8 = @intCast(spartan_count);
                              ^~~~~~~~~~~~~

At runtime:

runtime_invalid_cast_truncate.zig
const std = @import("std");

pub fn main() void {
    var spartan_count: u16 = 300; // runtime-known
    _ = &spartan_count;
    const byte: u8 = @intCast(spartan_count);
    std.debug.print("value: {}\n", .{byte});
}
Shell
$ zig build-exe runtime_invalid_cast_truncate.zig
$ ./runtime_invalid_cast_truncate
thread 3518251 panic: integer does not fit in destination type
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_cast_truncate.zig:6:22: 0x1153d23 in main (runtime_invalid_cast_truncate.zig)
    const byte: u8 = @intCast(spartan_count);
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
To truncate bits, use @truncate.

Integer Overflow 
Default Operations 
The following operators can cause integer overflow:

+ (addition)
- (subtraction)
- (negation)
* (multiplication)
/ (division)
@divTrunc (division)
@divFloor (division)
@divExact (division)
Example with addition at compile-time:

test_comptime_overflow.zig
comptime {
    var byte: u8 = 255;
    byte += 1;
}
Shell
$ zig test test_comptime_overflow.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_overflow.zig:3:10: error: overflow of integer type 'u8' with value '256'
    byte += 1;
    ~~~~~^~~~

At runtime:

runtime_overflow.zig
const std = @import("std");

pub fn main() void {
    var byte: u8 = 255;
    byte += 1;
    std.debug.print("value: {}\n", .{byte});
}
Shell
$ zig build-exe runtime_overflow.zig
$ ./runtime_overflow
thread 3520992 panic: integer overflow
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_overflow.zig:5:10: 0x1153d38 in main (runtime_overflow.zig)
    byte += 1;
         ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Standard Library Math Functions 
These functions provided by the standard library return possible errors.

@import("std").math.add
@import("std").math.sub
@import("std").math.mul
@import("std").math.divTrunc
@import("std").math.divFloor
@import("std").math.divExact
@import("std").math.shl
Example of catching an overflow for addition:

math_add.zig
const math = @import("std").math;
const print = @import("std").debug.print;
pub fn main() !void {
    var byte: u8 = 255;

    byte = if (math.add(u8, byte, 1)) |result| result else |err| {
        print("unable to add one: {s}\n", .{@errorName(err)});
        return err;
    };

    print("result: {}\n", .{byte});
}
Shell
$ zig build-exe math_add.zig
$ ./math_add
unable to add one: Overflow
error: Overflow
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/math.zig:568:21: 0x1154048 in add__anon_23202 (std.zig)
    if (ov[1] != 0) return error.Overflow;
                    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/math_add.zig:8:9: 0x1152905 in main (math_add.zig)
        return err;
        ^
Builtin Overflow Functions 
These builtins return a tuple containing whether there was an overflow (as a u1) and the possibly overflowed bits of the operation:

@addWithOverflow
@subWithOverflow
@mulWithOverflow
@shlWithOverflow
Example of @addWithOverflow:

addWithOverflow_builtin.zig
const print = @import("std").debug.print;
pub fn main() void {
    const byte: u8 = 255;

    const ov = @addWithOverflow(byte, 10);
    if (ov[1] != 0) {
        print("overflowed result: {}\n", .{ov[0]});
    } else {
        print("result: {}\n", .{ov[0]});
    }
}
Shell
$ zig build-exe addWithOverflow_builtin.zig
$ ./addWithOverflow_builtin
overflowed result: 9
Wrapping Operations 
These operations have guaranteed wraparound semantics.

+% (wraparound addition)
-% (wraparound subtraction)
-% (wraparound negation)
*% (wraparound multiplication)
test_wraparound_semantics.zig
const std = @import("std");
const expect = std.testing.expect;
const minInt = std.math.minInt;
const maxInt = std.math.maxInt;

test "wraparound addition and subtraction" {
    const x: i32 = maxInt(i32);
    const min_val = x +% 1;
    try expect(min_val == minInt(i32));
    const max_val = min_val -% 1;
    try expect(max_val == maxInt(i32));
}
Shell
$ zig test test_wraparound_semantics.zig
1/1 test_wraparound_semantics.test.wraparound addition and subtraction...OK
All 1 tests passed.
Exact Left Shift Overflow 
At compile-time:

test_comptime_shlExact_overwlow.zig
comptime {
    const x = @shlExact(@as(u8, 0b01010101), 2);
    _ = x;
}
Shell
$ zig test test_comptime_shlExact_overwlow.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_shlExact_overwlow.zig:2:15: error: operation caused overflow
    const x = @shlExact(@as(u8, 0b01010101), 2);
              ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

At runtime:

runtime_shlExact_overflow.zig
const std = @import("std");

pub fn main() void {
    var x: u8 = 0b01010101; // runtime-known
    _ = &x;
    const y = @shlExact(x, 2);
    std.debug.print("value: {}\n", .{y});
}
Shell
$ zig build-exe runtime_shlExact_overflow.zig
$ ./runtime_shlExact_overflow
thread 3520402 panic: left shift overflowed bits
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_shlExact_overflow.zig:6:5: 0x1153d44 in main (runtime_shlExact_overflow.zig)
    const y = @shlExact(x, 2);
    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Exact Right Shift Overflow 
At compile-time:

test_comptime_shrExact_overflow.zig
comptime {
    const x = @shrExact(@as(u8, 0b10101010), 2);
    _ = x;
}
Shell
$ zig test test_comptime_shrExact_overflow.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_shrExact_overflow.zig:2:15: error: exact shift shifted out 1 bits
    const x = @shrExact(@as(u8, 0b10101010), 2);
              ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

At runtime:

runtime_shrExact_overflow.zig
const std = @import("std");

pub fn main() void {
    var x: u8 = 0b10101010; // runtime-known
    _ = &x;
    const y = @shrExact(x, 2);
    std.debug.print("value: {}\n", .{y});
}
Shell
$ zig build-exe runtime_shrExact_overflow.zig
$ ./runtime_shrExact_overflow
thread 3521133 panic: right shift overflowed bits
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_shrExact_overflow.zig:6:5: 0x1153d2d in main (runtime_shrExact_overflow.zig)
    const y = @shrExact(x, 2);
    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Division by Zero 
At compile-time:

test_comptime_division_by_zero.zig
comptime {
    const a: i32 = 1;
    const b: i32 = 0;
    const c = a / b;
    _ = c;
}
Shell
$ zig test test_comptime_division_by_zero.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_division_by_zero.zig:4:19: error: division by zero here causes illegal behavior
    const c = a / b;
                  ^

At runtime:

runtime_division_by_zero.zig
const std = @import("std");

pub fn main() void {
    var a: u32 = 1;
    var b: u32 = 0;
    _ = .{ &a, &b };
    const c = a / b;
    std.debug.print("value: {}\n", .{c});
}
Shell
$ zig build-exe runtime_division_by_zero.zig
$ ./runtime_division_by_zero
thread 3518297 panic: division by zero
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_division_by_zero.zig:7:17: 0x1153d33 in main (runtime_division_by_zero.zig)
    const c = a / b;
                ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Remainder Division by Zero 
At compile-time:

test_comptime_remainder_division_by_zero.zig
comptime {
    const a: i32 = 10;
    const b: i32 = 0;
    const c = a % b;
    _ = c;
}
Shell
$ zig test test_comptime_remainder_division_by_zero.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_remainder_division_by_zero.zig:4:19: error: division by zero here causes illegal behavior
    const c = a % b;
                  ^

At runtime:

runtime_remainder_division_by_zero.zig
const std = @import("std");

pub fn main() void {
    var a: u32 = 10;
    var b: u32 = 0;
    _ = .{ &a, &b };
    const c = a % b;
    std.debug.print("value: {}\n", .{c});
}
Shell
$ zig build-exe runtime_remainder_division_by_zero.zig
$ ./runtime_remainder_division_by_zero
thread 3521949 panic: division by zero
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_remainder_division_by_zero.zig:7:17: 0x1153d33 in main (runtime_remainder_division_by_zero.zig)
    const c = a % b;
                ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Exact Division Remainder 
At compile-time:

test_comptime_divExact_remainder.zig
comptime {
    const a: u32 = 10;
    const b: u32 = 3;
    const c = @divExact(a, b);
    _ = c;
}
Shell
$ zig test test_comptime_divExact_remainder.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_divExact_remainder.zig:4:15: error: exact division produced remainder
    const c = @divExact(a, b);
              ^~~~~~~~~~~~~~~

At runtime:

runtime_divExact_remainder.zig
const std = @import("std");

pub fn main() void {
    var a: u32 = 10;
    var b: u32 = 3;
    _ = .{ &a, &b };
    const c = @divExact(a, b);
    std.debug.print("value: {}\n", .{c});
}
Shell
$ zig build-exe runtime_divExact_remainder.zig
$ ./runtime_divExact_remainder
thread 3521134 panic: exact division produced remainder
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_divExact_remainder.zig:7:15: 0x1153d6a in main (runtime_divExact_remainder.zig)
    const c = @divExact(a, b);
              ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Attempt to Unwrap Null 
At compile-time:

test_comptime_unwrap_null.zig
comptime {
    const optional_number: ?i32 = null;
    const number = optional_number.?;
    _ = number;
}
Shell
$ zig test test_comptime_unwrap_null.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_unwrap_null.zig:3:35: error: unable to unwrap null
    const number = optional_number.?;
                   ~~~~~~~~~~~~~~~^~

At runtime:

runtime_unwrap_null.zig
const std = @import("std");

pub fn main() void {
    var optional_number: ?i32 = null;
    _ = &optional_number;
    const number = optional_number.?;
    std.debug.print("value: {}\n", .{number});
}
Shell
$ zig build-exe runtime_unwrap_null.zig
$ ./runtime_unwrap_null
thread 3518111 panic: attempt to use null value
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_unwrap_null.zig:6:35: 0x1153d57 in main (runtime_unwrap_null.zig)
    const number = optional_number.?;
                                  ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
One way to avoid this crash is to test for null instead of assuming non-null, with the if expression:

testing_null_with_if.zig
const print = @import("std").debug.print;
pub fn main() void {
    const optional_number: ?i32 = null;

    if (optional_number) |number| {
        print("got number: {}\n", .{number});
    } else {
        print("it's null\n", .{});
    }
}
Shell
$ zig build-exe testing_null_with_if.zig
$ ./testing_null_with_if
it's null
See also:

Optionals
Attempt to Unwrap Error 
At compile-time:

test_comptime_unwrap_error.zig
comptime {
    const number = getNumberOrFail() catch unreachable;
    _ = number;
}

fn getNumberOrFail() !i32 {
    return error.UnableToReturnNumber;
}
Shell
$ zig test test_comptime_unwrap_error.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_unwrap_error.zig:2:44: error: caught unexpected error 'UnableToReturnNumber'
    const number = getNumberOrFail() catch unreachable;
                                           ^~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_unwrap_error.zig:7:18: note: error returned here
    return error.UnableToReturnNumber;
                 ^~~~~~~~~~~~~~~~~~~~

At runtime:

runtime_unwrap_error.zig
const std = @import("std");

pub fn main() void {
    const number = getNumberOrFail() catch unreachable;
    std.debug.print("value: {}\n", .{number});
}

fn getNumberOrFail() !i32 {
    return error.UnableToReturnNumber;
}
Shell
$ zig build-exe runtime_unwrap_error.zig
$ ./runtime_unwrap_error
thread 3519250 panic: attempt to unwrap error: UnableToReturnNumber
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_unwrap_error.zig:9:5: 0x1154d0f in getNumberOrFail (runtime_unwrap_error.zig)
    return error.UnableToReturnNumber;
    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_unwrap_error.zig:4:44: 0x1154d68 in main (runtime_unwrap_error.zig)
    const number = getNumberOrFail() catch unreachable;
                                           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1153f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115383a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
One way to avoid this crash is to test for an error instead of assuming a successful result, with the if expression:

testing_error_with_if.zig
const print = @import("std").debug.print;

pub fn main() void {
    const result = getNumberOrFail();

    if (result) |number| {
        print("got number: {}\n", .{number});
    } else |err| {
        print("got error: {s}\n", .{@errorName(err)});
    }
}

fn getNumberOrFail() !i32 {
    return error.UnableToReturnNumber;
}
Shell
$ zig build-exe testing_error_with_if.zig
$ ./testing_error_with_if
got error: UnableToReturnNumber
See also:

Errors
Invalid Error Code 
At compile-time:

test_comptime_invalid_error_code.zig
comptime {
    const err = error.AnError;
    const number = @intFromError(err) + 10;
    const invalid_err = @errorFromInt(number);
    _ = invalid_err;
}
Shell
$ zig test test_comptime_invalid_error_code.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_error_code.zig:4:39: error: integer value '11' represents no error
    const invalid_err = @errorFromInt(number);
                                      ^~~~~~

At runtime:

runtime_invalid_error_code.zig
const std = @import("std");

pub fn main() void {
    const err = error.AnError;
    var number = @intFromError(err) + 500;
    _ = &number;
    const invalid_err = @errorFromInt(number);
    std.debug.print("value: {}\n", .{invalid_err});
}
Shell
$ zig build-exe runtime_invalid_error_code.zig
$ ./runtime_invalid_error_code
thread 3520498 panic: invalid error code
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_error_code.zig:7:5: 0x1153d4a in main (runtime_invalid_error_code.zig)
    const invalid_err = @errorFromInt(number);
    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Invalid Enum Cast 
At compile-time:

test_comptime_invalid_enum_cast.zig
const Foo = enum {
    a,
    b,
    c,
};
comptime {
    const a: u2 = 3;
    const b: Foo = @enumFromInt(a);
    _ = b;
}
Shell
$ zig test test_comptime_invalid_enum_cast.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_enum_cast.zig:8:20: error: enum 'test_comptime_invalid_enum_cast.Foo' has no tag with value '3'
    const b: Foo = @enumFromInt(a);
                   ^~~~~~~~~~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_enum_cast.zig:1:13: note: enum declared here
const Foo = enum {
            ^~~~

At runtime:

runtime_invalid_enum_cast.zig
const std = @import("std");

const Foo = enum {
    a,
    b,
    c,
};

pub fn main() void {
    var a: u2 = 3;
    _ = &a;
    const b: Foo = @enumFromInt(a);
    std.debug.print("value: {s}\n", .{@tagName(b)});
}
Shell
$ zig build-exe runtime_invalid_enum_cast.zig
$ ./runtime_invalid_enum_cast
thread 3519406 panic: invalid enum value
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_enum_cast.zig:12:20: 0x1153d94 in main (runtime_invalid_enum_cast.zig)
    const b: Foo = @enumFromInt(a);
                   ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Invalid Error Set Cast 
At compile-time:

test_comptime_invalid_error_set_cast.zig
const Set1 = error{
    A,
    B,
};
const Set2 = error{
    A,
    C,
};
comptime {
    _ = @as(Set2, @errorCast(Set1.B));
}
Shell
$ zig test test_comptime_invalid_error_set_cast.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_error_set_cast.zig:10:19: error: 'error.B' not a member of error set 'error{A,C}'
    _ = @as(Set2, @errorCast(Set1.B));
                  ^~~~~~~~~~~~~~~~~~

At runtime:

runtime_invalid_error_set_cast.zig
const std = @import("std");

const Set1 = error{
    A,
    B,
};
const Set2 = error{
    A,
    C,
};
pub fn main() void {
    foo(Set1.B);
}
fn foo(set1: Set1) void {
    const x: Set2 = @errorCast(set1);
    std.debug.print("value: {}\n", .{x});
}
Shell
$ zig build-exe runtime_invalid_error_set_cast.zig
$ ./runtime_invalid_error_set_cast
thread 3519699 panic: invalid error code
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_error_set_cast.zig:15:21: 0x1155f9a in foo (runtime_invalid_error_set_cast.zig)
    const x: Set2 = @errorCast(set1);
                    ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_error_set_cast.zig:12:8: 0x1154d1a in main (runtime_invalid_error_set_cast.zig)
    foo(Set1.B);
       ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1153f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115383a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Incorrect Pointer Alignment 
At compile-time:

test_comptime_incorrect_pointer_alignment.zig
comptime {
    const ptr: *align(1) i32 = @ptrFromInt(0x1);
    const aligned: *align(4) i32 = @alignCast(ptr);
    _ = aligned;
}
Shell
$ zig test test_comptime_incorrect_pointer_alignment.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_incorrect_pointer_alignment.zig:3:47: error: pointer address 0x1 is not aligned to 4 bytes
    const aligned: *align(4) i32 = @alignCast(ptr);
                                              ^~~

At runtime:

runtime_incorrect_pointer_alignment.zig
const mem = @import("std").mem;
pub fn main() !void {
    var array align(4) = [_]u32{ 0x11111111, 0x11111111 };
    const bytes = mem.sliceAsBytes(array[0..]);
    if (foo(bytes) != 0x11111111) return error.Wrong;
}
fn foo(bytes: []u8) u32 {
    const slice4 = bytes[1..5];
    const int_slice = mem.bytesAsSlice(u32, @as([]align(4) u8, @alignCast(slice4)));
    return int_slice[0];
}
Shell
$ zig build-exe runtime_incorrect_pointer_alignment.zig
$ ./runtime_incorrect_pointer_alignment
thread 3519173 panic: incorrect alignment
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_incorrect_pointer_alignment.zig:9:64: 0x1154092 in foo (runtime_incorrect_pointer_alignment.zig)
    const int_slice = mem.bytesAsSlice(u32, @as([]align(4) u8, @alignCast(slice4)));
                                                               ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_incorrect_pointer_alignment.zig:5:12: 0x11528d5 in main (runtime_incorrect_pointer_alignment.zig)
    if (foo(bytes) != 0x11111111) return error.Wrong;
           ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:675:37: 0x1153065 in posixCallMainAndExit (std.zig)
            const result = root.main() catch |err| {
                                    ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Wrong Union Field Access 
At compile-time:

test_comptime_wrong_union_field_access.zig
comptime {
    var f = Foo{ .int = 42 };
    f.float = 12.34;
}

const Foo = union {
    float: f32,
    int: u32,
};
Shell
$ zig test test_comptime_wrong_union_field_access.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_wrong_union_field_access.zig:3:6: error: access of union field 'float' while field 'int' is active
    f.float = 12.34;
    ~^~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_wrong_union_field_access.zig:6:13: note: union declared here
const Foo = union {
            ^~~~~

At runtime:

runtime_wrong_union_field_access.zig
const std = @import("std");

const Foo = union {
    float: f32,
    int: u32,
};

pub fn main() void {
    var f = Foo{ .int = 42 };
    bar(&f);
}

fn bar(f: *Foo) void {
    f.float = 12.34;
    std.debug.print("value: {}\n", .{f.float});
}
Shell
$ zig build-exe runtime_wrong_union_field_access.zig
$ ./runtime_wrong_union_field_access
thread 3520106 panic: access of union field 'float' while field 'int' is active
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_wrong_union_field_access.zig:14:6: 0x1155f77 in bar (runtime_wrong_union_field_access.zig)
    f.float = 12.34;
     ^
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_wrong_union_field_access.zig:10:8: 0x1154d42 in main (runtime_wrong_union_field_access.zig)
    bar(&f);
       ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1153f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115383a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
This safety is not available for extern or packed unions.

To change the active field of a union, assign the entire union, like this:

change_active_union_field.zig
const std = @import("std");

const Foo = union {
    float: f32,
    int: u32,
};

pub fn main() void {
    var f = Foo{ .int = 42 };
    bar(&f);
}

fn bar(f: *Foo) void {
    f.* = Foo{ .float = 12.34 };
    std.debug.print("value: {}\n", .{f.float});
}
Shell
$ zig build-exe change_active_union_field.zig
$ ./change_active_union_field
value: 1.234e1
To change the active field of a union when a meaningful value for the field is not known, use undefined, like this:

undefined_active_union_field.zig
const std = @import("std");

const Foo = union {
    float: f32,
    int: u32,
};

pub fn main() void {
    var f = Foo{ .int = 42 };
    f = Foo{ .float = undefined };
    bar(&f);
    std.debug.print("value: {}\n", .{f.float});
}

fn bar(f: *Foo) void {
    f.float = 12.34;
}
Shell
$ zig build-exe undefined_active_union_field.zig
$ ./undefined_active_union_field
value: 1.234e1
See also:

union
extern union
Out of Bounds Float to Integer Cast 
This happens when casting a float to an integer where the float has a value outside the integer type's range.

At compile-time:

test_comptime_out_of_bounds_float_to_integer_cast.zig
comptime {
    const float: f32 = 4294967296;
    const int: i32 = @intFromFloat(float);
    _ = int;
}
Shell
$ zig test test_comptime_out_of_bounds_float_to_integer_cast.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_out_of_bounds_float_to_integer_cast.zig:3:36: error: float value '4294967296' cannot be stored in integer type 'i32'
    const int: i32 = @intFromFloat(float);
                                   ^~~~~

At runtime:

runtime_out_of_bounds_float_to_integer_cast.zig
pub fn main() void {
    var float: f32 = 4294967296; // runtime-known
    _ = &float;
    const int: i32 = @intFromFloat(float);
    _ = int;
}
Shell
$ zig build-exe runtime_out_of_bounds_float_to_integer_cast.zig
$ ./runtime_out_of_bounds_float_to_integer_cast
thread 3518374 panic: integer part of floating point value out of bounds
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_out_of_bounds_float_to_integer_cast.zig:4:22: 0x1153d8b in main (runtime_out_of_bounds_float_to_integer_cast.zig)
    const int: i32 = @intFromFloat(float);
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Pointer Cast Invalid Null 
This happens when casting a pointer with the address 0 to a pointer which may not have the address 0. For example, C Pointers, Optional Pointers, and allowzero pointers allow address zero, but normal Pointers do not.

At compile-time:

test_comptime_invalid_null_pointer_cast.zig
comptime {
    const opt_ptr: ?*i32 = null;
    const ptr: *i32 = @ptrCast(opt_ptr);
    _ = ptr;
}
Shell
$ zig test test_comptime_invalid_null_pointer_cast.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_comptime_invalid_null_pointer_cast.zig:3:32: error: null pointer casted to type '*i32'
    const ptr: *i32 = @ptrCast(opt_ptr);
                               ^~~~~~~

At runtime:

runtime_invalid_null_pointer_cast.zig
pub fn main() void {
    var opt_ptr: ?*i32 = null;
    _ = &opt_ptr;
    const ptr: *i32 = @ptrCast(opt_ptr);
    _ = ptr;
}
Shell
$ zig build-exe runtime_invalid_null_pointer_cast.zig
$ ./runtime_invalid_null_pointer_cast
thread 3522288 panic: cast causes pointer to be null
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/runtime_invalid_null_pointer_cast.zig:4:23: 0x1153d2d in main (runtime_invalid_null_pointer_cast.zig)
    const ptr: *i32 = @ptrCast(opt_ptr);
                      ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:666:22: 0x1152f64 in posixCallMainAndExit (std.zig)
            root.main();
                     ^
/home/ci/actions-runner/_work/zig-bootstrap/out/host/lib/zig/std/start.zig:286:5: 0x115283a in _start (std.zig)
    asm volatile (switch (native_arch) {
    ^
???:?:?: 0x0 in ??? (???)
(process terminated by signal)
Memory 
The Zig language performs no memory management on behalf of the programmer. This is why Zig has no runtime, and why Zig code works seamlessly in so many environments, including real-time software, operating system kernels, embedded devices, and low latency servers. As a consequence, Zig programmers must always be able to answer the question:

Where are the bytes?

Like Zig, the C programming language has manual memory management. However, unlike Zig, C has a default allocator - malloc, realloc, and free. When linking against libc, Zig exposes this allocator with std.heap.c_allocator. However, by convention, there is no default allocator in Zig. Instead, functions which need to allocate accept an Allocator parameter. Likewise, data structures such as std.ArrayList accept an Allocator parameter in their initialization functions:

test_allocator.zig
const std = @import("std");
const Allocator = std.mem.Allocator;
const expect = std.testing.expect;

test "using an allocator" {
    var buffer: [100]u8 = undefined;
    var fba = std.heap.FixedBufferAllocator.init(&buffer);
    const allocator = fba.allocator();
    const result = try concat(allocator, "foo", "bar");
    try expect(std.mem.eql(u8, "foobar", result));
}

fn concat(allocator: Allocator, a: []const u8, b: []const u8) ![]u8 {
    const result = try allocator.alloc(u8, a.len + b.len);
    @memcpy(result[0..a.len], a);
    @memcpy(result[a.len..], b);
    return result;
}
Shell
$ zig test test_allocator.zig
1/1 test_allocator.test.using an allocator...OK
All 1 tests passed.
In the above example, 100 bytes of stack memory are used to initialize a FixedBufferAllocator, which is then passed to a function. As a convenience there is a global FixedBufferAllocator available for quick tests at std.testing.allocator, which will also perform basic leak detection.

Zig has a general purpose allocator available to be imported with std.heap.GeneralPurposeAllocator. However, it is still recommended to follow the Choosing an Allocator guide.

Choosing an Allocator 
What allocator to use depends on a number of factors. Here is a flow chart to help you decide:

Are you making a library? In this case, best to accept an Allocator as a parameter and allow your library's users to decide what allocator to use.
Are you linking libc? In this case, std.heap.c_allocator is likely the right choice, at least for your main allocator.
Need to use the same allocator in multiple threads? Use one of your choice wrapped around std.heap.ThreadSafeAllocator
Is the maximum number of bytes that you will need bounded by a number known at comptime? In this case, use std.heap.FixedBufferAllocator.
Is your program a command line application which runs from start to end without any fundamental cyclical pattern (such as a video game main loop, or a web server request handler), such that it would make sense to free everything at once at the end? In this case, it is recommended to follow this pattern:
cli_allocation.zig
const std = @import("std");

pub fn main() !void {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();

    const allocator = arena.allocator();

    const ptr = try allocator.create(i32);
    std.debug.print("ptr={*}\n", .{ptr});
}
Shell
$ zig build-exe cli_allocation.zig
$ ./cli_allocation
ptr=i32@7f0e1b319010
When using this kind of allocator, there is no need to free anything manually. Everything gets freed at once with the call to arena.deinit().
Are the allocations part of a cyclical pattern such as a video game main loop, or a web server request handler? If the allocations can all be freed at once, at the end of the cycle, for example once the video game frame has been fully rendered, or the web server request has been served, then std.heap.ArenaAllocator is a great candidate. As demonstrated in the previous bullet point, this allows you to free entire arenas at once. Note also that if an upper bound of memory can be established, then std.heap.FixedBufferAllocator can be used as a further optimization.
Are you writing a test, and you want to make sure error.OutOfMemory is handled correctly? In this case, use std.testing.FailingAllocator.
Are you writing a test? In this case, use std.testing.allocator.
Finally, if none of the above apply, you need a general purpose allocator. Zig's general purpose allocator is available as a function that takes a comptime struct of configuration options and returns a type. Generally, you will set up one std.heap.GeneralPurposeAllocator in your main function, and then pass it or sub-allocators around to various parts of your application.
You can also consider Implementing an Allocator.
Where are the bytes? 
String literals such as "hello" are in the global constant data section. This is why it is an error to pass a string literal to a mutable slice, like this:

test_string_literal_to_slice.zig
fn foo(s: []u8) void {
    _ = s;
}

test "string literal to mutable slice" {
    foo("hello");
}
Shell
$ zig test test_string_literal_to_slice.zig
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_string_literal_to_slice.zig:6:9: error: expected type '[]u8', found '*const [5:0]u8'
    foo("hello");
        ^~~~~~~
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_string_literal_to_slice.zig:6:9: note: cast discards const qualifier
/home/ci/actions-runner/_work/zig-bootstrap/zig/doc/langref/test_string_literal_to_slice.zig:1:11: note: parameter type declared here
fn foo(s: []u8) void {
          ^~~~

However if you make the slice constant, then it works:

test_string_literal_to_const_slice.zig
fn foo(s: []const u8) void {
    _ = s;
}

test "string literal to constant slice" {
    foo("hello");
}
Shell
$ zig test test_string_literal_to_const_slice.zig
1/1 test_string_literal_to_const_slice.test.string literal to constant slice...OK
All 1 tests passed.
Just like string literals, const declarations, when the value is known at comptime, are stored in the global constant data section. Also Compile Time Variables are stored in the global constant data section.

var declarations inside functions are stored in the function's stack frame. Once a function returns, any Pointers to variables in the function's stack frame become invalid references, and dereferencing them becomes unchecked Illegal Behavior.

var declarations at the top level or in struct declarations are stored in the global data section.

The location of memory allocated with allocator.alloc or allocator.create is determined by the allocator's implementation.

TODO: thread local variables

Implementing an Allocator 
Zig programmers can implement their own allocators by fulfilling the Allocator interface. In order to do this one must read carefully the documentation comments in std/mem.zig and then supply a allocFn and a resizeFn.

There are many example allocators to look at for inspiration. Look at std/heap.zig and std.heap.GeneralPurposeAllocator.

Heap Allocation Failure 
Many programming languages choose to handle the possibility of heap allocation failure by unconditionally crashing. By convention, Zig programmers do not consider this to be a satisfactory solution. Instead, error.OutOfMemory represents heap allocation failure, and Zig libraries return this error code whenever heap allocation failure prevented an operation from completing successfully.

Some have argued that because some operating systems such as Linux have memory overcommit enabled by default, it is pointless to handle heap allocation failure. There are many problems with this reasoning:

Only some operating systems have an overcommit feature.
Linux has it enabled by default, but it is configurable.
Windows does not overcommit.
Embedded systems do not have overcommit.
Hobby operating systems may or may not have overcommit.
For real-time systems, not only is there no overcommit, but typically the maximum amount of memory per application is determined ahead of time.
When writing a library, one of the main goals is code reuse. By making code handle allocation failure correctly, a library becomes eligible to be reused in more contexts.
Although some software has grown to depend on overcommit being enabled, its existence is the source of countless user experience disasters. When a system with overcommit enabled, such as Linux on default settings, comes close to memory exhaustion, the system locks up and becomes unusable. At this point, the OOM Killer selects an application to kill based on heuristics. This non-deterministic decision often results in an important process being killed, and often fails to return the system back to working order.
Recursion 
Recursion is a fundamental tool in modeling software. However it has an often-overlooked problem: unbounded memory allocation.

Recursion is an area of active experimentation in Zig and so the documentation here is not final. You can read a summary of recursion status in the 0.3.0 release notes.

The short summary is that currently recursion works normally as you would expect. Although Zig code is not yet protected from stack overflow, it is planned that a future version of Zig will provide such protection, with some degree of cooperation from Zig code required.

Lifetime and Ownership 
It is the Zig programmer's responsibility to ensure that a pointer is not accessed when the memory pointed to is no longer available. Note that a slice is a form of pointer, in that it references other memory.

In order to prevent bugs, there are some helpful conventions to follow when dealing with pointers. In general, when a function returns a pointer, the documentation for the function should explain who "owns" the pointer. This concept helps the programmer decide when it is appropriate, if ever, to free the pointer.

For example, the function's documentation may say "caller owns the returned memory", in which case the code that calls the function must have a plan for when to free that memory. Probably in this situation, the function will accept an Allocator parameter.

Sometimes the lifetime of a pointer may be more complicated. For example, the std.ArrayList(T).items slice has a lifetime that remains valid until the next time the list is resized, such as by appending new elements.

The API documentation for functions and data structures should take great care to explain the ownership and lifetime semantics of pointers. Ownership determines whose responsibility it is to free the memory referenced by the pointer, and lifetime determines the point at which the memory becomes inaccessible (lest Illegal Behavior occur).

Compile Variables 
Compile variables are accessible by importing the "builtin" package, which the compiler makes available to every Zig source file. It contains compile-time constants such as the current target, endianness, and release mode.

compile_variables.zig
const builtin = @import("builtin");
const separator = if (builtin.os.tag == .windows) '\\' else '/';
Example of what is imported with @import("builtin"):

@import("builtin")
const std = @import("std");
/// Zig version. When writing code that supports multiple versions of Zig, prefer
/// feature detection (i.e. with `@hasDecl` or `@hasField`) over version checks.
pub const zig_version = std.SemanticVersion.parse(zig_version_string) catch unreachable;
pub const zig_version_string = "0.15.0-dev.764+2e3154428";
pub const zig_backend = std.builtin.CompilerBackend.stage2_x86_64;

pub const output_mode: std.builtin.OutputMode = .Exe;
pub const link_mode: std.builtin.LinkMode = .static;
pub const unwind_tables: std.builtin.UnwindTables = .@"async";
pub const is_test = false;
pub const single_threaded = false;
pub const abi: std.Target.Abi = .gnu;
pub const cpu: std.Target.Cpu = .{
    .arch = .x86_64,
    .model = &std.Target.x86.cpu.znver2,
    .features = std.Target.x86.featureSet(&.{
        .@"64bit",
        .adx,
        .aes,
        .allow_light_256_bit,
        .avx,
        .avx2,
        .bmi,
        .bmi2,
        .branchfusion,
        .clflushopt,
        .clwb,
        .clzero,
        .cmov,
        .crc32,
        .cx16,
        .cx8,
        .f16c,
        .fast_15bytenop,
        .fast_bextr,
        .fast_imm16,
        .fast_lzcnt,
        .fast_movbe,
        .fast_scalar_fsqrt,
        .fast_scalar_shift_masks,
        .fast_variable_perlane_shuffle,
        .fast_vector_fsqrt,
        .fma,
        .fsgsbase,
        .fxsr,
        .idivq_to_divl,
        .lzcnt,
        .mmx,
        .movbe,
        .mwaitx,
        .nopl,
        .pclmul,
        .popcnt,
        .prfchw,
        .rdpid,
        .rdpru,
        .rdrnd,
        .rdseed,
        .sahf,
        .sbb_dep_breaking,
        .sha,
        .slow_shld,
        .smap,
        .smep,
        .sse,
        .sse2,
        .sse3,
        .sse4_1,
        .sse4_2,
        .sse4a,
        .ssse3,
        .vzeroupper,
        .wbnoinvd,
        .x87,
        .xsave,
        .xsavec,
        .xsaveopt,
        .xsaves,
    }),
};
pub const os: std.Target.Os = .{
    .tag = .linux,
    .version_range = .{ .linux = .{
        .range = .{
            .min = .{
                .major = 5,
                .minor = 10,
                .patch = 0,
            },
            .max = .{
                .major = 5,
                .minor = 10,
                .patch = 0,
            },
        },
        .glibc = .{
            .major = 2,
            .minor = 31,
            .patch = 0,
        },
        .android = 24,
    }},
};
pub const target: std.Target = .{
    .cpu = cpu,
    .os = os,
    .abi = abi,
    .ofmt = object_format,
    .dynamic_linker = .init("/lib64/ld-linux-x86-64.so.2"),
};
pub const object_format: std.Target.ObjectFormat = .elf;
pub const mode: std.builtin.OptimizeMode = .Debug;
pub const link_libc = false;
pub const link_libcpp = false;
pub const have_error_return_tracing = true;
pub const valgrind_support = true;
pub const sanitize_thread = false;
pub const fuzz = false;
pub const position_independent_code = false;
pub const position_independent_executable = false;
pub const strip_debug_info = false;
pub const code_model: std.builtin.CodeModel = .default;
pub const omit_frame_pointer = false;
See also:

Build Mode
Compilation Model 
A Zig compilation is separated into modules. Each module is a collection of Zig source files, one of which is the module's root source file. Each module can depend on any number of other modules, forming a directed graph (dependency loops between modules are allowed). If module A depends on module B, then any Zig source file in module A can import the root source file of module B using @import with the module's name. In essence, a module acts as an alias to import a Zig source file (which might exist in a completely separate part of the filesystem).

A simple Zig program compiled with zig build-exe has two key modules: the one containing your code, known as the "main" or "root" module, and the standard library. Your module depends on the standard library module under the name "std", which is what allows you to write @import("std")! In fact, every single module in a Zig compilation — including the standard library itself — implicitly depends on the standard library module under the name "std".

The "root module" (the one provided by you in the zig build-exe example) has a special property. Like the standard library, it is implicitly made available to all modules (including itself), this time under the name "root". So, @import("root") will always be equivalent to @import of your "main" source file (often, but not necessarily, named main.zig).

Source File Structs 
Every Zig source file is implicitly a struct declaration; you can imagine that the file's contents are literally surrounded by struct { ... }. This means that as well as declarations, the top level of a file is permitted to contain fields:

TopLevelFields.zig
//! Because this file contains fields, it is a type which is intended to be instantiated, and so
//! is named in TitleCase instead of snake_case by convention.

foo: u32,
bar: u64,

/// `@This()` can be used to refer to this struct type. In files with fields, it is quite common to
/// name the type here, so it can be easily referenced by other declarations in this file.
const TopLevelFields = @This();

pub fn init(val: u32) TopLevelFields {
    return .{
        .foo = val,
        .bar = val * 10,
    };
}
Such files can be instantiated just like any other struct type. A file's "root struct type" can be referred to within that file using @This.

File and Declaration Discovery 
Zig places importance on the concept of whether any piece of code is semantically analyzed; in essence, whether the compiler "looks at" it. What code is analyzed is based on what files and declarations are "discovered" from a certain point. This process of "discovery" is based on a simple set of recursive rules:

If a call to @import is analyzed, the file being imported is analyzed.
If a type (including a file) is analyzed, all comptime, usingnamespace, and export declarations within it are analyzed.
If a type (including a file) is analyzed, and the compilation is for a test, and the module the type is within is the root module of the compilation, then all test declarations within it are also analyzed.
If a reference to a named declaration (i.e. a usage of it) is analyzed, the declaration being referenced is analyzed. Declarations are order-independent, so this reference may be above or below the declaration being referenced, or even in another file entirely.
That's it! Those rules define how Zig files and declarations are discovered. All that remains is to understand where this process starts.

The answer to that is the root of the standard library: every Zig compilation begins by analyzing the file lib/std/std.zig. This file contains a comptime declaration which imports lib/std/start.zig, and that file in turn uses @import("root") to reference the "root module"; so, the file you provide as your main module's root source file is effectively also a root, because the standard library will always reference it.

It is often desirable to make sure that certain declarations — particularly test or export declarations — are discovered. Based on the above rules, a common strategy for this is to use @import within a comptime or test block:

force_file_discovery.zig
comptime {
    // This will ensure that the file 'api.zig' is always discovered (as long as this file is discovered).
    // It is useful if 'api.zig' contains important exported declarations.
    _ = @import("api.zig");

    // We could also have a file which contains declarations we only want to export depending on a comptime
    // condition. In that case, we can use an `if` statement here:
    if (builtin.os.tag == .windows) {
        _ = @import("windows_api.zig");
    }
}

test {
    // This will ensure that the file 'tests.zig' is always discovered (as long as this file is discovered),
    // if this compilation is a test. It is useful if 'tests.zig' contains tests we want to ensure are run.
    _ = @import("tests.zig");

    // We could also have a file which contains tests we only want to run depending on a comptime condition.
    // In that case, we can use an `if` statement here:
    if (builtin.os.tag == .windows) {
        _ = @import("windows_tests.zig");
    }
}

const builtin = @import("builtin");
Special Root Declarations 
Because the root module's root source file is always accessible using @import("root"), is is sometimes used by libraries — including the Zig Standard Library — as a place for the program to expose some "global" information to that library. The Zig Standard Library will look for several declarations in this file.

Entry Point 
When building an executable, the most important thing to be looked up in this file is the program's entry point. Most commonly, this is a function named main, which std.start will call just after performing important initialization work.

Alternatively, the presence of a declaration named _start (for instance, pub const _start = {};) will disable the default std.start logic, allowing your root source file to export a low-level entry point as needed.

entry_point.zig
/// `std.start` imports this file using `@import("root")`, and uses this declaration as the program's
/// user-provided entry point. It can return any of the following types:
/// * `void`
/// * `E!void`, for any error set `E`
/// * `u8`
/// * `E!u8`, for any error set `E`
/// Returning a `void` value from this function will exit with code 0.
/// Returning a `u8` value from this function will exit with the given status code.
/// Returning an error value from this function will print an Error Return Trace and exit with code 1.
pub fn main() void {
    std.debug.print("Hello, World!\n", .{});
}

// If uncommented, this declaration would suppress the usual std.start logic, causing
// the `main` declaration above to be ignored.
//pub const _start = {};

const std = @import("std");
Shell
$ zig build-exe entry_point.zig
$ ./entry_point
Hello, World!
If the Zig compilation links libc, the main function can optionally be an export fn which matches the signature of the C main function:

libc_export_entry_point.zig
pub export fn main(argc: c_int, argv: [*]const [*:0]const u8) c_int {
    const args = argv[0..@intCast(argc)];
    std.debug.print("Hello! argv[0] is '{s}'\n", .{args[0]});
    return 0;
}

const std = @import("std");
Shell
$ zig build-exe libc_export_entry_point.zig -lc
$ ./libc_export_entry_point
Hello! argv[0] is './libc_export_entry_point'
std.start may also use other entry point declarations in certain situations, such as wWinMain or EfiMain. Refer to the lib/std/start.zig logic for details of these declarations.

Standard Library Options 
The standard library also looks for a declaration in the root module's root source file named std_options. If present, this declaration is expected to be a struct of type std.Options, and allows the program to customize some standard library functionality, such as the std.log implementation.

std_options.zig
/// The presence of this declaration allows the program to override certain behaviors of the standard library.
/// For a full list of available options, see the documentation for `std.Options`.
pub const std_options: std.Options = .{
    // By default, in safe build modes, the standard library will attach a segfault handler to the program to
    // print a helpful stack trace if a segmentation fault occurs. Here, we can disable this, or even enable
    // it in unsafe build modes.
    .enable_segfault_handler = true,
    // This is the logging function used by `std.log`.
    .logFn = myLogFn,
};

fn myLogFn(
    comptime level: std.log.Level,
    comptime scope: @Type(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    // We could do anything we want here!
    // ...but actually, let's just call the default implementation.
    std.log.defaultLog(level, scope, format, args);
}

const std = @import("std");
Panic Handler 
The Zig Standard Library looks for a declaration named panic in the root module's root source file. If present, it is expected to be a namespace (container type) with declarations providing different panic handlers.

See std.debug.simple_panic for a basic implementation of this namespace.

Overriding how the panic handler actually outputs messages, but keeping the formatted safety panics which are enabled by default, can be easily achieved with std.debug.FullPanic:

panic_handler.zig
pub fn main() void {
    @setRuntimeSafety(true);
    var x: u8 = 255;
    // Let's overflow this integer!
    x += 1;
}

pub const panic = std.debug.FullPanic(myPanic);

fn myPanic(msg: []const u8, first_trace_addr: ?usize) noreturn {
    _ = first_trace_addr;
    std.debug.print("Panic! {s}\n", .{msg});
    std.process.exit(1);
}

const std = @import("std");
Shell
$ zig build-exe panic_handler.zig
$ ./panic_handler
Panic! integer overflow
Zig Build System 
The Zig Build System provides a cross-platform, dependency-free way to declare the logic required to build a project. With this system, the logic to build a project is written in a build.zig file, using the Zig Build System API to declare and configure build artifacts and other tasks.

Some examples of tasks the build system can help with:

Performing tasks in parallel and caching the results.
Depending on other projects.
Providing a package for other projects to depend on.
Creating build artifacts by executing the Zig compiler. This includes building Zig source code as well as C and C++ source code.
Capturing user-configured options and using those options to configure the build.
Surfacing build configuration as comptime values by providing a file that can be imported by Zig code.
Caching build artifacts to avoid unnecessarily repeating steps.
Executing build artifacts or system-installed tools.
Running tests and verifying the output of executing a build artifact matches the expected value.
Running zig fmt on a codebase or a subset of it.
Custom tasks.
To use the build system, run zig build --help to see a command-line usage help menu. This will include project-specific options that were declared in the build.zig script.

For the time being, the build system documentation is hosted externally: Build System Documentation

C 
Although Zig is independent of C, and, unlike most other languages, does not depend on libc, Zig acknowledges the importance of interacting with existing C code.

There are a few ways that Zig facilitates C interop.

C Type Primitives 
These have guaranteed C ABI compatibility and can be used like any other type.

c_char
c_short
c_ushort
c_int
c_uint
c_long
c_ulong
c_longlong
c_ulonglong
c_longdouble
To interop with the C void type, use anyopaque.

See also:

Primitive Types
Import from C Header File 
The @cImport builtin function can be used to directly import symbols from .h files:

cImport_builtin.zig
const c = @cImport({
    // See https://github.com/ziglang/zig/issues/515
    @cDefine("_NO_CRT_STDIO_INLINE", "1");
    @cInclude("stdio.h");
});
pub fn main() void {
    _ = c.printf("hello\n");
}
Shell
$ zig build-exe cImport_builtin.zig -lc
$ ./cImport_builtin
hello
The @cImport function takes an expression as a parameter. This expression is evaluated at compile-time and is used to control preprocessor directives and include multiple .h files:

@cImport Expression
const builtin = @import("builtin");

const c = @cImport({
    @cDefine("NDEBUG", builtin.mode == .ReleaseFast);
    if (something) {
        @cDefine("_GNU_SOURCE", {});
    }
    @cInclude("stdlib.h");
    if (something) {
        @cUndef("_GNU_SOURCE");
    }
    @cInclude("soundio.h");
});
See also:

@cImport
@cInclude
@cDefine
@cUndef
@import
C Translation CLI 
Zig's C translation capability is available as a CLI tool via zig translate-c. It requires a single filename as an argument. It may also take a set of optional flags that are forwarded to clang. It writes the translated file to stdout.

Command line flags 
-I: Specify a search directory for include files. May be used multiple times. Equivalent to clang's -I flag. The current directory is not included by default; use -I. to include it.
-D: Define a preprocessor macro. Equivalent to clang's -D flag.
-cflags [flags] --: Pass arbitrary additional command line flags to clang. Note: the list of flags must end with --
-target: The target triple for the translated Zig code. If no target is specified, the current host target will be used.
Using -target and -cflags 
Important! When translating C code with zig translate-c, you must use the same -target triple that you will use when compiling the translated code. In addition, you must ensure that the -cflags used, if any, match the cflags used by code on the target system. Using the incorrect -target or -cflags could result in clang or Zig parse failures, or subtle ABI incompatibilities when linking with C code.

varytarget.h
long FOO = __LONG_MAX__;
Shell
$ zig translate-c -target thumb-freestanding-gnueabihf varytarget.h|grep FOO
pub export var FOO: c_long = 2147483647;
$ zig translate-c -target x86_64-macos-gnu varytarget.h|grep FOO
pub export var FOO: c_long = 9223372036854775807;
varycflags.h
enum FOO { BAR };
int do_something(enum FOO foo);
Shell
$ zig translate-c varycflags.h|grep -B1 do_something
pub const enum_FOO = c_uint;
pub extern fn do_something(foo: enum_FOO) c_int;
$ zig translate-c -cflags -fshort-enums -- varycflags.h|grep -B1 do_something
pub const enum_FOO = u8;
pub extern fn do_something(foo: enum_FOO) c_int;
@cImport vs translate-c 
@cImport and zig translate-c use the same underlying C translation functionality, so on a technical level they are equivalent. In practice, @cImport is useful as a way to quickly and easily access numeric constants, typedefs, and record types without needing any extra setup. If you need to pass cflags to clang, or if you would like to edit the translated code, it is recommended to use zig translate-c and save the results to a file. Common reasons for editing the generated code include: changing anytype parameters in function-like macros to more specific types; changing [*c]T pointers to [*]T or *T pointers for improved type safety; and enabling or disabling runtime safety within specific functions.

See also:

Targets
C Type Primitives
Pointers
C Pointers
Import from C Header File
@cInclude
@cImport
@setRuntimeSafety
C Translation Caching 
The C translation feature (whether used via zig translate-c or @cImport) integrates with the Zig caching system. Subsequent runs with the same source file, target, and cflags will use the cache instead of repeatedly translating the same code.

To see where the cached files are stored when compiling code that uses @cImport, use the --verbose-cimport flag:

verbose_cimport_flag.zig
const c = @cImport({
    @cDefine("_NO_CRT_STDIO_INLINE", "1");
    @cInclude("stdio.h");
});
pub fn main() void {
    _ = c;
}
Shell
$ zig build-exe verbose_cimport_flag.zig -lc --verbose-cimport
info(compilation): C import source: /home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/a9dade369e12a8c90b55d7f3e444f0ce/cimport.h
info(compilation): C import .d file: /home/ci/actions-runner/_work/zig-bootstrap/out/zig-local-cache/o/a9dade369e12a8c90b55d7f3e444f0ce/cimport.h.d
$ ./verbose_cimport_flag
cimport.h contains the file to translate (constructed from calls to @cInclude, @cDefine, and @cUndef), cimport.h.d is the list of file dependencies, and cimport.zig contains the translated output.

See also:

Import from C Header File
C Translation CLI
@cInclude
@cImport
Translation failures 
Some C constructs cannot be translated to Zig - for example, goto, structs with bitfields, and token-pasting macros. Zig employs demotion to allow translation to continue in the face of non-translatable entities.

Demotion comes in three varieties - opaque, extern, and @compileError. C structs and unions that cannot be translated correctly will be translated as opaque{}. Functions that contain opaque types or code constructs that cannot be translated will be demoted to extern declarations. Thus, non-translatable types can still be used as pointers, and non-translatable functions can be called so long as the linker is aware of the compiled function.

@compileError is used when top-level definitions (global variables, function prototypes, macros) cannot be translated or demoted. Since Zig uses lazy analysis for top-level declarations, untranslatable entities will not cause a compile error in your code unless you actually use them.

See also:

opaque
extern
@compileError
C Macros 
C Translation makes a best-effort attempt to translate function-like macros into equivalent Zig functions. Since C macros operate at the level of lexical tokens, not all C macros can be translated to Zig. Macros that cannot be translated will be demoted to @compileError. Note that C code which uses macros will be translated without any additional issues (since Zig operates on the pre-processed source with macros expanded). It is merely the macros themselves which may not be translatable to Zig.

Consider the following example:

macro.c
#define MAKELOCAL(NAME, INIT) int NAME = INIT
int foo(void) {
   MAKELOCAL(a, 1);
   MAKELOCAL(b, 2);
   return a + b;
}
Shell
$ zig translate-c macro.c > macro.zig
macro.zig
pub export fn foo() c_int {
    var a: c_int = 1;
    _ = &a;
    var b: c_int = 2;
    _ = &b;
    return a + b;
}
pub const MAKELOCAL = @compileError("unable to translate C expr: unexpected token .Equal"); // macro.c:1:9
Note that foo was translated correctly despite using a non-translatable macro. MAKELOCAL was demoted to @compileError since it cannot be expressed as a Zig function; this simply means that you cannot directly use MAKELOCAL from Zig.

See also:

@compileError
C Pointers 
This type is to be avoided whenever possible. The only valid reason for using a C pointer is in auto-generated code from translating C code.

When importing C header files, it is ambiguous whether pointers should be translated as single-item pointers (*T) or many-item pointers ([*]T). C pointers are a compromise so that Zig code can utilize translated header files directly.

[*c]T - C pointer.

Supports all the syntax of the other two pointer types (*T) and ([*]T).
Coerces to other pointer types, as well as Optional Pointers. When a C pointer is coerced to a non-optional pointer, safety-checked Illegal Behavior occurs if the address is 0.
Allows address 0. On non-freestanding targets, dereferencing address 0 is safety-checked Illegal Behavior. Optional C pointers introduce another bit to keep track of null, just like ?usize. Note that creating an optional C pointer is unnecessary as one can use normal Optional Pointers.
Supports Type Coercion to and from integers.
Supports comparison with integers.
Does not support Zig-only pointer attributes such as alignment. Use normal Pointers please!
When a C pointer is pointing to a single struct (not an array), dereference the C pointer to access the struct's fields or member data. That syntax looks like this:

ptr_to_struct.*.struct_member

This is comparable to doing -> in C.

When a C pointer is pointing to an array of structs, the syntax reverts to this:

ptr_to_struct_array[index].struct_member

C Variadic Functions 
Zig supports extern variadic functions.

test_variadic_function.zig
const std = @import("std");
const testing = std.testing;

pub extern "c" fn printf(format: [*:0]const u8, ...) c_int;

test "variadic function" {
    try testing.expect(printf("Hello, world!\n") == 14);
    try testing.expect(@typeInfo(@TypeOf(printf)).@"fn".is_var_args);
}
Shell
$ zig test test_variadic_function.zig -lc
1/1 test_variadic_function.test.variadic function...OK
All 1 tests passed.
Hello, world!
Variadic functions can be implemented using @cVaStart, @cVaEnd, @cVaArg and @cVaCopy.

test_defining_variadic_function.zig
const std = @import("std");
const testing = std.testing;
const builtin = @import("builtin");

fn add(count: c_int, ...) callconv(.c) c_int {
    var ap = @cVaStart();
    defer @cVaEnd(&ap);
    var i: usize = 0;
    var sum: c_int = 0;
    while (i < count) : (i += 1) {
        sum += @cVaArg(&ap, c_int);
    }
    return sum;
}

test "defining a variadic function" {
    if (builtin.cpu.arch == .aarch64 and builtin.os.tag != .macos) {
        // https://github.com/ziglang/zig/issues/14096
        return error.SkipZigTest;
    }
    if (builtin.cpu.arch == .x86_64 and builtin.os.tag == .windows) {
        // https://github.com/ziglang/zig/issues/16961
        return error.SkipZigTest;
    }

    try std.testing.expectEqual(@as(c_int, 0), add(0));
    try std.testing.expectEqual(@as(c_int, 1), add(1, @as(c_int, 1)));
    try std.testing.expectEqual(@as(c_int, 3), add(2, @as(c_int, 1), @as(c_int, 2)));
}
Shell
$ zig test test_defining_variadic_function.zig
1/1 test_defining_variadic_function.test.defining a variadic function...OK
All 1 tests passed.
Exporting a C Library 
One of the primary use cases for Zig is exporting a library with the C ABI for other programming languages to call into. The export keyword in front of functions, variables, and types causes them to be part of the library API:

mathtest.zig
export fn add(a: i32, b: i32) i32 {
    return a + b;
}
To make a static library:

Shell
$ zig build-lib mathtest.zig
To make a shared library:

Shell
$ zig build-lib mathtest.zig -dynamic
Here is an example with the Zig Build System:

test.c
// This header is generated by zig from mathtest.zig
#include "mathtest.h"
#include <stdio.h>

int main(int argc, char **argv) {
    int32_t result = add(42, 1337);
    printf("%d\n", result);
    return 0;
}
build_c.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const lib = b.addSharedLibrary(.{
        .name = "mathtest",
        .root_source_file = b.path("mathtest.zig"),
        .version = .{ .major = 1, .minor = 0, .patch = 0 },
    });
    const exe = b.addExecutable(.{
        .name = "test",
    });
    exe.addCSourceFile(.{ .file = b.path("test.c"), .flags = &.{"-std=c99"} });
    exe.linkLibrary(lib);
    exe.linkSystemLibrary("c");

    b.default_step.dependOn(&exe.step);

    const run_cmd = exe.run();

    const test_step = b.step("test", "Test the program");
    test_step.dependOn(&run_cmd.step);
}
Shell
$ zig build test
1379
See also:

export
Mixing Object Files 
You can mix Zig object files with any other object files that respect the C ABI. Example:

base64.zig
const base64 = @import("std").base64;

export fn decode_base_64(
    dest_ptr: [*]u8,
    dest_len: usize,
    source_ptr: [*]const u8,
    source_len: usize,
) usize {
    const src = source_ptr[0..source_len];
    const dest = dest_ptr[0..dest_len];
    const base64_decoder = base64.standard.Decoder;
    const decoded_size = base64_decoder.calcSizeForSlice(src) catch unreachable;
    base64_decoder.decode(dest[0..decoded_size], src) catch unreachable;
    return decoded_size;
}
test.c
// This header is generated by zig from base64.zig
#include "base64.h"

#include <string.h>
#include <stdio.h>

int main(int argc, char **argv) {
    const char *encoded = "YWxsIHlvdXIgYmFzZSBhcmUgYmVsb25nIHRvIHVz";
    char buf[200];

    size_t len = decode_base_64(buf, 200, encoded, strlen(encoded));
    buf[len] = 0;
    puts(buf);

    return 0;
}
build_object.zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const obj = b.addObject(.{
        .name = "base64",
        .root_source_file = b.path("base64.zig"),
    });

    const exe = b.addExecutable(.{
        .name = "test",
    });
    exe.addCSourceFile(.{ .file = b.path("test.c"), .flags = &.{"-std=c99"} });
    exe.addObject(obj);
    exe.linkSystemLibrary("c");
    b.installArtifact(exe);
}
Shell
$ zig build
$ ./zig-out/bin/test
all your base are belong to us
See also:

Targets
Zig Build System
WebAssembly 
Zig supports building for WebAssembly out of the box.

Freestanding 
For host environments like the web browser and nodejs, build as an executable using the freestanding OS target. Here's an example of running Zig code compiled to WebAssembly with nodejs.

math.zig
extern fn print(i32) void;

export fn add(a: i32, b: i32) void {
    print(a + b);
}
Shell
$ zig build-exe math.zig -target wasm32-freestanding -fno-entry --export=add
test.js
const fs = require('fs');
const source = fs.readFileSync("./math.wasm");
const typedArray = new Uint8Array(source);

WebAssembly.instantiate(typedArray, {
  env: {
    print: (result) => { console.log(`The result is ${result}`); }
  }}).then(result => {
  const add = result.instance.exports.add;
  add(1, 2);
});
Shell
$ node test.js
The result is 3
WASI 
Zig's support for WebAssembly System Interface (WASI) is under active development. Example of using the standard library and reading command line arguments:

wasi_args.zig
const std = @import("std");

pub fn main() !void {
    var general_purpose_allocator: std.heap.GeneralPurposeAllocator(.{}) = .init;
    const gpa = general_purpose_allocator.allocator();
    const args = try std.process.argsAlloc(gpa);
    defer std.process.argsFree(gpa, args);

    for (args, 0..) |arg, i| {
        std.debug.print("{}: {s}\n", .{ i, arg });
    }
}
Shell
$ zig build-exe wasi_args.zig -target wasm32-wasi
Shell
$ wasmtime wasi_args.wasm 123 hello
0: wasi_args.wasm
1: 123
2: hello
A more interesting example would be extracting the list of preopens from the runtime. This is now supported in the standard library via std.fs.wasi.Preopens:

wasi_preopens.zig
const std = @import("std");
const fs = std.fs;

pub fn main() !void {
    var general_purpose_allocator: std.heap.GeneralPurposeAllocator(.{}) = .init;
    const gpa = general_purpose_allocator.allocator();

    var arena_instance = std.heap.ArenaAllocator.init(gpa);
    defer arena_instance.deinit();
    const arena = arena_instance.allocator();

    const preopens = try fs.wasi.preopensAlloc(arena);

    for (preopens.names, 0..) |preopen, i| {
        std.debug.print("{}: {s}\n", .{ i, preopen });
    }
}
Shell
$ zig build-exe wasi_preopens.zig -target wasm32-wasi
Shell
$ wasmtime --dir=. wasi_preopens.wasm
0: stdin
1: stdout
2: stderr
3: .
Targets 
Target refers to the computer that will be used to run an executable. It is composed of the CPU architecture, the set of enabled CPU features, operating system, minimum and maximum operating system version, ABI, and ABI version.

Zig is a general-purpose programming language which means that it is designed to generate optimal code for a large set of targets. The command zig targets provides information about all of the targets the compiler is aware of.

When no target option is provided to the compiler, the default choice is to target the host computer, meaning that the resulting executable will be unsuitable for copying to a different computer. In order to copy an executable to another computer, the compiler needs to know about the target requirements via the -target option.

The Zig Standard Library (@import("std")) has cross-platform abstractions, making the same source code viable on many targets. Some code is more portable than other code. In general, Zig code is extremely portable compared to other programming languages.

Each platform requires its own implementations to make Zig's cross-platform abstractions work. These implementations are at various degrees of completion. Each tagged release of the compiler comes with release notes that provide the full support table for each target.

Style Guide 
These coding conventions are not enforced by the compiler, but they are shipped in this documentation along with the compiler in order to provide a point of reference, should anyone wish to point to an authority on agreed upon Zig coding style.

Avoid Redundancy in Names 
Avoid these words in type names:

Value
Data
Context
Manager
utils, misc, or somebody's initials
Everything is a value, all types are data, everything is context, all logic manages state. Nothing is communicated by using a word that applies to all types.

Temptation to use "utilities", "miscellaneous", or somebody's initials is a failure to categorize, or more commonly, overcategorization. Such declarations can live at the root of a module that needs them with no namespace needed.

Avoid Redundant Names in Fully-Qualified Namespaces 
Every declaration is assigned a fully qualified namespace by the compiler, creating a tree structure. Choose names based on the fully-qualified namespace, and avoid redundant name segments.

redundant_fqn.zig
const std = @import("std");

pub const json = struct {
    pub const JsonValue = union(enum) {
        number: f64,
        boolean: bool,
        // ...
    };
};

pub fn main() void {
    std.debug.print("{s}\n", .{@typeName(json.JsonValue)});
}
Shell
$ zig build-exe redundant_fqn.zig
$ ./redundant_fqn
redundant_fqn.json.JsonValue
In this example, "json" is repeated in the fully-qualified namespace. The solution is to delete Json from JsonValue. In this example we have an empty struct named json but remember that files also act as part of the fully-qualified namespace.

This example is an exception to the rule specified in Avoid Redundancy in Names. The meaning of the type has been reduced to its core: it is a json value. The name cannot be any more specific without being incorrect.

Whitespace 
4 space indentation
Open braces on same line, unless you need to wrap.
If a list of things is longer than 2, put each item on its own line and exercise the ability to put an extra comma at the end.
Line length: aim for 100; use common sense.
Names 
Roughly speaking: camelCaseFunctionName, TitleCaseTypeName, snake_case_variable_name. More precisely:

If x is a type then x should be TitleCase, unless it is a struct with 0 fields and is never meant to be instantiated, in which case it is considered to be a "namespace" and uses snake_case.
If x is callable, and x's return type is type, then x should be TitleCase.
If x is otherwise callable, then x should be camelCase.
Otherwise, x should be snake_case.
Acronyms, initialisms, proper nouns, or any other word that has capitalization rules in written English are subject to naming conventions just like any other word. Even acronyms that are only 2 letters long are subject to these conventions.

File names fall into two categories: types and namespaces. If the file (implicitly a struct) has top level fields, it should be named like any other struct with fields using TitleCase. Otherwise, it should use snake_case. Directory names should be snake_case.

These are general rules of thumb; if it makes sense to do something different, do what makes sense. For example, if there is an established convention such as ENOENT, follow the established convention.

Examples 
style_example.zig
const namespace_name = @import("dir_name/file_name.zig");
const TypeName = @import("dir_name/TypeName.zig");
var global_var: i32 = undefined;
const const_name = 42;
const primitive_type_alias = f32;
const string_alias = []u8;

const StructName = struct {
    field: i32,
};
const StructAlias = StructName;

fn functionName(param_name: TypeName) void {
    var functionPointer = functionName;
    functionPointer();
    functionPointer = otherFunction;
    functionPointer();
}
const functionAlias = functionName;

fn ListTemplateFunction(comptime ChildType: type, comptime fixed_size: usize) type {
    return List(ChildType, fixed_size);
}

fn ShortList(comptime T: type, comptime n: usize) type {
    return struct {
        field_name: [n]T,
        fn methodName() void {}
    };
}

// The word XML loses its casing when used in Zig identifiers.
const xml_document =
    \\<?xml version="1.0" encoding="UTF-8"?>
    \\<document>
    \\</document>
;
const XmlParser = struct {
    field: i32,
};

// The initials BE (Big Endian) are just another word in Zig identifier names.
fn readU32Be() u32 {}
See the Zig Standard Library for more examples.

Doc Comment Guidance 
Omit any information that is redundant based on the name of the thing being documented.
Duplicating information onto multiple similar functions is encouraged because it helps IDEs and other tools provide better help text.
Use the word assume to indicate invariants that cause unchecked Illegal Behavior when violated.
Use the word assert to indicate invariants that cause safety-checked Illegal Behavior when violated.
Source Encoding 
Zig source code is encoded in UTF-8. An invalid UTF-8 byte sequence results in a compile error.

Throughout all zig source code (including in comments), some code points are never allowed:

Ascii control characters, except for U+000a (LF), U+000d (CR), and U+0009 (HT): U+0000 - U+0008, U+000b - U+000c, U+000e - U+0001f, U+007f.
Non-Ascii Unicode line endings: U+0085 (NEL), U+2028 (LS), U+2029 (PS).
LF (byte value 0x0a, code point U+000a, '\n') is the line terminator in Zig source code. This byte value terminates every line of zig source code except the last line of the file. It is recommended that non-empty source files end with an empty line, which means the last byte would be 0x0a (LF).

Each LF may be immediately preceded by a single CR (byte value 0x0d, code point U+000d, '\r') to form a Windows style line ending, but this is discouraged. Note that in multiline strings, CRLF sequences will be encoded as LF when compiled into a zig program. A CR in any other context is not allowed.

HT hard tabs (byte value 0x09, code point U+0009, '\t') are interchangeable with SP spaces (byte value 0x20, code point U+0020, ' ') as a token separator, but use of hard tabs is discouraged. See Grammar.

For compatibility with other tools, the compiler ignores a UTF-8-encoded byte order mark (U+FEFF) if it is the first Unicode code point in the source text. A byte order mark is not allowed anywhere else in the source.

Note that running zig fmt on a source file will implement all recommendations mentioned here.

Note that a tool reading Zig source code can make assumptions if the source code is assumed to be correct Zig code. For example, when identifying the ends of lines, a tool can use a naive search such as /\n/, or an advanced search such as /\r\n?|[\n\u0085\u2028\u2029]/, and in either case line endings will be correctly identified. For another example, when identifying the whitespace before the first token on a line, a tool can either use a naive search such as /[ \t]/, or an advanced search such as /\s/, and in either case whitespace will be correctly identified.

Keyword Reference 
Keyword	Description
addrspace
The addrspace keyword.
TODO add documentation for addrspace
align
align can be used to specify the alignment of a pointer. It can also be used after a variable or function declaration to specify the alignment of pointers to that variable or function.
See also Alignment
allowzero
The pointer attribute allowzero allows a pointer to have address zero.
See also allowzero
and
The boolean operator and.
See also Operators
anyframe
anyframe can be used as a type for variables which hold pointers to function frames.
See also Async Functions
anytype
Function parameters can be declared with anytype in place of the type. The type will be inferred where the function is called.
See also Function Parameter Type Inference
asm
asm begins an inline assembly expression. This allows for directly controlling the machine code generated on compilation.
See also Assembly
async
async can be used before a function call to get a pointer to the function's frame when it suspends.
See also Async Functions
await
await can be used to suspend the current function until the frame provided after the await completes. await copies the value returned from the target function's frame to the caller.
See also Async Functions
break
break can be used with a block label to return a value from the block. It can also be used to exit a loop before iteration completes naturally.
See also Blocks, while, for
callconv
callconv can be used to specify the calling convention in a function type.
See also Functions
catch
catch can be used to evaluate an expression if the expression before it evaluates to an error. The expression after the catch can optionally capture the error value.
See also catch, Operators
comptime
comptime before a declaration can be used to label variables or function parameters as known at compile time. It can also be used to guarantee an expression is run at compile time.
See also comptime
const
const declares a variable that can not be modified. Used as a pointer attribute, it denotes the value referenced by the pointer cannot be modified.
See also Variables
continue
continue can be used in a loop to jump back to the beginning of the loop.
See also while, for
defer
defer will execute an expression when control flow leaves the current block.
See also defer
else
else can be used to provide an alternate branch for if, switch, while, and for expressions.
If used after an if expression, the else branch will be executed if the test value returns false, null, or an error.
If used within a switch expression, the else branch will be executed if the test value matches no other cases.
If used after a loop expression, the else branch will be executed if the loop finishes without breaking.
See also if, switch, while, for
enum
enum defines an enum type.
See also enum
errdefer
errdefer will execute an expression when control flow leaves the current block if the function returns an error, the errdefer expression can capture the unwrapped value.
See also errdefer
error
error defines an error type.
See also Errors
export
export makes a function or variable externally visible in the generated object file. Exported functions default to the C calling convention.
See also Functions
extern
extern can be used to declare a function or variable that will be resolved at link time, when linking statically or at runtime, when linking dynamically.
See also Functions
fn
fn declares a function.
See also Functions
for
A for expression can be used to iterate over the elements of a slice, array, or tuple.
See also for
if
An if expression can test boolean expressions, optional values, or error unions. For optional values or error unions, the if expression can capture the unwrapped value.
See also if
inline
inline can be used to label a loop expression such that it will be unrolled at compile time. It can also be used to force a function to be inlined at all call sites.
See also inline while, inline for, Functions
linksection
The linksection keyword can be used to specify what section the function or global variable will be put into (e.g. .text).
noalias
The noalias keyword.
TODO add documentation for noalias
noinline
noinline disallows function to be inlined in all call sites.
See also Functions
nosuspend
The nosuspend keyword can be used in front of a block, statement or expression, to mark a scope where no suspension points are reached. In particular, inside a nosuspend scope:
Using the suspend keyword results in a compile error.
Using await on a function frame which hasn't completed yet results in safety-checked Illegal Behavior.
Calling an async function may result in safety-checked Illegal Behavior, because it's equivalent to await async some_async_fn(), which contains an await.
Code inside a nosuspend scope does not cause the enclosing function to become an async function.
See also Async Functions
opaque
opaque defines an opaque type.
See also opaque
or
The boolean operator or.
See also Operators
orelse
orelse can be used to evaluate an expression if the expression before it evaluates to null.
See also Optionals, Operators
packed
The packed keyword before a struct definition changes the struct's in-memory layout to the guaranteed packed layout.
See also packed struct
pub
The pub in front of a top level declaration makes the declaration available to reference from a different file than the one it is declared in.
See also import
resume
resume will continue execution of a function frame after the point the function was suspended.
return
return exits a function with a value.
See also Functions
struct
struct defines a struct.
See also struct
suspend
suspend will cause control flow to return to the call site or resumer of the function. suspend can also be used before a block within a function, to allow the function access to its frame before control flow returns to the call site.
switch
A switch expression can be used to test values of a common type. switch cases can capture field values of a Tagged union.
See also switch
test
The test keyword can be used to denote a top-level block of code used to make sure behavior meets expectations.
See also Zig Test
threadlocal
threadlocal can be used to specify a variable as thread-local.
See also Thread Local Variables
try
try evaluates an error union expression. If it is an error, it returns from the current function with the same error. Otherwise, the expression results in the unwrapped value.
See also try
union
union defines a union.
See also union
unreachable
unreachable can be used to assert that control flow will never happen upon a particular location. Depending on the build mode, unreachable may emit a panic.
Emits a panic in Debug and ReleaseSafe mode, or when using zig test.
Does not emit a panic in ReleaseFast and ReleaseSmall mode.
See also unreachable
usingnamespace
usingnamespace is a top-level declaration that imports all the public declarations of the operand, which must be a struct, union, or enum, into the current scope.
See also usingnamespace
var
var declares a variable that may be modified.
See also Variables
volatile
volatile can be used to denote loads or stores of a pointer have side effects. It can also modify an inline assembly expression to denote it has side effects.
See also volatile, Assembly
while
A while expression can be used to repeatedly test a boolean, optional, or error union expression, and cease looping when that expression evaluates to false, null, or an error, respectively.
See also while
Appendix 
Containers 
A container in Zig is any syntactical construct that acts as a namespace to hold variable and function declarations. Containers are also type definitions which can be instantiated. Structs, enums, unions, opaques, and even Zig source files themselves are containers.

Although containers (except Zig source files) use curly braces to surround their definition, they should not be confused with blocks or functions. Containers do not contain statements.

Grammar 
grammar.y
Root <- skip container_doc_comment? ContainerMembers eof

# *** Top level ***
ContainerMembers <- ContainerDeclaration* (ContainerField COMMA)* (ContainerField / ContainerDeclaration*)

ContainerDeclaration <- TestDecl / ComptimeDecl / doc_comment? KEYWORD_pub? Decl

TestDecl <- KEYWORD_test (STRINGLITERALSINGLE / IDENTIFIER)? Block

ComptimeDecl <- KEYWORD_comptime Block

Decl
    <- (KEYWORD_export / KEYWORD_extern STRINGLITERALSINGLE? / KEYWORD_inline / KEYWORD_noinline)? FnProto (SEMICOLON / Block)
     / (KEYWORD_export / KEYWORD_extern STRINGLITERALSINGLE?)? KEYWORD_threadlocal? GlobalVarDecl
     / KEYWORD_usingnamespace Expr SEMICOLON

FnProto <- KEYWORD_fn IDENTIFIER? LPAREN ParamDeclList RPAREN ByteAlign? AddrSpace? LinkSection? CallConv? EXCLAMATIONMARK? TypeExpr

VarDeclProto <- (KEYWORD_const / KEYWORD_var) IDENTIFIER (COLON TypeExpr)? ByteAlign? AddrSpace? LinkSection?

GlobalVarDecl <- VarDeclProto (EQUAL Expr)? SEMICOLON

ContainerField <- doc_comment? KEYWORD_comptime? !KEYWORD_fn (IDENTIFIER COLON)? TypeExpr ByteAlign? (EQUAL Expr)?

# *** Block Level ***
Statement
    <- KEYWORD_comptime ComptimeStatement
     / KEYWORD_nosuspend BlockExprStatement
     / KEYWORD_suspend BlockExprStatement
     / KEYWORD_defer BlockExprStatement
     / KEYWORD_errdefer Payload? BlockExprStatement
     / IfStatement
     / LabeledStatement
     / SwitchExpr
     / VarDeclExprStatement

ComptimeStatement
    <- BlockExpr
     / VarDeclExprStatement

IfStatement
    <- IfPrefix BlockExpr ( KEYWORD_else Payload? Statement )?
     / IfPrefix AssignExpr ( SEMICOLON / KEYWORD_else Payload? Statement )

LabeledStatement <- BlockLabel? (Block / LoopStatement)

LoopStatement <- KEYWORD_inline? (ForStatement / WhileStatement)

ForStatement
    <- ForPrefix BlockExpr ( KEYWORD_else Statement )?
     / ForPrefix AssignExpr ( SEMICOLON / KEYWORD_else Statement )

WhileStatement
    <- WhilePrefix BlockExpr ( KEYWORD_else Payload? Statement )?
     / WhilePrefix AssignExpr ( SEMICOLON / KEYWORD_else Payload? Statement )

BlockExprStatement
    <- BlockExpr
     / AssignExpr SEMICOLON

BlockExpr <- BlockLabel? Block

# An expression, assignment, or any destructure, as a statement.
VarDeclExprStatement
    <- VarDeclProto (COMMA (VarDeclProto / Expr))* EQUAL Expr SEMICOLON
     / Expr (AssignOp Expr / (COMMA (VarDeclProto / Expr))+ EQUAL Expr)? SEMICOLON

# *** Expression Level ***

# An assignment or a destructure whose LHS are all lvalue expressions.
AssignExpr <- Expr (AssignOp Expr / (COMMA Expr)+ EQUAL Expr)?

SingleAssignExpr <- Expr (AssignOp Expr)?

Expr <- BoolOrExpr

BoolOrExpr <- BoolAndExpr (KEYWORD_or BoolAndExpr)*

BoolAndExpr <- CompareExpr (KEYWORD_and CompareExpr)*

CompareExpr <- BitwiseExpr (CompareOp BitwiseExpr)?

BitwiseExpr <- BitShiftExpr (BitwiseOp BitShiftExpr)*

BitShiftExpr <- AdditionExpr (BitShiftOp AdditionExpr)*

AdditionExpr <- MultiplyExpr (AdditionOp MultiplyExpr)*

MultiplyExpr <- PrefixExpr (MultiplyOp PrefixExpr)*

PrefixExpr <- PrefixOp* PrimaryExpr

PrimaryExpr
    <- AsmExpr
     / IfExpr
     / KEYWORD_break BreakLabel? Expr?
     / KEYWORD_comptime Expr
     / KEYWORD_nosuspend Expr
     / KEYWORD_continue BreakLabel?
     / KEYWORD_resume Expr
     / KEYWORD_return Expr?
     / BlockLabel? LoopExpr
     / Block
     / CurlySuffixExpr

IfExpr <- IfPrefix Expr (KEYWORD_else Payload? Expr)?

Block <- LBRACE Statement* RBRACE

LoopExpr <- KEYWORD_inline? (ForExpr / WhileExpr)

ForExpr <- ForPrefix Expr (KEYWORD_else Expr)?

WhileExpr <- WhilePrefix Expr (KEYWORD_else Payload? Expr)?

CurlySuffixExpr <- TypeExpr InitList?

InitList
    <- LBRACE FieldInit (COMMA FieldInit)* COMMA? RBRACE
     / LBRACE Expr (COMMA Expr)* COMMA? RBRACE
     / LBRACE RBRACE

TypeExpr <- PrefixTypeOp* ErrorUnionExpr

ErrorUnionExpr <- SuffixExpr (EXCLAMATIONMARK TypeExpr)?

SuffixExpr
    <- KEYWORD_async PrimaryTypeExpr SuffixOp* FnCallArguments
     / PrimaryTypeExpr (SuffixOp / FnCallArguments)*

PrimaryTypeExpr
    <- BUILTINIDENTIFIER FnCallArguments
     / CHAR_LITERAL
     / ContainerDecl
     / DOT IDENTIFIER
     / DOT InitList
     / ErrorSetDecl
     / FLOAT
     / FnProto
     / GroupedExpr
     / LabeledTypeExpr
     / IDENTIFIER
     / IfTypeExpr
     / INTEGER
     / KEYWORD_comptime TypeExpr
     / KEYWORD_error DOT IDENTIFIER
     / KEYWORD_anyframe
     / KEYWORD_unreachable
     / STRINGLITERAL
     / SwitchExpr

ContainerDecl <- (KEYWORD_extern / KEYWORD_packed)? ContainerDeclAuto

ErrorSetDecl <- KEYWORD_error LBRACE IdentifierList RBRACE

GroupedExpr <- LPAREN Expr RPAREN

IfTypeExpr <- IfPrefix TypeExpr (KEYWORD_else Payload? TypeExpr)?

LabeledTypeExpr
    <- BlockLabel Block
     / BlockLabel? LoopTypeExpr

LoopTypeExpr <- KEYWORD_inline? (ForTypeExpr / WhileTypeExpr)

ForTypeExpr <- ForPrefix TypeExpr (KEYWORD_else TypeExpr)?

WhileTypeExpr <- WhilePrefix TypeExpr (KEYWORD_else Payload? TypeExpr)?

SwitchExpr <- KEYWORD_switch LPAREN Expr RPAREN LBRACE SwitchProngList RBRACE

# *** Assembly ***
AsmExpr <- KEYWORD_asm KEYWORD_volatile? LPAREN Expr AsmOutput? RPAREN

AsmOutput <- COLON AsmOutputList AsmInput?

AsmOutputItem <- LBRACKET IDENTIFIER RBRACKET STRINGLITERAL LPAREN (MINUSRARROW TypeExpr / IDENTIFIER) RPAREN

AsmInput <- COLON AsmInputList AsmClobbers?

AsmInputItem <- LBRACKET IDENTIFIER RBRACKET STRINGLITERAL LPAREN Expr RPAREN

AsmClobbers <- COLON StringList

# *** Helper grammar ***
BreakLabel <- COLON IDENTIFIER

BlockLabel <- IDENTIFIER COLON

FieldInit <- DOT IDENTIFIER EQUAL Expr

WhileContinueExpr <- COLON LPAREN AssignExpr RPAREN

LinkSection <- KEYWORD_linksection LPAREN Expr RPAREN

AddrSpace <- KEYWORD_addrspace LPAREN Expr RPAREN

# Fn specific
CallConv <- KEYWORD_callconv LPAREN Expr RPAREN

ParamDecl
    <- doc_comment? (KEYWORD_noalias / KEYWORD_comptime)? (IDENTIFIER COLON)? ParamType
     / DOT3

ParamType
    <- KEYWORD_anytype
     / TypeExpr

# Control flow prefixes
IfPrefix <- KEYWORD_if LPAREN Expr RPAREN PtrPayload?

WhilePrefix <- KEYWORD_while LPAREN Expr RPAREN PtrPayload? WhileContinueExpr?

ForPrefix <- KEYWORD_for LPAREN ForArgumentsList RPAREN PtrListPayload

# Payloads
Payload <- PIPE IDENTIFIER PIPE

PtrPayload <- PIPE ASTERISK? IDENTIFIER PIPE

PtrIndexPayload <- PIPE ASTERISK? IDENTIFIER (COMMA IDENTIFIER)? PIPE

PtrListPayload <- PIPE ASTERISK? IDENTIFIER (COMMA ASTERISK? IDENTIFIER)* COMMA? PIPE

# Switch specific
SwitchProng <- KEYWORD_inline? SwitchCase EQUALRARROW PtrIndexPayload? SingleAssignExpr

SwitchCase
    <- SwitchItem (COMMA SwitchItem)* COMMA?
     / KEYWORD_else

SwitchItem <- Expr (DOT3 Expr)?

# For specific
ForArgumentsList <- ForItem (COMMA ForItem)* COMMA?

ForItem <- Expr (DOT2 Expr?)?

# Operators
AssignOp
    <- ASTERISKEQUAL
     / ASTERISKPIPEEQUAL
     / SLASHEQUAL
     / PERCENTEQUAL
     / PLUSEQUAL
     / PLUSPIPEEQUAL
     / MINUSEQUAL
     / MINUSPIPEEQUAL
     / LARROW2EQUAL
     / LARROW2PIPEEQUAL
     / RARROW2EQUAL
     / AMPERSANDEQUAL
     / CARETEQUAL
     / PIPEEQUAL
     / ASTERISKPERCENTEQUAL
     / PLUSPERCENTEQUAL
     / MINUSPERCENTEQUAL
     / EQUAL

CompareOp
    <- EQUALEQUAL
     / EXCLAMATIONMARKEQUAL
     / LARROW
     / RARROW
     / LARROWEQUAL
     / RARROWEQUAL

BitwiseOp
    <- AMPERSAND
     / CARET
     / PIPE
     / KEYWORD_orelse
     / KEYWORD_catch Payload?

BitShiftOp
    <- LARROW2
     / RARROW2
     / LARROW2PIPE

AdditionOp
    <- PLUS
     / MINUS
     / PLUS2
     / PLUSPERCENT
     / MINUSPERCENT
     / PLUSPIPE
     / MINUSPIPE

MultiplyOp
    <- PIPE2
     / ASTERISK
     / SLASH
     / PERCENT
     / ASTERISK2
     / ASTERISKPERCENT
     / ASTERISKPIPE

PrefixOp
    <- EXCLAMATIONMARK
     / MINUS
     / TILDE
     / MINUSPERCENT
     / AMPERSAND
     / KEYWORD_try
     / KEYWORD_await

PrefixTypeOp
    <- QUESTIONMARK
     / KEYWORD_anyframe MINUSRARROW
     / SliceTypeStart (ByteAlign / AddrSpace / KEYWORD_const / KEYWORD_volatile / KEYWORD_allowzero)*
     / PtrTypeStart (AddrSpace / KEYWORD_align LPAREN Expr (COLON Expr COLON Expr)? RPAREN / KEYWORD_const / KEYWORD_volatile / KEYWORD_allowzero)*
     / ArrayTypeStart

SuffixOp
    <- LBRACKET Expr (DOT2 (Expr? (COLON Expr)?)?)? RBRACKET
     / DOT IDENTIFIER
     / DOTASTERISK
     / DOTQUESTIONMARK

FnCallArguments <- LPAREN ExprList RPAREN

# Ptr specific
SliceTypeStart <- LBRACKET (COLON Expr)? RBRACKET

PtrTypeStart
    <- ASTERISK
     / ASTERISK2
     / LBRACKET ASTERISK (LETTERC / COLON Expr)? RBRACKET

ArrayTypeStart <- LBRACKET Expr (COLON Expr)? RBRACKET

# ContainerDecl specific
ContainerDeclAuto <- ContainerDeclType LBRACE container_doc_comment? ContainerMembers RBRACE

ContainerDeclType
    <- KEYWORD_struct (LPAREN Expr RPAREN)?
     / KEYWORD_opaque
     / KEYWORD_enum (LPAREN Expr RPAREN)?
     / KEYWORD_union (LPAREN (KEYWORD_enum (LPAREN Expr RPAREN)? / Expr) RPAREN)?

# Alignment
ByteAlign <- KEYWORD_align LPAREN Expr RPAREN

# Lists
IdentifierList <- (doc_comment? IDENTIFIER COMMA)* (doc_comment? IDENTIFIER)?

SwitchProngList <- (SwitchProng COMMA)* SwitchProng?

AsmOutputList <- (AsmOutputItem COMMA)* AsmOutputItem?

AsmInputList <- (AsmInputItem COMMA)* AsmInputItem?

StringList <- (STRINGLITERAL COMMA)* STRINGLITERAL?

ParamDeclList <- (ParamDecl COMMA)* ParamDecl?

ExprList <- (Expr COMMA)* Expr?

# *** Tokens ***
eof <- !.
bin <- [01]
bin_ <- '_'? bin
oct <- [0-7]
oct_ <- '_'? oct
hex <- [0-9a-fA-F]
hex_ <- '_'? hex
dec <- [0-9]
dec_ <- '_'? dec

bin_int <- bin bin_*
oct_int <- oct oct_*
dec_int <- dec dec_*
hex_int <- hex hex_*

ox80_oxBF <- [\200-\277]
oxF4 <- '\364'
ox80_ox8F <- [\200-\217]
oxF1_oxF3 <- [\361-\363]
oxF0 <- '\360'
ox90_0xBF <- [\220-\277]
oxEE_oxEF <- [\356-\357]
oxED <- '\355'
ox80_ox9F <- [\200-\237]
oxE1_oxEC <- [\341-\354]
oxE0 <- '\340'
oxA0_oxBF <- [\240-\277]
oxC2_oxDF <- [\302-\337]

# From https://lemire.me/blog/2018/05/09/how-quickly-can-you-check-that-a-string-is-valid-unicode-utf-8/
# First Byte      Second Byte     Third Byte      Fourth Byte
# [0x00,0x7F]
# [0xC2,0xDF]     [0x80,0xBF]
#    0xE0         [0xA0,0xBF]     [0x80,0xBF]
# [0xE1,0xEC]     [0x80,0xBF]     [0x80,0xBF]
#    0xED         [0x80,0x9F]     [0x80,0xBF]
# [0xEE,0xEF]     [0x80,0xBF]     [0x80,0xBF]
#    0xF0         [0x90,0xBF]     [0x80,0xBF]     [0x80,0xBF]
# [0xF1,0xF3]     [0x80,0xBF]     [0x80,0xBF]     [0x80,0xBF]
#    0xF4         [0x80,0x8F]     [0x80,0xBF]     [0x80,0xBF]

mb_utf8_literal <-
       oxF4      ox80_ox8F ox80_oxBF ox80_oxBF
     / oxF1_oxF3 ox80_oxBF ox80_oxBF ox80_oxBF
     / oxF0      ox90_0xBF ox80_oxBF ox80_oxBF
     / oxEE_oxEF ox80_oxBF ox80_oxBF
     / oxED      ox80_ox9F ox80_oxBF
     / oxE1_oxEC ox80_oxBF ox80_oxBF
     / oxE0      oxA0_oxBF ox80_oxBF
     / oxC2_oxDF ox80_oxBF

ascii_char_not_nl_slash_squote <- [\000-\011\013-\046\050-\133\135-\177]

char_escape
    <- "\\x" hex hex
     / "\\u{" hex+ "}"
     / "\\" [nr\\t'"]
char_char
    <- mb_utf8_literal
     / char_escape
     / ascii_char_not_nl_slash_squote

string_char
    <- char_escape
     / [^\\"\n]

container_doc_comment <- ('//!' [^\n]* [ \n]* skip)+
doc_comment <- ('///' [^\n]* [ \n]* skip)+
line_comment <- '//' ![!/][^\n]* / '////' [^\n]*
line_string <- ("\\\\" [^\n]* [ \n]*)+
skip <- ([ \n] / line_comment)*

CHAR_LITERAL <- "'" char_char "'" skip
FLOAT
    <- "0x" hex_int "." hex_int ([pP] [-+]? dec_int)? skip
     /      dec_int "." dec_int ([eE] [-+]? dec_int)? skip
     / "0x" hex_int [pP] [-+]? dec_int skip
     /      dec_int [eE] [-+]? dec_int skip
INTEGER
    <- "0b" bin_int skip
     / "0o" oct_int skip
     / "0x" hex_int skip
     /      dec_int   skip
STRINGLITERALSINGLE <- "\"" string_char* "\"" skip
STRINGLITERAL
    <- STRINGLITERALSINGLE
     / (line_string                 skip)+
IDENTIFIER
    <- !keyword [A-Za-z_] [A-Za-z0-9_]* skip
     / "@" STRINGLITERALSINGLE
BUILTINIDENTIFIER <- "@"[A-Za-z_][A-Za-z0-9_]* skip


AMPERSAND            <- '&'      ![=]      skip
AMPERSANDEQUAL       <- '&='               skip
ASTERISK             <- '*'      ![*%=|]   skip
ASTERISK2            <- '**'               skip
ASTERISKEQUAL        <- '*='               skip
ASTERISKPERCENT      <- '*%'     ![=]      skip
ASTERISKPERCENTEQUAL <- '*%='              skip
ASTERISKPIPE         <- '*|'     ![=]      skip
ASTERISKPIPEEQUAL    <- '*|='              skip
CARET                <- '^'      ![=]      skip
CARETEQUAL           <- '^='               skip
COLON                <- ':'                skip
COMMA                <- ','                skip
DOT                  <- '.'      ![*.?]    skip
DOT2                 <- '..'     ![.]      skip
DOT3                 <- '...'              skip
DOTASTERISK          <- '.*'               skip
DOTQUESTIONMARK      <- '.?'               skip
EQUAL                <- '='      ![>=]     skip
EQUALEQUAL           <- '=='               skip
EQUALRARROW          <- '=>'               skip
EXCLAMATIONMARK      <- '!'      ![=]      skip
EXCLAMATIONMARKEQUAL <- '!='               skip
LARROW               <- '<'      ![<=]     skip
LARROW2              <- '<<'     ![=|]     skip
LARROW2EQUAL         <- '<<='              skip
LARROW2PIPE          <- '<<|'    ![=]      skip
LARROW2PIPEEQUAL     <- '<<|='             skip
LARROWEQUAL          <- '<='               skip
LBRACE               <- '{'                skip
LBRACKET             <- '['                skip
LPAREN               <- '('                skip
MINUS                <- '-'      ![%=>|]   skip
MINUSEQUAL           <- '-='               skip
MINUSPERCENT         <- '-%'     ![=]      skip
MINUSPERCENTEQUAL    <- '-%='              skip
MINUSPIPE            <- '-|'     ![=]      skip
MINUSPIPEEQUAL       <- '-|='              skip
MINUSRARROW          <- '->'               skip
PERCENT              <- '%'      ![=]      skip
PERCENTEQUAL         <- '%='               skip
PIPE                 <- '|'      ![|=]     skip
PIPE2                <- '||'               skip
PIPEEQUAL            <- '|='               skip
PLUS                 <- '+'      ![%+=|]   skip
PLUS2                <- '++'               skip
PLUSEQUAL            <- '+='               skip
PLUSPERCENT          <- '+%'     ![=]      skip
PLUSPERCENTEQUAL     <- '+%='              skip
PLUSPIPE             <- '+|'     ![=]      skip
PLUSPIPEEQUAL        <- '+|='              skip
LETTERC              <- 'c'                skip
QUESTIONMARK         <- '?'                skip
RARROW               <- '>'      ![>=]     skip
RARROW2              <- '>>'     ![=]      skip
RARROW2EQUAL         <- '>>='              skip
RARROWEQUAL          <- '>='               skip
RBRACE               <- '}'                skip
RBRACKET             <- ']'                skip
RPAREN               <- ')'                skip
SEMICOLON            <- ';'                skip
SLASH                <- '/'      ![=]      skip
SLASHEQUAL           <- '/='               skip
TILDE                <- '~'                skip

end_of_word <- ![a-zA-Z0-9_] skip
KEYWORD_addrspace   <- 'addrspace'   end_of_word
KEYWORD_align       <- 'align'       end_of_word
KEYWORD_allowzero   <- 'allowzero'   end_of_word
KEYWORD_and         <- 'and'         end_of_word
KEYWORD_anyframe    <- 'anyframe'    end_of_word
KEYWORD_anytype     <- 'anytype'     end_of_word
KEYWORD_asm         <- 'asm'         end_of_word
KEYWORD_async       <- 'async'       end_of_word
KEYWORD_await       <- 'await'       end_of_word
KEYWORD_break       <- 'break'       end_of_word
KEYWORD_callconv    <- 'callconv'    end_of_word
KEYWORD_catch       <- 'catch'       end_of_word
KEYWORD_comptime    <- 'comptime'    end_of_word
KEYWORD_const       <- 'const'       end_of_word
KEYWORD_continue    <- 'continue'    end_of_word
KEYWORD_defer       <- 'defer'       end_of_word
KEYWORD_else        <- 'else'        end_of_word
KEYWORD_enum        <- 'enum'        end_of_word
KEYWORD_errdefer    <- 'errdefer'    end_of_word
KEYWORD_error       <- 'error'       end_of_word
KEYWORD_export      <- 'export'      end_of_word
KEYWORD_extern      <- 'extern'      end_of_word
KEYWORD_fn          <- 'fn'          end_of_word
KEYWORD_for         <- 'for'         end_of_word
KEYWORD_if          <- 'if'          end_of_word
KEYWORD_inline      <- 'inline'      end_of_word
KEYWORD_noalias     <- 'noalias'     end_of_word
KEYWORD_nosuspend   <- 'nosuspend'   end_of_word
KEYWORD_noinline    <- 'noinline'    end_of_word
KEYWORD_opaque      <- 'opaque'      end_of_word
KEYWORD_or          <- 'or'          end_of_word
KEYWORD_orelse      <- 'orelse'      end_of_word
KEYWORD_packed      <- 'packed'      end_of_word
KEYWORD_pub         <- 'pub'         end_of_word
KEYWORD_resume      <- 'resume'      end_of_word
KEYWORD_return      <- 'return'      end_of_word
KEYWORD_linksection <- 'linksection' end_of_word
KEYWORD_struct      <- 'struct'      end_of_word
KEYWORD_suspend     <- 'suspend'     end_of_word
KEYWORD_switch      <- 'switch'      end_of_word
KEYWORD_test        <- 'test'        end_of_word
KEYWORD_threadlocal <- 'threadlocal' end_of_word
KEYWORD_try         <- 'try'         end_of_word
KEYWORD_union       <- 'union'       end_of_word
KEYWORD_unreachable <- 'unreachable' end_of_word
KEYWORD_usingnamespace <- 'usingnamespace' end_of_word
KEYWORD_var         <- 'var'         end_of_word
KEYWORD_volatile    <- 'volatile'    end_of_word
KEYWORD_while       <- 'while'       end_of_word

keyword <- KEYWORD_addrspace / KEYWORD_align / KEYWORD_allowzero / KEYWORD_and
         / KEYWORD_anyframe / KEYWORD_anytype / KEYWORD_asm / KEYWORD_async
         / KEYWORD_await / KEYWORD_break / KEYWORD_callconv / KEYWORD_catch
         / KEYWORD_comptime / KEYWORD_const / KEYWORD_continue / KEYWORD_defer
         / KEYWORD_else / KEYWORD_enum / KEYWORD_errdefer / KEYWORD_error / KEYWORD_export
         / KEYWORD_extern / KEYWORD_fn / KEYWORD_for / KEYWORD_if
         / KEYWORD_inline / KEYWORD_noalias / KEYWORD_nosuspend / KEYWORD_noinline
         / KEYWORD_opaque / KEYWORD_or / KEYWORD_orelse / KEYWORD_packed
         / KEYWORD_pub / KEYWORD_resume / KEYWORD_return / KEYWORD_linksection
         / KEYWORD_struct / KEYWORD_suspend / KEYWORD_switch / KEYWORD_test
         / KEYWORD_threadlocal / KEYWORD_try / KEYWORD_union / KEYWORD_unreachable
         / KEYWORD_usingnamespace / KEYWORD_var / KEYWORD_volatile / KEYWORD_while
Zen 
Communicate intent precisely.
Edge cases matter.
Favor reading code over writing code.
Only one obvious way to do things.
Runtime crashes are better than bugs.
Compile errors are better than runtime crashes.
Incremental improvements.
Avoid local maximums.
Reduce the amount one must remember.
Focus on code rather than style.
Resource allocation may fail; resource deallocation must succeed.
Memory is a resource.
Together we serve the users.
</rawcontent>
<rawcode>
```zig [src/evm/run_result.zig]
const ExecutionError = @import("execution/execution_error.zig");

/// Result of an EVM execution run.
///
/// RunResult encapsulates the outcome of executing EVM bytecode, including
/// success/failure status, gas consumption, and any output data. This is
/// the primary return type for VM execution functions.
///
/// ## Design Rationale
/// The result combines multiple pieces of information needed after execution:
/// - Status indicates how execution ended (success, revert, error)
/// - Gas tracking for accounting and refunds
/// - Output data for return values or revert messages
/// - Optional error details for debugging
///
/// ## Status Types
/// - Success: Execution completed normally
/// - Revert: Explicit revert (REVERT opcode or require failure)
/// - Invalid: Invalid operation (bad opcode, stack error, etc.)
/// - OutOfGas: Execution ran out of gas
///
/// ## Usage
/// ```zig
/// const result = vm.run(bytecode, gas_limit);
/// switch (result.status) {
///     .Success => {
///         // Process output data
///         const return_data = result.output orelse &[_]u8{};
///     },
///     .Revert => {
///         // Handle revert with reason
///         const revert_reason = result.output orelse &[_]u8{};
///     },
///     .Invalid => {
///         // Handle error
///         std.log.err("Execution failed: {?}", .{result.err});
///     },
///     .OutOfGas => {
///         // Handle out of gas
///     },
/// }
/// ```
const Self = @This();

/// Execution completion status.
///
/// Indicates how the execution ended. This maps to EVM execution outcomes:
/// - Success: Normal completion (STOP, RETURN, or end of code)
/// - Revert: Explicit revert (REVERT opcode)
/// - Invalid: Execution error (invalid opcode, stack error, etc.)
/// - OutOfGas: Gas exhausted during execution
pub const Status = enum {
    /// Execution completed successfully
    Success,
    /// Execution was explicitly reverted
    Revert,
    /// Execution failed due to invalid operation
    Invalid,
    /// Execution ran out of gas
    OutOfGas,
};
status: Status,

/// Optional execution error details.
///
/// Present when status is Invalid, providing specific error information
/// for debugging and error reporting.
err: ?ExecutionError.Error,

/// Remaining gas after execution.
///
/// For successful execution, this is refunded to the caller.
/// For failed execution, this may be zero or partially consumed.
gas_left: u64,

/// Total gas consumed during execution.
///
/// Calculated as: initial_gas - gas_left
/// Used for:
/// - Transaction receipts
/// - Gas accounting
/// - Performance monitoring
gas_used: u64,

/// Output data from execution.
///
/// Contents depend on execution status:
/// - Success: Return data from RETURN opcode
/// - Revert: Revert reason from REVERT opcode
/// - Invalid/OutOfGas: Usually null
///
/// Note: Empty output is different from null output.
/// Empty means explicit empty return, null means no return.
output: ?[]const u8,

pub fn init(
    initial_gas: u64,
    gas_left: u64,
    status: Status,
    err: ?ExecutionError.Error,
    output: ?[]const u8,
) Self {
    return Self{
        .status = status,
        .err = err,
        .gas_left = gas_left,
        .gas_used = initial_gas - gas_left,
        .output = output,
    };
}
```
```zig [src/evm/create_result.zig]
const Address = @import("Address");

/// Result structure for contract creation operations in the EVM.
///
/// This structure encapsulates the outcome of deploying a new smart contract
/// through CREATE or CREATE2 opcodes. It provides all necessary information
/// about the deployment result, including the new contract's address and any
/// revert data if the deployment failed.
///
/// ## Contract Creation Flow
/// 1. Execute initcode (constructor bytecode)
/// 2. Initcode returns runtime bytecode
/// 3. Runtime bytecode is stored at computed address
/// 4. This result structure is returned
///
/// ## Address Computation
/// - **CREATE**: address = keccak256(rlp([sender, nonce]))[12:]
/// - **CREATE2**: address = keccak256(0xff ++ sender ++ salt ++ keccak256(initcode))[12:]
///
/// ## Success Conditions
/// A creation succeeds when:
/// - Initcode executes without reverting
/// - Sufficient gas remains for code storage
/// - Returned bytecode size ≤ 24,576 bytes (EIP-170)
/// - No address collision occurs
///
/// ## Failure Modes
/// - Initcode reverts (REVERT opcode or error)
/// - Out of gas during execution
/// - Returned bytecode exceeds size limit
/// - Address collision (extremely rare)
/// - Stack depth exceeded
///
/// ## Example Usage
/// ```zig
/// const result = try vm.create_contract(value, initcode, gas, salt);
/// if (result.success) {
///     // Contract deployed at result.address
///     log.info("Deployed to: {}", .{result.address});
/// } else {
///     // Deployment failed, check output for revert reason
///     if (result.output) |revert_data| {
///         log.err("Deployment failed: {}", .{revert_data});
///     }
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
const Self = @This();

/// Indicates whether the contract creation succeeded.
///
/// - `true`: Contract successfully deployed and code stored on-chain
/// - `false`: Creation failed due to revert, gas, or other errors
///
/// ## State Changes
/// - Success: All state changes are committed, contract exists at address
/// - Failure: All state changes are reverted, no contract is deployed
success: bool,

/// The address where the contract was (or would have been) deployed.
///
/// This address is computed deterministically before execution begins:
/// - For CREATE: Based on sender address and nonce
/// - For CREATE2: Based on sender, salt, and initcode hash
///
/// ## Important Notes
/// - Address is computed even if creation fails
/// - Can be used to predict addresses before deployment
/// - Useful for counterfactual instantiation patterns
///
/// ## Address Collision
/// If this address already contains a contract, creation fails.
/// The probability of collision is negligible (2^-160).
address: Address.Address,

/// Amount of gas remaining after the creation attempt.
///
/// ## Gas Accounting
/// - Deducted: Initcode execution + code storage (200 per byte)
/// - Refunded: Unused gas returns to caller
/// - Minimum: 32,000 gas for CREATE/CREATE2 base cost
///
/// ## Usage Patterns
/// - Success: Add back to calling context's available gas
/// - Failure with revert: Some gas may remain (unlike out-of-gas)
/// - Failure out-of-gas: Will be 0 or very low
gas_left: u64,

/// Optional data returned by the contract creation.
///
/// ## Success Case
/// - Contains the runtime bytecode to be stored on-chain
/// - Size must be ≤ 24,576 bytes (MAX_CODE_SIZE)
/// - Empty output creates a contract with no code
///
/// ## Failure Case
/// - Contains revert reason if REVERT was used
/// - `null` for out-of-gas or invalid operations
/// - Useful for debugging deployment failures
///
/// ## Memory Management
/// The output buffer is allocated by the VM and ownership transfers
/// to the caller, who must free it when no longer needed.
///
/// ## Examples
/// ```zig
/// // Success: output contains runtime bytecode
/// if (result.success and result.output) |bytecode| {
///     assert(bytecode.len <= MAX_CODE_SIZE);
/// }
///
/// // Failure: output may contain revert message
/// if (!result.success and result.output) |reason| {
///     // Decode revert reason (often ABI-encoded string)
/// }
/// ```
output: ?[]const u8,

pub fn initFailure(gas_left: u64, output: ?[]const u8) Self {
    return Self{
        .success = false,
        .address = Address.zero(),
        .gas_left = gas_left,
        .output = output,
    };
}
```
```zig [src/evm/jump_table/operation_config.zig]
const std = @import("std");
const execution = @import("../execution/package.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Stack = @import("../stack/stack.zig");
const Operation = @import("../opcodes/operation.zig");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;

/// Specification for an EVM operation.
/// This data structure allows us to define all operations in a single place
/// and generate the Operation structs at compile time.
pub const OpSpec = struct {
    /// Operation name (e.g., "ADD", "MUL")
    name: []const u8,
    /// Opcode byte value (0x00-0xFF)
    opcode: u8,
    /// Execution function
    execute: Operation.ExecutionFunc,
    /// Base gas cost
    gas: u64,
    /// Minimum stack items required
    min_stack: u32,
    /// Maximum stack size allowed (usually Stack.CAPACITY or Stack.CAPACITY - 1)
    max_stack: u32,
    /// Optional: for hardfork variants, specify which variant this is
    variant: ?Hardfork = null,
};

/// Complete specification of all EVM execution.
/// This replaces the scattered Operation definitions across multiple files.
pub const ALL_OPERATIONS = [_]OpSpec{
    // 0x00s: Stop and Arithmetic Operations
    .{ .name = "STOP", .opcode = 0x00, .execute = execution.control.op_stop, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "ADD", .opcode = 0x01, .execute = execution.arithmetic.op_add, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MUL", .opcode = 0x02, .execute = execution.arithmetic.op_mul, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SUB", .opcode = 0x03, .execute = execution.arithmetic.op_sub, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DIV", .opcode = 0x04, .execute = execution.arithmetic.op_div, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SDIV", .opcode = 0x05, .execute = execution.arithmetic.op_sdiv, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MOD", .opcode = 0x06, .execute = execution.arithmetic.op_mod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SMOD", .opcode = 0x07, .execute = execution.arithmetic.op_smod, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ADDMOD", .opcode = 0x08, .execute = execution.arithmetic.op_addmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "MULMOD", .opcode = 0x09, .execute = execution.arithmetic.op_mulmod, .gas = gas_constants.GasMidStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "EXP", .opcode = 0x0a, .execute = execution.arithmetic.op_exp, .gas = 10, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SIGNEXTEND", .opcode = 0x0b, .execute = execution.arithmetic.op_signextend, .gas = gas_constants.GasFastStep, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x10s: Comparison & Bitwise Logic Operations
    .{ .name = "LT", .opcode = 0x10, .execute = execution.comparison.op_lt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "GT", .opcode = 0x11, .execute = execution.comparison.op_gt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLT", .opcode = 0x12, .execute = execution.comparison.op_slt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SGT", .opcode = 0x13, .execute = execution.comparison.op_sgt, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "EQ", .opcode = 0x14, .execute = execution.comparison.op_eq, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "ISZERO", .opcode = 0x15, .execute = execution.comparison.op_iszero, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "AND", .opcode = 0x16, .execute = execution.bitwise.op_and, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "OR", .opcode = 0x17, .execute = execution.bitwise.op_or, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "XOR", .opcode = 0x18, .execute = execution.bitwise.op_xor, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "NOT", .opcode = 0x19, .execute = execution.bitwise.op_not, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "BYTE", .opcode = 0x1a, .execute = execution.bitwise.op_byte, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SHL", .opcode = 0x1b, .execute = execution.bitwise.op_shl, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },
    .{ .name = "SHR", .opcode = 0x1c, .execute = execution.bitwise.op_shr, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },
    .{ .name = "SAR", .opcode = 0x1d, .execute = execution.bitwise.op_sar, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },

    // 0x20s: Crypto
    .{ .name = "SHA3", .opcode = 0x20, .execute = execution.crypto.op_sha3, .gas = gas_constants.Keccak256Gas, .min_stack = 2, .max_stack = Stack.CAPACITY },

    // 0x30s: Environmental Information
    .{ .name = "ADDRESS", .opcode = 0x30, .execute = execution.environment.op_address, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "BALANCE_FRONTIER", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "BALANCE_TANGERINE", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 400, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "BALANCE_ISTANBUL", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "BALANCE_BERLIN", .opcode = 0x31, .execute = execution.environment.op_balance, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "ORIGIN", .opcode = 0x32, .execute = execution.environment.op_origin, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLER", .opcode = 0x33, .execute = execution.environment.op_caller, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLVALUE", .opcode = 0x34, .execute = execution.environment.op_callvalue, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATALOAD", .opcode = 0x35, .execute = execution.environment.op_calldataload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "CALLDATASIZE", .opcode = 0x36, .execute = execution.environment.op_calldatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALLDATACOPY", .opcode = 0x37, .execute = execution.memory.op_calldatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "CODESIZE", .opcode = 0x38, .execute = execution.environment.op_codesize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CODECOPY", .opcode = 0x39, .execute = execution.environment.op_codecopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY },
    .{ .name = "GASPRICE", .opcode = 0x3a, .execute = execution.environment.op_gasprice, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "EXTCODESIZE_FRONTIER", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "EXTCODESIZE_TANGERINE", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "EXTCODESIZE_ISTANBUL", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 700, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "EXTCODESIZE", .opcode = 0x3b, .execute = execution.environment.op_extcodesize, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "EXTCODECOPY_FRONTIER", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 20, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "EXTCODECOPY_TANGERINE", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "EXTCODECOPY_ISTANBUL", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 700, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "EXTCODECOPY", .opcode = 0x3c, .execute = execution.environment.op_extcodecopy, .gas = 0, .min_stack = 4, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "RETURNDATASIZE", .opcode = 0x3d, .execute = execution.memory.op_returndatasize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .BYZANTIUM },
    .{ .name = "RETURNDATACOPY", .opcode = 0x3e, .execute = execution.memory.op_returndatacopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = .BYZANTIUM },
    .{ .name = "EXTCODEHASH", .opcode = 0x3f, .execute = execution.environment.op_extcodehash, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CONSTANTINOPLE },

    // 0x40s: Block Information
    .{ .name = "BLOCKHASH", .opcode = 0x40, .execute = execution.block.op_blockhash, .gas = 20, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "COINBASE", .opcode = 0x41, .execute = execution.block.op_coinbase, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "TIMESTAMP", .opcode = 0x42, .execute = execution.block.op_timestamp, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "NUMBER", .opcode = 0x43, .execute = execution.block.op_number, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "DIFFICULTY", .opcode = 0x44, .execute = execution.block.op_difficulty, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GASLIMIT", .opcode = 0x45, .execute = execution.block.op_gaslimit, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CHAINID", .opcode = 0x46, .execute = execution.environment.op_chainid, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .ISTANBUL },
    .{ .name = "SELFBALANCE", .opcode = 0x47, .execute = execution.environment.op_selfbalance, .gas = gas_constants.GasFastStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .ISTANBUL },
    .{ .name = "BASEFEE", .opcode = 0x48, .execute = execution.block.op_basefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .LONDON },
    .{ .name = "BLOBHASH", .opcode = 0x49, .execute = execution.block.op_blobhash, .gas = gas_constants.BlobHashGas, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "BLOBBASEFEE", .opcode = 0x4a, .execute = execution.block.op_blobbasefee, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .CANCUN },

    // 0x50s: Stack, Memory, Storage and Flow Operations
    .{ .name = "POP", .opcode = 0x50, .execute = execution.stack.op_pop, .gas = gas_constants.GasQuickStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MLOAD", .opcode = 0x51, .execute = execution.memory.op_mload, .gas = gas_constants.GasFastestStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE", .opcode = 0x52, .execute = execution.memory.op_mstore, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "MSTORE8", .opcode = 0x53, .execute = execution.memory.op_mstore8, .gas = gas_constants.GasFastestStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "SLOAD_FRONTIER", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 50, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "SLOAD_TANGERINE", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 200, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
    .{ .name = "SLOAD_ISTANBUL", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 800, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .ISTANBUL },
    .{ .name = "SLOAD", .opcode = 0x54, .execute = execution.storage.op_sload, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .BERLIN },
    .{ .name = "SSTORE", .opcode = 0x55, .execute = execution.storage.op_sstore, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMP", .opcode = 0x56, .execute = execution.control.op_jump, .gas = gas_constants.GasMidStep, .min_stack = 1, .max_stack = Stack.CAPACITY },
    .{ .name = "JUMPI", .opcode = 0x57, .execute = execution.control.op_jumpi, .gas = gas_constants.GasSlowStep, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "PC", .opcode = 0x58, .execute = execution.control.op_pc, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "MSIZE", .opcode = 0x59, .execute = execution.memory.op_msize, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "GAS", .opcode = 0x5a, .execute = execution.system.gas_op, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "JUMPDEST", .opcode = 0x5b, .execute = execution.control.op_jumpdest, .gas = gas_constants.JumpdestGas, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "TLOAD", .opcode = 0x5c, .execute = execution.storage.op_tload, .gas = gas_constants.WarmStorageReadCost, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "TSTORE", .opcode = 0x5d, .execute = execution.storage.op_tstore, .gas = gas_constants.WarmStorageReadCost, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "MCOPY", .opcode = 0x5e, .execute = execution.memory.op_mcopy, .gas = gas_constants.GasFastestStep, .min_stack = 3, .max_stack = Stack.CAPACITY, .variant = .CANCUN },
    .{ .name = "PUSH0", .opcode = 0x5f, .execute = execution.stack.op_push0, .gas = gas_constants.GasQuickStep, .min_stack = 0, .max_stack = Stack.CAPACITY - 1, .variant = .SHANGHAI },

    // 0x60s & 0x70s: Push operations (generated dynamically in jump table)
    // 0x80s: Duplication operations (generated dynamically in jump table)
    // 0x90s: Exchange operations (generated dynamically in jump table)
    // 0xa0s: Logging operations (generated dynamically in jump table)

    // 0xf0s: System operations
    .{ .name = "CREATE", .opcode = 0xf0, .execute = execution.system.op_create, .gas = gas_constants.CreateGas, .min_stack = 3, .max_stack = Stack.CAPACITY - 1 },
    .{ .name = "CALL_FRONTIER", .opcode = 0xf1, .execute = execution.system.op_call, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .FRONTIER },
    .{ .name = "CALL", .opcode = 0xf1, .execute = execution.system.op_call, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "CALLCODE_FRONTIER", .opcode = 0xf2, .execute = execution.system.op_callcode, .gas = 40, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .FRONTIER },
    .{ .name = "CALLCODE", .opcode = 0xf2, .execute = execution.system.op_callcode, .gas = 700, .min_stack = 7, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "RETURN", .opcode = 0xf3, .execute = execution.control.op_return, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY },
    .{ .name = "DELEGATECALL", .opcode = 0xf4, .execute = execution.system.op_delegatecall, .gas = 40, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .HOMESTEAD },
    .{ .name = "DELEGATECALL_TANGERINE", .opcode = 0xf4, .execute = execution.system.op_delegatecall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .TANGERINE_WHISTLE },
    .{ .name = "CREATE2", .opcode = 0xf5, .execute = execution.system.op_create2, .gas = gas_constants.CreateGas, .min_stack = 4, .max_stack = Stack.CAPACITY - 1, .variant = .CONSTANTINOPLE },
    .{ .name = "STATICCALL", .opcode = 0xfa, .execute = execution.system.op_staticcall, .gas = 700, .min_stack = 6, .max_stack = Stack.CAPACITY - 1, .variant = .BYZANTIUM },
    .{ .name = "REVERT", .opcode = 0xfd, .execute = execution.control.op_revert, .gas = 0, .min_stack = 2, .max_stack = Stack.CAPACITY, .variant = .BYZANTIUM },
    .{ .name = "INVALID", .opcode = 0xfe, .execute = execution.control.op_invalid, .gas = 0, .min_stack = 0, .max_stack = Stack.CAPACITY },
    .{ .name = "SELFDESTRUCT_FRONTIER", .opcode = 0xff, .execute = execution.control.op_selfdestruct, .gas = 0, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .FRONTIER },
    .{ .name = "SELFDESTRUCT", .opcode = 0xff, .execute = execution.control.op_selfdestruct, .gas = 5000, .min_stack = 1, .max_stack = Stack.CAPACITY, .variant = .TANGERINE_WHISTLE },
};

/// Generate an Operation struct from an OpSpec.
pub fn generate_operation(spec: OpSpec) Operation {
    return Operation{
        .execute = spec.execute,
        .constant_gas = spec.gas,
        .min_stack = spec.min_stack,
        .max_stack = spec.max_stack,
    };
}
```
```zig [src/evm/jump_table/jump_table.zig]
const std = @import("std");
const Opcode = @import("../opcodes/opcode.zig");
const Operation = @import("../opcodes/operation.zig");
const Hardfork = @import("../hardforks/hardfork.zig").Hardfork;
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");
const Frame = @import("../frame.zig");
const Contract = @import("../contract/contract.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

const execution = @import("../execution/package.zig");
const stack_ops = execution.stack;
const log = execution.log;
const operation_config = @import("operation_config.zig");

/// EVM jump table for efficient opcode dispatch.
///
/// The jump table is a critical performance optimization that maps opcodes
/// to their execution handlers. Instead of using a switch statement with
/// 256 cases, the jump table provides O(1) dispatch by indexing directly
/// into an array of function pointers.
///
/// ## Design Rationale
/// - Array indexing is faster than switch statement branching
/// - Cache-line alignment improves memory access patterns
/// - Hardfork-specific tables allow for efficient versioning
/// - Null entries default to UNDEFINED operation
///
/// ## Hardfork Evolution
/// The jump table evolves with each hardfork:
/// - New opcodes are added (e.g., PUSH0 in Shanghai)
/// - Gas costs change (e.g., SLOAD in Berlin)
/// - Opcodes are removed or modified
///
/// ## Performance Considerations
/// - 64-byte cache line alignment reduces cache misses
/// - Direct indexing eliminates branch prediction overhead
/// - Operation structs are immutable for thread safety
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const opcode = bytecode[pc];
/// const operation = table.get_operation(opcode);
/// const result = try table.execute(pc, interpreter, state, opcode);
/// ```
const Self = @This();

/// CPU cache line size for optimal memory alignment.
/// Most modern x86/ARM processors use 64-byte cache lines.
const CACHE_LINE_SIZE = 64;

/// Array of operation handlers indexed by opcode value.
/// Aligned to cache line boundaries for optimal performance.
/// Null entries are treated as undefined opcodes.
table: [256]?*const Operation align(CACHE_LINE_SIZE),

/// CANCUN jump table, pre-generated at compile time.
/// This is the latest hardfork configuration.
pub const CANCUN = init_from_hardfork(.CANCUN);

/// Default jump table for the latest hardfork.
/// References CANCUN to avoid generating the same table twice.
/// This is what gets used when no jump table is specified.
pub const DEFAULT = CANCUN;

/// Create an empty jump table with all entries set to null.
///
/// This creates a blank jump table that must be populated with
/// operations before use. Typically, you'll want to use
/// init_from_hardfork() instead to get a pre-configured table.
///
/// @return An empty jump table
pub fn init() Self {
    return Self{
        .table = [_]?*const Operation{null} ** 256,
    };
}

/// Get the operation handler for a given opcode.
///
/// Returns the operation associated with the opcode, or the NULL
/// operation if the opcode is undefined in this jump table.
///
/// @param self The jump table
/// @param opcode The opcode byte value (0x00-0xFF)
/// @return Operation handler (never null)
///
/// Example:
/// ```zig
/// const op = table.get_operation(0x01); // Get ADD operation
/// ```
pub fn get_operation(self: *const Self, opcode: u8) *const Operation {
    return self.table[opcode] orelse &Operation.NULL;
}

/// Execute an opcode using the jump table.
///
/// This is the main dispatch function that:
/// 1. Looks up the operation for the opcode
/// 2. Validates stack requirements
/// 3. Consumes gas
/// 4. Executes the operation
///
/// @param self The jump table
/// @param pc Current program counter
/// @param interpreter VM interpreter context
/// @param state Execution state (cast to Frame internally)
/// @param opcode The opcode to execute
/// @return Execution result with gas consumed
/// @throws InvalidOpcode if opcode is undefined
/// @throws StackUnderflow/Overflow if validation fails
/// @throws OutOfGas if insufficient gas
///
/// Example:
/// ```zig
/// const result = try table.execute(pc, &interpreter, &state, bytecode[pc]);
/// ```
pub fn execute(self: *const Self, pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State, opcode: u8) ExecutionError.Error!Operation.ExecutionResult {
    @branchHint(.likely);
    const operation = self.get_operation(opcode);

    // Cast state to Frame to access gas_remaining and stack
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    Log.debug("JumpTable.execute: Executing opcode 0x{x:0>2} at pc={}, gas={}, stack_size={}", .{ opcode, pc, frame.gas_remaining, frame.stack.size });

    if (operation.undefined) {
        @branchHint(.cold);
        Log.debug("JumpTable.execute: Invalid opcode 0x{x:0>2}", .{opcode});
        frame.gas_remaining = 0;
        return ExecutionError.Error.InvalidOpcode;
    }

    const stack_validation = @import("../stack/stack_validation.zig");
    try stack_validation.validate_stack_requirements(&frame.stack, operation);

    if (operation.constant_gas > 0) {
        @branchHint(.likely);
        Log.debug("JumpTable.execute: Consuming {} gas for opcode 0x{x:0>2}", .{ operation.constant_gas, opcode });
        try frame.consume_gas(operation.constant_gas);
    }

    const res = try operation.execute(pc, interpreter, state);
    Log.debug("JumpTable.execute: Opcode 0x{x:0>2} completed, gas_remaining={}", .{ opcode, frame.gas_remaining });
    return res;
}

/// Validate and fix the jump table.
///
/// Ensures all entries are valid:
/// - Null entries are replaced with UNDEFINED operation
/// - Operations with memory_size must have dynamic_gas
/// - Invalid operations are logged and replaced
///
/// This should be called after manually constructing a jump table
/// to ensure it's safe for execution.
///
/// @param self The jump table to validate
pub fn validate(self: *Self) void {
    for (0..256) |i| {
        if (self.table[i] == null) {
            @branchHint(.cold);
            self.table[i] = &Operation.NULL;
        } else if (self.table[i].?.memory_size != null and self.table[i].?.dynamic_gas == null) {
            @branchHint(.likely);
            // Log error instead of panicking
            std.debug.print("Warning: Operation 0x{x} has memory size but no dynamic gas calculation\n", .{i});
            // Set to NULL to prevent issues
            self.table[i] = &Operation.NULL;
        }
    }
}

pub fn copy(self: *const Self, allocator: std.mem.Allocator) !Self {
    _ = allocator;
    return Self{
        .table = self.table,
    };
}


/// Create a jump table configured for a specific hardfork.
///
/// This is the primary way to create a jump table. It starts with
/// the Frontier base configuration and applies all changes up to
/// the specified hardfork.
///
/// @param hardfork The target hardfork configuration
/// @return A fully configured jump table
///
/// Hardfork progression:
/// - FRONTIER: Base EVM opcodes
/// - HOMESTEAD: DELEGATECALL
/// - TANGERINE_WHISTLE: Gas repricing (EIP-150)
/// - BYZANTIUM: REVERT, RETURNDATASIZE, STATICCALL
/// - CONSTANTINOPLE: CREATE2, SHL/SHR/SAR, EXTCODEHASH
/// - ISTANBUL: CHAINID, SELFBALANCE, more gas changes
/// - BERLIN: Access lists, cold/warm storage
/// - LONDON: BASEFEE
/// - SHANGHAI: PUSH0
/// - CANCUN: BLOBHASH, MCOPY, transient storage
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// // Table includes all opcodes through Cancun
/// ```
pub fn init_from_hardfork(hardfork: Hardfork) Self {
    @setEvalBranchQuota(10000);
    var jt = Self.init();
    // With ALL_OPERATIONS sorted by hardfork, we can iterate once.
    // Each opcode will be set to the latest active version for the target hardfork.
    inline for (operation_config.ALL_OPERATIONS) |spec| {
        const op_hardfork = spec.variant orelse Hardfork.FRONTIER;
        if (@intFromEnum(op_hardfork) <= @intFromEnum(hardfork)) {
            const op = struct {
                pub const operation = operation_config.generate_operation(spec);
            };
            jt.table[spec.opcode] = &op.operation;
        }
    }
    // 0x60s & 0x70s: Push operations
    inline for (0..32) |i| {
        const n = i + 1;
        jt.table[0x60 + i] = &Operation{
            .execute = stack_ops.make_push(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = 0,
            .max_stack = Stack.CAPACITY - 1,
        };
    }
    // 0x80s: Duplication Operations
    inline for (1..17) |n| {
        jt.table[0x80 + n - 1] = &Operation{
            .execute = stack_ops.make_dup(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = @intCast(n),
            .max_stack = Stack.CAPACITY - 1,
        };
    }
    // 0x90s: Exchange Operations
    inline for (1..17) |n| {
        jt.table[0x90 + n - 1] = &Operation{
            .execute = stack_ops.make_swap(n),
            .constant_gas = execution.gas_constants.GasFastestStep,
            .min_stack = @intCast(n + 1),
            .max_stack = Stack.CAPACITY,
        };
    }
    // 0xa0s: Logging Operations
    inline for (0..5) |n| {
        jt.table[0xa0 + n] = &Operation{
            .execute = log.make_log(n),
            .constant_gas = execution.gas_constants.LogGas + execution.gas_constants.LogTopicGas * n,
            .min_stack = @intCast(n + 2),
            .max_stack = Stack.CAPACITY,
        };
    }
    jt.validate();
    return jt;
}
```
```zig [src/evm/contract/bitvec.zig]
const std = @import("std");
const constants = @import("../constants/constants.zig");

/// BitVec is a bit vector implementation used for tracking JUMPDEST positions in bytecode
const Self = @This();

/// Bit array stored in u64 chunks
bits: []u64,
/// Total length in bits
size: usize,
/// Whether this bitvec owns its memory (and should free it)
owned: bool,

/// Error types for BitVec operations
pub const BitVecError = error{
    /// Position is out of bounds for the bit vector
    PositionOutOfBounds,
};

/// Error type for BitVec initialization
pub const BitVecInitError = std.mem.Allocator.Error;

/// Error type for code bitmap creation
pub const CodeBitmapError = BitVecInitError;

/// Create a new BitVec with the given size
pub fn init(allocator: std.mem.Allocator, size: usize) BitVecInitError!Self {
    const u64_size = (size + 63) / 64; // Round up to nearest u64
    const bits = try allocator.alloc(u64, u64_size);
    @memset(bits, 0); // Initialize all bits to 0
    return Self{
        .bits = bits,
        .size = size,
        .owned = true,
    };
}

/// Create a BitVec from existing memory (not owned)
pub fn from_memory(bits: []u64, size: usize) Self {
    return Self{
        .bits = bits,
        .size = size,
        .owned = false,
    };
}

/// Free allocated memory if owned
pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
    if (self.owned) {
        allocator.free(self.bits);
        self.bits = &.{};
        self.size = 0;
    }
}

/// Set a bit at the given position
pub fn set(self: *Self, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Set a bit at the given position without bounds checking
pub fn set_unchecked(self: *Self, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] |= bit;
}

/// Clear a bit at the given position
pub fn clear(self: *Self, pos: usize) BitVecError!void {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Clear a bit at the given position without bounds checking
pub fn clear_unchecked(self: *Self, pos: usize) void {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    self.bits[idx] &= ~bit;
}

/// Check if a bit is set at the given position
pub fn is_set(self: *const Self, pos: usize) BitVecError!bool {
    if (pos >= self.size) return BitVecError.PositionOutOfBounds;
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if a bit is set at the given position without bounds checking
pub fn is_set_unchecked(self: *const Self, pos: usize) bool {
    const idx = pos / 64;
    const bit = @as(u64, 1) << @intCast(pos % 64);
    return (self.bits[idx] & bit) != 0;
}

/// Check if the position represents a valid code segment
pub fn code_segment(self: *const Self, pos: usize) BitVecError!bool {
    return self.is_set(pos);
}

/// Check if the position represents a valid code segment without bounds checking
pub fn code_segment_unchecked(self: *const Self, pos: usize) bool {
    return self.is_set_unchecked(pos);
}

/// Analyze bytecode to identify valid JUMPDEST locations and code segments
pub fn code_bitmap(allocator: std.mem.Allocator, code: []const u8) CodeBitmapError!Self {
    var bitmap = try Self.init(allocator, code.len);
    errdefer bitmap.deinit(allocator);

    // Mark all positions as valid code initially
    for (0..code.len) |i| {
        bitmap.set_unchecked(i);
    }

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        // If the opcode is a PUSH, skip the pushed bytes
        if (constants.is_push(op)) {
            const push_bytes = constants.get_push_size(op); // Get number of bytes to push

            // Mark pushed bytes as data (not code)
            var j: usize = 1;
            while (j <= push_bytes and i + j < code.len) : (j += 1) {
                bitmap.clear_unchecked(i + j);
            }

            // Skip the pushed bytes
            if (i + push_bytes + 1 < code.len) {
                i += push_bytes + 1;
            } else {
                i = code.len;
            }
        } else {
            i += 1;
        }
    }

    return bitmap;
}

```
```zig [src/evm/contract/eip_7702_bytecode.zig]
const Address = @import("Address");

/// Magic bytes that identify EIP-7702 delegated code
/// 
/// EIP-7702 introduces a new transaction type that allows EOAs (Externally Owned Accounts)
/// to temporarily delegate their code execution to a contract address. This is marked
/// by prepending the contract address with these magic bytes: 0xE7 0x02
pub const EIP7702_MAGIC_BYTES = [2]u8{ 0xE7, 0x02 };

/// EIP-7702 bytecode representation for delegated EOA code
/// 
/// This struct represents the bytecode format introduced by EIP-7702, which allows
/// EOAs to delegate their code execution to a contract address. The bytecode format
/// consists of the magic bytes (0xE7, 0x02) followed by a 20-byte address.
/// 
/// ## EIP-7702 Overview
/// 
/// EIP-7702 enables EOAs to temporarily act like smart contracts by delegating
/// their code execution to an existing contract. This is useful for:
/// - Account abstraction without deploying new contracts
/// - Batched transactions from EOAs
/// - Sponsored transactions
/// - Enhanced wallet functionality
/// 
/// ## Bytecode Format
/// 
/// The delegated bytecode format is exactly 22 bytes:
/// - Bytes 0-1: Magic bytes (0xE7, 0x02)
/// - Bytes 2-21: Contract address to delegate to
/// 
/// When the EVM encounters this bytecode format, it executes the code at the
/// specified contract address in the context of the EOA.
const Self = @This();

/// The contract address that this EOA delegates execution to
address: Address.Address,

/// Creates a new EIP-7702 bytecode representation
/// 
/// ## Parameters
/// - `address`: The contract address to delegate execution to
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Example
/// ```zig
/// const delegate_address = Address.from_hex("0x742d35Cc6634C0532925a3b844Bc9e7595f62d3c");
/// const bytecode = EIP7702Bytecode.new(delegate_address);
/// ```
pub fn new(address: Address.Address) Self {
    return .{ .address = address };
}

/// Creates an EIP-7702 bytecode representation from raw bytes
/// 
/// Parses the bytecode format to extract the delegation address.
/// This function expects the input to include the magic bytes.
/// 
/// ## Parameters
/// - `bytes`: Raw bytecode bytes, should be at least 22 bytes (2 magic + 20 address)
/// 
/// ## Returns
/// A new EIP7702Bytecode instance
/// 
/// ## Errors
/// Currently this function doesn't validate the magic bytes or length,
/// but may return malformed results if the input is invalid.
/// 
/// ## Example
/// ```zig
/// const raw_bytecode = &[_]u8{0xE7, 0x02} ++ address_bytes;
/// const bytecode = try EIP7702Bytecode.new_raw(raw_bytecode);
/// ```
pub fn new_raw(bytes: []const u8) !Self {
    var address: Address.Address = undefined;
    if (bytes.len > 20) {
        @memcpy(&address, bytes[2..22]);
    }
    return Self.new(address);
}

/// Returns the raw bytecode representation
/// 
/// **NOTE**: This function is currently incomplete and returns an empty slice.
/// It should return the full 22-byte bytecode including magic bytes and address.
/// 
/// ## Parameters
/// - `self`: The EIP7702Bytecode instance
/// 
/// ## Returns
/// The raw bytecode bytes (currently returns empty slice - TODO: implement properly)
/// 
/// ## TODO
/// This function should be implemented to return:
/// - Bytes 0-1: EIP7702_MAGIC_BYTES
/// - Bytes 2-21: The delegation address
pub fn raw(self: *const Self) []const u8 {
    _ = self;
    return &[_]u8{};
}
```
```zig [src/evm/contract/storage_pool.zig]
const std = @import("std");

/// Object pool for EVM storage-related hash maps to reduce allocation pressure.
///
/// The StoragePool manages reusable hash maps for storage slot tracking and access
/// patterns, significantly reducing allocation/deallocation overhead during EVM
/// execution. This is particularly important for contracts that make heavy use
/// of storage operations.
///
/// ## Design Rationale
/// EVM execution frequently creates and destroys hash maps for:
/// - Tracking which storage slots have been accessed (warm/cold for EIP-2929)
/// - Storing original storage values for gas refund calculations
///
/// Rather than allocating new maps for each contract call, this pool maintains
/// a cache of cleared maps ready for reuse.
///
/// ## Usage Pattern
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
///
/// // Borrow a map
/// const map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(map);
///
/// // Use the map for storage operations
/// try map.put(slot, value);
/// ```
///
/// ## Thread Safety
/// This pool is NOT thread-safe. Each thread should maintain its own pool
/// or use external synchronization.
const Self = @This();

/// Pool of reusable access tracking maps (slot -> accessed flag)
access_maps: std.ArrayList(*std.AutoHashMap(u256, bool)),
/// Pool of reusable storage value maps (slot -> value)
storage_maps: std.ArrayList(*std.AutoHashMap(u256, u256)),
/// Allocator used for creating new maps when pool is empty
allocator: std.mem.Allocator,

/// Initialize a new storage pool.
///
/// @param allocator The allocator to use for creating new maps
/// @return A new StoragePool instance
///
/// Example:
/// ```zig
/// var pool = StoragePool.init(allocator);
/// defer pool.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) Self {
    return .{
        .access_maps = std.ArrayList(*std.AutoHashMap(u256, bool)).init(allocator),
        .storage_maps = std.ArrayList(*std.AutoHashMap(u256, u256)).init(allocator),
        .allocator = allocator,
    };
}

/// Clean up the storage pool and all contained maps.
///
/// This function destroys all pooled maps and frees their memory.
/// After calling deinit, the pool should not be used.
///
/// Note: Any maps currently borrowed from the pool will become invalid
/// after deinit. Ensure all borrowed maps are returned before calling this.
pub fn deinit(self: *Self) void {
    // Clean up any remaining maps
    for (self.access_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    for (self.storage_maps.items) |map| {
        map.deinit();
        self.allocator.destroy(map);
    }
    self.access_maps.deinit();
    self.storage_maps.deinit();
}

/// Error type for access map borrowing operations
pub const BorrowAccessMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow an access tracking map from the pool.
///
/// Access maps track which storage slots have been accessed during execution,
/// used for EIP-2929 warm/cold access gas pricing.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const access_map = try pool.borrow_access_map();
/// defer pool.return_access_map(access_map);
///
/// // Track storage slot access
/// try access_map.put(slot, true);
/// const was_accessed = access_map.get(slot) orelse false;
/// ```
pub fn borrow_access_map(self: *Self) BorrowAccessMapError!*std.AutoHashMap(u256, bool) {
    if (self.access_maps.items.len > 0) return self.access_maps.pop() orelse unreachable;
    const map = self.allocator.create(std.AutoHashMap(u256, bool)) catch {
        return BorrowAccessMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, bool).init(self.allocator);
    return map;
}

/// Return an access map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_access_map(self: *Self, map: *std.AutoHashMap(u256, bool)) void {
    map.clearRetainingCapacity();
    self.access_maps.append(map) catch {};
}

/// Error type for storage map borrowing operations
pub const BorrowStorageMapError = error{
    /// Allocator failed to allocate memory for a new map
    OutOfAllocatorMemory,
};

/// Borrow a storage value map from the pool.
///
/// Storage maps store slot values, typically used for tracking original
/// values to calculate gas refunds or implement storage rollback.
///
/// If the pool has available maps, one is returned immediately.
/// Otherwise, a new map is allocated.
///
/// @return A cleared hash map ready for use
/// @throws OutOfAllocatorMemory if allocation fails
///
/// Example:
/// ```zig
/// const storage_map = try pool.borrow_storage_map();
/// defer pool.return_storage_map(storage_map);
///
/// // Store original value before modification
/// try storage_map.put(slot, original_value);
/// ```
pub fn borrow_storage_map(self: *Self) BorrowStorageMapError!*std.AutoHashMap(u256, u256) {
    if (self.storage_maps.pop()) |map| {
        return map;
    }
    const map = self.allocator.create(std.AutoHashMap(u256, u256)) catch {
        return BorrowStorageMapError.OutOfAllocatorMemory;
    };
    map.* = std.AutoHashMap(u256, u256).init(self.allocator);
    return map;
}

/// Return a storage map to the pool for reuse.
///
/// The map is cleared but its capacity is retained to avoid
/// reallocation on next use. If the pool fails to store the
/// returned map (due to memory pressure), it is silently discarded.
///
/// @param map The map to return to the pool
///
/// Note: The map should not be used after returning it to the pool.
pub fn return_storage_map(self: *Self, map: *std.AutoHashMap(u256, u256)) void {
    map.clearRetainingCapacity();
    self.storage_maps.append(map) catch {};
}
```
```zig [src/evm/contract/contract.zig]
//! Production-quality Contract module for EVM execution context.
//!
//! This module provides the core abstraction for contract execution in the EVM,
//! managing bytecode, gas accounting, storage access tracking, and JUMPDEST validation.
//! It incorporates performance optimizations from modern EVM implementations including
//! evmone, revm, and go-ethereum.
//!
//! ## Architecture
//! The Contract structure represents a single execution frame in the EVM call stack.
//! Each contract call (CALL, DELEGATECALL, STATICCALL, CREATE) creates a new Contract
//! instance that tracks its own gas, storage access, and execution state.
//!
//! ## Performance Characteristics
//! - **JUMPDEST validation**: O(log n) using binary search on pre-sorted positions
//! - **Storage access**: O(1) with warm/cold tracking for EIP-2929
//! - **Code analysis**: Cached globally with thread-safe access
//! - **Memory management**: Zero-allocation paths for common operations
//! - **Storage pooling**: Reuses hash maps to reduce allocation pressure
//!
//! ## Key Features
//! 1. **Code Analysis Caching**: Bytecode is analyzed once and cached globally
//! 2. **EIP-2929 Support**: Tracks warm/cold storage slots for gas calculation
//! 3. **Static Call Protection**: Prevents state modifications in read-only contexts
//! 4. **Gas Refund Tracking**: Manages gas refunds with EIP-3529 limits
//! 5. **Deployment Support**: Handles both CREATE and CREATE2 deployment flows
//!
//! ## Thread Safety
//! The global analysis cache uses mutex protection when multi-threaded,
//! automatically degrading to no-op mutexes in single-threaded builds.
//!
//! ## Memory Management
//! Contracts can optionally use a StoragePool to reuse hash maps across
//! multiple contract executions, significantly reducing allocation overhead
//! in high-throughput scenarios.
//!
//! ## Reference Implementations
//! - go-ethereum: https://github.com/ethereum/go-ethereum/blob/master/core/vm/contract.go
//! - revm: https://github.com/bluealloy/revm/blob/main/crates/interpreter/src/contract.rs
//! - evmone: https://github.com/ethereum/evmone/blob/master/lib/evmone/execution_state.hpp
const std = @import("std");
const constants = @import("../constants/constants.zig");
const bitvec = @import("bitvec.zig");
const Address = @import("Address");
const ExecutionError = @import("../execution/execution_error.zig");
const CodeAnalysis = @import("code_analysis.zig");
const StoragePool = @import("storage_pool.zig");
const Log = @import("../log.zig");

/// Maximum gas refund allowed (EIP-3529)
const MAX_REFUND_QUOTIENT = 5;

/// Error types for Contract operations
pub const ContractError = std.mem.Allocator.Error || StorageOperationError;
pub const StorageOperationError = error{
    OutOfAllocatorMemory,
    InvalidStorageOperation,
};
pub const CodeAnalysisError = std.mem.Allocator.Error;

/// Global analysis cache (simplified version)
var analysis_cache: ?std.AutoHashMap([32]u8, *CodeAnalysis) = null;
// Use conditional compilation for thread safety
const is_single_threaded = @import("builtin").single_threaded;
const Mutex = if (is_single_threaded) struct {
    pub fn lock(self: *@This()) void {
        _ = self;
    }
    pub fn unlock(self: *@This()) void {
        _ = self;
    }
} else std.Thread.Mutex;

var cache_mutex: Mutex = .{};

/// Contract represents the execution context for a single call frame in the EVM.
///
/// Each contract execution (whether from external transaction, internal call,
/// or contract creation) operates within its own Contract instance. This design
/// enables proper isolation, gas accounting, and state management across the
/// call stack.
const Self = @This();

// ============================================================================
// Identity and Context Fields
// ============================================================================

/// The address where this contract's code is deployed.
///
/// - For regular calls: The callee's address
/// - For DELEGATECALL: The current contract's address (code from elsewhere)
/// - For CREATE/CREATE2: Initially zero, set after address calculation
address: Address.Address,

/// The address that initiated this contract execution.
///
/// - For external transactions: The EOA that signed the transaction
/// - For internal calls: The contract that executed CALL/DELEGATECALL/etc
/// - For CREATE/CREATE2: The creating contract's address
///
/// Note: This is msg.sender in Solidity, not tx.origin
caller: Address.Address,

/// The amount of Wei sent with this contract call.
///
/// - Regular calls: Can be any amount (if not static)
/// - DELEGATECALL: Always 0 (uses parent's value)
/// - STATICCALL: Always 0 (no value transfer allowed)
/// - CREATE/CREATE2: Initial balance for new contract
value: u256,

// ============================================================================
// Code and Analysis Fields
// ============================================================================

/// The bytecode being executed in this context.
///
/// - Regular calls: The deployed contract's runtime bytecode
/// - CALLCODE/DELEGATECALL: The external contract's code
/// - CREATE/CREATE2: The initialization bytecode (constructor)
///
/// This slice is a view into existing memory, not owned by Contract.
code: []const u8,

/// Keccak256 hash of the contract bytecode.
///
/// Used for:
/// - Code analysis caching (avoids re-analyzing same bytecode)
/// - EXTCODEHASH opcode implementation
/// - CREATE2 address calculation
///
/// For deployments, this is set to zero as there's no deployed code yet.
code_hash: [32]u8,

/// Cached length of the bytecode for performance.
///
/// Storing this separately avoids repeated slice.len calls in hot paths
/// like bounds checking for PC and CODECOPY operations.
code_size: u64,

/// Optional reference to pre-computed code analysis.
///
/// Contains:
/// - JUMPDEST positions for O(log n) validation
/// - Code vs data segments (bitvector)
/// - Static analysis results (has CREATE, has SELFDESTRUCT, etc)
///
/// This is lazily computed on first jump and cached globally.
analysis: ?*const CodeAnalysis,

// ============================================================================
// Gas Tracking Fields
// ============================================================================

/// Remaining gas available for execution.
///
/// Decremented by each operation according to its gas cost.
/// If this reaches 0, execution halts with out-of-gas error.
///
/// Gas forwarding rules:
/// - CALL: Limited by 63/64 rule (EIP-150)
/// - DELEGATECALL/STATICCALL: Same rules as CALL
/// - CREATE/CREATE2: All remaining gas minus stipend
gas: u64,

/// Accumulated gas refund from storage operations.
///
/// Tracks gas to be refunded at transaction end from:
/// - SSTORE: Clearing storage slots
/// - SELFDESTRUCT: Contract destruction (pre-London)
///
/// Limited to gas_used / 5 by EIP-3529 (London hardfork).
gas_refund: u64,

// ============================================================================
// Input/Output Fields
// ============================================================================

/// Input data passed to this contract execution.
///
/// - External transactions: Transaction data field
/// - CALL/STATICCALL: Data passed in call
/// - DELEGATECALL: Data passed (preserves msg.data)
/// - CREATE/CREATE2: Constructor arguments
///
/// Accessed via CALLDATALOAD, CALLDATASIZE, CALLDATACOPY opcodes.
input: []const u8,

// ============================================================================
// Execution Flags
// ============================================================================

/// Indicates this is a contract deployment (CREATE/CREATE2).
///
/// When true:
/// - Executing initialization code (constructor)
/// - No deployed code exists at the address yet
/// - Result will be stored as contract code if successful
is_deployment: bool,

/// Indicates this is a system-level call.
///
/// System calls bypass certain checks and gas costs.
/// Used for precompiles and protocol-level operations.
is_system_call: bool,

/// Indicates read-only execution context (STATICCALL).
///
/// When true, these operations will fail:
/// - SSTORE (storage modification)
/// - LOG0-LOG4 (event emission)
/// - CREATE/CREATE2 (contract creation)
/// - SELFDESTRUCT (contract destruction)
/// - CALL with value transfer
is_static: bool,

// ============================================================================
// Storage Access Tracking (EIP-2929)
// ============================================================================

/// Tracks which storage slots have been accessed (warm vs cold).
///
/// EIP-2929 charges different gas costs:
/// - Cold access (first time): 2100 gas
/// - Warm access (subsequent): 100 gas
///
/// Key: storage slot, Value: true (accessed)
/// Can be borrowed from StoragePool for efficiency.
storage_access: ?*std.AutoHashMap(u256, bool),

/// Tracks original storage values for gas refund calculations.
///
/// Used by SSTORE to determine gas costs and refunds based on:
/// - Original value (at transaction start)
/// - Current value (in storage)
/// - New value (being set)
///
/// Key: storage slot, Value: original value
original_storage: ?*std.AutoHashMap(u256, u256),

/// Whether this contract address was cold at call start.
///
/// Used for EIP-2929 gas calculations:
/// - Cold contract: Additional 2600 gas for first access
/// - Warm contract: No additional cost
///
/// Contracts become warm after first access in a transaction.
is_cold: bool,

// ============================================================================
// Optimization Fields
// ============================================================================

/// Quick flag indicating if bytecode contains any JUMPDEST opcodes.
///
/// Enables fast-path optimization:
/// - If false, all jumps fail immediately (no valid destinations)
/// - If true, full JUMPDEST analysis is needed
///
/// Set during initialization by scanning bytecode.
has_jumpdests: bool,

/// Flag indicating empty bytecode.
///
/// Empty contracts (no code) are common in Ethereum:
/// - EOAs (externally owned accounts)
/// - Destroyed contracts
/// - Contracts that failed deployment
///
/// Enables fast-path for calls to codeless addresses.
is_empty: bool,

/// Creates a new Contract for executing existing deployed code.
///
/// This is the standard constructor for CALL, CALLCODE, DELEGATECALL,
/// and STATICCALL operations. The contract code must already exist
/// at the specified address.
///
/// ## Parameters
/// - `caller`: The address initiating this call (msg.sender)
/// - `addr`: The address where the code is deployed
/// - `value`: Wei being transferred (0 for DELEGATECALL/STATICCALL)
/// - `gas`: Gas allocated for this execution
/// - `code`: The contract bytecode to execute
/// - `code_hash`: Keccak256 hash of the bytecode
/// - `input`: Call data (function selector + arguments)
/// - `is_static`: Whether this is a read-only context
///
/// ## Example
/// ```zig
/// const contract = Contract.init(
///     caller_address,
///     contract_address,
///     value,
///     gas_limit,
///     bytecode,
///     bytecode_hash,
///     calldata,
///     false, // not static
/// );
/// ```
pub fn init(
    caller: Address.Address,
    addr: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    code_hash: [32]u8,
    input: []const u8,
    is_static: bool,
) Self {
    return Self{
        .address = addr,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = code_hash,
        .code_size = code.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };
}

/// Creates a new Contract for deploying new bytecode.
///
/// Used for CREATE and CREATE2 operations. The contract address
/// is initially zero and will be set by the VM after computing
/// the deployment address.
///
/// ## Parameters
/// - `caller`: The creating contract's address
/// - `value`: Initial balance for the new contract
/// - `gas`: Gas allocated for deployment
/// - `code`: Initialization bytecode (constructor)
/// - `salt`: Optional salt for CREATE2 (null for CREATE)
///
/// ## Address Calculation
/// - CREATE: address = keccak256(rlp([sender, nonce]))[12:]
/// - CREATE2: address = keccak256(0xff ++ sender ++ salt ++ keccak256(code))[12:]
///
/// ## Deployment Flow
/// 1. Execute initialization code
/// 2. Code returns runtime bytecode
/// 3. VM stores runtime bytecode at computed address
/// 4. Contract becomes callable at that address
///
/// ## Example
/// ```zig
/// // CREATE
/// const contract = Contract.init_deployment(
///     deployer_address,
///     initial_balance,
///     gas_limit,
///     init_bytecode,
///     null, // no salt for CREATE
/// );
/// ```
pub fn init_deployment(
    caller: Address.Address,
    value: u256,
    gas: u64,
    code: []const u8,
    salt: ?[32]u8,
) Self {
    const contract = Self{
        .address = Address.zero(),
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = code,
        .code_hash = [_]u8{0} ** 32, // Deployment doesn't have code hash. This could be kekkac256(0) instead of 0
        .code_size = code.len,
        .input = &[_]u8{},
        .is_static = false,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = false, // Deployment is always warm
        .gas_refund = 0,
        .is_deployment = true,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(code),
        .is_empty = code.len == 0,
    };

    if (salt == null) return contract;
    // Salt is used for CREATE2 address calculation
    // The actual address calculation happens in the VM's create2_contract method

    return contract;
}

/// Performs a quick scan to check if bytecode contains any JUMPDEST opcodes.
///
/// This is a fast O(n) scan used during contract initialization to set
/// the `has_jumpdests` flag. If no JUMPDESTs exist, we can skip all
/// jump validation as any JUMP/JUMPI will fail.
///
/// ## Note
/// This doesn't account for JUMPDEST bytes inside PUSH data.
/// Full analysis is deferred until actually needed (lazy evaluation).
///
/// ## Returns
/// - `true`: At least one 0x5B byte found
/// - `false`: No JUMPDEST opcodes present
fn contains_jumpdest(code: []const u8) bool {
    for (code) |op| {
        if (op == constants.JUMPDEST) return true;
    }
    return false;
}

/// Validates if a jump destination is valid within the contract bytecode.
///
/// A valid jump destination must:
/// 1. Be within code bounds (< code_size)
/// 2. Point to a JUMPDEST opcode (0x5B)
/// 3. Not be inside PUSH data (validated by code analysis)
///
/// ## Parameters
/// - `allocator`: Allocator for lazy code analysis
/// - `dest`: Target program counter from JUMP/JUMPI
///
/// ## Returns
/// - `true`: Valid JUMPDEST at the target position
/// - `false`: Invalid destination (out of bounds, not JUMPDEST, or in data)
///
/// ## Performance
/// - Fast path: Empty code or no JUMPDESTs (immediate false)
/// - Analyzed code: O(log n) binary search
/// - First jump: O(n) analysis then O(log n) search
///
/// ## Example
/// ```zig
/// if (!contract.valid_jumpdest(allocator, jump_target)) {
///     return ExecutionError.InvalidJump;
/// }
/// ```
pub fn valid_jumpdest(self: *Self, allocator: std.mem.Allocator, dest: u256) bool {
    // Fast path: empty code or out of bounds
    if (self.is_empty or dest >= self.code_size) return false;

    // Fast path: no JUMPDESTs in code
    if (!self.has_jumpdests) return false;
    const pos: u32 = @intCast(@min(dest, std.math.maxInt(u32)));

    // Ensure analysis is performed
    self.ensure_analysis(allocator);

    // Binary search in sorted JUMPDEST positions
    if (self.analysis) |analysis| {
        if (analysis.jumpdest_positions.len > 0) {
            const Context = struct { target: u32 };
            const found = std.sort.binarySearch(
                u32,
                analysis.jumpdest_positions,
                Context{ .target = pos },
                struct {
                    fn compare(ctx: Context, item: u32) std.math.Order {
                        return std.math.order(ctx.target, item);
                    }
                }.compare,
            );
            return found != null;
        }
    }
    // Fallback to bitvec check
    return self.is_code(pos);
}

/// Ensure code analysis is performed
fn ensure_analysis(self: *Self, allocator: std.mem.Allocator) void {
    if (self.analysis == null and !self.is_empty) {
        self.analysis = analyze_code(allocator, self.code, self.code_hash) catch null;
    }
}

/// Check if position is code (not data)
pub fn is_code(self: *const Self, pos: u64) bool {
    if (self.analysis) |analysis| {
        // We know pos is within bounds if analysis exists, so use unchecked version
        return analysis.code_segments.is_set_unchecked(@intCast(pos));
    }
    return true;
}

/// Attempts to consume gas from the contract's available gas.
///
/// This is the primary gas accounting method, called before every
/// operation to ensure sufficient gas remains. The inline directive
/// ensures this hot-path function has minimal overhead.
///
/// ## Parameters
/// - `amount`: Gas units to consume
///
/// ## Returns
/// - `true`: Gas successfully deducted
/// - `false`: Insufficient gas (triggers out-of-gas error)
///
/// ## Usage
/// ```zig
/// if (!contract.use_gas(operation_cost)) {
///     return ExecutionError.OutOfGas;
/// }
/// ```
///
/// ## Note
/// This method is marked inline for performance as it's called
/// millions of times during contract execution.
pub fn use_gas(self: *Self, amount: u64) bool {
    if (self.gas < amount) return false;
    self.gas -= amount;
    return true;
}

/// Use gas without checking (when known safe)
pub fn use_gas_unchecked(self: *Self, amount: u64) void {
    self.gas -= amount;
}

/// Refund gas to contract
pub fn refund_gas(self: *Self, amount: u64) void {
    self.gas += amount;
}

/// Add to gas refund counter with clamping
pub fn add_gas_refund(self: *Self, amount: u64) void {
    const max_refund = self.gas / MAX_REFUND_QUOTIENT;
    self.gas_refund = @min(self.gas_refund + amount, max_refund);
}

/// Subtract from gas refund counter with clamping
pub fn sub_gas_refund(self: *Self, amount: u64) void {
    self.gas_refund = if (self.gas_refund > amount) self.gas_refund - amount else 0;
}

pub const MarkStorageSlotWarmError = error{
    OutOfAllocatorMemory,
};

/// Mark storage slot as warm with pool support
pub fn mark_storage_slot_warm(self: *Self, allocator: std.mem.Allocator, slot: u256, pool: ?*StoragePool) MarkStorageSlotWarmError!bool {
    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| switch (err) {
                StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => {
                    Log.debug("Contract.mark_storage_slot_warm: failed to borrow access map: {any}", .{err});
                    return MarkStorageSlotWarmError.OutOfAllocatorMemory;
                },
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Contract.mark_storage_slot_warm: allocation failed: {any}", .{err});
                return MarkStorageSlotWarmError.OutOfAllocatorMemory;
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    const was_cold = !map.contains(slot);
    if (was_cold) {
        map.put(slot, true) catch |err| {
            Log.debug("Contract.mark_storage_slot_warm: map.put failed: {any}", .{err});
            return MarkStorageSlotWarmError.OutOfAllocatorMemory;
        };
    }
    return was_cold;
}

/// Check if storage slot is cold
pub fn is_storage_slot_cold(self: *const Self, slot: u256) bool {
    if (self.storage_access) |map| {
        return !map.contains(slot);
    }
    return true;
}

/// Batch mark storage slots as warm
pub fn mark_storage_slots_warm(self: *Self, allocator: std.mem.Allocator, slots: []const u256, pool: ?*StoragePool) ContractError!void {
    if (slots.len == 0) return;

    if (self.storage_access == null) {
        if (pool) |p| {
            self.storage_access = p.borrow_access_map() catch |err| {
                Log.debug("Failed to borrow access map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowAccessMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.storage_access = allocator.create(std.AutoHashMap(u256, bool)) catch |err| {
                Log.debug("Failed to create storage access map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.storage_access.?.* = std.AutoHashMap(u256, bool).init(allocator);
        }
    }

    const map = self.storage_access.?;
    map.ensureTotalCapacity(@as(u32, @intCast(map.count() + slots.len))) catch |err| {
        Log.debug("Failed to ensure capacity for {d} storage slots: {any}", .{ slots.len, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };

    for (slots) |slot| {
        map.putAssumeCapacity(slot, true);
    }
}

/// Store original storage value
pub fn set_original_storage_value(self: *Self, allocator: std.mem.Allocator, slot: u256, value: u256, pool: ?*StoragePool) ContractError!void {
    if (self.original_storage == null) {
        if (pool) |p| {
            self.original_storage = p.borrow_storage_map() catch |err| {
                Log.debug("Failed to borrow storage map from pool: {any}", .{err});
                return switch (err) {
                    StoragePool.BorrowStorageMapError.OutOfAllocatorMemory => StorageOperationError.OutOfAllocatorMemory,
                };
            };
        } else {
            self.original_storage = allocator.create(std.AutoHashMap(u256, u256)) catch |err| {
                Log.debug("Failed to create original storage map: {any}", .{err});
                return switch (err) {
                    std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
                };
            };
            self.original_storage.?.* = std.AutoHashMap(u256, u256).init(allocator);
        }
    }

    self.original_storage.?.put(slot, value) catch |err| {
        Log.debug("Failed to store original storage value for slot {d}: {any}", .{ slot, err });
        return switch (err) {
            std.mem.Allocator.Error.OutOfMemory => std.mem.Allocator.Error.OutOfMemory,
        };
    };
}

/// Get original storage value
pub fn get_original_storage_value(self: *const Self, slot: u256) ?u256 {
    if (self.original_storage) |map| {
        return map.get(slot);
    }
    return null;
}

/// Get opcode at position (inline for performance)
pub fn get_op(self: *const Self, n: u64) u8 {
    return if (n < self.code_size) self.code[@intCast(n)] else constants.STOP;
}

/// Get opcode at position without bounds check
pub fn get_op_unchecked(self: *const Self, n: u64) u8 {
    return self.code[n];
}

/// Set call code (for CALLCODE/DELEGATECALL)
pub fn set_call_code(self: *Self, hash: [32]u8, code: []const u8) void {
    self.code = code;
    self.code_hash = hash;
    self.code_size = code.len;
    self.has_jumpdests = contains_jumpdest(code);
    self.is_empty = code.len == 0;
    self.analysis = null;
}

/// Clean up contract resources
pub fn deinit(self: *Self, allocator: std.mem.Allocator, pool: ?*StoragePool) void {
    if (pool) |p| {
        if (self.storage_access) |map| {
            p.return_access_map(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            p.return_storage_map(map);
            self.original_storage = null;
        }
    } else {
        if (self.storage_access) |map| {
            map.deinit();
            allocator.destroy(map);
            self.storage_access = null;
        }
        if (self.original_storage) |map| {
            map.deinit();
            allocator.destroy(map);
            self.original_storage = null;
        }
    }
    // Analysis is typically cached globally, so don't free
}

/// Analyzes bytecode and caches the results globally for reuse.
///
/// This function performs comprehensive static analysis on EVM bytecode:
/// 1. Identifies code vs data segments (for JUMPDEST validation)
/// 2. Extracts and sorts all JUMPDEST positions
/// 3. Detects special opcodes (CREATE, SELFDESTRUCT, dynamic jumps)
/// 4. Caches results by code hash for reuse
///
/// ## Parameters
/// - `allocator`: Memory allocator for analysis structures
/// - `code`: The bytecode to analyze
/// - `code_hash`: Hash for cache lookup/storage
///
/// ## Returns
/// Pointer to CodeAnalysis (cached or newly created)
///
/// ## Performance
/// - First analysis: O(n) where n is code length
/// - Subsequent calls: O(1) cache lookup
/// - Thread-safe with mutex protection
///
/// ## Caching Strategy
/// Analysis results are cached globally by code hash. This is highly
/// effective as the same contract code is often executed many times
/// across different addresses (e.g., proxy patterns, token contracts).
///
/// ## Example
/// ```zig
/// const analysis = try Contract.analyze_code(
///     allocator,
///     bytecode,
///     bytecode_hash,
/// );
/// // Analysis is now cached for future use
/// ```
pub fn analyze_code(allocator: std.mem.Allocator, code: []const u8, code_hash: [32]u8) CodeAnalysisError!*const CodeAnalysis {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache == null) {
        analysis_cache = std.AutoHashMap([32]u8, *CodeAnalysis).init(allocator);
    }

    if (analysis_cache.?.get(code_hash)) |cached| {
        return cached;
    }

    const analysis = allocator.create(CodeAnalysis) catch |err| {
        Log.debug("Failed to allocate CodeAnalysis: {any}", .{err});
        return err;
    };

    analysis.code_segments = try bitvec.code_bitmap(allocator, code);

    var jumpdests = std.ArrayList(u32).init(allocator);
    defer jumpdests.deinit();

    var i: usize = 0;
    while (i < code.len) {
        const op = code[i];

        if (op == constants.JUMPDEST and analysis.code_segments.is_set_unchecked(i)) {
            jumpdests.append(@as(u32, @intCast(i))) catch |err| {
                Log.debug("Failed to append jumpdest position {d}: {any}", .{ i, err });
                return err;
            };
        }

        if (constants.is_push(op)) {
            const push_size = constants.get_push_size(op);
            i += push_size + 1;
        } else {
            i += 1;
        }
    }

    // Sort for binary search
    std.mem.sort(u32, jumpdests.items, {}, comptime std.sort.asc(u32));
    analysis.jumpdest_positions = jumpdests.toOwnedSlice() catch |err| {
        Log.debug("Failed to convert jumpdests to owned slice: {any}", .{err});
        return err;
    };

    analysis.max_stack_depth = 0;
    analysis.block_gas_costs = null;
    analysis.has_dynamic_jumps = contains_op(code, &[_]u8{ constants.JUMP, constants.JUMPI });
    analysis.has_static_jumps = false;
    analysis.has_selfdestruct = contains_op(code, &[_]u8{constants.SELFDESTRUCT});
    analysis.has_create = contains_op(code, &[_]u8{ constants.CREATE, constants.CREATE2 });

    analysis_cache.?.put(code_hash, analysis) catch |err| {
        Log.debug("Failed to cache code analysis: {any}", .{err});
        // Continue without caching - return the analysis anyway
    };

    return analysis;
}

/// Check if code contains any of the given opcodes
pub fn contains_op(code: []const u8, opcodes: []const u8) bool {
    for (code) |op| {
        for (opcodes) |target| {
            if (op == target) return true;
        }
    }
    return false;
}

/// Clear the global analysis cache
pub fn clear_analysis_cache(allocator: std.mem.Allocator) void {
    cache_mutex.lock();
    defer cache_mutex.unlock();

    if (analysis_cache) |*cache| {
        var iter = cache.iterator();
        while (iter.next()) |entry| {
            entry.value_ptr.*.deinit(allocator);
            allocator.destroy(entry.value_ptr.*);
        }
        cache.deinit();
        analysis_cache = null;
    }
}

/// Analyze jump destinations - public wrapper for ensure_analysis
pub fn analyze_jumpdests(self: *Self, allocator: std.mem.Allocator) void {
    self.ensure_analysis(allocator);
}

/// Create a contract to execute bytecode at a specific address
/// This is useful for testing or executing code that should be treated as if it's deployed at an address
/// The caller must separately call vm.state.set_code(address, bytecode) to deploy the code
pub fn init_at_address(
    caller: Address.Address,
    address: Address.Address,
    value: u256,
    gas: u64,
    bytecode: []const u8,
    input: []const u8,
    is_static: bool,
) Self {
    // Calculate code hash for the bytecode
    var hasher = std.crypto.hash.sha3.Keccak256.init(.{});
    hasher.update(bytecode);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    return Self{
        .address = address,
        .caller = caller,
        .value = value,
        .gas = gas,
        .code = bytecode,
        .code_hash = code_hash,
        .code_size = bytecode.len,
        .input = input,
        .is_static = is_static,
        .analysis = null,
        .storage_access = null,
        .original_storage = null,
        .is_cold = true,
        .gas_refund = 0,
        .is_deployment = false,
        .is_system_call = false,
        .has_jumpdests = contains_jumpdest(bytecode),
        .is_empty = bytecode.len == 0,
    };
}
```
```zig [src/evm/contract/code_analysis.zig]
const std = @import("std");
const bitvec = @import("bitvec.zig");

/// Advanced code analysis for EVM bytecode optimization.
///
/// This structure holds pre-computed analysis results for a contract's bytecode,
/// enabling efficient execution by pre-identifying jump destinations, code segments,
/// and other properties that would otherwise need to be computed at runtime.
///
/// The analysis is performed once when a contract is first loaded and cached for
/// subsequent executions, significantly improving performance for frequently-used
/// contracts.
///
/// ## Fields
/// - `code_segments`: Bit vector marking which bytes are executable code vs data
/// - `jumpdest_positions`: Sorted array of valid JUMPDEST positions for O(log n) validation
/// - `block_gas_costs`: Optional pre-computed gas costs for basic blocks
/// - `max_stack_depth`: Maximum stack depth required by the contract
/// - `has_dynamic_jumps`: Whether the code contains JUMP/JUMPI with dynamic targets
/// - `has_static_jumps`: Whether the code contains JUMP/JUMPI with static targets
/// - `has_selfdestruct`: Whether the code contains SELFDESTRUCT opcode
/// - `has_create`: Whether the code contains CREATE/CREATE2 opcodes
///
/// ## Performance
/// - Jump destination validation: O(log n) using binary search
/// - Code segment checking: O(1) using bit vector
/// - Enables dead code elimination and other optimizations
///
/// ## Memory Management
/// The analysis owns its allocated memory and must be properly cleaned up
/// using the `deinit` method to prevent memory leaks.
const Self = @This();

/// Bit vector marking which bytes in the bytecode are executable code vs data.
/// 
/// Each bit corresponds to a byte in the contract bytecode:
/// - 1 = executable code byte
/// - 0 = data byte (e.g., PUSH arguments)
///
/// This is critical for JUMPDEST validation since jump destinations
/// must point to actual code, not data bytes within PUSH instructions.
code_segments: bitvec,

/// Sorted array of all valid JUMPDEST positions in the bytecode.
///
/// Pre-sorted to enable O(log n) binary search validation of jump targets.
/// Only positions marked as code (not data) and containing the JUMPDEST
/// opcode (0x5B) are included.
jumpdest_positions: []const u32,

/// Optional pre-computed gas costs for each basic block.
///
/// When present, enables advanced gas optimization by pre-calculating
/// the gas cost of straight-line code sequences between jumps.
/// This is an optional optimization that may not be computed for all contracts.
block_gas_costs: ?[]const u32,

/// Maximum stack depth required by any execution path in the contract.
///
/// Pre-computed through static analysis to enable early detection of
/// stack overflow conditions. A value of 0 indicates the depth wasn't analyzed.
max_stack_depth: u16,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with dynamic targets.
///
/// Dynamic jumps (where the target is computed at runtime) prevent certain
/// optimizations and require full jump destination validation at runtime.
has_dynamic_jumps: bool,

/// Indicates whether the contract contains JUMP/JUMPI opcodes with static targets.
///
/// Static jumps (where the target is a constant) can be pre-validated
/// and optimized during analysis.
has_static_jumps: bool,

/// Indicates whether the contract contains the SELFDESTRUCT opcode (0xFF).
///
/// Contracts with SELFDESTRUCT require special handling for state management
/// and cannot be marked as "pure" or side-effect free.
has_selfdestruct: bool,

/// Indicates whether the contract contains CREATE or CREATE2 opcodes.
///
/// Contracts that can deploy other contracts require additional
/// gas reservation and state management considerations.
has_create: bool,

/// Releases all memory allocated by this code analysis.
///
/// This method must be called when the analysis is no longer needed to prevent
/// memory leaks. It safely handles all owned resources including:
/// - The code segments bit vector
/// - The jumpdest positions array
/// - The optional block gas costs array
///
/// ## Parameters
/// - `self`: The analysis instance to clean up
/// - `allocator`: The same allocator used to create the analysis resources
///
/// ## Safety
/// After calling deinit, the analysis instance should not be used again.
/// All pointers to analysis data become invalid.
///
/// ## Example
/// ```zig
/// var analysis = try analyzeCode(allocator, bytecode);
/// defer analysis.deinit(allocator);
/// ```
pub fn deinit(self: *Self, allocator: std.mem.Allocator) void {
    self.code_segments.deinit(allocator);
    if (self.jumpdest_positions.len > 0) {
        allocator.free(self.jumpdest_positions);
    }
    if (self.block_gas_costs) |costs| {
        allocator.free(costs);
    }
}
```
```zig [src/evm/memory_size.zig]
/// Memory access requirements for EVM operations.
///
/// MemorySize encapsulates the memory region that an operation needs to access,
/// defined by an offset and size. This is used for:
/// - Calculating memory expansion costs
/// - Validating memory bounds
/// - Pre-allocating memory before operations
///
/// ## Memory Expansion
/// The EVM charges gas for memory expansion in 32-byte words. When an operation
/// accesses memory beyond the current size, the memory must expand to accommodate
/// it, incurring additional gas costs.
///
/// ## Gas Calculation
/// Memory expansion cost is quadratic:
/// - memory_cost = (memory_size_word ** 2) / 512 + (3 * memory_size_word)
/// - memory_size_word = (offset + size + 31) / 32
///
/// ## Zero-Size Edge Case
/// Operations with size=0 don't access memory and don't trigger expansion,
/// regardless of the offset value. This is important for operations like
/// RETURNDATACOPY with zero length.
///
/// Example:
/// ```zig
/// // MLOAD at offset 0x100 needs 32 bytes
/// const mem_size = MemorySize{ .offset = 0x100, .size = 32 };
/// 
/// // Calculate required memory size
/// const required = mem_size.offset + mem_size.size; // 0x120
/// ```
const Self = @This();

/// Starting offset in memory where the operation begins.
/// This is typically popped from the stack.
offset: u64,

/// Number of bytes the operation needs to access.
/// A size of 0 means no memory access (and no expansion).
size: u64,
```
```zig [src/evm/wasm_stubs.zig]
// Minimal stubs for WASM/freestanding build
const std = @import("std");

// Thread stub for single-threaded WASM
pub const DummyMutex = struct {
    pub fn lock(self: *@This()) void { _ = self; }
    pub fn unlock(self: *@This()) void { _ = self; }
};

// Logging stub for WASM
pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.enum_literal),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args;
    // No-op in WASM
}

// Panic stub for WASM
pub fn panic(msg: []const u8, error_return_trace: ?*std.builtin.StackTrace, ret_addr: ?usize) noreturn {
    _ = msg;
    _ = error_return_trace;
    _ = ret_addr;
    unreachable;
}
```
```zig [src/evm/precompiles/precompile_addresses.zig]
const Address = @import("Address").Address;

/// Precompile addresses as defined by the Ethereum specification
/// These addresses are reserved for built-in precompiled contracts

/// ECRECOVER precompile - signature recovery
pub const ECRECOVER_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x01 };

/// SHA256 precompile - SHA-256 hash function
pub const SHA256_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x02 };

/// RIPEMD160 precompile - RIPEMD-160 hash function
pub const RIPEMD160_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x03 };

/// IDENTITY precompile - returns input data unchanged
pub const IDENTITY_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x04 };

/// MODEXP precompile - modular exponentiation
pub const MODEXP_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x05 };

/// ECADD precompile - elliptic curve addition on alt_bn128
pub const ECADD_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x06 };

/// ECMUL precompile - elliptic curve scalar multiplication on alt_bn128
pub const ECMUL_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x07 };

/// ECPAIRING precompile - elliptic curve pairing check on alt_bn128
pub const ECPAIRING_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x08 };

/// BLAKE2F precompile - BLAKE2b F compression function
pub const BLAKE2F_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x09 };

/// POINT_EVALUATION precompile - KZG point evaluation (EIP-4844)
pub const POINT_EVALUATION_ADDRESS: Address = [_]u8{ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x0A };

/// Checks if the given address is a precompile address
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    // Check if the first 19 bytes are zero
    for (address[0..19]) |byte| {
        if (byte != 0) return false;
    }
    
    // Check if the last byte is in the precompile range (1-10)
    const last_byte = address[19];
    return last_byte >= 1 and last_byte <= 10;
}

/// Gets the precompile ID from an address
/// @param address The precompile address
/// @return The precompile ID (1-10) or 0 if not a precompile
pub fn get_precompile_id(address: Address) u8 {
    if (!is_precompile(address)) return 0;
    return address[19];
}```
```zig [src/evm/precompiles/precompiles.zig]
const std = @import("std");
const Address = @import("Address").Address;
const addresses = @import("precompile_addresses.zig");
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const identity = @import("identity.zig");
const ChainRules = @import("../hardforks/chain_rules.zig");

/// Main precompile dispatcher module
///
/// This module provides the main interface for precompile execution. It handles:
/// - Address-based precompile detection and routing
/// - Hardfork-based availability checks
/// - Unified execution interface for all precompiles
/// - Error handling and result management
///
/// The dispatcher is designed to be easily extensible for future precompiles.
/// Adding a new precompile requires:
/// 1. Adding the address constant to precompile_addresses.zig
/// 2. Implementing the precompile logic in its own module
/// 3. Adding the dispatch case to execute_precompile()
/// 4. Adding availability check to is_available()

/// Checks if the given address is a precompile address
///
/// This function determines whether a given address corresponds to a known precompile.
/// It serves as the entry point for precompile detection during contract calls.
///
/// @param address The address to check
/// @return true if the address is a known precompile, false otherwise
pub fn is_precompile(address: Address) bool {
    return addresses.is_precompile(address);
}

/// Checks if a precompile is available in the given chain rules
///
/// Different precompiles were introduced in different hardforks. This function
/// ensures that precompiles are only available when they should be according
/// to the Ethereum specification.
///
/// @param address The precompile address to check
/// @param chain_rules The current chain rules configuration
/// @return true if the precompile is available with these chain rules
pub fn is_available(address: Address, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) return false;
    
    const precompile_id = addresses.get_precompile_id(address);
    
    return switch (precompile_id) {
        1, 2, 3, 4 => true, // ECRECOVER, SHA256, RIPEMD160, IDENTITY available from Frontier
        5 => chain_rules.IsByzantium, // MODEXP from Byzantium
        6, 7, 8 => chain_rules.IsByzantium, // ECADD, ECMUL, ECPAIRING from Byzantium
        9 => chain_rules.IsIstanbul, // BLAKE2F from Istanbul
        10 => chain_rules.IsCancun, // POINT_EVALUATION from Cancun
        else => false,
    };
}

/// Executes a precompile with the given parameters
///
/// This is the main execution function that routes precompile calls to their
/// specific implementations. It handles:
/// - Precompile address validation
/// - Hardfork availability checks
/// - Routing to specific precompile implementations
/// - Consistent error handling
///
/// @param address The precompile address being called
/// @param input Input data for the precompile
/// @param output Output buffer to write results (must be large enough)
/// @param gas_limit Maximum gas available for execution
/// @param chain_rules Current chain rules for availability checking
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute_precompile(
    address: Address, 
    input: []const u8, 
    output: []u8, 
    gas_limit: u64, 
    chain_rules: ChainRules
) PrecompileOutput {
    // Check if this is a valid precompile address
    if (!is_precompile(address)) {
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Check if this precompile is available with the current chain rules
    if (!is_available(address, chain_rules)) {
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    const precompile_id = addresses.get_precompile_id(address);
    
    // Route to specific precompile implementation
    return switch (precompile_id) {
        4 => identity.execute(input, output, gas_limit), // IDENTITY
        
        // Placeholder implementations for future precompiles
        1 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // ECRECOVER - TODO
        2 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // SHA256 - TODO
        3 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // RIPEMD160 - TODO
        5 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // MODEXP - TODO
        6 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // ECADD - TODO
        7 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // ECMUL - TODO
        8 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // ECPAIRING - TODO
        9 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // BLAKE2F - TODO
        10 => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed), // POINT_EVALUATION - TODO
        
        else => PrecompileOutput.failure_result(PrecompileError.ExecutionFailed),
    };
}

/// Estimates the gas cost for a precompile call
///
/// This function calculates the gas cost for a precompile call without actually
/// executing it. Useful for gas estimation and transaction validation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Estimated gas cost or error if not available
pub fn estimate_gas(address: Address, input_size: usize, chain_rules: ChainRules) !u64 {
    if (!is_precompile(address)) {
        return error.InvalidPrecompile;
    }
    
    if (!is_available(address, chain_rules)) {
        return error.PrecompileNotAvailable;
    }
    
    const precompile_id = addresses.get_precompile_id(address);
    
    return switch (precompile_id) {
        4 => identity.calculate_gas_checked(input_size), // IDENTITY
        
        // Placeholder gas calculations for future precompiles
        1 => error.NotImplemented, // ECRECOVER - TODO
        2 => error.NotImplemented, // SHA256 - TODO
        3 => error.NotImplemented, // RIPEMD160 - TODO
        5 => error.NotImplemented, // MODEXP - TODO
        6 => error.NotImplemented, // ECADD - TODO
        7 => error.NotImplemented, // ECMUL - TODO
        8 => error.NotImplemented, // ECPAIRING - TODO
        9 => error.NotImplemented, // BLAKE2F - TODO
        10 => error.NotImplemented, // POINT_EVALUATION - TODO
        
        else => error.InvalidPrecompile,
    };
}

/// Gets the expected output size for a precompile call
///
/// Some precompiles have fixed output sizes, while others depend on the input.
/// This function provides a way to determine the required output buffer size.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param chain_rules Current chain rules
/// @return Expected output size or error if not available
pub fn get_output_size(address: Address, input_size: usize, chain_rules: ChainRules) !usize {
    if (!is_precompile(address)) {
        return error.InvalidPrecompile;
    }
    
    if (!is_available(address, chain_rules)) {
        return error.PrecompileNotAvailable;
    }
    
    const precompile_id = addresses.get_precompile_id(address);
    
    return switch (precompile_id) {
        4 => identity.get_output_size(input_size), // IDENTITY
        
        // Placeholder output sizes for future precompiles
        1 => 32, // ECRECOVER - fixed 32 bytes (address)
        2 => 32, // SHA256 - fixed 32 bytes (hash)
        3 => 32, // RIPEMD160 - fixed 32 bytes (hash, padded)
        5 => error.NotImplemented, // MODEXP - variable size, TODO
        6 => 64, // ECADD - fixed 64 bytes (point)
        7 => 64, // ECMUL - fixed 64 bytes (point)
        8 => 32, // ECPAIRING - fixed 32 bytes (boolean result)
        9 => 64, // BLAKE2F - fixed 64 bytes (state)
        10 => 64, // POINT_EVALUATION - fixed 64 bytes (proof result)
        
        else => error.InvalidPrecompile,
    };
}

/// Validates that a precompile call would succeed
///
/// This function performs all validation checks without executing the precompile.
/// Useful for transaction validation and gas estimation.
///
/// @param address The precompile address
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @param chain_rules Current chain rules
/// @return true if the call would succeed
pub fn validate_call(address: Address, input_size: usize, gas_limit: u64, chain_rules: ChainRules) bool {
    if (!is_precompile(address)) return false;
    if (!is_available(address, chain_rules)) return false;
    
    const gas_cost = estimate_gas(address, input_size, chain_rules) catch return false;
    return gas_cost <= gas_limit;
}```
```zig [src/evm/precompiles/precompile_result.zig]
const std = @import("std");

/// PrecompileError represents error conditions that can occur during precompile execution
///
/// Precompiles have different error conditions from regular EVM execution:
/// - OutOfGas: Gas limit exceeded during execution
/// - InvalidInput: Input data is malformed or invalid for the precompile
/// - ExecutionFailed: The precompile operation itself failed
pub const PrecompileError = error{
    /// Insufficient gas provided to complete the precompile operation
    /// This occurs when the calculated gas cost exceeds the provided gas limit
    OutOfGas,
    
    /// Input data is invalid for the specific precompile
    /// Each precompile has its own input validation requirements
    InvalidInput,
    
    /// The precompile operation failed during execution
    /// This covers cryptographic failures, computation errors, etc.
    ExecutionFailed,
    
    /// Memory allocation failed during precompile execution
    /// Not a normal precompile error - indicates system resource exhaustion
    OutOfMemory,
};

/// PrecompileResult represents the successful result of a precompile execution
///
/// Contains the gas consumed and the output data produced by the precompile.
/// Output data is owned by the caller and must be managed appropriately.
pub const PrecompileResult = struct {
    /// Amount of gas consumed by the precompile execution
    gas_used: u64,
    
    /// Length of the output data produced
    /// The actual output data is written to the provided output buffer
    output_size: usize,
};

/// PrecompileOutput represents the complete result of precompile execution
///
/// This is a union type that represents either success or failure of precompile execution.
/// Success contains gas usage and output size, while failure contains the specific error.
pub const PrecompileOutput = union(enum) {
    /// Successful execution with gas usage and output
    success: PrecompileResult,
    
    /// Failed execution with specific error
    failure: PrecompileError,
    
    /// Creates a successful result
    /// @param gas_used The amount of gas consumed
    /// @param output_size The size of the output data
    /// @return A successful PrecompileOutput
    pub fn success_result(gas_used: u64, output_size: usize) PrecompileOutput {
        return PrecompileOutput{ 
            .success = PrecompileResult{ 
                .gas_used = gas_used, 
                .output_size = output_size 
            } 
        };
    }
    
    /// Creates a failure result
    /// @param err The error that occurred
    /// @return A failed PrecompileOutput
    pub fn failure_result(err: PrecompileError) PrecompileOutput {
        return PrecompileOutput{ .failure = err };
    }
    
    /// Checks if the result represents success
    /// @return true if successful, false if failed
    pub fn is_success(self: PrecompileOutput) bool {
        return switch (self) {
            .success => true,
            .failure => false,
        };
    }
    
    /// Checks if the result represents failure
    /// @return true if failed, false if successful
    pub fn is_failure(self: PrecompileOutput) bool {
        return !self.is_success();
    }
    
    /// Gets the gas used from a successful result
    /// @return The gas used, or 0 if the result is a failure
    pub fn get_gas_used(self: PrecompileOutput) u64 {
        return switch (self) {
            .success => |result| result.gas_used,
            .failure => 0,
        };
    }
    
    /// Gets the output size from a successful result
    /// @return The output size, or 0 if the result is a failure
    pub fn get_output_size(self: PrecompileOutput) usize {
        return switch (self) {
            .success => |result| result.output_size,
            .failure => 0,
        };
    }
    
    /// Gets the error from a failed result
    /// @return The error, or null if the result is successful
    pub fn get_error(self: PrecompileOutput) ?PrecompileError {
        return switch (self) {
            .success => null,
            .failure => |err| err,
        };
    }
};

/// Get a human-readable description for a precompile error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// @param err The precompile error to describe
/// @return A string slice containing a human-readable description of the error
pub fn get_error_description(err: PrecompileError) []const u8 {
    return switch (err) {
        PrecompileError.OutOfGas => "Precompile execution ran out of gas",
        PrecompileError.InvalidInput => "Invalid input data for precompile",
        PrecompileError.ExecutionFailed => "Precompile execution failed",
        PrecompileError.OutOfMemory => "Out of memory during precompile execution",
    };
}```
```zig [src/evm/precompiles/precompile_gas.zig]
const std = @import("std");

/// Gas calculation utilities for precompiles
///
/// This module provides common gas calculation patterns used by precompiles.
/// Many precompiles use linear gas costs (base + per_word * word_count) or other
/// standard patterns defined here.

/// Calculates linear gas cost: base_cost + per_word_cost * ceil(input_size / 32)
///
/// This is the most common gas calculation pattern for precompiles. The cost consists
/// of a base cost plus a per-word cost for each 32-byte word of input data.
/// Partial words are rounded up to full words.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost for the operation
pub fn calculate_linear_cost(input_size: usize, base_cost: u64, per_word_cost: u64) u64 {
    const word_count = (input_size + 31) / 32;
    return base_cost + per_word_cost * @as(u64, @intCast(word_count));
}

/// Calculates linear gas cost with checked arithmetic to prevent overflow
///
/// Same as calculate_linear_cost but returns an error if the calculation would overflow.
/// This is important for very large input sizes that could cause integer overflow.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @return Total gas cost or error if overflow occurs
pub fn calculate_linear_cost_checked(input_size: usize, base_cost: u64, per_word_cost: u64) !u64 {
    const word_count = (input_size + 31) / 32;
    const word_count_u64 = std.math.cast(u64, word_count) orelse return error.Overflow;
    
    const word_cost = std.math.mul(u64, per_word_cost, word_count_u64) catch return error.Overflow;
    const total_cost = std.math.add(u64, base_cost, word_cost) catch return error.Overflow;
    
    return total_cost;
}

/// Validates that the gas limit is sufficient for the calculated cost
///
/// This is a convenience function that combines gas calculation with validation.
/// It calculates the required gas and checks if the provided limit is sufficient.
///
/// @param input_size Size of the input data in bytes
/// @param base_cost Base gas cost regardless of input size
/// @param per_word_cost Gas cost per 32-byte word of input
/// @param gas_limit Maximum gas available for the operation
/// @return The calculated gas cost if within limit, error otherwise
pub fn validate_gas_limit(input_size: usize, base_cost: u64, per_word_cost: u64, gas_limit: u64) !u64 {
    const gas_cost = try calculate_linear_cost_checked(input_size, base_cost, per_word_cost);
    
    if (gas_cost > gas_limit) {
        return error.OutOfGas;
    }
    
    return gas_cost;
}

/// Calculates the number of 32-byte words for a given byte size
///
/// This is a utility function for converting byte sizes to word counts.
/// Used when precompiles need to know the exact word count for other calculations.
///
/// @param byte_size Size in bytes
/// @return Number of 32-byte words (rounded up)
pub fn bytes_to_words(byte_size: usize) usize {
    return (byte_size + 31) / 32;
}

/// Calculates gas cost for dynamic-length operations
///
/// Some precompiles have more complex gas calculations that depend on the
/// content of the input data, not just its size. This provides a framework
/// for such calculations.
///
/// @param input_data The input data to analyze
/// @param base_cost Base gas cost
/// @param calculate_dynamic_cost Function to calculate additional cost based on input
/// @return Total gas cost
pub fn calculate_dynamic_cost(
    input_data: []const u8, 
    base_cost: u64, 
    calculate_dynamic_cost_fn: fn([]const u8) u64
) u64 {
    const dynamic_cost = calculate_dynamic_cost_fn(input_data);
    return base_cost + dynamic_cost;
}```
```zig [src/evm/precompiles/identity.zig]
const std = @import("std");
const PrecompileResult = @import("precompile_result.zig").PrecompileResult;
const PrecompileOutput = @import("precompile_result.zig").PrecompileOutput;
const PrecompileError = @import("precompile_result.zig").PrecompileError;
const gas_utils = @import("precompile_gas.zig");

/// IDENTITY precompile implementation (address 0x04)
///
/// The IDENTITY precompile is the simplest of all precompiles. It returns the input
/// data unchanged (identity function). Despite its simplicity, it serves important
/// purposes:
///
/// 1. **Data copying**: Efficiently copy data between different memory contexts
/// 2. **Gas measurement**: Provides predictable gas costs for data operations
/// 3. **Testing**: Simple precompile for testing the precompile infrastructure
/// 4. **Specification compliance**: Required by Ethereum specification
///
/// ## Gas Cost
/// 
/// The gas cost follows the standard linear formula:
/// - Base cost: 15 gas
/// - Per-word cost: 3 gas per 32-byte word (rounded up)
/// - Total: 15 + 3 * ceil(input_size / 32)
///
/// ## Examples
///
/// ```zig
/// // Empty input: 15 gas, empty output
/// const result1 = execute(&[_]u8{}, &output, 100);
///
/// // 32 bytes input: 15 + 3 = 18 gas, same output as input
/// const result2 = execute(&[_]u8{1, 2, 3, ...}, &output, 100);
///
/// // 33 bytes input: 15 + 3*2 = 21 gas (2 words), same output as input
/// const result3 = execute(&[_]u8{1, 2, 3, ..., 33}, &output, 100);
/// ```

/// Gas constants for IDENTITY precompile
/// These values are defined in the Ethereum specification and must match exactly
pub const IDENTITY_BASE_COST: u64 = 15;
pub const IDENTITY_WORD_COST: u64 = 3;

/// Calculates the gas cost for IDENTITY precompile execution
///
/// Uses the standard linear gas calculation: base + word_cost * word_count
/// Where word_count = ceil(input_size / 32)
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost for processing the given input size
pub fn calculate_gas(input_size: usize) u64 {
    return gas_utils.calculate_linear_cost(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Calculates the gas cost with overflow protection
///
/// Same as calculate_gas but returns an error if the calculation would overflow.
/// Important for very large input sizes in adversarial scenarios.
///
/// @param input_size Size of the input data in bytes
/// @return Gas cost or error if calculation overflows
pub fn calculate_gas_checked(input_size: usize) !u64 {
    return gas_utils.calculate_linear_cost_checked(input_size, IDENTITY_BASE_COST, IDENTITY_WORD_COST);
}

/// Executes the IDENTITY precompile
///
/// This is the main entry point for IDENTITY precompile execution. It performs
/// the following steps:
///
/// 1. Calculate the required gas cost
/// 2. Validate that the gas limit is sufficient
/// 3. Copy input data to output buffer
/// 4. Return success result with gas used and output size
///
/// The function assumes that the output buffer is large enough to hold the input data.
/// This is the caller's responsibility to ensure.
///
/// @param input Input data to be copied (identity operation)
/// @param output Output buffer to write the result (must be >= input.len)
/// @param gas_limit Maximum gas available for this operation
/// @return PrecompileOutput containing success/failure and gas usage
pub fn execute(input: []const u8, output: []u8, gas_limit: u64) PrecompileOutput {
    // Calculate gas cost for this input size
    const gas_cost = calculate_gas_checked(input.len) catch {
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    };
    
    // Check if we have enough gas
    if (gas_cost > gas_limit) {
        return PrecompileOutput.failure_result(PrecompileError.OutOfGas);
    }
    
    // Validate output buffer size
    if (output.len < input.len) {
        return PrecompileOutput.failure_result(PrecompileError.ExecutionFailed);
    }
    
    // Identity operation: copy input to output
    // This is the core functionality - simply copy the input unchanged
    if (input.len > 0) {
        @memcpy(output[0..input.len], input);
    }
    
    return PrecompileOutput.success_result(gas_cost, input.len);
}

/// Validates the gas requirement without executing
///
/// This function can be used to check if a call would succeed without actually
/// performing the operation. Useful for gas estimation and validation.
///
/// @param input_size Size of the input data
/// @param gas_limit Available gas limit
/// @return true if the operation would succeed, false if out of gas
pub fn validate_gas_requirement(input_size: usize, gas_limit: u64) bool {
    const gas_cost = calculate_gas_checked(input_size) catch return false;
    return gas_cost <= gas_limit;
}

/// Gets the expected output size for given input
///
/// For IDENTITY, the output size is always equal to the input size.
/// This function is provided for consistency with other precompiles.
///
/// @param input_size Size of the input data
/// @return Expected output size (same as input for IDENTITY)
pub fn get_output_size(input_size: usize) usize {
    return input_size;
}```
```zig [src/evm/constants/memory_limits.zig]
const std = @import("std");

/// EVM Memory Limit Constants
/// 
/// The EVM doesn't have a hard memory limit in the specification, but practical
/// limits exist due to gas costs. Memory expansion has quadratic gas costs that
/// make extremely large allocations prohibitively expensive.
///
/// Most production EVMs implement practical memory limits to prevent DoS attacks
/// and ensure predictable resource usage.

/// Maximum memory size in bytes (32 MB)
/// This is a reasonable limit that matches many production EVM implementations.
/// At 32 MB, the gas cost would be approximately:
/// - Words: 1,048,576 (32 MB / 32 bytes)
/// - Linear cost: 3 * 1,048,576 = 3,145,728 gas
/// - Quadratic cost: (1,048,576^2) / 512 = 2,147,483,648 gas
/// - Total: ~2.15 billion gas (far exceeding any reasonable block gas limit)
pub const MAX_MEMORY_SIZE: u64 = 32 * 1024 * 1024; // 32 MB

/// Alternative reasonable limits used by other implementations:
/// - 16 MB: More conservative limit
pub const CONSERVATIVE_MEMORY_LIMIT: u64 = 16 * 1024 * 1024;

/// - 64 MB: More permissive limit
pub const PERMISSIVE_MEMORY_LIMIT: u64 = 64 * 1024 * 1024;

/// Calculate the gas cost for a given memory size
pub fn calculate_memory_gas_cost(size_bytes: u64) u64 {
    const words = (size_bytes + 31) / 32;
    const linear_cost = 3 * words;
    const quadratic_cost = (words * words) / 512;
    return linear_cost + quadratic_cost;
}

/// Check if a memory size would exceed reasonable gas limits
pub fn is_memory_size_reasonable(size_bytes: u64, available_gas: u64) bool {
    const gas_cost = calculate_memory_gas_cost(size_bytes);
    return gas_cost <= available_gas;
}

test "memory gas costs" {
    const testing = std.testing;
    
    // Test small allocations
    try testing.expectEqual(@as(u64, 3), calculate_memory_gas_cost(32)); // 1 word
    try testing.expectEqual(@as(u64, 6), calculate_memory_gas_cost(64)); // 2 words
    
    // Test 1 KB
    const kb_cost = calculate_memory_gas_cost(1024);
    try testing.expect(kb_cost > 96); // Should be more than linear cost alone
    
    // Test 1 MB - should be very expensive
    const mb_cost = calculate_memory_gas_cost(1024 * 1024);
    try testing.expect(mb_cost > 1_000_000); // Over 1 million gas
    
    // Test 32 MB - should be prohibitively expensive
    const limit_cost = calculate_memory_gas_cost(MAX_MEMORY_SIZE);
    try testing.expect(limit_cost > 2_000_000_000); // Over 2 billion gas
}

test "reasonable memory sizes" {
    const testing = std.testing;
    
    // With 10 million gas (reasonable for a transaction)
    const available_gas: u64 = 10_000_000;
    
    // Small sizes should be reasonable
    try testing.expect(is_memory_size_reasonable(1024, available_gas)); // 1 KB
    try testing.expect(is_memory_size_reasonable(10 * 1024, available_gas)); // 10 KB
    
    // Large sizes should not be reasonable
    try testing.expect(!is_memory_size_reasonable(10 * 1024 * 1024, available_gas)); // 10 MB
    try testing.expect(!is_memory_size_reasonable(MAX_MEMORY_SIZE, available_gas)); // 32 MB
}
```
```zig [src/evm/constants/constants.zig]
//! EVM opcode constants and bytecode analysis utilities.
//!
//! This module serves as the central definition point for all EVM opcodes
//! and provides utility functions for bytecode analysis. All opcodes are
//! defined as comptime constants for zero-cost abstraction and compile-time
//! verification.
//!
//! ## Organization
//! Opcodes are grouped by their functional categories:
//! - Arithmetic operations (0x00-0x0B)
//! - Comparison & bitwise logic (0x10-0x1D)
//! - Keccak hashing (0x20)
//! - Environmental information (0x30-0x3F)
//! - Block information (0x40-0x4A)
//! - Stack, memory, storage operations (0x50-0x5F)
//! - Push operations (0x60-0x7F)
//! - Duplication operations (0x80-0x8F)
//! - Exchange operations (0x90-0x9F)
//! - Logging operations (0xA0-0xA4)
//! - System operations (0xF0-0xFF)
//!
//! ## Usage
//! ```zig
//! const opcode = bytecode[pc];
//! if (constants.is_push(opcode)) {
//!     const push_size = constants.get_push_size(opcode);
//!     // Skip over the push data
//!     pc += 1 + push_size;
//! }
//! ```
//!
//! ## Hardfork Considerations
//! Some opcodes are only available after specific hardforks:
//! - PUSH0 (0x5F): Shanghai
//! - TLOAD/TSTORE (0x5C/0x5D): Cancun
//! - MCOPY (0x5E): Cancun
//! - BASEFEE (0x48): London
//! - CHAINID (0x46): Istanbul
//!
//! Reference: https://www.evm.codes/

// ============================================================================
// Arithmetic Operations (0x00-0x0B)
// ============================================================================

/// Halts execution of the current context.
/// Stack: [] -> []
/// Gas: 0
pub const STOP: u8 = 0x00;

/// Addition operation with modulo 2^256.
/// Stack: [a, b] -> [a + b]
/// Gas: 3
pub const ADD: u8 = 0x01;
/// Multiplication operation with modulo 2^256.
/// Stack: [a, b] -> [a * b]
/// Gas: 5
pub const MUL: u8 = 0x02;

/// Subtraction operation with modulo 2^256.
/// Stack: [a, b] -> [a - b]
/// Gas: 3
pub const SUB: u8 = 0x03;

/// Integer division operation.
/// Stack: [a, b] -> [a / b] (0 if b == 0)
/// Gas: 5
pub const DIV: u8 = 0x04;
pub const SDIV: u8 = 0x05;
pub const MOD: u8 = 0x06;
pub const SMOD: u8 = 0x07;
pub const ADDMOD: u8 = 0x08;
pub const MULMOD: u8 = 0x09;
/// Exponential operation (a ** b).
/// Stack: [a, b] -> [a ** b]
/// Gas: 10 + 50 per byte in exponent
/// Note: Gas cost increases with size of exponent
pub const EXP: u8 = 0x0A;

/// Sign extension operation.
/// Stack: [b, x] -> [y] where y is sign-extended x from (b+1)*8 bits
/// Gas: 5
pub const SIGNEXTEND: u8 = 0x0B;

// ============================================================================
// Comparison & Bitwise Logic Operations (0x10-0x1D)
// ============================================================================
pub const LT: u8 = 0x10;
pub const GT: u8 = 0x11;
pub const SLT: u8 = 0x12;
pub const SGT: u8 = 0x13;
pub const EQ: u8 = 0x14;
pub const ISZERO: u8 = 0x15;
pub const AND: u8 = 0x16;
pub const OR: u8 = 0x17;
pub const XOR: u8 = 0x18;
pub const NOT: u8 = 0x19;
pub const BYTE: u8 = 0x1A;
pub const SHL: u8 = 0x1B;
pub const SHR: u8 = 0x1C;
pub const SAR: u8 = 0x1D;

// ============================================================================
// Cryptographic Operations (0x20)
// ============================================================================

/// Computes Keccak-256 hash of memory region.
/// Stack: [offset, size] -> [hash]
/// Gas: 30 + 6 per word + memory expansion
pub const KECCAK256: u8 = 0x20;

// ============================================================================
// Environmental Information (0x30-0x3F)
// ============================================================================
pub const ADDRESS: u8 = 0x30;
pub const BALANCE: u8 = 0x31;
pub const ORIGIN: u8 = 0x32;
pub const CALLER: u8 = 0x33;
pub const CALLVALUE: u8 = 0x34;
pub const CALLDATALOAD: u8 = 0x35;
pub const CALLDATASIZE: u8 = 0x36;
pub const CALLDATACOPY: u8 = 0x37;
pub const CODESIZE: u8 = 0x38;
pub const CODECOPY: u8 = 0x39;
pub const GASPRICE: u8 = 0x3A;
pub const EXTCODESIZE: u8 = 0x3B;
pub const EXTCODECOPY: u8 = 0x3C;
pub const RETURNDATASIZE: u8 = 0x3D;
pub const RETURNDATACOPY: u8 = 0x3E;
pub const EXTCODEHASH: u8 = 0x3F;

// ============================================================================
// Block Information (0x40-0x4A)
// ============================================================================
pub const BLOCKHASH: u8 = 0x40;
pub const COINBASE: u8 = 0x41;
pub const TIMESTAMP: u8 = 0x42;
pub const NUMBER: u8 = 0x43;
pub const PREVRANDAO: u8 = 0x44;
pub const GASLIMIT: u8 = 0x45;
pub const CHAINID: u8 = 0x46;
pub const SELFBALANCE: u8 = 0x47;
pub const BASEFEE: u8 = 0x48;
pub const BLOBHASH: u8 = 0x49;
pub const BLOBBASEFEE: u8 = 0x4A;

// ============================================================================
// Stack, Memory, Storage and Flow Operations (0x50-0x5F)
// ============================================================================
pub const POP: u8 = 0x50;
pub const MLOAD: u8 = 0x51;
pub const MSTORE: u8 = 0x52;
pub const MSTORE8: u8 = 0x53;
/// Load value from storage.
/// Stack: [key] -> [value]
/// Gas: 100 (warm) or 2100 (cold) since Berlin
pub const SLOAD: u8 = 0x54;

/// Store value to storage.
/// Stack: [key, value] -> []
/// Gas: Complex - depends on current value and new value
/// Note: Most expensive operation, can cost 20000 gas
pub const SSTORE: u8 = 0x55;
pub const JUMP: u8 = 0x56;
pub const JUMPI: u8 = 0x57;
pub const PC: u8 = 0x58;
pub const MSIZE: u8 = 0x59;
pub const GAS: u8 = 0x5A;
/// Valid jump destination marker.
/// Stack: [] -> []
/// Gas: 1
/// Note: Only opcode that can be jumped to
pub const JUMPDEST: u8 = 0x5B;
pub const TLOAD: u8 = 0x5C;
pub const TSTORE: u8 = 0x5D;
pub const MCOPY: u8 = 0x5E;
/// Push zero onto the stack (Shanghai hardfork).
/// Stack: [] -> [0]
/// Gas: 2
/// Note: More efficient than PUSH1 0x00
pub const PUSH0: u8 = 0x5F;

// ============================================================================
// Push Operations (0x60-0x7F)
// ============================================================================
pub const PUSH1: u8 = 0x60;
pub const PUSH2: u8 = 0x61;
pub const PUSH3: u8 = 0x62;
pub const PUSH4: u8 = 0x63;
pub const PUSH5: u8 = 0x64;
pub const PUSH6: u8 = 0x65;
pub const PUSH7: u8 = 0x66;
pub const PUSH8: u8 = 0x67;
pub const PUSH9: u8 = 0x68;
pub const PUSH10: u8 = 0x69;
pub const PUSH11: u8 = 0x6A;
pub const PUSH12: u8 = 0x6B;
pub const PUSH13: u8 = 0x6C;
pub const PUSH14: u8 = 0x6D;
pub const PUSH15: u8 = 0x6E;
pub const PUSH16: u8 = 0x6F;
pub const PUSH17: u8 = 0x70;
pub const PUSH18: u8 = 0x71;
pub const PUSH19: u8 = 0x72;
pub const PUSH20: u8 = 0x73;
pub const PUSH21: u8 = 0x74;
pub const PUSH22: u8 = 0x75;
pub const PUSH23: u8 = 0x76;
pub const PUSH24: u8 = 0x77;
pub const PUSH25: u8 = 0x78;
pub const PUSH26: u8 = 0x79;
pub const PUSH27: u8 = 0x7A;
pub const PUSH28: u8 = 0x7B;
pub const PUSH29: u8 = 0x7C;
pub const PUSH30: u8 = 0x7D;
pub const PUSH31: u8 = 0x7E;
pub const PUSH32: u8 = 0x7F;

// ============================================================================
// Duplication Operations (0x80-0x8F)
// ============================================================================
pub const DUP1: u8 = 0x80;
pub const DUP2: u8 = 0x81;
pub const DUP3: u8 = 0x82;
pub const DUP4: u8 = 0x83;
pub const DUP5: u8 = 0x84;
pub const DUP6: u8 = 0x85;
pub const DUP7: u8 = 0x86;
pub const DUP8: u8 = 0x87;
pub const DUP9: u8 = 0x88;
pub const DUP10: u8 = 0x89;
pub const DUP11: u8 = 0x8A;
pub const DUP12: u8 = 0x8B;
pub const DUP13: u8 = 0x8C;
pub const DUP14: u8 = 0x8D;
pub const DUP15: u8 = 0x8E;
pub const DUP16: u8 = 0x8F;

// ============================================================================
// Exchange Operations (0x90-0x9F)
// ============================================================================
pub const SWAP1: u8 = 0x90;
pub const SWAP2: u8 = 0x91;
pub const SWAP3: u8 = 0x92;
pub const SWAP4: u8 = 0x93;
pub const SWAP5: u8 = 0x94;
pub const SWAP6: u8 = 0x95;
pub const SWAP7: u8 = 0x96;
pub const SWAP8: u8 = 0x97;
pub const SWAP9: u8 = 0x98;
pub const SWAP10: u8 = 0x99;
pub const SWAP11: u8 = 0x9A;
pub const SWAP12: u8 = 0x9B;
pub const SWAP13: u8 = 0x9C;
pub const SWAP14: u8 = 0x9D;
pub const SWAP15: u8 = 0x9E;
pub const SWAP16: u8 = 0x9F;

// ============================================================================
// Logging Operations (0xA0-0xA4)
// ============================================================================
pub const LOG0: u8 = 0xA0;
pub const LOG1: u8 = 0xA1;
pub const LOG2: u8 = 0xA2;
pub const LOG3: u8 = 0xA3;
pub const LOG4: u8 = 0xA4;

// ============================================================================
// System Operations (0xF0-0xFF)
// ============================================================================
pub const CREATE: u8 = 0xF0;
pub const CALL: u8 = 0xF1;
pub const CALLCODE: u8 = 0xF2;
pub const RETURN: u8 = 0xF3;
pub const DELEGATECALL: u8 = 0xF4;
pub const CREATE2: u8 = 0xF5;
pub const RETURNDATALOAD: u8 = 0xF7;
pub const EXTCALL: u8 = 0xF8;
pub const EXTDELEGATECALL: u8 = 0xF9;
pub const STATICCALL: u8 = 0xFA;
pub const EXTSTATICCALL: u8 = 0xFB;
pub const REVERT: u8 = 0xFD;
pub const INVALID: u8 = 0xFE;
/// Destroy contract and send balance to address.
/// Stack: [address] -> []
/// Gas: 5000 + dynamic costs
/// Note: Deprecated - only works in same transaction (Cancun)
pub const SELFDESTRUCT: u8 = 0xFF;

/// Checks if an opcode is a PUSH operation (PUSH1-PUSH32).
///
/// PUSH operations place N bytes of immediate data onto the stack,
/// where N is determined by the specific PUSH opcode.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between PUSH1 (0x60) and PUSH32 (0x7F)
/// - `false` otherwise
///
/// ## Example
/// ```zig
/// if (is_push(opcode)) {
///     const data_size = get_push_size(opcode);
///     // Read `data_size` bytes following the opcode
/// }
/// ```
pub fn is_push(op: u8) bool {
    return op >= PUSH1 and op <= PUSH32;
}

/// Returns the number of immediate data bytes for a PUSH opcode.
///
/// PUSH1 pushes 1 byte, PUSH2 pushes 2 bytes, etc., up to PUSH32
/// which pushes 32 bytes of immediate data from the bytecode.
///
/// ## Parameters
/// - `op`: The opcode to analyze
///
/// ## Returns
/// - 1-32 for valid PUSH opcodes (PUSH1-PUSH32)
/// - 0 for non-PUSH opcodes
///
/// ## Algorithm
/// For valid PUSH opcodes: size = opcode - 0x60 + 1
///
/// ## Example
/// ```zig
/// const size = get_push_size(PUSH20); // Returns 20
/// const size2 = get_push_size(ADD);   // Returns 0
/// ```
pub fn get_push_size(op: u8) u8 {
    if (!is_push(op)) return 0;
    return op - PUSH1 + 1;
}

/// Checks if an opcode is a DUP operation (DUP1-DUP16).
///
/// DUP operations duplicate a stack item and push the copy onto the stack.
/// DUP1 duplicates the top item, DUP2 the second item, etc.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` if the opcode is between DUP1 (0x80) and DUP16 (0x8F)
/// - `false` otherwise
///
/// ## Stack Effect
/// DUPn: [... vn ... v1] -> [... vn ... v1 vn]
pub fn is_dup(op: u8) bool {
    return op >= DUP1 and op <= DUP16;
}

/// Get the stack position for a DUP opcode
/// Returns 0 for non-DUP opcodes
pub fn get_dup_position(op: u8) u8 {
    if (!is_dup(op)) return 0;
    return op - DUP1 + 1;
}

/// Check if an opcode is a SWAP operation
pub fn is_swap(op: u8) bool {
    return op >= SWAP1 and op <= SWAP16;
}

/// Get the stack position for a SWAP opcode
/// Returns 0 for non-SWAP opcodes
pub fn get_swap_position(op: u8) u8 {
    if (!is_swap(op)) return 0;
    return op - SWAP1 + 1;
}

/// Check if an opcode is a LOG operation
pub fn is_log(op: u8) bool {
    return op >= LOG0 and op <= LOG4;
}

/// Get the number of topics for a LOG opcode
/// Returns 0 for non-LOG opcodes
pub fn get_log_topic_count(op: u8) u8 {
    if (!is_log(op)) return 0;
    return op - LOG0;
}

/// Checks if an opcode terminates execution of the current context.
///
/// Terminating operations end the current execution context and cannot
/// be followed by any other operations in the execution flow.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns
/// - `true` for STOP, RETURN, REVERT, SELFDESTRUCT, INVALID
/// - `false` otherwise
///
/// ## Terminating Opcodes
/// - STOP (0x00): Halts execution successfully
/// - RETURN (0xF3): Returns data and halts successfully
/// - REVERT (0xFD): Reverts state changes and returns data
/// - SELFDESTRUCT (0xFF): Destroys contract and sends balance
/// - INVALID (0xFE): Invalid operation, always reverts
///
/// ## Usage
/// ```zig
/// if (is_terminating(opcode)) {
///     // This is the last operation in this context
///     return;
/// }
/// ```
pub fn is_terminating(op: u8) bool {
    return op == STOP or op == RETURN or op == REVERT or op == SELFDESTRUCT or op == INVALID;
}

/// Check if an opcode is a call operation
pub fn is_call(op: u8) bool {
    return op == CALL or op == CALLCODE or op == DELEGATECALL or op == STATICCALL or
        op == EXTCALL or op == EXTDELEGATECALL or op == EXTSTATICCALL;
}

/// Check if an opcode is a create operation
pub fn is_create(op: u8) bool {
    return op == CREATE or op == CREATE2;
}

/// Checks if an opcode can modify blockchain state.
///
/// State-modifying operations are restricted in static calls and
/// require special handling for gas accounting and rollback.
///
/// ## Parameters
/// - `op`: The opcode to check
///
/// ## Returns  
/// - `true` for operations that modify storage, create contracts, or emit logs
/// - `false` for read-only operations
///
/// ## State-Modifying Opcodes
/// - SSTORE: Modifies contract storage
/// - CREATE/CREATE2: Deploys new contracts
/// - SELFDESTRUCT: Destroys contract and transfers balance
/// - LOG0-LOG4: Emits events (modifies receipts)
///
/// ## Note
/// CALL can also modify state indirectly if it transfers value,
/// but this function only checks direct state modifications.
///
/// ## Static Call Protection
/// These operations will fail with an error if executed within
/// a STATICCALL context.
pub fn modifies_state(op: u8) bool {
    return op == SSTORE or op == CREATE or op == CREATE2 or op == SELFDESTRUCT or
        op == LOG0 or op == LOG1 or op == LOG2 or op == LOG3 or op == LOG4;
}

/// Check if an opcode is valid
pub fn is_valid(op: u8) bool {
    return op != INVALID;
}

// ============================================================================
// Contract Size and Gas Constants
// ============================================================================

/// Maximum allowed size for deployed contract bytecode.
///
/// ## Value
/// 24,576 bytes (24 KB)
///
/// ## Origin
/// Defined by EIP-170 (activated in Spurious Dragon hardfork)
///
/// ## Rationale
/// - Prevents excessive blockchain growth from large contracts
/// - Ensures contracts can be loaded into memory efficiently
/// - Encourages modular contract design
///
/// ## Implications
/// - Contract creation fails if initcode returns bytecode larger than this
/// - Does NOT limit initcode size (see EIP-3860 for that)
/// - Libraries and proxy patterns help work around this limit
///
/// Reference: https://eips.ethereum.org/EIPS/eip-170
pub const MAX_CODE_SIZE: u32 = 24576;

/// Gas cost per byte of deployed contract code.
///
/// ## Value
/// 200 gas per byte
///
/// ## Usage
/// Charged during contract creation (CREATE/CREATE2) based on the
/// size of the returned bytecode that will be stored on-chain.
///
/// ## Calculation
/// `deployment_gas_cost = len(returned_code) * 200`
///
/// ## Example
/// A 1000-byte contract costs an additional 200,000 gas to deploy
/// beyond the execution costs.
///
/// ## Note
/// This is separate from the initcode gas cost introduced in EIP-3860.
pub const DEPLOY_CODE_GAS_PER_BYTE: u64 = 200;
```
```zig [src/evm/constants/gas_constants.zig]
/// EVM gas cost constants for opcode execution
///
/// This module defines all gas cost constants used in EVM execution according
/// to the Ethereum Yellow Paper and various EIPs. Gas costs are critical for
/// preventing denial-of-service attacks and fairly pricing computational resources.
///
/// ## Gas Cost Categories
///
/// Operations are grouped by computational complexity:
/// - **Quick** (2 gas): Trivial operations like PC, MSIZE, GAS
/// - **Fastest** (3 gas): Simple arithmetic like ADD, SUB, NOT, LT, GT
/// - **Fast** (5 gas): More complex arithmetic like MUL, DIV, MOD
/// - **Mid** (8 gas): Advanced arithmetic like ADDMOD, MULMOD, SIGNEXTEND
/// - **Slow** (10 gas): Operations requiring more computation
/// - **Ext** (20+ gas): External operations like BALANCE, EXTCODESIZE
///
/// ## Historical Changes
///
/// Gas costs have evolved through various EIPs:
/// - EIP-150: Increased costs for IO-heavy operations
/// - EIP-2200: SSTORE net gas metering
/// - EIP-2929: Increased costs for cold storage/account access
/// - EIP-3529: Reduced refunds and cold access costs
/// - EIP-3860: Initcode metering
///
/// ## Usage
/// ```zig
/// const gas_cost = switch (opcode) {
///     0x01 => GasFastestStep, // ADD
///     0x02 => GasFastStep,    // MUL
///     0x20 => Keccak256Gas + (data_size_words * Keccak256WordGas),
///     else => 0,
/// };
/// ```

/// Gas cost for very cheap operations
/// Operations: ADDRESS, ORIGIN, CALLER, CALLVALUE, CALLDATASIZE, CODESIZE,
/// GASPRICE, RETURNDATASIZE, PC, MSIZE, GAS, CHAINID, SELFBALANCE
pub const GasQuickStep: u64 = 2;

/// Gas cost for simple arithmetic and logic operations
/// Operations: ADD, SUB, NOT, LT, GT, SLT, SGT, EQ, ISZERO, AND, OR, XOR,
/// CALLDATALOAD, MLOAD, MSTORE, MSTORE8, PUSH operations, DUP operations,
/// SWAP operations
pub const GasFastestStep: u64 = 3;

/// Gas cost for multiplication and division operations
/// Operations: MUL, DIV, SDIV, MOD, SMOD, EXP (per byte of exponent)
pub const GasFastStep: u64 = 5;

/// Gas cost for advanced arithmetic operations
/// Operations: ADDMOD, MULMOD, SIGNEXTEND, KECCAK256 (base cost)
pub const GasMidStep: u64 = 8;

/// Gas cost for operations requiring moderate computation
/// Operations: JUMPI
pub const GasSlowStep: u64 = 10;

/// Gas cost for operations that interact with other accounts/contracts
/// Operations: BALANCE, EXTCODESIZE, BLOCKHASH
pub const GasExtStep: u64 = 20;

// ============================================================================
// Hashing Operation Costs
// ============================================================================

/// Base gas cost for KECCAK256 (SHA3) operation
/// This is the fixed cost regardless of input size
pub const Keccak256Gas: u64 = 30;

/// Additional gas cost per 32-byte word for KECCAK256
/// Total cost = Keccak256Gas + (word_count * Keccak256WordGas)
pub const Keccak256WordGas: u64 = 6;

// ============================================================================
// Storage Operation Costs (EIP-2929 & EIP-2200)
// ============================================================================

/// Gas cost for SLOAD on a warm storage slot
/// After EIP-2929, warm access is significantly cheaper than cold
pub const SloadGas: u64 = 100;

/// Gas cost for first-time (cold) SLOAD access in a transaction
/// EIP-2929: Prevents underpriced state access attacks
pub const ColdSloadCost: u64 = 2100;

/// Gas cost for first-time (cold) account access in a transaction
/// EIP-2929: Applied to BALANCE, EXTCODESIZE, EXTCODECOPY, EXTCODEHASH, CALL family
pub const ColdAccountAccessCost: u64 = 2600;

/// Gas cost for warm storage read operations
/// EIP-2929: Subsequent accesses to the same slot/account in a transaction
pub const WarmStorageReadCost: u64 = 100;

/// Minimum gas that must remain for SSTORE to succeed
/// Prevents storage modifications when gas is nearly exhausted
pub const SstoreSentryGas: u64 = 2300;

/// Gas cost for SSTORE when setting a storage slot from zero to non-zero
/// This is the most expensive storage operation as it increases state size
pub const SstoreSetGas: u64 = 20000;

/// Gas cost for SSTORE when changing an existing non-zero value to another non-zero value
/// Cheaper than initial set since slot is already allocated
pub const SstoreResetGas: u64 = 5000;

/// Gas cost for SSTORE when clearing a storage slot (non-zero to zero)
/// Same cost as reset, but eligible for gas refund
pub const SstoreClearGas: u64 = 5000;

/// Gas refund for clearing storage slot to zero
/// EIP-3529: Reduced from 15000 to prevent gas refund abuse
pub const SstoreRefundGas: u64 = 4800;
// ============================================================================
// Control Flow Costs
// ============================================================================

/// Gas cost for JUMPDEST opcode
/// Minimal cost as it's just a marker for valid jump destinations
pub const JumpdestGas: u64 = 1;

// ============================================================================
// Logging Operation Costs
// ============================================================================

/// Base gas cost for LOG operations (LOG0-LOG4)
/// This is the fixed cost before considering data size and topics
pub const LogGas: u64 = 375;

/// Gas cost per byte of data in LOG operations
/// Incentivizes efficient event data usage
pub const LogDataGas: u64 = 8;

/// Gas cost per topic in LOG operations
/// Each additional topic (LOG1, LOG2, etc.) adds this cost
pub const LogTopicGas: u64 = 375;

// ============================================================================
// Contract Creation and Call Costs
// ============================================================================

/// Base gas cost for CREATE opcode
/// High cost reflects the expense of deploying new contracts
pub const CreateGas: u64 = 32000;
/// Base gas cost for CALL operations
/// This is the minimum cost before additional charges
pub const CallGas: u64 = 40;

/// Gas stipend provided to called contract when transferring value
/// Ensures called contract has minimum gas to execute basic operations
pub const CallStipend: u64 = 2300;

/// Additional gas cost when CALL transfers value (ETH)
/// Makes value transfers more expensive to prevent spam
pub const CallValueTransferGas: u64 = 9000;

/// Additional gas cost when CALL creates a new account
/// Reflects the cost of adding a new entry to the state trie
pub const CallNewAccountGas: u64 = 25000;

/// Gas refund for SELFDESTRUCT operation
/// Incentivizes cleaning up unused contracts
pub const SelfdestructRefundGas: u64 = 24000;
// ============================================================================
// Memory Expansion Costs
// ============================================================================

/// Linear coefficient for memory gas calculation
/// Part of the formula: gas = MemoryGas * words + words² / QuadCoeffDiv
pub const MemoryGas: u64 = 3;

/// Quadratic coefficient divisor for memory gas calculation
/// Makes memory expansion quadratically expensive to prevent DoS attacks
pub const QuadCoeffDiv: u64 = 512;

// ============================================================================
// Contract Deployment Costs
// ============================================================================

/// Gas cost per byte of contract deployment code
/// Applied to the bytecode being deployed via CREATE/CREATE2
pub const CreateDataGas: u64 = 200;

/// Gas cost per 32-byte word of initcode
/// EIP-3860: Prevents deploying excessively large contracts
pub const InitcodeWordGas: u64 = 2;

/// Maximum allowed initcode size in bytes
/// EIP-3860: Limit is 49152 bytes (2 * MAX_CODE_SIZE)
pub const MaxInitcodeSize: u64 = 49152;

// ============================================================================
// Transaction Costs
// ============================================================================

/// Base gas cost for a standard transaction
/// Minimum cost for any transaction regardless of data or computation
pub const TxGas: u64 = 21000;

/// Base gas cost for contract creation transaction
/// Higher than standard tx due to contract deployment overhead
pub const TxGasContractCreation: u64 = 53000;

/// Gas cost per zero byte in transaction data
/// Cheaper than non-zero bytes to incentivize data efficiency
pub const TxDataZeroGas: u64 = 4;

/// Gas cost per non-zero byte in transaction data
/// Higher cost reflects increased storage and bandwidth requirements
pub const TxDataNonZeroGas: u64 = 16;

/// Gas cost per word for copy operations
/// Applied to CODECOPY, EXTCODECOPY, RETURNDATACOPY, etc.
pub const CopyGas: u64 = 3;

/// Maximum gas refund as a fraction of gas used
/// EIP-3529: Reduced from 1/2 to 1/5 to prevent refund abuse
pub const MaxRefundQuotient: u64 = 5;

// ============================================================================
// EIP-4844: Shard Blob Transactions
// ============================================================================

/// Gas cost for BLOBHASH opcode
/// Returns the hash of a blob associated with the transaction
pub const BlobHashGas: u64 = 3;

/// Gas cost for BLOBBASEFEE opcode
/// Returns the base fee for blob gas
pub const BlobBaseFeeGas: u64 = 2;

// ============================================================================
// EIP-1153: Transient Storage
// ============================================================================

/// Gas cost for TLOAD (transient storage load)
/// Transient storage is cleared after each transaction
pub const TLoadGas: u64 = 100;

/// Gas cost for TSTORE (transient storage store)
/// Same cost as TLOAD, much cheaper than persistent storage
pub const TStoreGas: u64 = 100;

// ============================================================================
// Precompile Operation Costs
// ============================================================================

/// Base gas cost for IDENTITY precompile (address 0x04)
/// Minimum cost regardless of input size
pub const IDENTITY_BASE_COST: u64 = 15;

/// Gas cost per 32-byte word for IDENTITY precompile
/// Total cost = IDENTITY_BASE_COST + (word_count * IDENTITY_WORD_COST)
pub const IDENTITY_WORD_COST: u64 = 3;

/// Calculate memory expansion gas cost
/// 
/// Computes the gas cost for expanding EVM memory from current_size to new_size bytes.
/// Memory expansion follows a quadratic cost formula to prevent DoS attacks.
/// 
/// ## Parameters
/// - `current_size`: Current memory size in bytes
/// - `new_size`: Requested new memory size in bytes
/// 
/// ## Returns
/// - Gas cost for the expansion (0 if new_size <= current_size)
/// 
/// ## Formula
/// The total memory cost for n words is: 3n + n²/512
/// Where a word is 32 bytes.
/// 
/// Pre-computed memory expansion costs for common sizes.
/// 
/// This lookup table stores the total memory cost for sizes up to 32KB (1024 words).
/// Using a LUT converts runtime calculations to O(1) lookups for common cases.
/// The formula is: 3n + n²/512 where n is the number of 32-byte words.
pub const MEMORY_EXPANSION_LUT = blk: {
    @setEvalBranchQuota(10000);
    const max_words = 1024; // Pre-compute for up to 32KB of memory
    var costs: [max_words]u64 = undefined;
    
    for (0..max_words) |words| {
        costs[words] = MemoryGas * words + (words * words) / QuadCoeffDiv;
    }
    
    break :blk costs;
};

/// The expansion cost is: total_cost(new_size) - total_cost(current_size)
/// 
/// ## Examples
/// - Expanding from 0 to 32 bytes (1 word): 3 + 0 = 3 gas
/// - Expanding from 0 to 64 bytes (2 words): 6 + 0 = 6 gas
/// - Expanding from 0 to 1024 bytes (32 words): 96 + 2 = 98 gas
/// - Expanding from 1024 to 2048 bytes: 294 - 98 = 196 gas
/// 
/// ## Edge Cases
/// - If new_size <= current_size, no expansion needed, returns 0
/// - Sizes are rounded up to the nearest word (32 bytes)
/// - At 32MB, gas cost exceeds 2 billion, effectively preventing larger allocations
/// 
/// ## Performance
/// - Uses pre-computed lookup table for sizes up to 32KB (O(1) lookup)
/// - Falls back to calculation for larger sizes
pub fn memory_gas_cost(current_size: u64, new_size: u64) u64 {
    if (new_size <= current_size) return 0;
    
    const current_words = (current_size + 31) / 32;
    const new_words = (new_size + 31) / 32;
    
    // Use lookup table for common cases (up to 32KB)
    if (new_words < MEMORY_EXPANSION_LUT.len) {
        const current_cost = if (current_words < MEMORY_EXPANSION_LUT.len)
            MEMORY_EXPANSION_LUT[current_words]
        else
            MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
            
        return MEMORY_EXPANSION_LUT[new_words] - current_cost;
    }
    
    // Fall back to calculation for larger sizes
    const current_cost = MemoryGas * current_words + (current_words * current_words) / QuadCoeffDiv;
    const new_cost = MemoryGas * new_words + (new_words * new_words) / QuadCoeffDiv;
    return new_cost - current_cost;
}
```
```zig [src/evm/fee_market.zig]
const std = @import("std");
const Log = @import("log.zig");

// FeeMarket implements the EIP-1559 fee market mechanism
///
// The EIP-1559 fee market introduces a base fee per block that moves
// up or down based on how full the previous block was compared to the target.
///
// Key features:
// 1. Base fee per block that is burned (not paid to miners)
// 2. Priority fee (tip) that goes to miners
// 3. Base fee adjustment based on block fullness

/// Helper function to calculate fee delta safely avoiding overflow and division by zero
fn calculate_fee_delta(fee: u64, gas_delta: u64, gas_target: u64, denominator: u64) u64 {
    // Using u128 for intermediate calculation to avoid overflow
    const intermediate: u128 = @as(u128, fee) * @as(u128, gas_delta);
    // Avoid division by zero
    const divisor: u128 = @max(1, @as(u128, gas_target) * @as(u128, denominator));
    const result: u64 = @intCast(@min(@as(u128, std.math.maxInt(u64)), intermediate / divisor));

    // Always return at least 1 to ensure some movement
    return @max(1, result);
}
/// Minimum base fee per gas (in wei)
/// This ensures the base fee never goes to zero
pub const MIN_BASE_FEE: u64 = 7;

/// Base fee change denominator
/// The base fee can change by at most 1/BASE_FEE_CHANGE_DENOMINATOR
/// (or 12.5% with the value of 8) between blocks
pub const BASE_FEE_CHANGE_DENOMINATOR: u64 = 8;

/// Initialize base fee for the first EIP-1559 block
///
/// This is used when transitioning from a pre-EIP-1559 chain to
/// an EIP-1559 enabled chain.
///
/// Parameters:
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_limit: Gas limit of the parent block
///
/// Returns: The initial base fee (in wei)
pub fn initial_base_fee(parent_gas_used: u64, parent_gas_limit: u64) u64 {
    Log.debug("Initializing base fee for first EIP-1559 block", .{});
    Log.debug("Parent block gas used: {d}, gas limit: {d}", .{ parent_gas_used, parent_gas_limit });

    // Initial base fee formula from the EIP-1559 specification
    // If the parent block used exactly the target gas, the initial base fee is 1 gwei
    // If it used more, the initial base fee is higher
    // If it used less, the initial base fee is lower

    // Target gas usage is half the block gas limit
    const parent_gas_target = parent_gas_limit / 2;

    // Initial base fee calculation
    var base_fee: u64 = 1_000_000_000; // 1 gwei in wei

    // Adjust initial base fee based on parent block's gas usage
    if (parent_gas_used > 0) {
        const gas_used_delta = if (parent_gas_used > parent_gas_target)
            parent_gas_used - parent_gas_target
        else
            parent_gas_target - parent_gas_used;

        const base_fee_delta = calculate_fee_delta(base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        if (parent_gas_used > parent_gas_target) {
            base_fee = base_fee + base_fee_delta;
        } else if (base_fee > base_fee_delta) {
            base_fee = base_fee - base_fee_delta;
        }
    }

    // Ensure base fee is at least the minimum
    base_fee = @max(base_fee, MIN_BASE_FEE);

    Log.debug("Initial base fee calculated: {d} wei", .{base_fee});
    return base_fee;
}

/// Calculate the next block's base fee based on the current block
///
/// This implements the EIP-1559 base fee adjustment algorithm:
/// - If the block used exactly the target gas, the base fee remains the same
/// - If the block used more than the target, the base fee increases
/// - If the block used less than the target, the base fee decreases
/// - The maximum change per block is 12.5% (1/8)
///
/// Parameters:
/// - parent_base_fee: Base fee of the parent block
/// - parent_gas_used: Gas used by the parent block
/// - parent_gas_target: Target gas usage of the parent block
///
/// Returns: The next block's base fee (in wei)
pub fn next_base_fee(parent_base_fee: u64, parent_gas_used: u64, parent_gas_target: u64) u64 {
    Log.debug("Calculating next block's base fee", .{});
    Log.debug("Parent block base fee: {d} wei", .{parent_base_fee});
    Log.debug("Parent block gas used: {d}, gas target: {d}", .{ parent_gas_used, parent_gas_target });

    // If parent block is empty, keep the base fee the same
    // Skip the delta calculations and just return the parent fee directly
    if (parent_gas_used == 0) {
        Log.debug("Parent block was empty, keeping base fee the same: {d} wei", .{parent_base_fee});
        return parent_base_fee;
    }

    // Calculate base fee delta
    var new_base_fee = parent_base_fee;

    if (parent_gas_used == parent_gas_target) {
        // If parent block used exactly the target gas, keep the base fee the same
        Log.debug("Parent block used exactly the target gas, keeping base fee the same", .{});
    } else if (parent_gas_used > parent_gas_target) {
        // If parent block used more than the target gas, increase the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_used - parent_gas_target;

        // Calculate the base fee delta (max 12.5% increase)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Increase the base fee
        // The overflow check is probably unnecessary given gas limits, but it's a good safety measure
        new_base_fee = std.math.add(u64, parent_base_fee, base_fee_delta) catch parent_base_fee;

        Log.debug("Parent block used more than target gas, increasing base fee by {d} wei", .{base_fee_delta});
    } else {
        // If parent block used less than the target gas, decrease the base fee

        // Calculate gas used delta as a fraction of target
        const gas_used_delta = parent_gas_target - parent_gas_used;

        // Calculate the base fee delta (max 12.5% decrease)
        const base_fee_delta = calculate_fee_delta(parent_base_fee, gas_used_delta, parent_gas_target, BASE_FEE_CHANGE_DENOMINATOR);

        // Decrease the base fee, but don't go below the minimum
        new_base_fee = if (parent_base_fee > base_fee_delta)
            parent_base_fee - base_fee_delta
        else
            MIN_BASE_FEE;

        Log.debug("Parent block used less than target gas, decreasing base fee by {d} wei", .{base_fee_delta});
    }

    // Ensure base fee is at least the minimum
    new_base_fee = @max(new_base_fee, MIN_BASE_FEE);

    Log.debug("Next block base fee calculated: {d} wei", .{new_base_fee});
    return new_base_fee;
}

/// Calculate the effective gas price for an EIP-1559 transaction
///
/// The effective gas price is the minimum of:
/// 1. max_fee_per_gas specified by the sender
/// 2. base_fee_per_gas + max_priority_fee_per_gas
///
/// Parameters:
/// - base_fee_per_gas: Current block's base fee
/// - max_fee_per_gas: Maximum fee the sender is willing to pay
/// - max_priority_fee_per_gas: Maximum tip the sender is willing to pay to the miner
///
/// Returns: The effective gas price, and the miner's portion of the fee
pub fn get_effective_gas_price(base_fee_per_gas: u64, max_fee_per_gas: u64, max_priority_fee_per_gas: u64) struct { effective_gas_price: u64, miner_fee: u64 } {
    Log.debug("Calculating effective gas price", .{});
    Log.debug("Base fee: {d}, max fee: {d}, max priority fee: {d}", .{ base_fee_per_gas, max_fee_per_gas, max_priority_fee_per_gas });

    // Ensure the transaction at least pays the base fee
    if (max_fee_per_gas < base_fee_per_gas) {
        std.log.warn("Transaction's max fee ({d}) is less than base fee ({d})", .{ max_fee_per_gas, base_fee_per_gas });
        // In a real implementation, this transaction would be rejected
        // For now, just return the max fee and zero miner fee
        return .{ .effective_gas_price = max_fee_per_gas, .miner_fee = 0 };
    }

    // Calculate the priority fee (tip to miner)
    // This is limited by both max_priority_fee_per_gas and the leftover after base fee
    const max_priority_fee = @min(max_priority_fee_per_gas, max_fee_per_gas - base_fee_per_gas);

    // The effective gas price is base fee plus priority fee
    const effective_gas_price = base_fee_per_gas + max_priority_fee;

    Log.debug("Effective gas price: {d} wei", .{effective_gas_price});
    Log.debug("Miner fee (priority fee): {d} wei", .{max_priority_fee});

    return .{ .effective_gas_price = effective_gas_price, .miner_fee = max_priority_fee };
}

/// Get the gas target for a block
///
/// The gas target is the desired gas usage per block, which is typically
/// half of the maximum gas limit.
///
/// Parameters:
/// - gas_limit: The block's gas limit
///
/// Returns: The gas target for the block
pub fn get_gas_target(gas_limit: u64) u64 {
    return gas_limit / 2;
}
```
```zig [src/evm/state/evm_log.zig]
const Address = @import("Address");

/// EVM event log representation
/// 
/// This struct represents a log entry emitted by smart contracts using the LOG0-LOG4 opcodes.
/// Logs are a crucial part of the Ethereum event system, allowing contracts to emit indexed
/// data that can be efficiently queried by external applications.
/// 
/// ## Overview
/// 
/// Event logs serve multiple purposes in the EVM:
/// - **Event Notification**: Notify external applications about state changes
/// - **Cheaper Storage**: Store data in logs instead of contract storage (much cheaper gas cost)
/// - **Historical Queries**: Enable efficient querying of past events
/// - **Debugging**: Provide insight into contract execution
/// 
/// ## Log Structure
/// 
/// Each log entry contains:
/// - **Address**: The contract that emitted the log
/// - **Topics**: Up to 4 indexed 32-byte values for efficient filtering
/// - **Data**: Arbitrary length non-indexed data
/// 
/// ## Topics vs Data
/// 
/// The distinction between topics and data is important:
/// - **Topics**: Indexed for efficient filtering, limited to 4 entries of 32 bytes each
/// - **Data**: Not indexed, can be arbitrary length, cheaper to include
/// 
/// ## Gas Costs
/// 
/// - LOG0: 375 gas base + 8 gas per byte of data
/// - LOG1-LOG4: 375 gas base + 375 gas per topic + 8 gas per byte of data
/// 
/// ## Example Usage
/// 
/// In Solidity:
/// ```solidity
/// event Transfer(address indexed from, address indexed to, uint256 value);
/// emit Transfer(msg.sender, recipient, amount);
/// ```
/// 
/// This would create a log with:
/// - topics[0]: keccak256("Transfer(address,address,uint256)")
/// - topics[1]: from address (indexed)
/// - topics[2]: to address (indexed)
/// - data: encoded uint256 value
const Self = @This();

/// The address of the contract that emitted this log
address: Address.Address,

/// Indexed topics for efficient log filtering
/// 
/// - First topic (if any) is typically the event signature hash
/// - Subsequent topics are indexed event parameters
/// - Maximum of 4 topics per log (LOG0 has 0, LOG4 has 4)
topics: []const u256,

/// Non-indexed event data
/// 
/// Contains ABI-encoded event parameters that were not marked as indexed.
/// This data is not searchable but is cheaper to include than topics.
data: []const u8,
```
```zig [src/evm/state/storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Composite key for EVM storage operations combining address and slot.
///
/// The StorageKey uniquely identifies a storage location within the EVM by
/// combining a contract address with a 256-bit storage slot number. This is
/// fundamental to how the EVM organizes persistent contract storage.
///
/// ## Design Rationale
/// Each smart contract has its own isolated storage space addressed by 256-bit
/// slots. To track storage across multiple contracts in a single VM instance,
/// we need a composite key that includes both the contract address and the
/// slot number.
///
/// ## Storage Model
/// In the EVM:
/// - Each contract has 2^256 storage slots
/// - Each slot can store a 256-bit value
/// - Slots are initially zero and only consume gas when first written
///
/// ## Usage
/// ```zig
/// const key = StorageKey{
///     .address = contract_address,
///     .slot = 0x0, // First storage slot
/// };
///
/// // Use in hash maps for storage tracking
/// var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
/// try storage.put(key, value);
/// ```
///
/// ## Hashing Strategy
/// The key implements a generic hash function that works with any hasher
/// implementing the standard update() interface. The address is hashed first,
/// followed by the slot number in big-endian format.
const Self = @This();

/// The contract address that owns this storage slot.
/// Standard 20-byte Ethereum address.
address: Address.Address,

/// The 256-bit storage slot number within the contract's storage space.
/// Slots are sparsely allocated - most remain at zero value.
slot: u256,

/// Compute a hash of this storage key for use in hash maps.
///
/// This function is designed to work with Zig's AutoHashMap and any
/// hasher that implements the standard `update([]const u8)` method.
///
/// The hash combines both the address and slot to ensure unique hashes
/// for different storage locations. The slot is converted to big-endian
/// bytes to ensure consistent hashing across different architectures.
///
/// @param self The storage key to hash
/// @param hasher Any hasher with an update() method
///
/// Example:
/// ```zig
/// var map = std.AutoHashMap(StorageKey, u256).init(allocator);
/// const key = StorageKey{ .address = addr, .slot = slot };
/// try map.put(key, value); // Uses hash() internally
/// ```
pub fn hash(self: Self, hasher: anytype) void {
    // Hash the address bytes
    hasher.update(&self.address);
    // Hash the slot as bytes in big-endian format for consistency
    var slot_bytes: [32]u8 = undefined;
    std.mem.writeInt(u256, &slot_bytes, self.slot, .big);
    hasher.update(&slot_bytes);
}

/// Check equality between two storage keys.
///
/// Two storage keys are equal if and only if both their address and
/// slot number match exactly. This is used by hash maps to resolve
/// collisions and find exact matches.
///
/// @param a First storage key
/// @param b Second storage key
/// @return true if both address and slot match
///
/// Example:
/// ```zig
/// const key1 = StorageKey{ .address = addr, .slot = 0 };
/// const key2 = StorageKey{ .address = addr, .slot = 0 };
/// std.debug.assert(key1.eql(key2));
/// ```
pub fn eql(a: Self, b: Self) bool {
    return std.mem.eql(u8, &a.address, &b.address) and a.slot == b.slot;
}
```
```zig [src/evm/state/state.zig]
//! EVM state management module - Tracks blockchain state during execution
//! 
//! This module provides the state storage layer for the EVM, managing all
//! mutable blockchain state including account balances, storage, code, nonces,
//! transient storage, and event logs.
//! 
//! ## State Components
//! 
//! The EVM state consists of:
//! - **Account State**: Balances, nonces, and contract code
//! - **Persistent Storage**: Contract storage slots (SSTORE/SLOAD)
//! - **Transient Storage**: Temporary storage within transactions (TSTORE/TLOAD)
//! - **Event Logs**: Emitted events from LOG0-LOG4 opcodes
//! 
//! ## Design Philosophy
//! 
//! This implementation uses hash maps for efficient lookups and modifications.
//! All state changes are applied immediately (no journaling in this layer).
//! For transaction rollback support, this should be wrapped in a higher-level
//! state manager that implements checkpointing/journaling.
//! 
//! ## Memory Management
//! 
//! All state data is heap-allocated using the provided allocator. The state
//! owns all data it stores and properly cleans up in deinit().
//! 
//! ## Thread Safety
//! 
//! This implementation is NOT thread-safe. Concurrent access must be synchronized
//! externally.

const std = @import("std");
const Address = @import("Address");
const EvmLog = @import("evm_log.zig");
const StorageKey = @import("storage_key.zig");
const Log = @import("../log.zig");

/// EVM state container
/// 
/// Manages all mutable blockchain state during EVM execution.
/// This includes account data, storage, and transaction artifacts.
const Self = @This();

/// Memory allocator for all state allocations
allocator: std.mem.Allocator,

/// Persistent contract storage (SSTORE/SLOAD)
/// Maps (address, slot) -> value
storage: std.AutoHashMap(StorageKey, u256),

/// Account balances in wei
/// Maps address -> balance
balances: std.AutoHashMap(Address.Address, u256),

/// Contract bytecode
/// Maps address -> code bytes
/// Empty slice for EOAs (Externally Owned Accounts)
code: std.AutoHashMap(Address.Address, []const u8),

/// Account nonces (transaction counters)
/// Maps address -> nonce
/// Incremented on each transaction from the account
nonces: std.AutoHashMap(Address.Address, u64),

/// Transient storage (EIP-1153: TSTORE/TLOAD)
/// Maps (address, slot) -> value
/// Cleared after each transaction
transient_storage: std.AutoHashMap(StorageKey, u256),

/// Event logs emitted during execution
/// Ordered list of all LOG0-LOG4 events
logs: std.ArrayList(EvmLog),

/// Initialize a new EVM state instance
/// 
/// Creates empty state with the provided allocator. All maps and lists
/// are initialized empty.
/// 
/// ## Parameters
/// - `allocator`: Memory allocator for all state allocations
/// 
/// ## Returns
/// - Success: New initialized state instance
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Example
/// ```zig
/// var state = try EvmState.init(allocator);
/// defer state.deinit();
/// ```
pub fn init(allocator: std.mem.Allocator) std.mem.Allocator.Error!Self {
    Log.debug("EvmState.init: Initializing EVM state with allocator", .{});
    
    var storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer storage.deinit();

    var balances = std.AutoHashMap(Address.Address, u256).init(allocator);
    errdefer balances.deinit();

    var code = std.AutoHashMap(Address.Address, []const u8).init(allocator);
    errdefer code.deinit();

    var nonces = std.AutoHashMap(Address.Address, u64).init(allocator);
    errdefer nonces.deinit();

    var transient_storage = std.AutoHashMap(StorageKey, u256).init(allocator);
    errdefer transient_storage.deinit();

    var logs = std.ArrayList(EvmLog).init(allocator);
    errdefer logs.deinit();

    Log.debug("EvmState.init: EVM state initialization complete", .{});
    return Self{
        .allocator = allocator,
        .storage = storage,
        .balances = balances,
        .code = code,
        .nonces = nonces,
        .transient_storage = transient_storage,
        .logs = logs,
    };
}

/// Clean up all allocated resources
/// 
/// Frees all memory used by the state, including:
/// - All hash maps
/// - Log data (topics and data arrays)
/// - Any allocated slices
/// 
/// ## Important
/// After calling deinit(), the state instance is invalid and
/// must not be used.
pub fn deinit(self: *Self) void {
    Log.debug("EvmState.deinit: Cleaning up EVM state, storage_count={}, balance_count={}, code_count={}, logs_count={}", .{
        self.storage.count(), self.balances.count(), self.code.count(), self.logs.items.len
    });
    
    self.storage.deinit();
    self.balances.deinit();
    self.code.deinit();
    self.nonces.deinit();
    self.transient_storage.deinit();

    // Clean up logs - free allocated memory for topics and data
    for (self.logs.items) |log| {
        self.allocator.free(log.topics);
        self.allocator.free(log.data);
    }
    self.logs.deinit();
    
    Log.debug("EvmState.deinit: EVM state cleanup complete", .{});
}

// State access methods

/// Get a value from persistent storage
/// 
/// Reads a storage slot for the given address. Returns 0 for
/// uninitialized slots (EVM default).
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// In real EVM: 100-2100 gas depending on cold/warm access
pub fn get_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    const value = self.storage.get(key) orelse 0;
    Log.debug("EvmState.get_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    return value;
}

/// Set a value in persistent storage
/// 
/// Updates a storage slot for the given address. Setting a value
/// to 0 is different from deleting it - it still consumes storage.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number  
/// - `value`: Value to store
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// In real EVM: 2900-20000 gas depending on current/new value
pub fn set_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.storage.put(key, value);
}

/// Get account balance
/// 
/// Returns the balance in wei for the given address.
/// Non-existent accounts have balance 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Balance in wei (0 for non-existent accounts)
pub fn get_balance(self: *const Self, address: Address.Address) u256 {
    const balance = self.balances.get(address) orelse 0;
    Log.debug("EvmState.get_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    return balance;
}

/// Set account balance
/// 
/// Updates the balance for the given address. Setting balance
/// creates the account if it doesn't exist.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `balance`: New balance in wei
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Note
/// Balance can exceed total ETH supply in test scenarios
pub fn set_balance(self: *Self, address: Address.Address, balance: u256) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_balance: addr={x}, balance={}", .{ Address.to_u256(address), balance });
    try self.balances.put(address, balance);
}

/// Get contract code
/// 
/// Returns the bytecode deployed at the given address.
/// EOAs and non-existent accounts return empty slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// 
/// ## Returns
/// Contract bytecode (empty slice for EOAs)
/// 
/// ## Note
/// The returned slice is owned by the state - do not free
pub fn get_code(self: *const Self, address: Address.Address) []const u8 {
    const code = self.code.get(address) orelse &[_]u8{};
    Log.debug("EvmState.get_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    return code;
}

/// Set contract code
/// 
/// Deploys bytecode to the given address. The state takes
/// ownership of the code slice.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `code`: Bytecode to deploy
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Important
/// The state does NOT copy the code - it takes ownership
/// of the provided slice
pub fn set_code(self: *Self, address: Address.Address, code: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_code: addr={x}, code_len={}", .{ Address.to_u256(address), code.len });
    try self.code.put(address, code);
}

/// Get account nonce
/// 
/// Returns the transaction count for the given address.
/// Non-existent accounts have nonce 0.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// Current nonce (0 for new accounts)
/// 
/// ## Note
/// Nonce prevents transaction replay attacks
pub fn get_nonce(self: *const Self, address: Address.Address) u64 {
    const nonce = self.nonces.get(address) orelse 0;
    Log.debug("EvmState.get_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    return nonce;
}

/// Set account nonce
/// 
/// Updates the transaction count for the given address.
/// 
/// ## Parameters
/// - `address`: Account address
/// - `nonce`: New nonce value
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Warning
/// Setting nonce below current value can enable replay attacks
pub fn set_nonce(self: *Self, address: Address.Address, nonce: u64) std.mem.Allocator.Error!void {
    Log.debug("EvmState.set_nonce: addr={x}, nonce={}", .{ Address.to_u256(address), nonce });
    try self.nonces.put(address, nonce);
}

/// Increment account nonce
/// 
/// Atomically increments the nonce and returns the previous value.
/// Used when processing transactions from an account.
/// 
/// ## Parameters
/// - `address`: Account address
/// 
/// ## Returns
/// - Success: Previous nonce value (before increment)
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Example
/// ```zig
/// const tx_nonce = try state.increment_nonce(sender);
/// // tx_nonce is used for the transaction
/// // account nonce is now tx_nonce + 1
/// ```
pub fn increment_nonce(self: *Self, address: Address.Address) std.mem.Allocator.Error!u64 {
    const current_nonce = self.get_nonce(address);
    const new_nonce = current_nonce + 1;
    Log.debug("EvmState.increment_nonce: addr={x}, old_nonce={}, new_nonce={}", .{ Address.to_u256(address), current_nonce, new_nonce });
    try self.set_nonce(address, new_nonce);
    return current_nonce;
}

// Transient storage methods

/// Get a value from transient storage
/// 
/// Reads a transient storage slot (EIP-1153). Transient storage
/// is cleared after each transaction, making it cheaper than
/// persistent storage for temporary data.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// 
/// ## Returns
/// The stored value, or 0 if not set
/// 
/// ## Gas Cost
/// TLOAD: 100 gas (always warm)
pub fn get_transient_storage(self: *const Self, address: Address.Address, slot: u256) u256 {
    const key = StorageKey{ .address = address, .slot = slot };
    const value = self.transient_storage.get(key) orelse 0;
    Log.debug("EvmState.get_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    return value;
}

/// Set a value in transient storage
/// 
/// Updates a transient storage slot (EIP-1153). Values are
/// automatically cleared after the transaction completes.
/// 
/// ## Parameters
/// - `address`: Contract address
/// - `slot`: Storage slot number
/// - `value`: Value to store temporarily
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if map expansion fails
/// 
/// ## Gas Cost
/// TSTORE: 100 gas (always warm)
/// 
/// ## Use Cases
/// - Reentrancy locks
/// - Temporary computation results
/// - Cross-contract communication within a transaction
pub fn set_transient_storage(self: *Self, address: Address.Address, slot: u256, value: u256) std.mem.Allocator.Error!void {
    const key = StorageKey{ .address = address, .slot = slot };
    Log.debug("EvmState.set_transient_storage: addr={x}, slot={}, value={}", .{ Address.to_u256(address), slot, value });
    try self.transient_storage.put(key, value);
}

// Log methods

/// Emit an event log
/// 
/// Records an event log from LOG0-LOG4 opcodes. The log is added
/// to the transaction's log list and cannot be removed.
/// 
/// ## Parameters
/// - `address`: Contract emitting the log
/// - `topics`: Indexed topics (0-4 entries)
/// - `data`: Non-indexed log data
/// 
/// ## Returns
/// - Success: void
/// - Error: OutOfMemory if allocation fails
/// 
/// ## Memory Management
/// This function copies both topics and data to ensure they
/// persist beyond the current execution context.
/// 
/// ## Example
/// ```zig
/// // Emit Transfer event
/// const topics = [_]u256{
///     0x123..., // Transfer event signature
///     from_addr, // indexed from
///     to_addr,   // indexed to  
/// };
/// const data = encode_u256(amount);
/// try state.emit_log(contract_addr, &topics, data);
/// ```
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) std.mem.Allocator.Error!void {
    Log.debug("EvmState.emit_log: addr={x}, topics_len={}, data_len={}", .{ Address.to_u256(address), topics.len, data.len });
    
    // Clone the data to ensure it persists
    const data_copy = try self.allocator.alloc(u8, data.len);
    @memcpy(data_copy, data);

    // Clone the topics to ensure they persist
    const topics_copy = try self.allocator.alloc(u256, topics.len);
    @memcpy(topics_copy, topics);

    const log = EvmLog{
        .address = address,
        .topics = topics_copy,
        .data = data_copy,
    };

    try self.logs.append(log);
    Log.debug("EvmState.emit_log: Log emitted, total_logs={}", .{self.logs.items.len});
}
```
```zig [src/evm/vm.zig]
const std = @import("std");
const Contract = @import("contract/contract.zig");
const Stack = @import("stack/stack.zig");
const JumpTable = @import("jump_table/jump_table.zig");
const Frame = @import("frame.zig");
const Operation = @import("opcodes/operation.zig");
const Address = @import("Address");
const StoragePool = @import("contract/storage_pool.zig");
const AccessList = @import("access_list/access_list.zig");
const ExecutionError = @import("execution/execution_error.zig");
const rlp = @import("Rlp");
const Keccak256 = std.crypto.hash.sha3.Keccak256;
const ChainRules = @import("hardforks/chain_rules.zig");
const gas_constants = @import("constants/gas_constants.zig");
const constants = @import("constants/constants.zig");
const Log = @import("log.zig");
const EvmLog = @import("state/evm_log.zig");
const Context = @import("context.zig");
const EvmState = @import("state/state.zig");
pub const StorageKey = @import("state/storage_key.zig");
pub const CreateResult = @import("create_result.zig");
pub const CallResult = @import("call_result.zig");
pub const RunResult = @import("run_result.zig");
const Hardfork = @import("hardforks/hardfork.zig").Hardfork;
const precompiles = @import("precompiles/precompiles.zig");

/// Virtual Machine for executing Ethereum bytecode.
///
/// Manages contract execution, gas accounting, state access, and protocol enforcement
/// according to the configured hardfork rules. Supports the full EVM instruction set
/// including contract creation, calls, and state modifications.
const Self = @This();

/// Memory allocator for VM operations
allocator: std.mem.Allocator,
/// Return data from the most recent operation
return_data: []u8 = &[_]u8{},
/// Legacy stack field (unused in current implementation)
stack: Stack = .{},
/// Opcode dispatch table for the configured hardfork
table: JumpTable,
/// Protocol rules for the current hardfork
chain_rules: ChainRules,
// TODO should be injected
/// World state including accounts, storage, and code
state: EvmState,
/// Transaction and block context
context: Context,
/// Warm/cold access tracking for EIP-2929 gas costs
access_list: AccessList,
/// Current call depth for overflow protection
depth: u16 = 0,
/// Whether the current context is read-only (STATICCALL)
read_only: bool = false,

/// Initialize VM with a jump table and corresponding chain rules.
///
/// @param allocator Memory allocator for VM operations
/// @param jump_table Optional jump table. If null, uses JumpTable.DEFAULT (latest hardfork)
/// @param chain_rules Optional chain rules. If null, uses ChainRules.DEFAULT (latest hardfork)
/// @return Initialized VM instance
///
/// Example with custom jump table and rules:
/// ```zig
/// const my_table = comptime JumpTable.init_from_hardfork(.BERLIN);
/// const my_rules = ChainRules.for_hardfork(.BERLIN);
/// var vm = try VM.init(allocator, &my_table, &my_rules);
/// ```
///
/// Example with default (latest):
/// ```zig
/// var vm = try VM.init(allocator, null, null);
/// ```
pub fn init(allocator: std.mem.Allocator, jump_table: ?*const JumpTable, chain_rules: ?*const ChainRules) std.mem.Allocator.Error!Self {
    Log.debug("VM.init: Initializing VM with allocator", .{});

    var state = try EvmState.init(allocator);
    errdefer state.deinit();

    var access_list = AccessList.init(allocator);
    errdefer access_list.deinit();

    Log.debug("VM.init: VM initialization complete", .{});
    return Self{
        .allocator = allocator,
        .table = (jump_table orelse &JumpTable.DEFAULT).*,
        .chain_rules = (chain_rules orelse &ChainRules.DEFAULT).*,
        .state = state,
        .context = Context.init(),
        .access_list = access_list,
    };
}

/// Initialize VM with a specific hardfork.
/// Convenience function that creates the jump table at runtime.
/// For production use, consider pre-generating the jump table at compile time.
pub fn init_with_hardfork(allocator: std.mem.Allocator, hardfork: Hardfork) std.mem.Allocator.Error!Self {
    const table = JumpTable.init_from_hardfork(hardfork);
    const rules = ChainRules.for_hardfork(hardfork);
    return init(allocator, &table, &rules);
}

/// Free all VM resources.
/// Must be called when finished with the VM to prevent memory leaks.
pub fn deinit(self: *Self) void {
    self.state.deinit();
    self.access_list.deinit();
    Contract.clear_analysis_cache(self.allocator);
}

/// Execute contract bytecode and return the result.
///
/// This is the main execution entry point. The contract must be properly initialized
/// with bytecode, gas limit, and input data. The VM executes opcodes sequentially
/// until completion, error, or gas exhaustion.
///
/// Time complexity: O(n) where n is the number of opcodes executed.
/// Memory: May allocate for return data if contract returns output.
///
/// Example:
/// ```zig
/// var contract = Contract.init_at_address(caller, addr, 0, 100000, code, input, false);
/// defer contract.deinit(vm.allocator, null);
/// try vm.state.set_code(addr, code);
/// const result = try vm.interpret(&contract, input);
/// defer if (result.output) |output| vm.allocator.free(output);
/// ```
///
/// See also: interpret_static() for read-only execution
pub fn interpret(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, false);
}

/// Execute contract bytecode in read-only mode.
/// Identical to interpret() but prevents any state modifications.
/// Used for view functions and static analysis.
pub fn interpret_static(self: *Self, contract: *Contract, input: []const u8) ExecutionError.Error!RunResult {
    return try self.interpret_with_context(contract, input, true);
}

/// Core bytecode execution with configurable static context.
/// Runs the main VM loop, executing opcodes sequentially while tracking
/// gas consumption and handling control flow changes.
pub fn interpret_with_context(self: *Self, contract: *Contract, input: []const u8, is_static: bool) ExecutionError.Error!RunResult {
    @branchHint(.likely);
    Log.debug("VM.interpret_with_context: Starting execution, depth={}, gas={}, static={}", .{ self.depth, contract.gas, is_static });

    self.depth += 1;
    defer self.depth -= 1;

    const prev_read_only = self.read_only;
    defer self.read_only = prev_read_only;

    self.read_only = self.read_only or is_static;

    const initial_gas = contract.gas;
    var pc: usize = 0;
    var frame = try Frame.init(self.allocator, contract);
    defer frame.deinit();
    frame.memory.finalize_root();
    frame.is_static = self.read_only;
    frame.depth = @as(u32, @intCast(self.depth));
    frame.input = input;
    frame.gas_remaining = contract.gas;

    const interpreter_ptr: *Operation.Interpreter = @ptrCast(self);
    const state_ptr: *Operation.State = @ptrCast(&frame);

    while (pc < contract.code_size) {
        @branchHint(.likely);
        const opcode = contract.get_op(pc);
        frame.pc = pc;

        const result = self.table.execute(pc, interpreter_ptr, state_ptr, opcode) catch |err| {
            @branchHint(.likely);
            contract.gas = frame.gas_remaining;
            self.return_data = @constCast(frame.return_data_buffer);

            var output: ?[]const u8 = null;
            if (frame.return_data_buffer.len > 0) {
                output = self.allocator.dupe(u8, frame.return_data_buffer) catch {
                    // We are out of memory, which is a critical failure. The safest way to
                    // handle this is to treat it as an OutOfGas error, which consumes
                    // all gas and stops execution.
                    return RunResult.init(initial_gas, 0, .OutOfGas, ExecutionError.Error.OutOfMemory, null);
                };
            }

            return switch (err) {
                ExecutionError.Error.InvalidOpcode => {
                    @branchHint(.cold);
                    // INVALID opcode consumes all remaining gas
                    frame.gas_remaining = 0;
                    contract.gas = 0;
                    return RunResult.init(initial_gas, 0, .Invalid, err, output);
                },
                ExecutionError.Error.STOP => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Success, null, output);
                },
                ExecutionError.Error.REVERT => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .Revert, err, output);
                },
                ExecutionError.Error.OutOfGas => {
                    return RunResult.init(initial_gas, frame.gas_remaining, .OutOfGas, err, output);
                },
                ExecutionError.Error.InvalidJump,
                ExecutionError.Error.StackUnderflow,
                ExecutionError.Error.StackOverflow,
                ExecutionError.Error.StaticStateChange,
                ExecutionError.Error.WriteProtection,
                ExecutionError.Error.DepthLimit,
                ExecutionError.Error.MaxCodeSizeExceeded,
                ExecutionError.Error.OutOfMemory,
                => {
                    @branchHint(.cold);
                    return RunResult.init(initial_gas, frame.gas_remaining, .Invalid, err, output);
                },
                else => return err, // Unexpected error
            };
        };

        if (frame.pc != pc) {
            @branchHint(.likely);
            pc = frame.pc;
        } else {
            pc += result.bytes_consumed;
        }
    }

    contract.gas = frame.gas_remaining;
    self.return_data = @constCast(frame.return_data_buffer);

    const output: ?[]const u8 = if (frame.return_data_buffer.len > 0) try self.allocator.dupe(u8, frame.return_data_buffer) else null;

    return RunResult.init(
        initial_gas,
        frame.gas_remaining,
        .Success,
        null,
        output,
    );
}

fn create_contract_internal(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64, new_address: Address.Address) std.mem.Allocator.Error!CreateResult {
    if (self.state.get_code(new_address).len > 0) {
        @branchHint(.unlikely);
        // Contract already exists at this address
        return CreateResult.initFailure(gas, null);
    }

    const creator_balance = self.state.get_balance(creator);
    if (creator_balance < value) {
        @branchHint(.unlikely);
        return CreateResult.initFailure(gas, null);
    }

    if (value > 0) {
        try self.state.set_balance(creator, creator_balance - value);
        try self.state.set_balance(new_address, value);
    }

    if (init_code.len == 0) {
        // No init code means empty contract
        return CreateResult{
            .success = true,
            .address = new_address,
            .gas_left = gas,
            .output = null,
        };
    }

    var hasher = Keccak256.init(.{});
    hasher.update(init_code);
    var code_hash: [32]u8 = undefined;
    hasher.final(&code_hash);

    var init_contract = Contract.init(
        creator, // caller (who is creating this contract)
        new_address, // address (the new contract's address)
        value, // value being sent to this contract
        gas, // gas available for init code execution
        init_code, // the init code to execute
        code_hash, // hash of the init code
        &[_]u8{}, // no input data for init code
        false, // not static
    );
    defer init_contract.deinit(self.allocator, null);

    // Execute the init code - this should return the deployment bytecode
    const init_result = self.interpret_with_context(&init_contract, &[_]u8{}, false) catch |err| {
        if (err == ExecutionError.Error.REVERT) {
            // On revert, we should still consume gas but not all
            return CreateResult.initFailure(init_contract.gas, null);
        }

        // Most initcode failures should return 0 address and consume all gas
        return CreateResult.initFailure(0, null);
    };

    const deployment_code = init_result.output orelse &[_]u8{};

    // Check EIP-170 MAX_CODE_SIZE limit on the returned bytecode (24,576 bytes)
    if (deployment_code.len > constants.MAX_CODE_SIZE) {
        return CreateResult.initFailure(0, null);
    }

    const deploy_code_gas = @as(u64, @intCast(deployment_code.len)) * constants.DEPLOY_CODE_GAS_PER_BYTE;

    if (deploy_code_gas > init_result.gas_left) {
        return CreateResult.initFailure(0, null);
    }

    try self.state.set_code(new_address, deployment_code);

    const gas_left = init_result.gas_left - deploy_code_gas;

    return CreateResult{
        .success = true,
        .address = new_address,
        .gas_left = gas_left,
        .output = deployment_code,
    };
}

// Contract creation with CREATE opcode
pub const CreateContractError = std.mem.Allocator.Error || Address.CalculateAddressError;

/// Create a new contract using CREATE opcode semantics.
///
/// Increments creator's nonce, calculates address via keccak256(rlp([sender, nonce])),
/// transfers value if specified, executes init code, and deploys resulting bytecode.
///
/// Parameters:
/// - creator: Account initiating contract creation
/// - value: Wei to transfer to new contract (0 for no transfer)
/// - init_code: Bytecode executed to generate contract code
/// - gas: Maximum gas for entire creation process
///
/// Returns CreateResult with success=false if:
/// - Creator balance < value (insufficient funds)
/// - Contract exists at calculated address (collision)
/// - Init code reverts or runs out of gas
/// - Deployed bytecode > 24,576 bytes (EIP-170)
/// - Insufficient gas for deployment (200 gas/byte)
///
/// Time complexity: O(init_code_length + deployed_code_length)
/// Memory: Allocates space for deployed bytecode
///
/// See also: create2_contract() for deterministic addresses
pub fn create_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractError!CreateResult {
    const nonce = try self.state.increment_nonce(creator);
    const new_address = try Address.calculate_create_address(self.allocator, creator, nonce);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallContractError = std.mem.Allocator.Error;

/// Execute a CALL operation to another contract or precompile.
///
/// This method handles both regular contract calls and precompile calls.
/// For precompiles, it routes to the appropriate precompile implementation.
/// For regular contracts, it currently returns failure (TODO: implement contract execution).
///
/// @param caller The address initiating the call
/// @param to The address being called (may be a precompile)
/// @param value The amount of ETH being transferred (must be 0 for static calls)
/// @param input Input data for the call
/// @param gas Gas limit available for the call
/// @param is_static Whether this is a static call (no state changes allowed)
/// @return CallResult indicating success/failure and return data
pub fn call_contract(self: *Self, caller: Address.Address, to: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    @branchHint(.likely);
    
    Log.debug("VM.call_contract: Call from {any} to {any}, gas={}, static={}", .{ caller, to, gas, is_static });
    
    // Check if this is a precompile call
    if (precompiles.is_precompile(to)) {
        Log.debug("VM.call_contract: Detected precompile call to {any}", .{to});
        return self.execute_precompile_call(to, input, gas, is_static);
    }
    
    // Regular contract call - currently not implemented
    // TODO: Implement value transfer, gas calculation, recursive execution, and return data handling
    Log.debug("VM.call_contract: Regular contract call not implemented yet", .{});
    _ = value;
    return CallResult{ .success = false, .gas_left = gas, .output = null };
}

/// Execute a precompile call
///
/// This method handles the execution of precompiled contracts. It performs
/// the following steps:
/// 1. Check if the precompile is available in the current hardfork
/// 2. Validate that value transfers are zero (precompiles don't accept ETH)
/// 3. Estimate output buffer size and allocate memory
/// 4. Execute the precompile
/// 5. Handle success/failure and return appropriate CallResult
///
/// @param address The precompile address
/// @param input Input data for the precompile
/// @param gas Gas limit available for execution
/// @param is_static Whether this is a static call (doesn't affect precompiles)
/// @return CallResult with success/failure, gas usage, and output data
fn execute_precompile_call(self: *Self, address: Address.Address, input: []const u8, gas: u64, is_static: bool) CallContractError!CallResult {
    _ = is_static; // Precompiles are inherently stateless, so static flag doesn't matter
    
    Log.debug("VM.execute_precompile_call: Executing precompile at {any}, input_size={}, gas={}", .{ address, input.len, gas });
    
    // Get current chain rules
    const chain_rules = self.chain_rules;
    
    // Check if this precompile is available with current chain rules
    if (!precompiles.is_available(address, chain_rules)) {
        Log.debug("VM.execute_precompile_call: Precompile not available with current chain rules", .{});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
    
    // Estimate required output buffer size
    const output_size = precompiles.get_output_size(address, input.len, chain_rules) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to get output size: {}", .{err});
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    };
    
    // Allocate output buffer
    const output_buffer = self.allocator.alloc(u8, output_size) catch |err| {
        Log.debug("VM.execute_precompile_call: Failed to allocate output buffer: {}", .{err});
        return error.OutOfMemory;
    };
    
    // Execute the precompile
    const result = precompiles.execute_precompile(address, input, output_buffer, gas, chain_rules);
    
    if (result.is_success()) {
        const gas_used = result.get_gas_used();
        const actual_output_size = result.get_output_size();
        
        Log.debug("VM.execute_precompile_call: Precompile succeeded, gas_used={}, output_size={}", .{ gas_used, actual_output_size });
        
        // Resize buffer to actual output size if needed
        if (actual_output_size < output_size) {
            const resized_output = self.allocator.realloc(output_buffer, actual_output_size) catch output_buffer;
            return CallResult{ 
                .success = true, 
                .gas_left = gas - gas_used, 
                .output = resized_output[0..actual_output_size] 
            };
        }
        
        return CallResult{ 
            .success = true, 
            .gas_left = gas - gas_used, 
            .output = output_buffer[0..actual_output_size] 
        };
    } else {
        // Free the allocated buffer on failure
        self.allocator.free(output_buffer);
        
        if (result.get_error()) |err| {
            Log.debug("VM.execute_precompile_call: Precompile failed with error: {any}", .{err});
        }
        
        return CallResult{ .success = false, .gas_left = gas, .output = null };
    }
}

pub const ConsumeGasError = ExecutionError.Error;

pub const Create2ContractError = std.mem.Allocator.Error || Address.CalculateCreate2AddressError;

/// Create a new contract using CREATE2 opcode semantics.
///
/// Calculates a deterministic address using keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:],
/// transfers value if specified, executes the initialization code, and deploys
/// the resulting bytecode. Unlike CREATE, the address is predictable before deployment.
pub fn create2_contract(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractError!CreateResult {
    // Calculate the new contract address using CREATE2 formula:
    // address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
    const new_address = try Address.calculate_create2_address(self.allocator, creator, salt, init_code);
    return self.create_contract_internal(creator, value, init_code, gas, new_address);
}

pub const CallcodeContractError = std.mem.Allocator.Error;

// TODO
/// Execute a CALLCODE operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code in current contract's context while preserving caller information.
pub fn callcode_contract(self: *Self, current: Address.Address, code_address: Address.Address, value: u256, input: []const u8, gas: u64, is_static: bool) CallcodeContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = value;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const DelegatecallContractError = std.mem.Allocator.Error;

/// Execute a DELEGATECALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target code with current caller and value context preserved.
pub fn delegatecall_contract(self: *Self, current: Address.Address, code_address: Address.Address, input: []const u8, gas: u64, is_static: bool) DelegatecallContractError!CallResult {
    _ = self;
    _ = current;
    _ = code_address;
    _ = input;
    _ = gas;
    _ = is_static;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const StaticcallContractError = std.mem.Allocator.Error;

/// Execute a STATICCALL operation.
/// NOT IMPLEMENTED - always returns failure.
/// TODO: Execute target contract in guaranteed read-only mode.
pub fn staticcall_contract(self: *Self, caller: Address.Address, to: Address.Address, input: []const u8, gas: u64) StaticcallContractError!CallResult {
    _ = self;
    _ = caller;
    _ = to;
    _ = input;
    _ = gas;
    return CallResult{ .success = false, .gas_left = 0, .output = null };
}

pub const EmitLogError = std.mem.Allocator.Error;

/// Emit an event log (LOG0-LOG4 opcodes).
/// Records an event that will be included in the transaction receipt.
pub fn emit_log(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogError!void {
    try self.state.emit_log(address, topics, data);
}

pub const InitTransactionAccessListError = AccessList.InitTransactionError;

/// Initialize the access list for a new transaction (EIP-2929).
/// Must be called at the start of each transaction to set up warm/cold access tracking.
pub fn init_transaction_access_list(self: *Self, to: ?Address.Address) InitTransactionAccessListError!void {
    try self.access_list.init_transaction(self.context.tx_origin, self.context.block_coinbase, to);
}

pub const PreWarmAddressesError = AccessList.PreWarmAddressesError;

/// Mark addresses as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists to pre-warm addresses in transactions.
/// Time complexity: O(n) where n is the number of addresses.
pub fn pre_warm_addresses(self: *Self, addresses: []const Address.Address) PreWarmAddressesError!void {
    try self.access_list.pre_warm_addresses(addresses);
}

pub const PreWarmStorageSlotsError = AccessList.PreWarmStorageSlotsError;

/// Mark storage slots as warm to reduce gas costs for subsequent access.
/// Used with EIP-2930 access lists in transactions.
pub fn pre_warm_storage_slots(self: *Self, address: Address.Address, slots: []const u256) PreWarmStorageSlotsError!void {
    try self.access_list.pre_warm_storage_slots(address, slots);
}

pub const GetAddressAccessCostError = AccessList.AccessAddressError;

/// Get the gas cost for accessing an address and mark it as warm.
/// Returns higher gas for first access, lower gas for subsequent access per EIP-2929.
/// Time complexity: O(1) with hash table lookup.
pub fn get_address_access_cost(self: *Self, address: Address.Address) GetAddressAccessCostError!u64 {
    return self.access_list.access_address(address);
}

pub const GetStorageAccessCostError = AccessList.AccessStorageSlotError;

/// Get the gas cost for accessing a storage slot and mark it as warm.
/// Returns 2100 gas for cold access, 100 gas for warm access (Berlin hardfork).
pub fn get_storage_access_cost(self: *Self, address: Address.Address, slot: u256) GetStorageAccessCostError!u64 {
    return self.access_list.access_storage_slot(address, slot);
}

pub const GetCallCostError = AccessList.GetCallCostError;

/// Get the additional gas cost for a CALL operation based on address warmth.
/// Returns extra gas required for calls to cold addresses (EIP-2929).
pub fn get_call_cost(self: *Self, address: Address.Address) GetCallCostError!u64 {
    return self.access_list.get_call_cost(address);
}

pub const ValidateStaticContextError = error{WriteProtection};

/// Validate that state modifications are allowed in the current context.
/// Returns WriteProtection error if called within a static (read-only) context.
pub fn validate_static_context(self: *const Self) ValidateStaticContextError!void {
    if (self.read_only) return error.WriteProtection;
}

pub const SetStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a storage value with static context protection.
/// Used by the SSTORE opcode to prevent storage modifications in static calls.
pub fn set_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_storage(address, slot, value);
}

pub const SetTransientStorageProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set a transient storage value with static context protection.
/// Transient storage (EIP-1153) is cleared at the end of each transaction.
pub fn set_transient_storage_protected(self: *Self, address: Address.Address, slot: u256, value: u256) SetTransientStorageProtectedError!void {
    try self.validate_static_context();
    try self.state.set_transient_storage(address, slot, value);
}

pub const SetBalanceProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Set an account balance with static context protection.
/// Prevents balance modifications during static calls.
pub fn set_balance_protected(self: *Self, address: Address.Address, balance: u256) SetBalanceProtectedError!void {
    try self.validate_static_context();
    try self.state.set_balance(address, balance);
}

pub const SetCodeProtectedError = ValidateStaticContextError || std.mem.Allocator.Error;

/// Deploy contract code with static context protection.
/// Prevents code deployment during static calls.
pub fn set_code_protected(self: *Self, address: Address.Address, code: []const u8) SetCodeProtectedError!void {
    try self.validate_static_context();
    try self.state.set_code(address, code);
}

pub const EmitLogProtectedError = ValidateStaticContextError || EmitLogError;

/// Emit a log with static context protection.
/// Prevents log emission during static calls as logs modify the transaction state.
pub fn emit_log_protected(self: *Self, address: Address.Address, topics: []const u256, data: []const u8) EmitLogProtectedError!void {
    try self.validate_static_context();
    try self.emit_log(address, topics, data);
}

pub const CreateContractProtectedError = ValidateStaticContextError || CreateContractError;

/// Create a contract with static context protection.
/// Prevents contract creation during static calls.
pub fn create_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, gas: u64) CreateContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create_contract(creator, value, init_code, gas);
}

pub const Create2ContractProtectedError = ValidateStaticContextError || Create2ContractError;

/// Create a contract with CREATE2 and static context protection.
/// Prevents contract creation during static calls.
pub fn create2_contract_protected(self: *Self, creator: Address.Address, value: u256, init_code: []const u8, salt: u256, gas: u64) Create2ContractProtectedError!CreateResult {
    try self.validate_static_context();
    return self.create2_contract(creator, value, init_code, salt, gas);
}

pub const ValidateValueTransferError = error{WriteProtection};

/// Validate that value transfer is allowed in the current context.
/// Static calls cannot transfer value (msg.value must be 0).
pub fn validate_value_transfer(self: *const Self, value: u256) ValidateValueTransferError!void {
    if (self.read_only and value != 0) return error.WriteProtection;
}

pub const SelfdestructProtectedError = ValidateStaticContextError;

/// Execute SELFDESTRUCT with static context protection.
/// NOT FULLY IMPLEMENTED - currently only validates static context.
/// TODO: Transfer remaining balance to beneficiary and mark contract for deletion.
pub fn selfdestruct_protected(self: *Self, contract: Address.Address, beneficiary: Address.Address) SelfdestructProtectedError!void {
    _ = contract;
    _ = beneficiary;
    try self.validate_static_context();
}
```
```zig [src/evm/frame.zig]
const std = @import("std");
const Memory = @import("memory.zig");
const Stack = @import("stack/stack.zig");
const Contract = @import("contract/contract.zig");
const ExecutionError = @import("execution/execution_error.zig");
const Log = @import("log.zig");

/// EVM execution frame representing a single call context.
///
/// A Frame encapsulates all the state needed to execute a contract call,
/// including the stack, memory, gas tracking, and execution context.
/// Each contract call or message creates a new frame.
///
/// ## Frame Hierarchy
/// Frames form a call stack during execution:
/// - External transactions create the root frame
/// - CALL/CREATE operations create child frames
/// - Frames are limited by maximum call depth (1024)
///
/// ## Execution Model
/// The frame tracks:
/// - Computational state (stack, memory, PC)
/// - Gas consumption and limits
/// - Input/output data
/// - Static call restrictions
///
/// ## Memory Management
/// Each frame has its own memory space that:
/// - Starts empty and expands as needed
/// - Is cleared when the frame completes
/// - Charges quadratic gas for expansion
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = 1000000;
/// try frame.stack.append(42);
/// ```
const Self = @This();

/// Current opcode being executed (for debugging/tracing).
op: []const u8 = undefined,

/// Gas cost of current operation.
cost: u64 = 0,

/// Error that occurred during execution, if any.
err: ?ExecutionError.Error = null,

/// Frame's memory space for temporary data storage.
/// Grows dynamically and charges gas quadratically.
memory: Memory,

/// Operand stack for the stack machine.
/// Limited to 1024 elements per EVM rules.
stack: Stack,

/// Contract being executed in this frame.
/// Contains code, address, and contract metadata.
contract: *Contract,

/// Allocator for dynamic memory allocations.
allocator: std.mem.Allocator,

/// Flag indicating execution should halt.
/// Set by STOP, RETURN, REVERT, or errors.
stop: bool = false,

/// Remaining gas for this execution.
/// Decremented by each operation; execution fails at 0.
gas_remaining: u64 = 0,

/// Whether this is a STATICCALL context.
/// Prohibits state modifications (SSTORE, CREATE, SELFDESTRUCT).
is_static: bool = false,

/// Buffer containing return data from child calls.
/// Used by RETURNDATASIZE and RETURNDATACOPY opcodes.
return_data_buffer: []const u8 = &[_]u8{},

/// Input data for this call (calldata).
/// Accessed by CALLDATALOAD, CALLDATASIZE, CALLDATACOPY.
input: []const u8 = &[_]u8{},

/// Current call depth in the call stack.
/// Limited to 1024 to prevent stack overflow attacks.
depth: u32 = 0,

/// Output data to be returned from this frame.
/// Set by RETURN or REVERT operations.
output: []const u8 = &[_]u8{},

/// Current position in contract bytecode.
/// Incremented by opcode size, modified by JUMP/JUMPI.
pc: usize = 0,

/// Create a new execution frame with default settings.
///
/// Initializes a frame with empty stack and memory, ready for execution.
/// Gas and other parameters must be set after initialization.
///
/// @param allocator Memory allocator for dynamic allocations
/// @param contract The contract to execute
/// @return New frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// var frame = try Frame.init(allocator, &contract);
/// defer frame.deinit();
/// frame.gas_remaining = gas_limit;
/// frame.input = calldata;
/// ```
pub fn init(allocator: std.mem.Allocator, contract: *Contract) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = try Memory.init_default(allocator),
        .stack = .{},
    };
}

/// Create a frame with specific initial state.
///
/// Used for creating frames with pre-existing state, such as when
/// resuming execution or creating child frames with inherited state.
/// All parameters are optional and default to sensible values.
///
/// @param allocator Memory allocator
/// @param contract Contract to execute
/// @param op Current opcode (optional)
/// @param cost Gas cost of current op (optional)
/// @param err Existing error state (optional)
/// @param memory Pre-initialized memory (optional)
/// @param stack Pre-initialized stack (optional)
/// @param stop Halt flag (optional)
/// @param gas_remaining Available gas (optional)
/// @param is_static Static call flag (optional)
/// @param return_data_buffer Child return data (optional)
/// @param input Call data (optional)
/// @param depth Call stack depth (optional)
/// @param output Output buffer (optional)
/// @param pc Current PC (optional)
/// @return Configured frame instance
/// @throws OutOfMemory if memory initialization fails
///
/// Example:
/// ```zig
/// // Create child frame inheriting depth and static mode
/// const child_frame = try Frame.init_with_state(
///     allocator,
///     &child_contract,
///     .{ .depth = parent.depth + 1, .is_static = parent.is_static }
/// );
/// ```
pub fn init_with_state(
    allocator: std.mem.Allocator,
    contract: *Contract,
    op: ?[]const u8,
    cost: ?u64,
    err: ?ExecutionError.Error,
    memory: ?Memory,
    stack: ?Stack,
    stop: ?bool,
    gas_remaining: ?u64,
    is_static: ?bool,
    return_data_buffer: ?[]const u8,
    input: ?[]const u8,
    depth: ?u32,
    output: ?[]const u8,
    pc: ?usize,
) std.mem.Allocator.Error!Self {
    return Self{
        .allocator = allocator,
        .contract = contract,
        .memory = memory orelse try Memory.init_default(allocator),
        .stack = stack orelse .{},
        .op = op orelse undefined,
        .cost = cost orelse 0,
        .err = err,
        .stop = stop orelse false,
        .gas_remaining = gas_remaining orelse 0,
        .is_static = is_static orelse false,
        .return_data_buffer = return_data_buffer orelse &[_]u8{},
        .input = input orelse &[_]u8{},
        .depth = depth orelse 0,
        .output = output orelse &[_]u8{},
        .pc = pc orelse 0,
    };
}

/// Clean up frame resources.
///
/// Releases memory allocated by the frame. Must be called when
/// the frame is no longer needed to prevent memory leaks.
///
/// @param self The frame to clean up
pub fn deinit(self: *Self) void {
    self.memory.deinit();
}

/// Error type for gas consumption operations.
pub const ConsumeGasError = error{
    /// Insufficient gas to complete operation
    OutOfGas,
};

/// Consume gas from the frame's remaining gas.
///
/// Deducts the specified amount from gas_remaining. If insufficient
/// gas is available, returns OutOfGas error and execution should halt.
///
/// @param self The frame consuming gas
/// @param amount Gas units to consume
/// @throws OutOfGas if amount > gas_remaining
///
/// Example:
/// ```zig
/// // Charge gas for operation
/// try frame.consume_gas(operation.constant_gas);
///
/// // Charge dynamic gas
/// const memory_cost = calculate_memory_gas(size);
/// try frame.consume_gas(memory_cost);
/// ```
pub fn consume_gas(self: *Self, amount: u64) ConsumeGasError!void {
    @branchHint(.likely);
    if (amount > self.gas_remaining) return ConsumeGasError.OutOfGas;
    self.gas_remaining -= amount;
}
```
```zig [src/evm/execution/comparison.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

// Helper to convert Stack errors to ExecutionError
// These are redundant and can be removed.
// The op_* functions below use unsafe stack operations,
// so these helpers are unused anyway.

pub fn op_lt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM LT computes: a < b (where a was second from top, b was top)
    const result: u256 = if (a < b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_gt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // EVM GT computes: a > b (where a was second from top, b was top)
    const result: u256 = if (a > b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_slt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed less than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 < b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sgt(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    // Signed greater than
    const a_i256 = @as(i256, @bitCast(a));
    const b_i256 = @as(i256, @bitCast(b));

    const result: u256 = if (a_i256 > b_i256) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_eq(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop the top operand (b) unsafely
    const b = frame.stack.pop_unsafe();
    // Peek the new top operand (a) unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == b) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_iszero(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) unreachable;

    // Peek the operand unsafely
    const a = frame.stack.peek_unsafe().*;

    const result: u256 = if (a == 0) 1 else 0;

    // Modify the current top of the stack in-place with the result
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/system.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Contract = @import("../contract/contract.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

// Gas opcode handler
pub fn gas_op(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append( @as(u256, @intCast(frame.gas_remaining)));

    return Operation.ExecutionResult{};
}

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
}

pub fn op_create(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Debug: CREATE opcode: value, offset, size

    // Check depth
    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) return ExecutionError.Error.MaxCodeSizeExceeded;

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    // Calculate gas for creation
    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract
    const result = try vm.create_contract(frame.contract.address, value, init_code, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        try frame.stack.append( 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append( to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

/// CREATE2 opcode - Create contract with deterministic address
pub fn op_create2(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    const value = try frame.stack.pop();
    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();
    const salt = try frame.stack.pop();

    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // EIP-3860: Check initcode size limit FIRST (Shanghai and later)
    try check_offset_bounds(size);
    const size_usize = @as(usize, @intCast(size));
    if (vm.chain_rules.IsEIP3860 and size_usize > gas_constants.MaxInitcodeSize) return ExecutionError.Error.MaxCodeSizeExceeded;

    // Get init code from memory
    var init_code: []const u8 = &[_]u8{};
    if (size > 0) {
        try check_offset_bounds(offset);

        const offset_usize = @as(usize, @intCast(offset));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.total_size();
        const new_size = offset_usize + size_usize;
        const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
        try frame.consume_gas(memory_gas);

        // Ensure memory is available and get the slice
        _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);
        init_code = try frame.memory.get_slice(offset_usize, size_usize);
    }

    const init_code_cost = @as(u64, @intCast(init_code.len)) * gas_constants.CreateDataGas;
    const hash_cost = @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.Keccak256WordGas;

    // EIP-3860: Add gas cost for initcode word size (2 gas per 32-byte word) - Shanghai and later
    const initcode_word_cost = if (vm.chain_rules.IsEIP3860)
        @as(u64, @intCast((init_code.len + 31) / 32)) * gas_constants.InitcodeWordGas
    else
        0;
    try frame.consume_gas(init_code_cost + hash_cost + initcode_word_cost);

    // Calculate gas to give to the new contract (all but 1/64th)
    const gas_for_call = frame.gas_remaining - (frame.gas_remaining / 64);

    // Create the contract with CREATE2
    const result = try vm.create2_contract(frame.contract.address, value, init_code, salt, gas_for_call);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining / 64 + result.gas_left;

    if (!result.success) {
        try frame.stack.append( 0);
        frame.return_data_buffer = result.output orelse &[_]u8{};
        return Operation.ExecutionResult{};
    }

    // EIP-2929: Mark the newly created address as warm
    _ = try vm.access_list.access_address(result.address);
    try frame.stack.append( to_u256(result.address));

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    return Operation.ExecutionResult{};
}

pub fn op_call(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (args_offset > std.math.maxInt(usize) or args_size > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        // Check that offset + size doesn't overflow usize
        if (args_offset_usize > std.math.maxInt(usize) - args_size_usize) return ExecutionError.Error.InvalidOffset;

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        // Check that offset + size doesn't overflow and fits in usize
        if (ret_offset > std.math.maxInt(usize) or ret_size > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        // Check that offset + size doesn't overflow usize
        if (ret_offset_usize > std.math.maxInt(usize) - ret_size_usize) return ExecutionError.Error.InvalidOffset;

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    if (frame.is_static and value != 0) return ExecutionError.Error.WriteProtection;

    const to_address = from_u256(to);

    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the call
    const result = try vm.call_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append( if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_callcode(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const value = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    if (value != 0) {
        gas_for_call += 2300; // Stipend
    }

    // Execute the callcode (execute target's code with current storage context)
    // For callcode, we use the current contract's address as the execution context
    const result = try vm.callcode_contract(frame.contract.address, to_address, value, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append( if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_delegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the delegatecall (execute target's code with current storage context and msg.sender/value)
    // For delegatecall, we preserve the current contract's context
    // Note: delegatecall doesn't transfer value, it uses the current contract's value
    const result = try vm.delegatecall_contract(frame.contract.address, to_address, args, gas_for_call, frame.is_static);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append( if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}

pub fn op_staticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const gas = try frame.stack.pop();
    const to = try frame.stack.pop();
    const args_offset = try frame.stack.pop();
    const args_size = try frame.stack.pop();
    const ret_offset = try frame.stack.pop();
    const ret_size = try frame.stack.pop();

    // Check depth
    if (frame.depth >= 1024) {
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    // Get call data
    var args: []const u8 = &[_]u8{};
    if (args_size > 0) {
        try check_offset_bounds(args_offset);
        try check_offset_bounds(args_size);

        const args_offset_usize = @as(usize, @intCast(args_offset));
        const args_size_usize = @as(usize, @intCast(args_size));

        _ = try frame.memory.ensure_context_capacity(args_offset_usize + args_size_usize);
        args = try frame.memory.get_slice(args_offset_usize, args_size_usize);
    }

    // Ensure return memory
    if (ret_size > 0) {
        try check_offset_bounds(ret_offset);
        try check_offset_bounds(ret_size);

        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));

        _ = try frame.memory.ensure_context_capacity(ret_offset_usize + ret_size_usize);
    }

    // Convert to address
    const to_address = from_u256(to);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(to_address);
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Calculate gas to give to the call
    var gas_for_call = if (gas > std.math.maxInt(u64)) std.math.maxInt(u64) else @as(u64, @intCast(gas));
    gas_for_call = @min(gas_for_call, frame.gas_remaining - (frame.gas_remaining / 64));

    // Execute the static call (no value transfer, is_static = true)
    const result = try vm.call_contract(frame.contract.address, to_address, 0, args, gas_for_call, true);

    // Update gas remaining
    frame.gas_remaining = frame.gas_remaining - gas_for_call + result.gas_left;

    // Write return data to memory if requested
    if (ret_size > 0 and result.output != null) {
        const ret_offset_usize = @as(usize, @intCast(ret_offset));
        const ret_size_usize = @as(usize, @intCast(ret_size));
        const output = result.output.?;

        const copy_size = @min(ret_size_usize, output.len);
        const memory_slice = frame.memory.slice();
        @memcpy(memory_slice[ret_offset_usize .. ret_offset_usize + copy_size], output[0..copy_size]);

        // Zero out remaining bytes if output was smaller than requested
        if (copy_size < ret_size_usize) {
            @memset(memory_slice[ret_offset_usize + copy_size .. ret_offset_usize + ret_size_usize], 0);
        }
    }

    // Set return data
    frame.return_data_buffer = result.output orelse &[_]u8{};

    // Push success status
    try frame.stack.append( if (result.success) 1 else 0);

    return Operation.ExecutionResult{};
}
/// EXTCALL opcode (0xF8): External call with EOF validation
/// Not implemented - EOF feature
pub fn op_extcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTDELEGATECALL opcode (0xF9): External delegate call with EOF validation
/// Not implemented - EOF feature
pub fn op_extdelegatecall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}

/// EXTSTATICCALL opcode (0xFB): External static call with EOF validation
/// Not implemented - EOF feature
pub fn op_extstaticcall(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // This is an EOF (EVM Object Format) opcode, not yet implemented
    return ExecutionError.Error.EOFNotSupported;
}
```
```zig [src/evm/execution/execution_result.zig]
//! ExecutionResult module - Represents the outcome of executing an EVM opcode
//! 
//! This module defines the result structure returned by opcode execution functions.
//! Every opcode in the EVM returns an ExecutionResult that indicates:
//! - How many bytes of bytecode were consumed
//! - Whether execution should continue or halt (and if halting, what data to return)
//! 
//! ## Design Philosophy
//! 
//! The ExecutionResult struct provides a uniform interface for all opcode implementations
//! to communicate their results back to the main execution loop. This design allows for:
//! - Clean separation between opcode logic and control flow
//! - Efficient bytecode parsing without redundant position tracking
//! - Clear signaling of execution termination with associated data
//! 
//! ## Usage Pattern
//! 
//! ```zig
//! // In an opcode implementation
//! pub fn execute_add(vm: *VM) ExecutionResult {
//!     // Perform addition logic...
//!     return ExecutionResult{ .bytes_consumed = 1 }; // Continue execution
//! }
//! 
//! pub fn execute_return(vm: *VM) ExecutionResult {
//!     const data = vm.memory.read_range(offset, size);
//!     return ExecutionResult{ 
//!         .bytes_consumed = 1,
//!         .output = data  // Non-empty output signals halt
//!     };
//! }
//! ```

const std = @import("std");

/// ExecutionResult holds the result of executing a single EVM opcode
/// 
/// This struct is returned by every opcode execution function to indicate:
/// 1. How many bytes of bytecode were consumed (opcode + immediate data)
/// 2. Whether execution should continue or halt (indicated by output)
/// 
/// The EVM execution loop uses this information to:
/// - Advance the program counter by `bytes_consumed`
/// - Determine whether to continue executing or return control to caller
/// - Pass return data back to the calling context when halting
const Self = @This();

/// Number of bytes consumed by this opcode (including immediate data)
/// 
/// Most opcodes consume exactly 1 byte (just the opcode itself), but some
/// consume additional bytes for immediate data:
/// 
/// - **PUSH1-PUSH32**: Consume 1 + n bytes (opcode + n bytes of data)
/// - **All other opcodes**: Consume exactly 1 byte
/// 
/// The execution loop uses this value to advance the program counter (PC)
/// to the next instruction. Incorrect values here will cause the VM to
/// misinterpret subsequent bytecode.
/// 
/// ## Examples
/// - ADD opcode (0x01): bytes_consumed = 1
/// - PUSH1 0x42: bytes_consumed = 2 (1 for opcode, 1 for data)
/// - PUSH32 <32 bytes>: bytes_consumed = 33 (1 for opcode, 32 for data)
bytes_consumed: usize = 1,

/// Return data if the execution should halt (empty means continue)
/// 
/// This field serves a dual purpose:
/// 1. **Empty slice (`""`)**: Execution continues to the next instruction
/// 2. **Non-empty slice**: Execution halts and returns this data
/// 
/// Opcodes that halt execution include:
/// - **RETURN**: Returns specified data from memory
/// - **REVERT**: Returns revert data and reverts state changes  
/// - **STOP**: Halts with empty return data (but still non-empty slice)
/// - **INVALID**: Halts with empty data and consumes all gas
/// - **SELFDESTRUCT**: Halts after scheduling account destruction
/// 
/// The data in this field is typically:
/// - Memory contents for RETURN/REVERT
/// - Empty (but allocated) slice for STOP/INVALID
/// - Contract creation bytecode for CREATE operations
/// 
/// ## Memory Management
/// The slice should reference memory owned by the VM's memory system
/// or be a compile-time constant empty slice. The execution loop does
/// not free this memory.
output: []const u8 = "",
```
```zig [src/evm/execution/arithmetic.zig]
/// Arithmetic operations for the Ethereum Virtual Machine
///
/// This module implements all arithmetic opcodes for the EVM, including basic
/// arithmetic (ADD, SUB, MUL, DIV), signed operations (SDIV, SMOD), modular
/// arithmetic (MOD, ADDMOD, MULMOD), exponentiation (EXP), and sign extension
/// (SIGNEXTEND).
///
/// ## Design Philosophy
///
/// All operations follow a consistent pattern:
/// 1. Pop operands from the stack (validated by jump table)
/// 2. Perform the arithmetic operation
/// 3. Push the result back onto the stack
///
/// ## Performance Optimizations
///
/// - **Unsafe Operations**: Stack bounds checking is done by the jump table,
///   allowing opcodes to use unsafe stack operations for maximum performance
/// - **In-Place Updates**: Results are written directly to stack slots to
///   minimize memory operations
/// - **Wrapping Arithmetic**: Uses Zig's wrapping operators (`+%`, `*%`, `-%`)
///   for correct 256-bit overflow behavior
///
/// ## EVM Arithmetic Rules
///
/// - All values are 256-bit unsigned integers (u256)
/// - Overflow wraps around (e.g., MAX_U256 + 1 = 0)
/// - Division by zero returns 0 (not an error)
/// - Modulo by zero returns 0 (not an error)
/// - Signed operations interpret u256 as two's complement i256
///
/// ## Gas Costs
///
/// - ADD, SUB, NOT: 3 gas (GasFastestStep)
/// - MUL, DIV, SDIV, MOD, SMOD: 5 gas (GasFastStep)
/// - ADDMOD, MULMOD, SIGNEXTEND: 8 gas (GasMidStep)
/// - EXP: 10 gas + 50 per byte of exponent
///
/// ## Stack Requirements
///
/// Operation    | Stack Input | Stack Output | Description
/// -------------|-------------|--------------|-------------
/// ADD          | [a, b]      | [a + b]      | Addition with overflow
/// MUL          | [a, b]      | [a * b]      | Multiplication with overflow
/// SUB          | [a, b]      | [a - b]      | Subtraction with underflow
/// DIV          | [a, b]      | [a / b]      | Division (b=0 returns 0)
/// SDIV         | [a, b]      | [a / b]      | Signed division
/// MOD          | [a, b]      | [a % b]      | Modulo (b=0 returns 0)
/// SMOD         | [a, b]      | [a % b]      | Signed modulo
/// ADDMOD       | [a, b, n]   | [(a+b)%n]    | Addition modulo n
/// MULMOD       | [a, b, n]   | [(a*b)%n]    | Multiplication modulo n
/// EXP          | [a, b]      | [a^b]        | Exponentiation
/// SIGNEXTEND   | [b, x]      | [y]          | Sign extend x from byte b
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

/// ADD opcode (0x01) - Addition operation
///
/// Pops two values from the stack, adds them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a + b`: Sum with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate sum = (a + b) mod 2^256
/// 4. Push sum to stack
///
/// ## Example
/// Stack: [10, 20] => [30]
/// Stack: [MAX_U256, 1] => [0] (overflow wraps)
pub fn op_add(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const sum = a +% b;

    frame.stack.set_top_unsafe(sum);

    return Operation.ExecutionResult{};
}

/// MUL opcode (0x02) - Multiplication operation
///
/// Pops two values from the stack, multiplies them with wrapping overflow,
/// and pushes the result.
///
/// ## Stack Input
/// - `a`: First operand (second from top)
/// - `b`: Second operand (top)
///
/// ## Stack Output
/// - `a * b`: Product with 256-bit wrapping overflow
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate product = (a * b) mod 2^256
/// 4. Push product to stack
///
/// ## Example
/// Stack: [10, 20] => [200]
/// Stack: [2^128, 2^128] => [0] (overflow wraps)
pub fn op_mul(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;
    const product = a *% b;

    frame.stack.set_top_unsafe(product);

    return Operation.ExecutionResult{};
}

/// SUB opcode (0x03) - Subtraction operation
///
/// Pops two values from the stack, subtracts the top from the second,
/// with wrapping underflow, and pushes the result.
///
/// ## Stack Input
/// - `a`: Minuend (second from top)
/// - `b`: Subtrahend (top)
///
/// ## Stack Output
/// - `a - b`: Difference with 256-bit wrapping underflow
///
/// ## Gas Cost
/// 3 gas (GasFastestStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Calculate result = (a - b) mod 2^256
/// 4. Push result to stack
///
/// ## Example
/// Stack: [30, 10] => [20]
/// Stack: [10, 20] => [2^256 - 10] (underflow wraps)
pub fn op_sub(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a -% b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// DIV opcode (0x04) - Unsigned integer division
///
/// Pops two values from the stack, divides the second by the top,
/// and pushes the integer quotient. Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a / b`: Integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = floor(a / b)
/// 5. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [7, 3] => [2] (integer division)
/// Stack: [100, 0] => [0] (division by zero)
///
/// ## Note
/// Unlike most programming languages, EVM division by zero does not
/// throw an error but returns 0. This is a deliberate design choice
/// to avoid exceptional halting conditions.
pub fn op_div(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) 0 else a / b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SDIV opcode (0x05) - Signed integer division
///
/// Pops two values from the stack, interprets them as signed integers,
/// divides the second by the top, and pushes the signed quotient.
/// Division by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a / b`: Signed integer quotient, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else if a = -2^255 and b = -1, result = -2^255 (overflow case)
/// 6. Else result = truncated division a / b
/// 7. Push result to stack
///
/// ## Example
/// Stack: [20, 5] => [4]
/// Stack: [-20, 5] => [-4] (0xfff...fec / 5)
/// Stack: [-20, -5] => [4]
/// Stack: [MIN_I256, -1] => [MIN_I256] (overflow protection)
///
/// ## Note
/// The special case for MIN_I256 / -1 prevents integer overflow,
/// as the mathematical result (2^255) cannot be represented in i256.
pub fn op_sdiv(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const min_i256 = @as(i256, 1) << 255;
        if (a_i256 == min_i256 and b_i256 == -1) {
            result = @as(u256, @bitCast(min_i256));
        } else {
            const result_i256 = @divTrunc(a_i256, b_i256);
            result = @as(u256, @bitCast(result_i256));
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MOD opcode (0x06) - Modulo remainder operation
///
/// Pops two values from the stack, calculates the remainder of dividing
/// the second by the top, and pushes the result. Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend (second from top)
/// - `b`: Divisor (top)
///
/// ## Stack Output
/// - `a % b`: Remainder of a / b, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. If b = 0, result = 0 (no error)
/// 4. Else result = a modulo b
/// 5. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [100, 10] => [0]
/// Stack: [7, 0] => [0] (modulo by zero)
///
/// ## Note
/// The result is always in range [0, b-1] for b > 0.
/// Like DIV, modulo by zero returns 0 rather than throwing an error.
pub fn op_mod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = if (b == 0) 0 else a % b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SMOD opcode (0x07) - Signed modulo remainder operation
///
/// Pops two values from the stack, interprets them as signed integers,
/// calculates the signed remainder, and pushes the result.
/// Modulo by zero returns 0.
///
/// ## Stack Input
/// - `a`: Dividend as signed i256 (second from top)
/// - `b`: Divisor as signed i256 (top)
///
/// ## Stack Output
/// - `a % b`: Signed remainder, or 0 if b = 0
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack
/// 2. Pop a from stack
/// 3. Interpret both as two's complement signed integers
/// 4. If b = 0, result = 0
/// 5. Else result = signed remainder of a / b
/// 6. Push result to stack
///
/// ## Example
/// Stack: [17, 5] => [2]
/// Stack: [-17, 5] => [-2] (sign follows dividend)
/// Stack: [17, -5] => [2]
/// Stack: [-17, -5] => [-2]
///
/// ## Note
/// In signed modulo, the result has the same sign as the dividend (a).
/// This follows the Euclidean division convention where:
/// a = b * q + r, where |r| < |b| and sign(r) = sign(a)
pub fn op_smod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (b == 0) {
        result = 0;
    } else {
        const a_i256 = @as(i256, @bitCast(a));
        const b_i256 = @as(i256, @bitCast(b));
        const result_i256 = @rem(a_i256, b_i256);
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// ADDMOD opcode (0x08) - Addition modulo n
///
/// Pops three values from the stack, adds the first two, then takes
/// the modulo with the third value. Handles overflow correctly by
/// computing (a + b) mod n, not ((a + b) mod 2^256) mod n.
///
/// ## Stack Input
/// - `a`: First addend (third from top)
/// - `b`: Second addend (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a + b) % n`: Sum modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second addend)
/// 3. Pop a from stack (first addend)
/// 4. If n = 0, result = 0
/// 5. Else result = (a + b) mod n
/// 6. Push result to stack
///
/// ## Example
/// Stack: [10, 20, 7] => [2] ((10 + 20) % 7)
/// Stack: [MAX_U256, 5, 10] => [4] (overflow handled)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation is atomic - the addition and modulo are
/// performed as one operation to handle cases where a + b
/// exceeds 2^256.
pub fn op_addmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // The EVM ADDMOD operation computes (a + b) % n
        // Since we're working with u256, overflow wraps automatically
        // So (a +% b) gives us (a + b) mod 2^256
        // Then we just need to compute that result mod n
        const sum = a +% b; // Wrapping addition
        result = sum % n;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// MULMOD opcode (0x09) - Multiplication modulo n
///
/// Pops three values from the stack, multiplies the first two, then
/// takes the modulo with the third value. Correctly handles cases where
/// the product exceeds 2^256.
///
/// ## Stack Input
/// - `a`: First multiplicand (third from top)
/// - `b`: Second multiplicand (second from top)
/// - `n`: Modulus (top)
///
/// ## Stack Output
/// - `(a * b) % n`: Product modulo n, or 0 if n = 0
///
/// ## Gas Cost
/// 8 gas (GasMidStep)
///
/// ## Execution
/// 1. Pop n from stack (modulus)
/// 2. Pop b from stack (second multiplicand)
/// 3. Pop a from stack (first multiplicand)
/// 4. If n = 0, result = 0
/// 5. Else compute (a * b) mod n using Russian peasant algorithm
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses Russian peasant multiplication with modular reduction:
/// - Reduces inputs modulo n first
/// - Builds product bit by bit, reducing modulo n at each step
/// - Avoids need for 512-bit intermediate values
///
/// ## Example
/// Stack: [10, 20, 7] => [4] ((10 * 20) % 7)
/// Stack: [2^128, 2^128, 100] => [0] (handles overflow)
/// Stack: [50, 50, 0] => [0] (modulo by zero)
///
/// ## Note
/// This operation correctly computes (a * b) mod n even when
/// a * b exceeds 2^256, unlike naive (a *% b) % n approach.
pub fn op_mulmod(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;
    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    const n = frame.stack.pop_unsafe();
    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;
    if (n == 0) {
        result = 0;
    } else {
        // For MULMOD, we need to compute (a * b) % n where a * b might overflow
        // We can't just do (a *% b) % n because that would give us ((a * b) % 2^256) % n
        // which is not the same as (a * b) % n when a * b >= 2^256

        // We'll use the Russian peasant multiplication algorithm with modular reduction
        // This allows us to compute (a * b) % n without needing the full 512-bit product
        result = 0;
        var x = a % n;
        var y = b % n;

        while (y > 0) {
            // If y is odd, add x to result (mod n)
            if ((y & 1) == 1) {
                const sum = result +% x;
                result = sum % n;
            }

            x = (x +% x) % n;

            y >>= 1;
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// EXP opcode (0x0A) - Exponentiation
///
/// Pops two values from the stack and raises the second to the power
/// of the top. All operations are modulo 2^256.
///
/// ## Stack Input
/// - `a`: Base (second from top)
/// - `b`: Exponent (top)
///
/// ## Stack Output
/// - `a^b`: Result of a raised to power b, modulo 2^256
///
/// ## Gas Cost
/// - Static: 10 gas
/// - Dynamic: 50 gas per byte of exponent
/// - Total: 10 + 50 * byte_size_of_exponent
///
/// ## Execution
/// 1. Pop b from stack (exponent)
/// 2. Pop a from stack (base)
/// 3. Calculate dynamic gas cost based on exponent size
/// 4. Consume the dynamic gas
/// 5. Calculate a^b using binary exponentiation
/// 6. Push result to stack
///
/// ## Algorithm
/// Uses binary exponentiation (square-and-multiply):
/// - Processes exponent bit by bit
/// - Squares base for each bit position
/// - Multiplies result when bit is set
/// - All operations modulo 2^256
///
/// ## Example
/// Stack: [2, 10] => [1024]
/// Stack: [3, 4] => [81]
/// Stack: [10, 0] => [1] (anything^0 = 1)
/// Stack: [0, 10] => [0] (0^anything = 0, except 0^0 = 1)
///
/// ## Gas Examples
/// - 2^10: 10 + 50*1 = 60 gas (exponent fits in 1 byte)
/// - 2^256: 10 + 50*2 = 110 gas (exponent needs 2 bytes)
/// - 2^(2^255): 10 + 50*32 = 1610 gas (huge exponent)
pub fn op_exp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));
    _ = vm;

    if (frame.stack.size < 2) unreachable;

    const exp = frame.stack.pop_unsafe();
    const base = frame.stack.peek_unsafe().*;

    var exp_copy = exp;
    var byte_size: u64 = 0;
    while (exp_copy > 0) : (exp_copy >>= 8) {
        byte_size += 1;
    }
    if (byte_size > 0) {
        const gas_cost = 50 * byte_size;
        try frame.consume_gas(gas_cost);
    }

    var result: u256 = 1;
    var b = base;
    var e = exp;

    while (e > 0) {
        if ((e & 1) == 1) {
            result *%= b;
        }
        b *%= b;
        e >>= 1;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

/// SIGNEXTEND opcode (0x0B) - Sign extension
///
/// Extends the sign bit of a value from a given byte position to fill
/// all higher-order bits. Used to convert smaller signed integers to
/// full 256-bit representation.
///
/// ## Stack Input
/// - `b`: Byte position of sign bit (0-indexed from right)
/// - `x`: Value to sign-extend
///
/// ## Stack Output
/// - Sign-extended value
///
/// ## Gas Cost
/// 5 gas (GasFastStep)
///
/// ## Execution
/// 1. Pop b from stack (byte position)
/// 2. Pop x from stack (value to extend)
/// 3. If b >= 31, return x unchanged (already full width)
/// 4. Find sign bit at position (b * 8 + 7)
/// 5. If sign bit = 1, fill higher bits with 1s
/// 6. If sign bit = 0, fill higher bits with 0s
/// 7. Push result to stack
///
/// ## Byte Position
/// - b = 0: Extend from byte 0 (bits 0-7, rightmost byte)
/// - b = 1: Extend from byte 1 (bits 8-15)
/// - b = 31: Extend from byte 31 (bits 248-255, leftmost byte)
///
/// ## Example
/// Stack: [0, 0x7F] => [0x7F] (positive sign, no change)
/// Stack: [0, 0x80] => [0xFFFF...FF80] (negative sign extended)
/// Stack: [1, 0x80FF] => [0xFFFF...80FF] (extend from byte 1)
/// Stack: [31, x] => [x] (already full width)
///
/// ## Use Cases
/// - Converting int8/int16/etc to int256
/// - Arithmetic on mixed-width signed integers
/// - Implementing higher-level language semantics
pub fn op_signextend(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const byte_num = frame.stack.pop_unsafe();
    const x = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (byte_num >= 31) {
        result = x;
    } else {
        const byte_index = @as(u8, @intCast(byte_num));
        const sign_bit_pos = byte_index * 8 + 7;

        const sign_bit = (x >> @intCast(sign_bit_pos)) & 1;

        const keep_bits = sign_bit_pos + 1;

        if (sign_bit == 1) {
            // First, create a mask of all 1s for the upper bits
            if (keep_bits >= 256) {
                result = x;
            } else {
                const shift_amount = @as(u9, 256) - @as(u9, keep_bits);
                const ones_mask = ~(@as(u256, 0) >> @intCast(shift_amount));
                result = x | ones_mask;
            }
        } else {
            // Sign bit is 0, extend with 0s (just mask out upper bits)
            if (keep_bits >= 256) {
                result = x;
            } else {
                const zero_mask = (@as(u256, 1) << @intCast(keep_bits)) - 1;
                result = x & zero_mask;
            }
        }
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/control.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const ExecutionResult = @import("execution_result.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;
const Address = @import("Address");
const from_u256 = Address.from_u256;

pub fn op_stop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    return ExecutionError.Error.STOP;
}

pub fn op_jump(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) unreachable;

    // Use unsafe pop since bounds checking is done by jump_table
    const dest = frame.stack.pop_unsafe();

    // Check if destination is a valid JUMPDEST (pass u256 directly)
    if (!frame.contract.valid_jumpdest(frame.allocator, dest)) return ExecutionError.Error.InvalidJump;

    // After validation, convert to usize for setting pc
    if (dest > std.math.maxInt(usize)) return ExecutionError.Error.InvalidJump;

    frame.pc = @as(usize, @intCast(dest));

    return ExecutionResult{};
}

pub fn op_jumpi(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const dest = values.b; // Second from top (was on top)
    const condition = values.a; // Third from top (was second)

    if (condition != 0) {
        // Check if destination is a valid JUMPDEST (pass u256 directly)
        if (!frame.contract.valid_jumpdest(frame.allocator, dest)) return ExecutionError.Error.InvalidJump;

        // After validation, convert to usize for setting pc
        if (dest > std.math.maxInt(usize)) return ExecutionError.Error.InvalidJump;

        frame.pc = @as(usize, @intCast(dest));
    }

    return ExecutionResult{};
}

pub fn op_pc(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) unreachable;

    // Use unsafe push since bounds checking is done by jump_table
    frame.stack.append_unsafe(@as(u256, @intCast(pc)));

    return ExecutionResult{};
}

pub fn op_jumpdest(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;

    // No-op, just marks valid jump destination
    return ExecutionResult{};
}

pub fn op_return(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.STOP; // RETURN ends execution normally
}

pub fn op_revert(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Use batch pop for performance - pop 2 values at once
    const values = frame.stack.pop2_unsafe();
    const size = values.b; // Second from top (was on top)
    const offset = values.a; // Third from top (was second)

    if (size == 0) {
        frame.return_data_buffer = &[_]u8{};
    } else {
        if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

        const offset_usize = @as(usize, @intCast(offset));
        const size_usize = @as(usize, @intCast(size));

        // Calculate memory expansion gas cost
        const current_size = frame.memory.context_size();
        const end = offset_usize + size_usize;
        if (end > offset_usize) { // Check for overflow
            const memory_gas = gas_constants.memory_gas_cost(current_size, end);
            try frame.consume_gas(memory_gas);

            _ = try frame.memory.ensure_context_capacity(end);
        }

        // Get data from memory
        const data = try frame.memory.get_slice(offset_usize, size_usize);

        // Note: The memory gas cost already protects against excessive memory use.
        // The VM should handle copying the data when needed. We just set the reference.
        frame.return_data_buffer = data;
    }

    return ExecutionError.Error.REVERT;
}

pub fn op_invalid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Debug: op_invalid entered
    // INVALID opcode consumes all remaining gas
    frame.gas_remaining = 0;
    // Debug: op_invalid returning InvalidOpcode

    return ExecutionError.Error.InvalidOpcode;
}

pub fn op_selfdestruct(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Check if we're in a static call
    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    if (frame.stack.size < 1) unreachable;

    // Use unsafe pop since bounds checking is done by jump_table
    const beneficiary_u256 = frame.stack.pop_unsafe();
    const beneficiary = from_u256(beneficiary_u256);

    // EIP-2929: Check if beneficiary address is cold and consume appropriate gas
    const access_cost = vm.access_list.access_address(beneficiary) catch |err| switch (err) {
        error.OutOfMemory => return ExecutionError.Error.OutOfGas,
    };
    const is_cold = access_cost == AccessList.COLD_ACCOUNT_ACCESS_COST;
    if (is_cold) {
        // Cold address access costs more (2600 gas)
        try frame.consume_gas(gas_constants.ColdAccountAccessCost);
    }

    // Schedule selfdestruct for execution at the end of the transaction
    // For now, just return STOP

    return ExecutionError.Error.STOP;
}
```
```zig [src/evm/execution/package.zig]
// Package file for opcodes modules
// This file serves as the entry point for importing opcode modules

// Re-export all opcode modules for easy access
pub const arithmetic = @import("arithmetic.zig");
pub const bitwise = @import("bitwise.zig");
pub const block = @import("block.zig");
pub const comparison = @import("comparison.zig");
pub const control = @import("control.zig");
pub const crypto = @import("crypto.zig");
pub const environment = @import("environment.zig");
pub const log = @import("log.zig");
pub const memory = @import("memory.zig");
pub const stack = @import("stack.zig");
pub const storage = @import("storage.zig");
pub const system = @import("system.zig");

// Re-export common types
pub const Operation = @import("../opcodes/operation.zig");
pub const ExecutionError = @import("execution_error.zig");
pub const Frame = @import("../frame.zig");
pub const Stack = @import("../stack/stack.zig");
pub const Memory = @import("../memory.zig");
pub const Vm = @import("../vm.zig");
pub const Contract = @import("../contract/contract.zig");
pub const gas_constants = @import("../constants/gas_constants.zig");
```
```zig [src/evm/execution/execution_error.zig]
const std = @import("std");

/// ExecutionError represents various error conditions that can occur during EVM execution
///
/// This module defines all possible error conditions that can occur during the execution
/// of EVM bytecode. These errors are used throughout the EVM implementation to signal
/// various failure conditions, from normal stops to critical errors.
///
/// ## Error Categories
///
/// The errors can be broadly categorized into:
///
/// 1. **Normal Termination**: STOP, REVERT, INVALID
/// 2. **Resource Exhaustion**: OutOfGas, StackOverflow, MemoryLimitExceeded
/// 3. **Invalid Operations**: InvalidJump, InvalidOpcode, StaticStateChange
/// 4. **Bounds Violations**: StackUnderflow, OutOfOffset, ReturnDataOutOfBounds
/// 5. **Contract Creation**: DeployCodeTooBig, MaxCodeSizeExceeded, InvalidCodeEntry
/// 6. **Call Stack**: DepthLimit
/// 7. **Memory Management**: OutOfMemory, InvalidOffset, InvalidSize, ChildContextActive
/// 8. **Future Features**: EOFNotSupported
const Self = @This();

/// Error types for EVM execution
///
/// Each error represents a specific condition that can occur during EVM execution.
/// Some errors (like STOP and REVERT) are normal termination conditions, while
/// others represent actual failure states.
pub const Error = error{
    /// Normal termination via STOP opcode (0x00)
    /// This is not an error condition - it signals successful completion
    STOP,

    /// State reversion via REVERT opcode (0xFD)
    /// Returns data and reverts all state changes in the current context
    REVERT,

    /// Execution of INVALID opcode (0xFE)
    /// Consumes all remaining gas and reverts state
    INVALID,

    /// Insufficient gas to complete operation
    /// Occurs when gas_remaining < gas_required for any operation
    OutOfGas,

    /// Attempted to pop from empty stack or insufficient stack items
    /// Stack operations require specific minimum stack sizes
    StackUnderflow,

    /// Stack size exceeded maximum of 1024 elements
    /// Pushing to a full stack causes this error
    StackOverflow,

    /// JUMP/JUMPI to invalid destination
    /// Destination must be a JUMPDEST opcode at a valid position
    InvalidJump,

    /// Attempted to execute undefined opcode
    /// Not all byte values 0x00-0xFF are defined opcodes
    InvalidOpcode,

    /// Attempted state modification in static call context
    /// SSTORE, LOG*, CREATE*, and SELFDESTRUCT are forbidden in static calls
    StaticStateChange,

    /// Memory or calldata access beyond valid bounds
    /// Usually from integer overflow in offset calculations
    OutOfOffset,

    /// Gas calculation resulted in integer overflow
    /// Can occur with extremely large memory expansions
    GasUintOverflow,

    /// Attempted write in read-only context
    /// Similar to StaticStateChange but more general
    WriteProtection,

    /// RETURNDATACOPY accessing data beyond RETURNDATASIZE
    /// Unlike other copy operations, this is a hard error
    ReturnDataOutOfBounds,

    /// Contract deployment code exceeds maximum size
    /// Deployment bytecode has its own size limits
    DeployCodeTooBig,

    /// Deployed contract code exceeds 24,576 byte limit (EIP-170)
    /// Prevents storing excessively large contracts
    MaxCodeSizeExceeded,

    /// Invalid contract initialization code
    /// Can occur with malformed constructor bytecode
    InvalidCodeEntry,

    /// Call stack depth exceeded 1024 levels
    /// Prevents infinite recursion and stack overflow attacks
    DepthLimit,

    /// Memory allocation failed (host environment issue)
    /// Not a normal EVM error - indicates system resource exhaustion
    OutOfMemory,

    /// Invalid memory offset in operation
    /// Usually from malformed offset values
    InvalidOffset,

    /// Invalid memory size in operation
    /// Usually from malformed size values
    InvalidSize,

    /// Memory expansion would exceed configured limits
    /// Prevents excessive memory usage (typically 32MB limit)
    MemoryLimitExceeded,

    /// Attempted operation while child memory context is active
    /// Memory contexts must be properly managed
    ChildContextActive,

    /// Attempted to revert/commit without active child context
    /// Memory context operations must be balanced
    NoChildContextToRevertOrCommit,

    /// EOF (EVM Object Format) features not yet implemented
    /// Placeholder for future EOF-related opcodes
    EOFNotSupported,
};

/// Get a human-readable description for an execution error
///
/// Provides detailed descriptions of what each error means and when it occurs.
/// Useful for debugging, logging, and error reporting.
///
/// ## Parameters
/// - `err`: The execution error to describe
///
/// ## Returns
/// A string slice containing a human-readable description of the error
///
/// ## Example
/// ```zig
/// const err = Error.StackOverflow;
/// const desc = get_description(err);
/// std.log.err("EVM execution failed: {s}", .{desc});
/// ```
pub fn get_description(err: Error) []const u8 {
    return switch (err) {
        Error.STOP => "Normal STOP opcode execution",
        Error.REVERT => "REVERT opcode - state reverted",
        Error.INVALID => "INVALID opcode or invalid operation",
        Error.OutOfGas => "Out of gas",
        Error.StackUnderflow => "Stack underflow",
        Error.StackOverflow => "Stack overflow (beyond 1024 elements)",
        Error.InvalidJump => "Jump to invalid destination",
        Error.InvalidOpcode => "Undefined opcode",
        Error.StaticStateChange => "State modification in static context",
        Error.OutOfOffset => "Memory access out of bounds",
        Error.GasUintOverflow => "Gas calculation overflow",
        Error.WriteProtection => "Write to protected storage",
        Error.ReturnDataOutOfBounds => "Return data access out of bounds",
        Error.DeployCodeTooBig => "Contract creation code too large",
        Error.MaxCodeSizeExceeded => "Contract code size exceeds limit",
        Error.InvalidCodeEntry => "Invalid contract entry code",
        Error.DepthLimit => "Call depth exceeds limit (1024)",
        Error.OutOfMemory => "Out of memory allocation failed",
        Error.InvalidOffset => "Invalid memory offset",
        Error.InvalidSize => "Invalid memory size",
        Error.MemoryLimitExceeded => "Memory limit exceeded",
        Error.ChildContextActive => "Child context is active",
        Error.NoChildContextToRevertOrCommit => "No child context to revert or commit",
        Error.EOFNotSupported => "EOF (EVM Object Format) opcode not supported",
    };
}
```
```zig [src/evm/execution/bitwise.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

pub fn op_and(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a & b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_or(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a | b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_xor(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const b = frame.stack.pop_unsafe();
    const a = frame.stack.peek_unsafe().*;

    const result = a ^ b;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_not(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) unreachable;

    const value = frame.stack.peek_unsafe().*;

    const result = ~value;

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_byte(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const i = frame.stack.pop_unsafe();
    const val = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (i >= 32) {
        result = 0;
    } else {
        const i_usize = @as(usize, @intCast(i));
        // Byte 0 is MSB, byte 31 is LSB
        // To get byte i, we need to shift right by (31 - i) * 8 positions
        const shift_amount = (31 - i_usize) * 8;
        result = (val >> @intCast(shift_amount)) & 0xFF;
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shl(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value << @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_shr(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        result = 0;
    } else {
        result = value >> @intCast(shift);
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_sar(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    const shift = frame.stack.pop_unsafe();
    const value = frame.stack.peek_unsafe().*;

    var result: u256 = undefined;

    if (shift >= 256) {
        const sign_bit = value >> 255;
        if (sign_bit == 1) {
            result = std.math.maxInt(u256);
        } else {
            result = 0;
        }
    } else {
        // Arithmetic shift preserving sign
        const shift_amount = @as(u8, @intCast(shift));
        const value_i256 = @as(i256, @bitCast(value));
        const result_i256 = value_i256 >> shift_amount;
        result = @as(u256, @bitCast(result_i256));
    }

    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/crypto.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");

pub fn op_sha3(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    // Check bounds before anything else
    if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    if (size == 0) {
        // Even with size 0, we need to validate the offset is reasonable
        if (offset > 0) {
            // Check if offset is beyond reasonable memory limits
            const offset_usize = @as(usize, @intCast(offset));
            const memory_limits = @import("../constants/memory_limits.zig");
            if (offset_usize > memory_limits.MAX_MEMORY_SIZE) return ExecutionError.Error.OutOfOffset;
        }
        // Hash of empty data = keccak256("")
        const empty_hash: u256 = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        try frame.stack.append( empty_hash);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const size_usize = @as(usize, @intCast(size));

    // Check if offset + size would overflow
    const end = std.math.add(usize, offset_usize, size_usize) catch {
        return ExecutionError.Error.OutOfOffset;
    };

    // Check if the end position exceeds reasonable memory limits
    const memory_limits = @import("../constants/memory_limits.zig");
    if (end > memory_limits.MAX_MEMORY_SIZE) return ExecutionError.Error.OutOfOffset;

    // Dynamic gas cost for hashing
    const word_size = (size_usize + 31) / 32;
    const gas_cost = 6 * word_size;
    _ = vm;
    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);

    // Get data and hash
    const data = try frame.memory.get_slice(offset_usize, size_usize);

    // Calculate keccak256 hash
    var hash: [32]u8 = undefined;
    std.crypto.hash.sha3.Keccak256.hash(data, &hash, .{});

    // Hash calculated successfully

    // Convert hash to u256
    var result: u256 = 0;
    for (hash) |byte| {
        result = (result << 8) | byte;
    }

    try frame.stack.append(result);

    return Operation.ExecutionResult{};
}

// Alias for backwards compatibility
pub const op_keccak256 = op_sha3;
```
```zig [src/evm/execution/environment.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");
const to_u256 = Address.to_u256;
const from_u256 = Address.from_u256;
const gas_constants = @import("../constants/gas_constants.zig");
const AccessList = @import("../access_list/access_list.zig").AccessList;

// Import helper functions from error_mapping

pub fn op_address(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push contract address as u256
    const addr = to_u256(frame.contract.address);
    try frame.stack.append( addr);

    return Operation.ExecutionResult{};
}

pub fn op_balance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get balance from VM state
    const balance = vm.state.get_balance(address);
    try frame.stack.append( balance);

    return Operation.ExecutionResult{};
}

pub fn op_origin(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push transaction origin address
    const origin = to_u256(vm.context.tx_origin);
    try frame.stack.append( origin);

    return Operation.ExecutionResult{};
}

pub fn op_caller(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push caller address
    const caller = to_u256(frame.contract.caller);
    try frame.stack.append( caller);

    return Operation.ExecutionResult{};
}

pub fn op_callvalue(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push call value
    try frame.stack.append( frame.contract.value);

    return Operation.ExecutionResult{};
}

pub fn op_gasprice(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push gas price from transaction context
    try frame.stack.append( vm.context.gas_price);

    return Operation.ExecutionResult{};
}

pub fn op_extcodesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code size from VM state
    const code = vm.state.get_code(address);
    try frame.stack.append( @as(u256, @intCast(code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_extcodecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const address = from_u256(address_u256);
    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get external code from VM state
    const code = vm.state.get_code(address);

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_extcodehash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const address_u256 = try frame.stack.pop();
    const address = from_u256(address_u256);

    // EIP-2929: Check if address is cold and consume appropriate gas
    const access_cost = try vm.access_list.access_address(address);
    try frame.consume_gas(access_cost);

    // Get code from VM state and compute hash
    const code = vm.state.get_code(address);
    if (code.len == 0) {
        // Empty account - return zero
        try frame.stack.append( 0);
    } else {
        // Compute keccak256 hash of the code
        var hash: [32]u8 = undefined;
        std.crypto.hash.sha3.Keccak256.hash(code, &hash, .{});

        // Convert hash to u256
        var hash_u256: u256 = 0;
        for (hash) |byte| {
            hash_u256 = (hash_u256 << 8) | byte;
        }
        try frame.stack.append( hash_u256);
    }

    return Operation.ExecutionResult{};
}

pub fn op_selfbalance(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get balance of current executing contract
    const self_address = frame.contract.address;
    const balance = vm.state.get_balance(self_address);
    try frame.stack.append( balance);

    return Operation.ExecutionResult{};
}

pub fn op_chainid(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Push chain ID from VM context
    try frame.stack.append( vm.context.chain_id);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of calldata - use frame.input which is set by the VM
    // The frame.input is the actual calldata for this execution context
    try frame.stack.append( @as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Push size of current contract's code
    try frame.stack.append( @as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    if (offset > std.math.maxInt(usize)) {
        // Offset too large, push zero
        try frame.stack.append( 0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));
    const calldata = frame.input; // Use frame.input, not frame.contract.input

    // Load 32 bytes from calldata, padding with zeros if necessary
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        if (offset_usize + i < calldata.len) {
            value = (value << 8) | calldata[offset_usize + i];
        } else {
            value = value << 8; // Pad with zero
        }
    }

    try frame.stack.append( value);

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, data offset, and size
    const mem_offset = try frame.stack.pop();
    const data_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation (VERYLOW * word_count)
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get calldata from frame.input
    const calldata = frame.input;

    // Use set_data_bounded to copy the calldata to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, calldata, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop memory offset, code offset, and size
    const mem_offset = try frame.stack.pop();
    const code_offset = try frame.stack.pop();
    const size = try frame.stack.pop();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Get current contract code
    const code = frame.contract.code;

    // Use set_data_bounded to copy the code to memory
    // This handles partial copies and zero-padding automatically
    try frame.memory.set_data_bounded(mem_offset_usize, code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}
/// RETURNDATALOAD opcode (0xF7): Loads a 32-byte word from return data
/// This is an EOF opcode that allows reading from the return data buffer
pub fn op_returndataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    // Pop offset from stack
    const offset = try frame.stack.pop();

    // Check if offset is within bounds
    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));
    const return_data = frame.return_data_buffer;

    // If offset + 32 > return_data.len, this is an error (unlike CALLDATALOAD which pads with zeros)
    if (offset_usize + 32 > return_data.len) return ExecutionError.Error.OutOfOffset;

    // Load 32 bytes from return data
    var value: u256 = 0;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        value = (value << 8) | return_data[offset_usize + i];
    }

    try frame.stack.append( value);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/log.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");

// Compile-time verification that this file is being used
const COMPILE_TIME_LOG_VERSION = "2024_LOG_FIX_V2";

// Import Log struct from VM
const Log = Vm.Log;

// Import helper functions from error_mapping

pub fn make_log(comptime num_topics: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn log(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));
            const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

            // Debug logging removed for production

            // Check if we're in a static call
            if (frame.is_static) return ExecutionError.Error.WriteProtection;

            // REVM EXACT MATCH: Pop offset first, then len (revm: popn!([offset, len]))
            const offset = try frame.stack.pop();
            const size = try frame.stack.pop();

            // Debug logging removed for production

            // Pop N topics in order and store them in REVERSE (revm: stack.popn::<N>() returns in push order)
            var topics: [4]u256 = undefined;
            for (0..num_topics) |i| {
                topics[num_topics - 1 - i] = try frame.stack.pop();
                // Topic popped successfully
            }

            if (size == 0) {
                // Empty data
                // Emit empty log
                try vm.emit_log(frame.contract.address, topics[0..num_topics], &[_]u8{});
                return Operation.ExecutionResult{};
            }

            // Process non-empty log data

            if (offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) {
                // Offset or size exceeds maximum
                return ExecutionError.Error.OutOfOffset;
            }

            const offset_usize = @as(usize, @intCast(offset));
            const size_usize = @as(usize, @intCast(size));

            // Convert to usize for memory operations

            // Note: Base LOG gas (375) and topic gas (375 * N) are handled by jump table as constant_gas
            // We only need to handle dynamic costs: memory expansion and data bytes

            // 1. Calculate memory expansion gas cost
            const current_size = frame.memory.context_size();
            const new_size = offset_usize + size_usize;
            const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);

            // Memory expansion gas calculated

            try frame.consume_gas(memory_gas);

            // 2. Dynamic gas for data
            const byte_cost = gas_constants.LogDataGas * size_usize;

            // Calculate dynamic gas for data

            try frame.consume_gas(byte_cost);

            // Gas consumed successfully

            // Ensure memory is available
            _ = try frame.memory.ensure_context_capacity(offset_usize + size_usize);

            // Get log data
            const data = try frame.memory.get_slice(offset_usize, size_usize);

            // Emit log with data

            // Add log
            try vm.emit_log(frame.contract.address, topics[0..num_topics], data);

            return Operation.ExecutionResult{};
        }
    }.log;
}

// LOG operations are now generated directly in jump_table.zig using make_log()
```
```zig [src/evm/execution/memory.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Memory = @import("../memory.zig");
const gas_constants = @import("../constants/gas_constants.zig");

// Helper to check if u256 fits in usize
fn check_offset_bounds(value: u256) ExecutionError.Error!void {
    if (value > std.math.maxInt(usize)) return ExecutionError.Error.InvalidOffset;
}

pub fn op_mload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) unreachable;

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(gas_cost);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(offset_usize + 32);

    // Read 32 bytes from memory
    const value = try frame.memory.get_u256(offset_usize);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_mstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 32; // MSTORE writes 32 bytes
    const expansion_gas_cost = gas_constants.memory_gas_cost(current_size, new_size);

    try frame.consume_gas(expansion_gas_cost);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(offset_usize + 32);

    // Write 32 bytes to memory (big-endian)
    var bytes: [32]u8 = undefined;
    // Convert u256 to big-endian bytes
    var temp = value;
    var i: usize = 0;
    while (i < 32) : (i += 1) {
        bytes[31 - i] = @intCast(temp & 0xFF);
        temp = temp >> 8;
    }
    try frame.memory.set_data(offset_usize, &bytes);

    return Operation.ExecutionResult{};
}

pub fn op_mstore8(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // EVM Stack: [..., value, offset] where offset is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const offset = popped.b; // Second popped (was top)

    if (offset > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const offset_usize = @as(usize, @intCast(offset));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = offset_usize + 1;
    const gas_cost = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(gas_cost);

    // Ensure memory is available - expand to word boundary to match gas calculation
    const word_aligned_size = ((new_size + 31) / 32) * 32;
    _ = try frame.memory.ensure_context_capacity(word_aligned_size);

    // Write single byte to memory
    const byte_value = @as(u8, @truncate(value));
    const bytes = [_]u8{byte_value};
    try frame.memory.set_data(offset_usize, &bytes);

    return Operation.ExecutionResult{};
}

pub fn op_msize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) unreachable;

    // MSIZE returns the size in bytes, but memory is always expanded in 32-byte words
    // So we need to round up to the nearest word boundary
    const size = frame.memory.context_size();
    const word_aligned_size = ((size + 31) / 32) * 32;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(word_aligned_size)));

    return Operation.ExecutionResult{};
}

pub fn op_mcopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., dest, src, size] (top to bottom)
    const size = frame.stack.pop_unsafe();
    const src = frame.stack.pop_unsafe();
    const dest = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (dest > std.math.maxInt(usize) or src > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const dest_usize = @as(usize, @intCast(dest));
    const src_usize = @as(usize, @intCast(src));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const max_addr = @max(dest_usize + size_usize, src_usize + size_usize);
    const memory_gas = gas_constants.memory_gas_cost(current_size, max_addr);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available for both source and destination
    _ = try frame.memory.ensure_context_capacity(max_addr);

    // Copy with overlap handling
    // Get memory slice and handle overlapping copy
    const mem_slice = frame.memory.slice();
    if (mem_slice.len >= max_addr) {
        // Handle overlapping memory copy correctly
        if (dest_usize > src_usize and dest_usize < src_usize + size_usize) {
            // Forward overlap: dest is within source range, copy backwards
            std.mem.copyBackwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        } else if (src_usize > dest_usize and src_usize < dest_usize + size_usize) {
            // Backward overlap: src is within dest range, copy forwards  
            std.mem.copyForwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        } else {
            // No overlap, either direction is fine
            std.mem.copyForwards(u8, mem_slice[dest_usize..dest_usize + size_usize], mem_slice[src_usize..src_usize + size_usize]);
        }
    } else {
        return ExecutionError.Error.OutOfOffset;
    }

    return Operation.ExecutionResult{};
}

pub fn op_calldataload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 1) unreachable;

    // Get offset from top of stack unsafely - bounds checking is done in jump_table.zig
    const offset = frame.stack.peek_unsafe().*;

    if (offset > std.math.maxInt(usize)) {
        // Replace top of stack with 0
        frame.stack.set_top_unsafe(0);
        return Operation.ExecutionResult{};
    }

    const offset_usize = @as(usize, @intCast(offset));

    // Read 32 bytes from calldata (pad with zeros)
    var result: u256 = 0;

    for (0..32) |i| {
        if (offset_usize + i < frame.input.len) {
            result = (result << 8) | frame.input[offset_usize + i];
        } else {
            result = result << 8;
        }
    }

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(result);

    return Operation.ExecutionResult{};
}

pub fn op_calldatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) unreachable;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.input.len)));

    return Operation.ExecutionResult{};
}

pub fn op_calldatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy calldata to memory
    try frame.memory.set_data_bounded(mem_offset_usize, frame.input, data_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_codesize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) unreachable;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.contract.code.len)));

    return Operation.ExecutionResult{};
}

pub fn op_codecopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, code_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const code_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or code_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const code_offset_usize = @as(usize, @intCast(code_offset));
    const size_usize = @as(usize, @intCast(size));

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy code to memory
    try frame.memory.set_data_bounded(mem_offset_usize, frame.contract.code, code_offset_usize, size_usize);

    return Operation.ExecutionResult{};
}

pub fn op_returndatasize(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size >= Stack.CAPACITY) unreachable;

    // Push result unsafely - bounds checking is done in jump_table.zig
    frame.stack.append_unsafe(@as(u256, @intCast(frame.return_data_buffer.len)));

    return Operation.ExecutionResult{};
}

pub fn op_returndatacopy(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    if (frame.stack.size < 3) unreachable;

    // Pop three values unsafely - bounds checking is done in jump_table.zig
    // EVM stack order: [..., size, data_offset, mem_offset] (top to bottom)
    const mem_offset = frame.stack.pop_unsafe();
    const data_offset = frame.stack.pop_unsafe();
    const size = frame.stack.pop_unsafe();

    if (size == 0) return Operation.ExecutionResult{};

    if (mem_offset > std.math.maxInt(usize) or data_offset > std.math.maxInt(usize) or size > std.math.maxInt(usize)) return ExecutionError.Error.OutOfOffset;

    const mem_offset_usize = @as(usize, @intCast(mem_offset));
    const data_offset_usize = @as(usize, @intCast(data_offset));
    const size_usize = @as(usize, @intCast(size));

    // Check bounds
    if (data_offset_usize + size_usize > frame.return_data_buffer.len) return ExecutionError.Error.ReturnDataOutOfBounds;

    // Calculate memory expansion gas cost
    const current_size = frame.memory.context_size();
    const new_size = mem_offset_usize + size_usize;
    const memory_gas = gas_constants.memory_gas_cost(current_size, new_size);
    try frame.consume_gas(memory_gas);

    // Dynamic gas for copy operation
    const word_size = (size_usize + 31) / 32;
    try frame.consume_gas(gas_constants.CopyGas * word_size);

    // Ensure memory is available
    _ = try frame.memory.ensure_context_capacity(mem_offset_usize + size_usize);

    // Copy return data to memory
    try frame.memory.set_data(mem_offset_usize, frame.return_data_buffer[data_offset_usize .. data_offset_usize + size_usize]);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/storage.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const gas_constants = @import("../constants/gas_constants.zig");
const Address = @import("Address");
const Log = @import("../log.zig");

// EIP-3529 (London) gas costs for SSTORE
const SSTORE_SET_GAS: u64 = 20000;
const SSTORE_RESET_GAS: u64 = 2900;
const SSTORE_CLEARS_REFUND: u64 = 4800;

fn calculate_sstore_gas(current: u256, new: u256) u64 {
    if (current == new) return 0;
    if (current == 0) return SSTORE_SET_GAS;
    if (new == 0) return SSTORE_RESET_GAS;
    return SSTORE_RESET_GAS;
}

pub fn op_sload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.stack.size < 1) unreachable;

    const slot = frame.stack.peek_unsafe().*;

    if (vm.chain_rules.IsBerlin) {
        const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch {
            return ExecutionError.Error.OutOfMemory;
        };
        const gas_cost = if (is_cold) gas_constants.ColdSloadCost else gas_constants.WarmStorageReadCost;
        try frame.consume_gas(gas_cost);
    } else {
        // Pre-Berlin: gas is handled by jump table constant_gas
        // For Istanbul, this would be 800 gas set in the jump table
    }

    const value = vm.state.get_storage(frame.contract.address, slot);

    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

/// SSTORE opcode - Store value in persistent storage
pub fn op_sstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // EIP-1706: Disable SSTORE with gasleft lower than call stipend (2300)
    // This prevents reentrancy attacks by ensuring enough gas remains for exception handling
    if (vm.chain_rules.IsIstanbul and frame.gas_remaining <= gas_constants.SstoreSentryGas) return ExecutionError.Error.OutOfGas;

    if (frame.stack.size < 2) unreachable;

    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    const current_value = vm.state.get_storage(frame.contract.address, slot);

    const is_cold = frame.contract.mark_storage_slot_warm(frame.allocator, slot, null) catch |err| {
        Log.err("SSTORE: mark_storage_slot_warm failed: {}", .{err});
        return ExecutionError.Error.OutOfMemory;
    };

    var total_gas: u64 = 0;

    if (is_cold) {
        total_gas += gas_constants.ColdSloadCost;
    }

    // Add dynamic gas based on value change
    const dynamic_gas = calculate_sstore_gas(current_value, value);
    total_gas += dynamic_gas;

    // Consume all gas at once
    try frame.consume_gas(total_gas);

    try vm.state.set_storage(frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}

pub fn op_tload(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 1) unreachable;

    // Get slot from top of stack unsafely - bounds checking is done in jump_table.zig
    const slot = frame.stack.peek_unsafe().*;

    const value = vm.state.get_transient_storage(frame.contract.address, slot);

    // Replace top of stack with loaded value unsafely - bounds checking is done in jump_table.zig
    frame.stack.set_top_unsafe(value);

    return Operation.ExecutionResult{};
}

pub fn op_tstore(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    if (frame.is_static) return ExecutionError.Error.WriteProtection;

    // Gas is already handled by jump table constant_gas = 100

    if (frame.stack.size < 2) unreachable;

    // Pop two values unsafely using batch operation - bounds checking is done in jump_table.zig
    // Stack order: [..., value, slot] where slot is on top
    const popped = frame.stack.pop2_unsafe();
    const value = popped.a; // First popped (was second from top)
    const slot = popped.b; // Second popped (was top)

    try vm.state.set_transient_storage(frame.contract.address, slot, value);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/execution/stack.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");

pub fn op_pop(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    _ = try frame.stack.pop();

    return Operation.ExecutionResult{};
}

pub fn op_push0(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;
    _ = interpreter;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));

    try frame.stack.append( 0);

    return Operation.ExecutionResult{};
}

// Generate push operations for PUSH1 through PUSH32
pub fn make_push(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn push(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size >= Stack.CAPACITY) unreachable;

            var value: u256 = 0;
            const code = frame.contract.code;

            for (0..n) |i| {
                if (pc + 1 + i < code.len) {
                    value = (value << 8) | code[pc + 1 + i];
                } else {
                    value = value << 8;
                }
            }

            frame.stack.append_unsafe(value);

            // PUSH operations consume 1 + n bytes
            // (1 for the opcode itself, n for the immediate data)
            return Operation.ExecutionResult{ .bytes_consumed = 1 + n };
        }
    }.push;
}

// PUSH operations are now generated directly in jump_table.zig using make_push()

// Generate dup operations
pub fn make_dup(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn dup(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size < n) unreachable;
            if (frame.stack.size >= Stack.CAPACITY) unreachable;

            frame.stack.dup_unsafe(n);

            return Operation.ExecutionResult{};
        }
    }.dup;
}

// DUP operations are now generated directly in jump_table.zig using make_dup()

// Generate swap operations
pub fn make_swap(comptime n: u8) fn (usize, *Operation.Interpreter, *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    return struct {
        pub fn swap(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
            _ = pc;
            _ = interpreter;

            const frame = @as(*Frame, @ptrCast(@alignCast(state)));

            if (frame.stack.size < n + 1) unreachable;

            frame.stack.swapUnsafe(n);

            return Operation.ExecutionResult{};
        }
    }.swap;
}

// SWAP operations are now generated directly in jump_table.zig using make_swap()
```
```zig [src/evm/execution/block.zig]
const std = @import("std");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Frame = @import("../frame.zig");
const Vm = @import("../vm.zig");
const Address = @import("Address");

pub fn op_blockhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const block_number = try frame.stack.pop();

    const current_block = vm.context.block_number;

    if (block_number >= current_block) {
        try frame.stack.append( 0);
    } else if (current_block > block_number + 256) {
        try frame.stack.append( 0);
    } else if (block_number == 0) {
        try frame.stack.append( 0);
    } else {
        // Return a pseudo-hash based on block number for testing
        // In production, this would retrieve the actual block hash from chain history
        const hash = std.hash.Wyhash.hash(0, std.mem.asBytes(&block_number));
        try frame.stack.append( hash);
    }

    return Operation.ExecutionResult{};
}

pub fn op_coinbase(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append( Address.to_u256(vm.context.block_coinbase));

    return Operation.ExecutionResult{};
}

pub fn op_timestamp(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append( @as(u256, @intCast(vm.context.block_timestamp)));

    return Operation.ExecutionResult{};
}

pub fn op_number(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append( @as(u256, @intCast(vm.context.block_number)));

    return Operation.ExecutionResult{};
}

pub fn op_difficulty(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get difficulty/prevrandao from block context
    // Post-merge this returns PREVRANDAO
    try frame.stack.append( vm.context.block_difficulty);

    return Operation.ExecutionResult{};
}

pub fn op_prevrandao(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    // Same as difficulty post-merge
    return op_difficulty(pc, interpreter, state);
}

pub fn op_gaslimit(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    try frame.stack.append( @as(u256, @intCast(vm.context.block_gas_limit)));

    return Operation.ExecutionResult{};
}

pub fn op_basefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get base fee from block context
    // Push base fee (EIP-1559)
    try frame.stack.append( vm.context.block_base_fee);

    return Operation.ExecutionResult{};
}

pub fn op_blobhash(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    const index = try frame.stack.pop();

    // EIP-4844: Get blob hash at index
    if (index >= vm.context.blob_hashes.len) {
        try frame.stack.append( 0);
    } else {
        const idx = @as(usize, @intCast(index));
        try frame.stack.append( vm.context.blob_hashes[idx]);
    }

    return Operation.ExecutionResult{};
}

pub fn op_blobbasefee(pc: usize, interpreter: *Operation.Interpreter, state: *Operation.State) ExecutionError.Error!Operation.ExecutionResult {
    _ = pc;

    const frame = @as(*Frame, @ptrCast(@alignCast(state)));
    const vm = @as(*Vm, @ptrCast(@alignCast(interpreter)));

    // Get blob base fee from block context
    // Push blob base fee (EIP-4844)
    try frame.stack.append( vm.context.blob_base_fee);

    return Operation.ExecutionResult{};
}
```
```zig [src/evm/log.zig]
const std = @import("std");

/// Professional isomorphic logger for the EVM that works across all target architectures
/// including native platforms, WASI, and WASM environments. Uses the std_options.logFn
/// system for automatic platform adaptation.
///
/// Provides debug, error, and warning logging with EVM-specific prefixing.
/// Debug logs are optimized away in release builds for performance.

/// Debug log for development and troubleshooting
/// Optimized away in release builds for performance
pub fn debug(comptime format: []const u8, args: anytype) void {
    std.log.debug("[EVM] " ++ format, args);
}

/// Error log for critical issues that require attention
pub fn err(comptime format: []const u8, args: anytype) void {
    std.log.err("[EVM] " ++ format, args);
}

/// Warning log for non-critical issues and unexpected conditions
pub fn warn(comptime format: []const u8, args: anytype) void {
    std.log.warn("[EVM] " ++ format, args);
}

/// Info log for general information (use sparingly for performance)
pub fn info(comptime format: []const u8, args: anytype) void {
    std.log.info("[EVM] " ++ format, args);
}
```
```zig [src/evm/hardforks/chain_rules.zig]
const std = @import("std");
const Hardfork = @import("hardfork.zig").Hardfork;
const Log = @import("../log.zig");

/// Configuration for Ethereum protocol rules and EIP activations across hardforks.
///
/// This structure defines which Ethereum Improvement Proposals (EIPs) and protocol
/// rules are active during EVM execution. It serves as the central configuration
/// point for hardfork-specific behavior, enabling the EVM to correctly execute
/// transactions according to the rules of any supported Ethereum hardfork.
///
/// ## Purpose
/// The Ethereum protocol evolves through hardforks that introduce new features,
/// change gas costs, add opcodes, or modify execution semantics. This structure
/// encapsulates all these changes, allowing the EVM to maintain compatibility
/// with any point in Ethereum's history.
///
/// ## Default Configuration
/// By default, all fields are set to support the latest stable hardfork (Cancun),
/// ensuring new deployments get the most recent protocol features. Use the
/// `for_hardfork()` method to configure for specific historical hardforks.
///
/// ## Usage Pattern
/// ```zig
/// // Create rules for a specific hardfork
/// const rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Check if specific features are enabled
/// if (rules.IsEIP1559) {
///     // Use EIP-1559 fee market logic
/// }
/// ```
///
/// ## Hardfork Progression
/// The Ethereum mainnet hardfork progression:
/// 1. Frontier (July 2015) - Initial release
/// 2. Homestead (March 2016) - First major improvements
/// 3. DAO Fork (July 2016) - Emergency fork after DAO hack
/// 4. Tangerine Whistle (October 2016) - Gas repricing (EIP-150)
/// 5. Spurious Dragon (November 2016) - State cleaning (EIP-158)
/// 6. Byzantium (October 2017) - Major protocol upgrade
/// 7. Constantinople (February 2019) - Efficiency improvements
/// 8. Petersburg (February 2019) - Constantinople fix
/// 9. Istanbul (December 2019) - Gas cost adjustments
/// 10. Muir Glacier (January 2020) - Difficulty bomb delay
/// 11. Berlin (April 2021) - Gas improvements (EIP-2929)
/// 12. London (August 2021) - EIP-1559 fee market
/// 13. Arrow Glacier (December 2021) - Difficulty bomb delay
/// 14. Gray Glacier (June 2022) - Difficulty bomb delay
/// 15. The Merge (September 2022) - Proof of Stake transition
/// 16. Shanghai (April 2023) - Withdrawals enabled
/// 17. Cancun (March 2024) - Proto-danksharding
///
/// ## Memory Layout
/// This structure uses bool fields for efficient memory usage and fast access.
/// The compiler typically packs multiple bools together for cache efficiency.
const Self = @This();

/// Homestead hardfork activation flag (March 2016).
///
/// ## Key Changes
/// - Fixed critical issues from Frontier release
/// - Introduced DELEGATECALL opcode (0xF4) for library pattern
/// - Changed difficulty adjustment algorithm
/// - Removed canary contracts
/// - Fixed gas cost inconsistencies
///
/// ## EVM Impact
/// - New opcode: DELEGATECALL for code reuse with caller's context
/// - Modified CREATE behavior for out-of-gas scenarios
/// - Changed gas costs for CALL operations
IsHomestead: bool = true,

/// EIP-150 "Tangerine Whistle" hardfork activation (October 2016).
///
/// ## Purpose
/// Addressed denial-of-service attack vectors by repricing operations
/// that were underpriced relative to their computational complexity.
///
/// ## Key Changes
/// - Increased gas costs for EXTCODESIZE, EXTCODECOPY, BALANCE, CALL, CALLCODE, DELEGATECALL
/// - Increased gas costs for SLOAD from 50 to 200
/// - 63/64 rule for CALL operations gas forwarding
/// - Max call depth reduced from 1024 to 1024 (stack-based)
///
/// ## Security Impact
/// Mitigated "Shanghai attacks" that exploited underpriced opcodes
/// to create transactions consuming excessive resources.
IsEIP150: bool = true,

/// EIP-158 "Spurious Dragon" hardfork activation (November 2016).
///
/// ## Purpose
/// State size reduction through removal of empty accounts,
/// complementing EIP-150's gas repricing.
///
/// ## Key Changes  
/// - Empty account deletion (nonce=0, balance=0, code empty)
/// - Changed SELFDESTRUCT refund behavior
/// - Introduced EXP cost increase for large exponents
/// - Replay attack protection via chain ID
///
/// ## State Impact
/// Significantly reduced state size by removing ~20 million empty
/// accounts created by previous attacks.
IsEIP158: bool = true,

/// EIP-1559 fee market mechanism activation (London hardfork).
///
/// ## Purpose
/// Revolutionary change to Ethereum's fee mechanism introducing
/// base fee burning and priority fees (tips).
///
/// ## Key Changes
/// - Dynamic base fee adjusted per block based on utilization
/// - Base fee burned, reducing ETH supply
/// - Priority fee (tip) goes to miners/validators
/// - New transaction type (Type 2) with maxFeePerGas and maxPriorityFeePerGas
/// - BASEFEE opcode (0x48) to access current base fee
///
/// ## Economic Impact
/// - More predictable gas prices
/// - ETH becomes deflationary under high usage
/// - Better UX with fee estimation
IsEIP1559: bool = true,

/// Constantinople hardfork activation (February 2019).
///
/// ## Purpose
/// Optimization-focused upgrade adding cheaper operations and
/// preparing for future scaling solutions.
///
/// ## Key Changes
/// - New opcodes: SHL (0x1B), SHR (0x1C), SAR (0x1D) for bitwise shifting
/// - New opcode: EXTCODEHASH (0x3F) for cheaper code hash access
/// - CREATE2 (0xF5) for deterministic contract addresses
/// - Reduced gas costs for SSTORE operations (EIP-1283)
/// - Delayed difficulty bomb by 12 months
///
/// ## Developer Impact
/// - Bitwise operations enable more efficient algorithms
/// - CREATE2 enables counterfactual instantiation patterns
/// - Cheaper storage operations for certain patterns
IsConstantinople: bool = true,

/// Petersburg hardfork activation (February 2019).
///
/// ## Purpose
/// Emergency fix to Constantinople, disabling EIP-1283 due to
/// reentrancy concerns discovered before mainnet deployment.
///
/// ## Key Changes
/// - Removed EIP-1283 (SSTORE gas metering) from Constantinople
/// - Kept all other Constantinople features
/// - Essentially Constantinople minus problematic EIP
///
/// ## Historical Note
/// Constantinople was deployed on testnet but postponed on mainnet
/// when security researchers found the reentrancy issue. Petersburg
/// represents the actually deployed version.
IsPetersburg: bool = true,

/// Istanbul hardfork activation (December 2019).
///
/// ## Purpose
/// Gas cost adjustments based on real-world usage data and addition
/// of new opcodes for layer 2 support.
///
/// ## Key Changes
/// - EIP-152: Blake2b precompile for interoperability
/// - EIP-1108: Reduced alt_bn128 precompile gas costs
/// - EIP-1344: CHAINID opcode (0x46) for replay protection  
/// - EIP-1884: Repricing for trie-size dependent opcodes
/// - EIP-2028: Reduced calldata gas cost (16 gas per non-zero byte)
/// - EIP-2200: Rebalanced SSTORE gas cost with stipend
///
/// ## Opcodes Added
/// - CHAINID (0x46): Returns the current chain ID
/// - SELFBALANCE (0x47): Get balance without expensive BALANCE call
///
/// ## Performance Impact
/// Significant reduction in costs for L2 solutions using calldata.
IsIstanbul: bool = true,

/// Berlin hardfork activation (April 2021).
///
/// ## Purpose
/// Major gas model reform introducing access lists and fixing
/// long-standing issues with state access pricing.
///
/// ## Key Changes
/// - EIP-2565: Reduced ModExp precompile gas cost
/// - EIP-2718: Typed transaction envelope framework
/// - EIP-2929: Gas cost increase for state access opcodes
/// - EIP-2930: Optional access lists (Type 1 transactions)
///
/// ## Access List Impact
/// - First-time SLOAD: 2100 gas (cold) vs 100 gas (warm)
/// - First-time account access: 2600 gas (cold) vs 100 gas (warm)
/// - Transactions can pre-declare accessed state for gas savings
///
/// ## Developer Considerations
/// Access lists allow contracts to optimize gas usage by pre-warming
/// storage slots and addresses they'll interact with.
IsBerlin: bool = true,

/// London hardfork activation (August 2021).
///
/// ## Purpose  
/// Most significant economic change to Ethereum, introducing base fee
/// burning and dramatically improving fee predictability.
///
/// ## Key Changes
/// - EIP-1559: Fee market reform with base fee burning
/// - EIP-3198: BASEFEE opcode (0x48) to read current base fee
/// - EIP-3529: Reduction in refunds (SELFDESTRUCT, SSTORE)
/// - EIP-3541: Reject contracts starting with 0xEF byte
/// - EIP-3554: Difficulty bomb delay
///
/// ## EIP-3541 Impact
/// Reserves 0xEF prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Economic Changes
/// - Base fee burned makes ETH potentially deflationary
/// - Gas price volatility significantly reduced
/// - Better fee estimation and user experience
IsLondon: bool = true,

/// The Merge activation (September 2022).
///
/// ## Purpose
/// Historic transition from Proof of Work to Proof of Stake,
/// reducing energy consumption by ~99.95%.
///
/// ## Key Changes
/// - EIP-3675: Consensus layer transition
/// - EIP-4399: DIFFICULTY (0x44) renamed to PREVRANDAO
/// - Removed block mining rewards
/// - Block time fixed at ~12 seconds
///
/// ## PREVRANDAO Usage
/// The DIFFICULTY opcode now returns the previous block's RANDAO
/// value, providing a source of randomness from the beacon chain.
/// Not suitable for high-security randomness needs.
///
/// ## Network Impact
/// - No more uncle blocks
/// - Predictable block times
/// - Validators replace miners
IsMerge: bool = true,

/// Shanghai hardfork activation (April 2023).
///
/// ## Purpose
/// First major upgrade post-Merge, enabling validator withdrawals
/// and introducing efficiency improvements.
///
/// ## Key Changes
/// - EIP-3651: Warm COINBASE address (reduced gas for MEV)
/// - EIP-3855: PUSH0 opcode (0x5F) for gas efficiency
/// - EIP-3860: Limit and meter initcode size
/// - EIP-4895: Beacon chain withdrawals
///
/// ## PUSH0 Impact
/// New opcode that pushes zero onto stack for 2 gas,
/// replacing common pattern of `PUSH1 0` (3 gas).
///
/// ## Withdrawal Mechanism
/// Validators can finally withdraw staked ETH, completing
/// the Proof of Stake transition.
IsShanghai: bool = true,

/// Cancun hardfork activation (March 2024).
///
/// ## Purpose
/// Major scalability upgrade introducing blob transactions for L2s
/// and transient storage for advanced contract patterns.
///
/// ## Key Changes
/// - EIP-1153: Transient storage opcodes (TLOAD 0x5C, TSTORE 0x5D)
/// - EIP-4844: Proto-danksharding with blob transactions
/// - EIP-4788: Beacon block root in EVM
/// - EIP-5656: MCOPY opcode (0x5E) for memory copying
/// - EIP-6780: SELFDESTRUCT only in same transaction
/// - EIP-7516: BLOBBASEFEE opcode (0x4A)
///
/// ## Blob Transactions
/// New transaction type carrying data blobs (4096 field elements)
/// for L2 data availability at ~10x lower cost.
///
/// ## Transient Storage
/// Storage that persists only within a transaction, enabling
/// reentrancy locks and other patterns without permanent storage.
IsCancun: bool = true,

/// Prague hardfork activation flag (future upgrade).
///
/// ## Status
/// Not yet scheduled or fully specified. Expected to include:
/// - EOF (EVM Object Format) implementation
/// - Account abstraction improvements
/// - Further gas optimizations
///
/// ## Note
/// This flag is reserved for future use and should remain
/// false until Prague specifications are finalized.
IsPrague: bool = false,

/// Verkle trees activation flag (future upgrade).
///
/// ## Purpose
/// Fundamental change to Ethereum's state storage using Verkle trees
/// instead of Merkle Patricia tries for massive witness size reduction.
///
/// ## Expected Benefits
/// - Witness sizes reduced from ~10MB to ~200KB
/// - Enables stateless clients
/// - Improved sync times and network efficiency
///
/// ## Status
/// Under active research and development. Will require extensive
/// testing before mainnet deployment.
IsVerkle: bool = false,

/// Byzantium hardfork activation (October 2017).
///
/// ## Purpose
/// Major protocol upgrade adding privacy features and improving
/// smart contract capabilities.
///
/// ## Key Changes
/// - New opcodes: REVERT (0xFD), RETURNDATASIZE (0x3D), RETURNDATACOPY (0x3E)
/// - New opcode: STATICCALL (0xFA) for read-only calls
/// - Added precompiles for zkSNARK verification (alt_bn128)
/// - Difficulty bomb delay by 18 months
/// - Block reward reduced from 5 to 3 ETH
///
/// ## REVERT Impact
/// Allows contracts to revert with data, enabling better error
/// messages while still refunding remaining gas.
///
/// ## Privacy Features
/// zkSNARK precompiles enable privacy-preserving applications
/// like private transactions and scalability solutions.
IsByzantium: bool = true,

/// EIP-2930 optional access lists activation (Berlin hardfork).
///
/// ## Purpose
/// Introduces Type 1 transactions with optional access lists,
/// allowing senders to pre-declare state they'll access.
///
/// ## Benefits
/// - Mitigates breaking changes from EIP-2929 gas increases
/// - Allows gas savings by pre-warming storage slots
/// - Provides predictable gas costs for complex interactions
///
/// ## Transaction Format
/// Type 1 transactions include an access list of:
/// - Addresses to be accessed
/// - Storage keys per address to be accessed
///
/// ## Gas Savings
/// Pre-declaring access saves ~2000 gas per address and
/// ~2000 gas per storage slot on first access.
IsEIP2930: bool = true,

/// EIP-3198 BASEFEE opcode activation (London hardfork).
///
/// ## Purpose
/// Provides smart contracts access to the current block's base fee,
/// enabling on-chain fee market awareness.
///
/// ## Opcode Details
/// - BASEFEE (0x48): Pushes current block's base fee onto stack
/// - Gas cost: 2 (same as other block context opcodes)
///
/// ## Use Cases
/// - Fee estimation within contracts
/// - Conditional execution based on network congestion
/// - MEV-aware contract patterns
/// - Gas price oracles
///
/// ## Complementary to EIP-1559
/// Essential for contracts to interact properly with the
/// new fee market mechanism.
IsEIP3198: bool = true,

/// EIP-3651 warm COINBASE activation (Shanghai hardfork).
///
/// ## Purpose
/// Pre-warms the COINBASE address (block producer) to reduce gas costs
/// for common patterns, especially in MEV transactions.
///
/// ## Gas Impact
/// - Before: First COINBASE access costs 2600 gas (cold)
/// - After: COINBASE always costs 100 gas (warm)
///
/// ## MEV Considerations
/// Critical for MEV searchers and builders who frequently
/// interact with the block producer address for payments.
///
/// ## Implementation
/// The COINBASE address is added to the warm address set
/// at the beginning of transaction execution.
IsEIP3651: bool = true,

/// EIP-3855 PUSH0 instruction activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces dedicated opcode for pushing zero onto the stack,
/// optimizing a very common pattern in smart contracts.
///
/// ## Opcode Details
/// - PUSH0 (0x5F): Pushes 0 onto the stack
/// - Gas cost: 2 (base opcode cost)
/// - Replaces: PUSH1 0x00 (costs 3 gas)
///
/// ## Benefits
/// - 33% gas reduction for pushing zero
/// - Smaller bytecode (1 byte vs 2 bytes)
/// - Cleaner assembly code
///
/// ## Usage Statistics
/// Analysis showed ~11% of all PUSH operations push zero,
/// making this a significant optimization.
IsEIP3855: bool = true,

/// EIP-3860 initcode size limit activation (Shanghai hardfork).
///
/// ## Purpose
/// Introduces explicit limits and gas metering for contract creation
/// code to prevent DoS vectors and ensure predictable costs.
///
/// ## Key Limits
/// - Maximum initcode size: 49152 bytes (2x max contract size)
/// - Gas cost: 2 gas per 32-byte word of initcode
///
/// ## Affected Operations
/// - CREATE: Limited initcode size
/// - CREATE2: Limited initcode size
/// - Contract creation transactions
///
/// ## Security Rationale
/// Previously unlimited initcode could cause nodes to consume
/// excessive resources during contract deployment verification.
IsEIP3860: bool = true,

/// EIP-4895 beacon chain withdrawals activation (Shanghai hardfork).
///
/// ## Purpose
/// Enables validators to withdraw staked ETH from the beacon chain
/// to the execution layer, completing the PoS transition.
///
/// ## Mechanism
/// - Withdrawals are processed as system-level operations
/// - Not regular transactions - no gas cost or signature
/// - Automatically credited to withdrawal addresses
/// - Up to 16 withdrawals per block
///
/// ## Validator Operations
/// - Partial withdrawals: Excess balance above 32 ETH
/// - Full withdrawals: Complete exit from validation
///
/// ## Network Impact
/// Completes the Ethereum staking lifecycle, allowing validators
/// to access their staked funds and rewards.
IsEIP4895: bool = true,

/// EIP-4844 proto-danksharding activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces blob-carrying transactions for scalable data availability,
/// reducing L2 costs by ~10-100x through temporary data storage.
///
/// ## Blob Details
/// - Size: 4096 field elements (~125 KB)
/// - Max per block: 6 blobs (~750 KB)
/// - Retention: ~18 days (4096 epochs)
/// - Separate fee market with blob base fee
///
/// ## New Components
/// - Type 3 transactions with blob commitments
/// - KZG commitments for data availability proofs
/// - Blob fee market independent of execution gas
/// - BLOBHASH opcode (0x49) to access blob commitments
///
/// ## L2 Impact
/// Dramatically reduces costs for rollups by providing
/// dedicated data availability layer.
IsEIP4844: bool = true,

/// EIP-1153 transient storage activation (Cancun hardfork).
///
/// ## Purpose
/// Introduces transaction-scoped storage that automatically clears
/// after execution, enabling efficient temporary data patterns.
///
/// ## New Opcodes
/// - TLOAD (0x5C): Load from transient storage
/// - TSTORE (0x5D): Store to transient storage
/// - Gas costs: 100 for TLOAD, 100 for TSTORE
///
/// ## Key Properties
/// - Cleared after each transaction (not persisted)
/// - Reverted on transaction failure
/// - Separate namespace from persistent storage
/// - More gas efficient than SSTORE/SLOAD for temporary data
///
/// ## Use Cases
/// - Reentrancy guards without storage slots
/// - Temporary computation results
/// - Cross-contract communication within transaction
IsEIP1153: bool = true,

/// EIP-5656 MCOPY instruction activation (Cancun hardfork).
///
/// ## Purpose
/// Native memory copying instruction replacing inefficient
/// loop-based implementations in smart contracts.
///
/// ## Opcode Details
/// - MCOPY (0x5E): Copy memory regions
/// - Stack: [dest_offset, src_offset, length]
/// - Gas: 3 + 3 * ceil(length / 32) + memory expansion
///
/// ## Performance Impact
/// - ~10x faster than Solidity's loop-based copying
/// - Reduces bytecode size for memory operations
/// - Critical for data-heavy operations
///
/// ## Common Patterns
/// Optimizes array copying, string manipulation, and
/// data structure operations in smart contracts.
IsEIP5656: bool = true,

/// EIP-3541 contract code prefix restriction (London hardfork).
///
/// ## Purpose
/// Reserves the 0xEF byte prefix for future EVM Object Format (EOF),
/// preventing deployment of contracts with this prefix.
///
/// ## Restrictions
/// - New contracts cannot start with 0xEF byte
/// - Applies to CREATE, CREATE2, and deployment transactions
/// - Existing contracts with 0xEF prefix remain valid
///
/// ## EOF Preparation
/// This reservation enables future introduction of:
/// - Structured contract format with metadata
/// - Separate code and data sections
/// - Static jumps and improved analysis
/// - Versioning for EVM upgrades
///
/// ## Developer Impact
/// Extremely rare in practice as 0xEF was not a valid opcode,
/// making accidental conflicts unlikely.
IsEIP3541: bool = true,

/// Creates a ChainRules configuration for a specific Ethereum hardfork.
///
/// This factory function generates the appropriate set of protocol rules
/// for any supported hardfork, enabling the EVM to execute transactions
/// according to historical consensus rules.
///
/// ## Parameters
/// - `hardfork`: The target hardfork to configure rules for
///
/// ## Returns
/// A fully configured ChainRules instance with all flags set appropriately
/// for the specified hardfork.
///
/// ## Algorithm
/// The function starts with all features enabled (latest hardfork) and then
/// selectively disables features that weren't available at the specified
/// hardfork. This approach ensures new features are automatically included
/// in the latest configuration.
///
/// ## Example
/// ```zig
/// // Configure EVM for London hardfork rules
/// const london_rules = ChainRules.for_hardfork(.LONDON);
/// 
/// // Configure EVM for historical execution (e.g., replaying old blocks)
/// const byzantium_rules = ChainRules.for_hardfork(.BYZANTIUM);
/// ```
///
/// ## Hardfork Ordering
/// Each hardfork case disables all features introduced after it,
/// maintaining historical accuracy for transaction replay and testing.
/// Mapping of chain rule fields to the hardfork in which they were introduced.
const HardforkRule = struct {
    field_name: []const u8,
    introduced_in: Hardfork,
};

/// Comptime-generated mapping of all chain rules to their introduction hardforks.
/// This data-driven approach replaces the massive switch statement.
/// Default chain rules for the latest hardfork (CANCUN).
/// Pre-generated at compile time for zero runtime overhead.
pub const DEFAULT = for_hardfork(.DEFAULT);

const HARDFORK_RULES = [_]HardforkRule{
    .{ .field_name = "IsHomestead", .introduced_in = .HOMESTEAD },
    .{ .field_name = "IsEIP150", .introduced_in = .TANGERINE_WHISTLE },
    .{ .field_name = "IsEIP158", .introduced_in = .SPURIOUS_DRAGON },
    .{ .field_name = "IsByzantium", .introduced_in = .BYZANTIUM },
    .{ .field_name = "IsConstantinople", .introduced_in = .CONSTANTINOPLE },
    .{ .field_name = "IsPetersburg", .introduced_in = .PETERSBURG },
    .{ .field_name = "IsIstanbul", .introduced_in = .ISTANBUL },
    .{ .field_name = "IsBerlin", .introduced_in = .BERLIN },
    .{ .field_name = "IsLondon", .introduced_in = .LONDON },
    .{ .field_name = "IsMerge", .introduced_in = .MERGE },
    .{ .field_name = "IsShanghai", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsCancun", .introduced_in = .CANCUN },
    // EIPs grouped by their hardfork
    .{ .field_name = "IsEIP1559", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP2930", .introduced_in = .BERLIN },
    .{ .field_name = "IsEIP3198", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3541", .introduced_in = .LONDON },
    .{ .field_name = "IsEIP3651", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3855", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP3860", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4895", .introduced_in = .SHANGHAI },
    .{ .field_name = "IsEIP4844", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP1153", .introduced_in = .CANCUN },
    .{ .field_name = "IsEIP5656", .introduced_in = .CANCUN },
};

pub fn for_hardfork(hardfork: Hardfork) Self {
    var rules = Self{}; // All fields default to true
    
    // Disable features that were introduced after the target hardfork
    inline for (HARDFORK_RULES) |rule| {
        if (@intFromEnum(hardfork) < @intFromEnum(rule.introduced_in)) {
            @field(rules, rule.field_name) = false;
        }
    }
    
    return rules;
}
```
```zig [src/evm/hardforks/hardfork.zig]
/// Ethereum hardfork identifiers.
///
/// Hardforks represent protocol upgrades that change EVM behavior,
/// gas costs, or add new features. Each hardfork builds upon the
/// previous ones, maintaining backward compatibility while adding
/// improvements.
///
/// ## Hardfork History
/// The EVM has evolved through multiple hardforks, each addressing
/// specific issues or adding new capabilities:
/// - Early forks focused on security and gas pricing
/// - Later forks added new opcodes and features
/// - Recent forks optimize performance and add L2 support
///
/// ## Using Hardforks
/// Hardforks are primarily used to:
/// - Configure jump tables with correct opcodes
/// - Set appropriate gas costs for operations
/// - Enable/disable features based on fork rules
///
/// Example:
/// ```zig
/// const table = JumpTable.init_from_hardfork(.CANCUN);
/// const is_berlin_plus = @intFromEnum(hardfork) >= @intFromEnum(Hardfork.BERLIN);
/// ```
pub const Hardfork = enum {
    /// Original Ethereum launch (July 2015).
    /// Base EVM with fundamental opcodes.
    FRONTIER,
    
    /// First planned hardfork (March 2016).
    /// Added DELEGATECALL and fixed critical issues.
    HOMESTEAD,
    
    /// Emergency fork for DAO hack (July 2016).
    /// No EVM changes, only state modifications.
    DAO,
    
    /// Gas repricing fork (October 2016).
    /// EIP-150: Increased gas costs for IO-heavy operations.
    TANGERINE_WHISTLE,
    
    /// State cleaning fork (November 2016).
    /// EIP-161: Removed empty accounts.
    SPURIOUS_DRAGON,
    
    /// Major feature fork (October 2017).
    /// Added REVERT, RETURNDATASIZE, RETURNDATACOPY, STATICCALL.
    BYZANTIUM,
    
    /// Efficiency improvements (February 2019).
    /// Added CREATE2, shift opcodes, EXTCODEHASH.
    CONSTANTINOPLE,
    
    /// Quick fix fork (February 2019).
    /// Removed EIP-1283 due to reentrancy concerns.
    PETERSBURG,
    
    /// Gas optimization fork (December 2019).
    /// EIP-2200: Rebalanced SSTORE costs.
    /// Added CHAINID and SELFBALANCE.
    ISTANBUL,
    
    /// Difficulty bomb delay (January 2020).
    /// No EVM changes.
    MUIR_GLACIER,
    
    /// Access list fork (April 2021).
    /// EIP-2929: Gas cost for cold/warm access.
    /// EIP-2930: Optional access lists.
    BERLIN,
    
    /// Fee market reform (August 2021).
    /// EIP-1559: Base fee and new transaction types.
    /// Added BASEFEE opcode.
    LONDON,
    
    /// Difficulty bomb delay (December 2021).
    /// No EVM changes.
    ARROW_GLACIER,
    
    /// Difficulty bomb delay (June 2022).
    /// No EVM changes.
    GRAY_GLACIER,
    
    /// Proof of Stake transition (September 2022).
    /// Replaced DIFFICULTY with PREVRANDAO.
    MERGE,
    
    /// Withdrawal enabling fork (April 2023).
    /// EIP-3855: PUSH0 opcode.
    SHANGHAI,
    
    /// Proto-danksharding fork (March 2024).
    /// EIP-4844: Blob transactions.
    /// EIP-1153: Transient storage (TLOAD/TSTORE).
    /// EIP-5656: MCOPY opcode.
    CANCUN,

    /// Default hardfork for new chains.
    /// Set to latest stable fork (currently CANCUN).
    pub const DEFAULT = Hardfork.CANCUN;
};
```
```zig [src/evm/memory.zig]
const std = @import("std");
const Log = @import("log.zig");

/// Memory implementation for EVM execution contexts.
const Self = @This();

pub const MemoryError = error{
    OutOfMemory,
    InvalidOffset,
    InvalidSize,
    MemoryLimitExceeded,
};

/// Calculate number of 32-byte words needed for byte length (rounds up)
pub fn calculate_num_words(len: usize) usize {
    return (len + 31) / 32;
}

shared_buffer: std.ArrayList(u8),
allocator: std.mem.Allocator,
my_checkpoint: usize,
memory_limit: u64,
root_ptr: *Self,

pub const InitialCapacity: usize = 4 * 1024;
pub const DefaultMemoryLimit: u64 = 32 * 1024 * 1024; // 32 MB

/// Initializes the root Memory context. This instance owns the shared_buffer.
/// The caller must ensure the returned Memory is stored at a stable address
/// and call finalize_root() before use.
pub fn init(
    allocator: std.mem.Allocator,
    initial_capacity: usize,
    memory_limit: u64,
) !Self {
    Log.debug("Memory.init: Initializing memory, initial_capacity={}, memory_limit={}", .{ initial_capacity, memory_limit });
    var shared_buffer = std.ArrayList(u8).init(allocator);
    errdefer shared_buffer.deinit();
    try shared_buffer.ensureTotalCapacity(initial_capacity);

    Log.debug("Memory.init: Memory initialized successfully", .{});
    return Self{
        .shared_buffer = shared_buffer,
        .allocator = allocator,
        .my_checkpoint = 0,
        .memory_limit = memory_limit,
        .root_ptr = undefined,
    };
}

/// Finalizes the root Memory by setting root_ptr to itself.
/// Must be called after init() and the Memory is stored at its final address.
pub fn finalize_root(self: *Self) void {
    Log.debug("Memory.finalize_root: Finalizing root memory pointer", .{});
    self.root_ptr = self;
}

pub fn init_default(allocator: std.mem.Allocator) !Self {
    return try init(allocator, InitialCapacity, DefaultMemoryLimit);
}

/// Deinitializes the shared_buffer. Should ONLY be called on the root Memory instance.
pub fn deinit(self: *Self) void {
    if (self.my_checkpoint == 0 and self.root_ptr == self) {
        Log.debug("Memory.deinit: Deinitializing root memory, buffer_size={}", .{self.shared_buffer.items.len});
        self.shared_buffer.deinit();
    } else {
        Log.debug("Memory.deinit: Skipping deinit for non-root memory context, checkpoint={}", .{self.my_checkpoint});
    }
}

/// Returns the size of the memory region visible to the current context.
pub fn context_size(self: *const Self) usize {
    const total_len = self.root_ptr.shared_buffer.items.len;
    if (total_len < self.my_checkpoint) {
        // This indicates a bug or inconsistent state
        return 0;
    }
    return total_len - self.my_checkpoint;
}

/// Ensures the current context's memory region is at least `min_context_size` bytes.
/// Returns the number of *new 32-byte words added to the shared_buffer* if it expanded.
/// This is crucial for EVM gas calculation.
pub fn ensure_context_capacity(self: *Self, min_context_size: usize) MemoryError!u64 {
    const required_total_len = self.my_checkpoint + min_context_size;
    Log.debug("Memory.ensure_context_capacity: Ensuring capacity, min_context_size={}, required_total_len={}, memory_limit={}", .{ min_context_size, required_total_len, self.memory_limit });
    
    if (required_total_len > self.memory_limit) {
        Log.debug("Memory.ensure_context_capacity: Memory limit exceeded, required={}, limit={}", .{ required_total_len, self.memory_limit });
        return MemoryError.MemoryLimitExceeded;
    }

    const root = self.root_ptr;
    const old_total_buffer_len = root.shared_buffer.items.len;
    const old_total_words = calculate_num_words(old_total_buffer_len);

    if (required_total_len <= old_total_buffer_len) {
        // Buffer is already large enough
        Log.debug("Memory.ensure_context_capacity: Buffer already large enough, no expansion needed", .{});
        return 0;
    }

    // Resize the buffer
    const new_total_len = required_total_len;
    Log.debug("Memory.ensure_context_capacity: Expanding buffer from {} to {} bytes", .{ old_total_buffer_len, new_total_len });
    
    if (new_total_len > root.shared_buffer.capacity) {
        var new_capacity = root.shared_buffer.capacity;
        if (new_capacity == 0) new_capacity = 1; // Handle initial zero capacity
        while (new_capacity < new_total_len) {
            const doubled = @mulWithOverflow(new_capacity, 2);
            if (doubled[1] != 0) {
                // Overflow occurred
                return MemoryError.OutOfMemory;
            }
            new_capacity = doubled[0];
        }
        // Ensure new_capacity doesn't exceed memory_limit
        if (new_capacity > self.memory_limit and self.memory_limit <= std.math.maxInt(usize)) {
            new_capacity = @intCast(self.memory_limit);
        }
        if (new_total_len > new_capacity) return MemoryError.MemoryLimitExceeded;
        try root.shared_buffer.ensureTotalCapacity(new_capacity);
    }

    // Set new length and zero-initialize the newly added part
    root.shared_buffer.items.len = new_total_len;
    @memset(root.shared_buffer.items[old_total_buffer_len..new_total_len], 0);

    const new_total_words = calculate_num_words(new_total_len);
    const words_added = if (new_total_words > old_total_words) new_total_words - old_total_words else 0;
    Log.debug("Memory.ensure_context_capacity: Expansion complete, old_words={}, new_words={}, words_added={}", .{ old_total_words, new_total_words, words_added });
    return words_added;
}

/// Read 32 bytes as u256 at context-relative offset.
pub fn get_u256(self: *const Self, relative_offset: usize) MemoryError!u256 {
    Log.debug("Memory.get_u256: Reading u256 at relative_offset={}, context_size={}", .{ relative_offset, self.context_size() });
    if (relative_offset + 32 > self.context_size()) {
        Log.debug("Memory.get_u256: Invalid offset, offset+32={} > context_size={}", .{ relative_offset + 32, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const bytes = self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + 32];
    
    // Convert big-endian bytes to u256
    var value: u256 = 0;
    for (bytes) |byte| {
        value = (value << 8) | byte;
    }
    Log.debug("Memory.get_u256: Read value={} from offset={}", .{ value, relative_offset });
    return value;
}

/// Read arbitrary slice of memory at context-relative offset.
pub fn get_slice(self: *const Self, relative_offset: usize, len: usize) MemoryError![]const u8 {
    Log.debug("Memory.get_slice: Reading slice at relative_offset={}, len={}", .{ relative_offset, len });
    if (len == 0) return &[_]u8{};
    const end = std.math.add(usize, relative_offset, len) catch {
        Log.debug("Memory.get_slice: Invalid size overflow, offset={}, len={}", .{ relative_offset, len });
        return MemoryError.InvalidSize;
    };
    if (end > self.context_size()) {
        Log.debug("Memory.get_slice: Invalid offset, end={} > context_size={}", .{ end, self.context_size() });
        return MemoryError.InvalidOffset;
    }
    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + len;
    Log.debug("Memory.get_slice: Returning slice [{}..{}]", .{ abs_offset, abs_end });
    return self.root_ptr.shared_buffer.items[abs_offset..abs_end];
}

/// Write arbitrary data at context-relative offset.
pub fn set_data(self: *Self, relative_offset: usize, data: []const u8) MemoryError!void {
    Log.debug("Memory.set_data: Writing data at relative_offset={}, data_len={}", .{ relative_offset, data.len });
    if (data.len == 0) return;

    const end = std.math.add(usize, relative_offset, data.len) catch {
        Log.debug("Memory.set_data: Invalid size overflow, offset={}, data_len={}", .{ relative_offset, data.len });
        return MemoryError.InvalidSize;
    };
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_offset;
    const abs_end = abs_offset + data.len;
    Log.debug("Memory.set_data: Writing to buffer [{}..{}]", .{ abs_offset, abs_end });
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_end], data);
}

/// Write data with source offset and length (handles partial copies and zero-fills).
pub fn set_data_bounded(
    self: *Self,
    relative_memory_offset: usize,
    data: []const u8,
    data_offset: usize,
    len: usize,
) MemoryError!void {
    if (len == 0) return;

    const end = std.math.add(usize, relative_memory_offset, len) catch return MemoryError.InvalidSize;
    _ = try self.ensure_context_capacity(end);

    const abs_offset = self.my_checkpoint + relative_memory_offset;
    const abs_end = abs_offset + len;

    // If source offset is beyond data bounds, fill with zeros
    if (data_offset >= data.len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset..abs_end], 0);
        return;
    }

    // Calculate how much we can actually copy
    const data_end = @min(data_offset + len, data.len);
    const copy_len = data_end - data_offset;

    // Copy available data
    if (copy_len > 0) {
        @memcpy(
            self.root_ptr.shared_buffer.items[abs_offset .. abs_offset + copy_len],
            data[data_offset..data_end],
        );
    }

    // Zero-fill the rest
    if (copy_len < len) {
        @memset(self.root_ptr.shared_buffer.items[abs_offset + copy_len .. abs_end], 0);
    }
}

/// Get total size of memory (context size)
pub fn total_size(self: *const Self) usize {
    return self.context_size();
}

/// Get a mutable slice to the entire memory buffer (context-relative)
pub fn slice(self: *Self) []u8 {
    const ctx_size = self.context_size();
    const abs_start = self.my_checkpoint;
    const abs_end = abs_start + ctx_size;
    return self.root_ptr.shared_buffer.items[abs_start..abs_end];
}

/// Read a single byte at context-relative offset (for test compatibility)
pub fn get_byte(self: *const Self, relative_offset: usize) MemoryError!u8 {
    if (relative_offset >= self.context_size()) return MemoryError.InvalidOffset;
    const abs_offset = self.my_checkpoint + relative_offset;
    return self.root_ptr.shared_buffer.items[abs_offset];
}

/// Resize the context to the specified size (for test compatibility)
pub fn resize_context(self: *Self, new_size: usize) MemoryError!void {
    _ = try self.ensure_context_capacity(new_size);
}

/// Get the memory size (alias for context_size for test compatibility)
pub fn size(self: *const Self) usize {
    return self.context_size();
}

/// Write u256 value at context-relative offset (for test compatibility)
pub fn set_u256(self: *Self, relative_offset: usize, value: u256) MemoryError!void {
    Log.debug("Memory.set_u256: Writing u256 value={} at relative_offset={}", .{ value, relative_offset });
    _ = try self.ensure_context_capacity(relative_offset + 32);
    const abs_offset = self.my_checkpoint + relative_offset;
    
    // Convert u256 to big-endian bytes
    var bytes: [32]u8 = undefined;
    var val = value;
    var i: usize = 32;
    while (i > 0) {
        i -= 1;
        bytes[i] = @intCast(val & 0xFF);
        val >>= 8;
    }
    
    Log.debug("Memory.set_u256: Writing bytes to buffer at abs_offset={}", .{abs_offset});
    @memcpy(self.root_ptr.shared_buffer.items[abs_offset..abs_offset + 32], &bytes);
}

```
```zig [src/evm/stack/stack_validation.zig]
const std = @import("std");
const Stack = @import("stack.zig");
const Operation = @import("../opcodes/operation.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Stack validation utilities for EVM operations.
///
/// This module provides validation functions to ensure stack operations
/// will succeed before attempting them. This is crucial for:
/// - Preventing execution errors
/// - Enabling optimized unsafe operations after validation
/// - Maintaining EVM correctness
///
/// ## Validation Strategy
/// The EVM uses two-phase validation:
/// 1. Pre-execution validation (this module)
/// 2. Unsafe operations after validation passes
///
/// This allows opcodes to use fast unsafe operations in hot paths
/// while maintaining safety guarantees.
///
/// ## Stack Limits
/// The EVM enforces strict stack limits:
/// - Maximum depth: 1024 elements
/// - Underflow: Cannot pop from empty stack
/// - Overflow: Cannot exceed maximum depth
pub const ValidationPatterns = @import("validation_patterns.zig");

/// Validates stack requirements using Operation metadata.
///
/// Each EVM operation has min_stack and max_stack requirements:
/// - min_stack: Minimum elements needed on stack
/// - max_stack: Maximum allowed before operation (to prevent overflow)
///
/// @param stack The stack to validate
/// @param operation The operation with stack requirements
/// @throws StackUnderflow if stack has fewer than min_stack elements
/// @throws StackOverflow if stack has more than max_stack elements
///
/// Example:
/// ```zig
/// // Validate before executing an opcode
/// try validate_stack_requirements(&frame.stack, &operation);
/// // Safe to use unsafe operations now
/// operation.execute(&frame);
/// ```
pub fn validate_stack_requirements(
    stack: *const Stack,
    operation: *const Operation,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_requirements: Validating stack, size={}, min_required={}, max_allowed={}", .{ stack_size, operation.min_stack, operation.max_stack });

    // Check minimum stack requirement
    if (stack_size < operation.min_stack) {
        Log.debug("StackValidation.validate_stack_requirements: Stack underflow, size={} < min_stack={}", .{ stack_size, operation.min_stack });
        return ExecutionError.Error.StackUnderflow;
    }

    // Check maximum stack requirement
    // max_stack represents the maximum stack size allowed BEFORE the operation
    // to ensure we don't overflow after the operation completes
    if (stack_size > operation.max_stack) {
        Log.debug("StackValidation.validate_stack_requirements: Stack overflow, size={} > max_stack={}", .{ stack_size, operation.max_stack });
        return ExecutionError.Error.StackOverflow;
    }
    
    Log.debug("StackValidation.validate_stack_requirements: Validation passed", .{});
}

/// Validates stack has capacity for pop/push operations.
///
/// More flexible than validate_stack_requirements, this function
/// validates arbitrary pop/push counts. Used by:
/// - Dynamic operations (e.g., LOG with variable topics)
/// - Custom validation logic
/// - Testing and debugging
///
/// @param stack The stack to validate
/// @param pop_count Number of elements to pop
/// @param push_count Number of elements to push
/// @throws StackUnderflow if stack has < pop_count elements
/// @throws StackOverflow if operation would exceed capacity
///
/// Example:
/// ```zig
/// // Validate LOG3 operation (pops 5, pushes 0)
/// try validate_stack_operation(&stack, 5, 0);
/// ```
pub fn validate_stack_operation(
    stack: *const Stack,
    pop_count: u32,
    push_count: u32,
) ExecutionError.Error!void {
    const stack_size = stack.size;
    Log.debug("StackValidation.validate_stack_operation: Validating operation, stack_size={}, pop_count={}, push_count={}", .{ stack_size, pop_count, push_count });

    // Check if we have enough items to pop
    if (stack_size < pop_count) {
        Log.debug("StackValidation.validate_stack_operation: Stack underflow, size={} < pop_count={}", .{ stack_size, pop_count });
        return ExecutionError.Error.StackUnderflow;
    }

    // Calculate stack size after operation
    const new_size = stack_size - pop_count + push_count;

    // Check if result would overflow
    if (new_size > Stack.CAPACITY) {
        Log.debug("StackValidation.validate_stack_operation: Stack overflow, new_size={} > capacity={}", .{ new_size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    
    Log.debug("StackValidation.validate_stack_operation: Validation passed, new_size={}", .{new_size});
}

/// Calculate the maximum allowed stack size for an operation.
///
/// The max_stack value ensures that after an operation completes,
/// the stack won't exceed capacity. This is calculated as:
/// - If operation grows stack: CAPACITY - net_growth
/// - If operation shrinks/neutral: CAPACITY
///
/// @param pop_count Number of elements operation pops
/// @param push_count Number of elements operation pushes
/// @return Maximum allowed stack size before operation
///
/// Example:
/// ```zig
/// // PUSH1 operation (pop 0, push 1)
/// const max = calculate_max_stack(0, 1); // Returns 1023
/// // Stack must have <= 1023 elements before PUSH1
/// ```
pub fn calculate_max_stack(pop_count: u32, push_count: u32) u32 {
    if (push_count > pop_count) {
        const net_growth = push_count - pop_count;
        return @intCast(Stack.CAPACITY - net_growth);
    }
    // If operation reduces stack or is neutral, max is CAPACITY
    return Stack.CAPACITY;
}


// Tests
const testing = std.testing;

test "validate_stack_requirements" {
    var stack = Stack{};

    // Test underflow
    const op_needs_2 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 2,
        .max_stack = Stack.CAPACITY - 1,
    };

    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_requirements(&stack, &op_needs_2));

    // Add items and test success
    try stack.append(1);
    try stack.append(2);
    try validate_stack_requirements(&stack, &op_needs_2);

    // Test overflow
    const op_max_10 = Operation{
        .execute = undefined,
        .constant_gas = 3,
        .min_stack = 0,
        .max_stack = 10,
    };

    // Fill stack beyond max_stack
    var i: usize = 2;
    while (i < 11) : (i += 1) {
        try stack.append(@intCast(i));
    }

    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_requirements(&stack, &op_max_10));
}

test "validate_stack_operation" {
    var stack = Stack{};

    // Test underflow
    try testing.expectError(ExecutionError.Error.StackUnderflow, validate_stack_operation(&stack, 2, 1));

    // Add items
    try stack.append(10);
    try stack.append(20);

    // Binary op should succeed
    try validate_stack_operation(&stack, 2, 1);

    // Test overflow - fill stack almost to capacity
    stack.size = Stack.CAPACITY - 1;

    // Operation that would overflow
    try testing.expectError(ExecutionError.Error.StackOverflow, validate_stack_operation(&stack, 0, 2));
}

test "calculate_max_stack" {
    // Binary operations (pop 2, push 1) - net decrease of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY), calculate_max_stack(2, 1));

    // Push operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // DUP operations (pop 0, push 1) - net increase of 1
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 1), calculate_max_stack(0, 1));

    // Operations that push more than pop
    try testing.expectEqual(@as(u32, Stack.CAPACITY - 3), calculate_max_stack(1, 4));
}

test "ValidationPatterns" {
    var stack = Stack{};

    // Test binary op validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_binary_op(&stack));
    try stack.append(1);
    try stack.append(2);
    try ValidationPatterns.validate_binary_op(&stack);

    // Test DUP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_dup(&stack, 3));
    try ValidationPatterns.validate_dup(&stack, 2);

    // Test SWAP validation
    try testing.expectError(ExecutionError.Error.StackUnderflow, ValidationPatterns.validate_swap(&stack, 2));
    try ValidationPatterns.validate_swap(&stack, 1);

    // Test PUSH validation at capacity
    stack.size = Stack.CAPACITY;
    try testing.expectError(ExecutionError.Error.StackOverflow, ValidationPatterns.validate_push(&stack));
}
```
```zig [src/evm/stack/stack.zig]
const std = @import("std");
const Log = @import("../log.zig");

/// High-performance EVM stack implementation with fixed capacity.
///
/// The Stack is a core component of the EVM execution model, providing a
/// Last-In-First-Out (LIFO) data structure for 256-bit values. All EVM
/// computations operate on this stack, making its performance critical.
///
/// ## Design Rationale
/// - Fixed capacity of 1024 elements (per EVM specification)
/// - 32-byte alignment for optimal memory access on modern CPUs
/// - Unsafe variants skip bounds checking in hot paths for performance
///
/// ## Performance Optimizations
/// - Aligned memory for SIMD-friendly access patterns
/// - Unsafe variants used after jump table validation
/// - Direct memory access patterns for maximum speed
///
/// ## Safety Model
/// Operations are validated at the jump table level, allowing individual
/// opcodes to use faster unsafe operations without redundant bounds checking.
///
/// Example:
/// ```zig
/// var stack = Stack{};
/// try stack.append(100); // Safe variant (for error_mapping)
/// stack.append_unsafe(200); // Unsafe variant (for opcodes)
/// ```
const Self = @This();

/// Maximum stack capacity as defined by the EVM specification.
/// This limit prevents stack-based DoS attacks.
pub const CAPACITY: usize = 1024;

/// Error types for stack operations.
/// These map directly to EVM execution errors.
pub const Error = error{
    /// Stack would exceed 1024 elements
    StackOverflow,
    /// Attempted to pop from empty stack
    StackUnderflow,
};

/// Stack storage aligned to 32-byte boundaries.
/// Alignment improves performance on modern CPUs by:
/// - Enabling SIMD operations
/// - Reducing cache line splits
/// - Improving memory prefetching
data: [CAPACITY]u256 align(32) = [_]u256{0} ** CAPACITY,

/// Current number of elements on the stack.
/// Invariant: 0 <= size <= CAPACITY
size: usize = 0,

/// Push a value onto the stack (safe version).
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
/// @throws Overflow if stack is at capacity
///
/// Example:
/// ```zig
/// try stack.append(0x1234);
/// ```
pub fn append(self: *Self, value: u256) Error!void {
    if (self.size >= CAPACITY) {
        Log.debug("Stack.append: Stack overflow, size={}, capacity={}", .{ self.size, CAPACITY });
        return Error.StackOverflow;
    }
    Log.debug("Stack.append: Pushing value={}, new_size={}", .{ value, self.size + 1 });
    self.data[self.size] = value;
    self.size += 1;
}

/// Push a value onto the stack (unsafe version).
///
/// Caller must ensure stack has capacity. Used in hot paths
/// after validation has already been performed.
///
/// @param self The stack to push onto
/// @param value The 256-bit value to push
pub fn append_unsafe(self: *Self, value: u256) void {
    @branchHint(.likely); // We generally only use unsafe methods
    self.data[self.size] = value;
    self.size += 1;
}

/// Pop a value from the stack (safe version).
///
/// Removes and returns the top element. Clears the popped
/// slot to prevent information leakage.
///
/// @param self The stack to pop from
/// @return The popped value
/// @throws Underflow if stack is empty
///
/// Example:
/// ```zig
/// const value = try stack.pop();
/// ```
pub fn pop(self: *Self) Error!u256 {
    if (self.size == 0) {
        Log.debug("Stack.pop: Stack underflow, size=0", .{});
        return Error.StackUnderflow;
    }
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    Log.debug("Stack.pop: Popped value={}, new_size={}", .{ value, self.size });
    return value;
}

/// Pop a value from the stack (unsafe version).
///
/// Caller must ensure stack is not empty. Used in hot paths
/// after validation.
///
/// @param self The stack to pop from
/// @return The popped value
pub fn pop_unsafe(self: *Self) u256 {
    @branchHint(.likely);
    self.size -= 1;
    const value = self.data[self.size];
    self.data[self.size] = 0;
    return value;
}

/// Peek at the top value without removing it (unsafe version).
///
/// Caller must ensure stack is not empty.
///
/// @param self The stack to peek at
/// @return Pointer to the top value
pub fn peek_unsafe(self: *const Self) *const u256 {
    @branchHint(.likely);
    return &self.data[self.size - 1];
}

/// Duplicate the nth element onto the top of stack (unsafe version).
///
/// Caller must ensure preconditions are met.
///
/// @param self The stack to operate on
/// @param n Position to duplicate from (1-16)
pub fn dup_unsafe(self: *Self, n: usize) void {
    @branchHint(.likely);
    @setRuntimeSafety(false);
    self.append_unsafe(self.data[self.size - n]);
}

/// Pop 2 values without pushing (unsafe version)
pub fn pop2_unsafe(self: *Self) struct { a: u256, b: u256 } {
    @branchHint(.likely); // We generally only use unsafe methods
    @setRuntimeSafety(false);

    self.size -= 2;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
    };
}

/// Pop 3 values without pushing (unsafe version)
pub fn pop3_unsafe(self: *Self) struct { a: u256, b: u256, c: u256 } {
    @branchHint(.likely); // We generally only use unsafe methods
    @setRuntimeSafety(false);

    self.size -= 3;
    return .{
        .a = self.data[self.size],
        .b = self.data[self.size + 1],
        .c = self.data[self.size + 2],
    };
}

pub fn set_top_unsafe(self: *Self, value: u256) void {
    @branchHint(.likely); // We generally only use unsafe methods
    // Assumes stack is not empty; this should be guaranteed by jump_table validation
    // for opcodes that use this pattern (e.g., after a pop and peek on a stack with >= 2 items).
    self.data[self.size - 1] = value;
}

/// CamelCase alias used by existing execution code  
pub fn swapUnsafe(self: *Self, n: usize) void {
    @branchHint(.likely);
    std.mem.swap(u256, &self.data[self.size - 1], &self.data[self.size - n - 1]);
}

/// Peek at the nth element from the top (for test compatibility)
pub fn peek_n(self: *const Self, n: usize) Error!u256 {
    if (n >= self.size) {
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1 - n];
}

/// Clear the stack (for test compatibility)
pub fn clear(self: *Self) void {
    self.size = 0;
    // Zero out the data for security
    @memset(&self.data, 0);
}

/// Peek at the top value (for test compatibility)
pub fn peek(self: *const Self) Error!u256 {
    if (self.size == 0) {
        return Error.StackUnderflow;
    }
    return self.data[self.size - 1];
}```
```zig [src/evm/stack/validation_patterns.zig]
const Stack = @import("stack.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Log = @import("../log.zig");

/// Common validation patterns for EVM stack operations.
///
/// This module provides optimized validation functions for frequently used
/// stack operation patterns in the EVM. These functions check stack requirements
/// before operations execute, preventing stack underflow/overflow errors.
///
/// ## Design Philosophy
/// Rather than repeating validation logic across opcodes, these functions
/// encapsulate common patterns:
/// - Binary operations: pop 2, push 1 (ADD, MUL, SUB, etc.)
/// - Ternary operations: pop 3, push 1 (ADDMOD, MULMOD, etc.)
/// - Comparison operations: pop 2, push 1 (LT, GT, EQ, etc.)
/// - Unary operations: pop 1, push 1 (NOT, ISZERO, etc.)
///
/// ## Performance
/// These validation functions are designed to be inlined by the compiler,
/// making them zero-cost abstractions over direct validation code.
const Self = @This();

/// Validates stack requirements for binary operations.
///
/// Binary operations consume two stack items and produce one result.
/// This pattern is used by arithmetic operations like ADD, MUL, SUB, DIV,
/// and bitwise operations like AND, OR, XOR.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADD operation
/// try validate_binary_op(&frame.stack);
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push(a + b);
/// ```
pub fn validate_binary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for ternary operations.
///
/// Ternary operations consume three stack items and produce one result.
/// This pattern is used by operations like ADDMOD and MULMOD which
/// perform modular arithmetic.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 3 items or would overflow
///
/// Example:
/// ```zig
/// // Before ADDMOD operation: (a + b) % n
/// try validate_ternary_op(&frame.stack);
/// const n = frame.stack.pop();
/// const b = frame.stack.pop();
/// const a = frame.stack.pop();
/// frame.stack.push((a + b) % n);
/// ```
pub fn validate_ternary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 3, 1);
}

/// Validates stack requirements for comparison operations.
///
/// Comparison operations consume two stack items and produce one boolean
/// result (0 or 1). This includes LT, GT, SLT, SGT, and EQ operations.
///
/// @param stack The stack to validate
/// @return Error if stack has fewer than 2 items or would overflow
///
/// Note: This is functionally identical to validate_binary_op but exists
/// as a separate function for semantic clarity and potential future
/// specialization.
pub fn validate_comparison_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 2, 1);
}

/// Validates stack requirements for unary operations.
///
/// Unary operations consume one stack item and produce one result.
/// This pattern is used by operations like NOT, ISZERO, and SIGNEXTEND.
///
/// @param stack The stack to validate
/// @return Error if stack is empty or would overflow
///
/// Example:
/// ```zig
/// // Before ISZERO operation
/// try validate_unary_op(&frame.stack);
/// const value = frame.stack.pop();
/// frame.stack.push(if (value == 0) 1 else 0);
/// ```
pub fn validate_unary_op(stack: *const Stack) ExecutionError.Error!void {
    return validate_stack_operation(stack, 1, 1);
}

/// Validates stack requirements for DUP operations.
///
/// DUP operations duplicate the nth stack item, pushing a copy onto the top.
/// They consume no items but add one, so the stack must have:
/// - At least n items to duplicate from
/// - Room for one more item
///
/// @param stack The stack to validate
/// @param n The position to duplicate from (1-based, DUP1 duplicates top item)
/// @return StackUnderflow if fewer than n items, StackOverflow if full
///
/// Example:
/// ```zig
/// // DUP3 operation
/// try validate_dup(&frame.stack, 3);
/// const value = frame.stack.peek(2); // 0-based indexing
/// frame.stack.push(value);
/// ```
pub fn validate_dup(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_dup: Validating DUP{}, stack_size={}", .{ n, stack.size });
    // DUP pops 0 and pushes 1
    if (stack.size < n) {
        Log.debug("ValidationPatterns.validate_dup: Stack underflow, size={} < n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    if (stack.size >= Stack.CAPACITY) {
        Log.debug("ValidationPatterns.validate_dup: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_dup: Validation passed", .{});
}

/// Validates stack requirements for SWAP operations.
///
/// SWAP operations exchange the top stack item with the (n+1)th item.
/// They don't change the stack size, but require at least n+1 items.
///
/// @param stack The stack to validate
/// @param n The position to swap with (1-based, SWAP1 swaps top two items)
/// @return StackUnderflow if stack has n or fewer items
///
/// Example:
/// ```zig
/// // SWAP2 operation swaps top with 3rd item
/// try validate_swap(&frame.stack, 2);
/// frame.stack.swap(2);
/// ```
pub fn validate_swap(stack: *const Stack, n: u32) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_swap: Validating SWAP{}, stack_size={}", .{ n, stack.size });
    // SWAP needs at least n+1 items on stack
    if (stack.size <= n) {
        Log.debug("ValidationPatterns.validate_swap: Stack underflow, size={} <= n={}", .{ stack.size, n });
        return ExecutionError.Error.StackUnderflow;
    }
    Log.debug("ValidationPatterns.validate_swap: Validation passed", .{});
}

/// Validates stack requirements for PUSH operations.
///
/// PUSH operations add one new item to the stack. They only require
/// checking that the stack isn't already full.
///
/// @param stack The stack to validate
/// @return StackOverflow if stack is at capacity
///
/// Example:
/// ```zig
/// // PUSH1 operation
/// try validate_push(&frame.stack);
/// const value = readByte(pc + 1);
/// frame.stack.push(value);
/// ```
pub fn validate_push(stack: *const Stack) ExecutionError.Error!void {
    Log.debug("ValidationPatterns.validate_push: Validating PUSH, stack_size={}", .{stack.size});
    if (stack.size >= Stack.CAPACITY) {
        Log.debug("ValidationPatterns.validate_push: Stack overflow, size={} >= capacity={}", .{ stack.size, Stack.CAPACITY });
        return ExecutionError.Error.StackOverflow;
    }
    Log.debug("ValidationPatterns.validate_push: Validation passed", .{});
}

// Import the helper function
const validate_stack_operation = @import("stack_validation.zig").validate_stack_operation;
```
```zig [src/evm/access_list/access_list.zig]
const std = @import("std");
const Address = @import("Address");
const AccessListStorageKey = @import("access_list_storage_key.zig");
const AccessListStorageKeyContext = @import("access_list_storage_key_context.zig");

/// EIP-2929 & EIP-2930: Access list management for gas cost calculation
/// 
/// Tracks which addresses and storage slots have been accessed during transaction
/// execution. First access (cold) costs more gas than subsequent accesses (warm).
/// 
/// Gas costs:
/// - Cold address access: 2600 gas
/// - Warm address access: 100 gas  
/// - Cold storage slot access: 2100 gas
/// - Warm storage slot access: 100 gas

// Error types for AccessList operations
pub const AccessAddressError = std.mem.Allocator.Error;
pub const AccessStorageSlotError = std.mem.Allocator.Error;
pub const PreWarmAddressesError = std.mem.Allocator.Error;
pub const PreWarmStorageSlotsError = std.mem.Allocator.Error;
pub const InitTransactionError = std.mem.Allocator.Error;
pub const GetCallCostError = std.mem.Allocator.Error;

pub const AccessList = @This();


// Gas costs defined by EIP-2929
pub const COLD_ACCOUNT_ACCESS_COST: u64 = 2600;
pub const WARM_ACCOUNT_ACCESS_COST: u64 = 100;
pub const COLD_SLOAD_COST: u64 = 2100;
pub const WARM_SLOAD_COST: u64 = 100;

// Additional costs for CALL operations
pub const COLD_CALL_EXTRA_COST: u64 = COLD_ACCOUNT_ACCESS_COST - WARM_ACCOUNT_ACCESS_COST;

allocator: std.mem.Allocator,
/// Warm addresses - addresses that have been accessed
addresses: std.AutoHashMap(Address.Address, void),
/// Warm storage slots - storage slots that have been accessed
storage_slots: std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80),

pub fn init(allocator: std.mem.Allocator) AccessList {
    return .{
        .allocator = allocator,
        .addresses = std.AutoHashMap(Address.Address, void).init(allocator),
        .storage_slots = std.HashMap(AccessListStorageKey, void, AccessListStorageKeyContext, 80).init(allocator),
    };
}

pub fn deinit(self: *AccessList) void {
    self.addresses.deinit();
    self.storage_slots.deinit();
}

/// Clear all access lists for a new transaction
pub fn clear(self: *AccessList) void {
    self.addresses.clearRetainingCapacity();
    self.storage_slots.clearRetainingCapacity();
}

/// Mark an address as accessed and return the gas cost
/// Returns COLD_ACCOUNT_ACCESS_COST if first access, WARM_ACCOUNT_ACCESS_COST if already accessed
pub fn access_address(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) return WARM_ACCOUNT_ACCESS_COST;
    return COLD_ACCOUNT_ACCESS_COST;
}

/// Mark a storage slot as accessed and return the gas cost
/// Returns COLD_SLOAD_COST if first access, WARM_SLOAD_COST if already accessed
pub fn access_storage_slot(self: *AccessList, address: Address.Address, slot: u256) std.mem.Allocator.Error!u64 {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    const result = try self.storage_slots.getOrPut(key);
    if (result.found_existing) return WARM_SLOAD_COST;
    return COLD_SLOAD_COST;
}

/// Check if an address is warm (has been accessed)
pub fn is_address_warm(self: *const AccessList, address: Address.Address) bool {
    return self.addresses.contains(address);
}

/// Check if a storage slot is warm (has been accessed)
pub fn is_storage_slot_warm(self: *const AccessList, address: Address.Address, slot: u256) bool {
    const key = AccessListStorageKey{ .address = address, .slot = slot };
    return self.storage_slots.contains(key);
}

/// Pre-warm addresses from EIP-2930 access list
pub fn pre_warm_addresses(self: *AccessList, addresses: []const Address.Address) std.mem.Allocator.Error!void {
    for (addresses) |address| {
        try self.addresses.put(address, {});
    }
}

/// Pre-warm storage slots from EIP-2930 access list
pub fn pre_warm_storage_slots(self: *AccessList, address: Address.Address, slots: []const u256) std.mem.Allocator.Error!void {
    for (slots) |slot| {
        const key = AccessListStorageKey{ .address = address, .slot = slot };
        try self.storage_slots.put(key, {});
    }
}

/// Initialize transaction access list with pre-warmed addresses
/// According to EIP-2929, tx.origin and block.coinbase are always pre-warmed
pub fn init_transaction(self: *AccessList, tx_origin: Address.Address, coinbase: Address.Address, to: ?Address.Address) std.mem.Allocator.Error!void {
    // Clear previous transaction data
    self.clear();
    
    try self.addresses.put(tx_origin, {});
    try self.addresses.put(coinbase, {});
    
    if (to) |to_address| {
        try self.addresses.put(to_address, {});
    }
}

/// Get the extra gas cost for accessing an address (for CALL operations)
/// Returns 0 if warm, COLD_CALL_EXTRA_COST if cold
pub fn get_call_cost(self: *AccessList, address: Address.Address) std.mem.Allocator.Error!u64 {
    const result = try self.addresses.getOrPut(address);
    if (result.found_existing) return 0;
    return COLD_CALL_EXTRA_COST;
}

// Tests
const testing = std.testing;

test "AccessList basic operations" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    
    // First access should be cold
    const cost1 = try access_list.access_address(test_address);
    try testing.expectEqual(COLD_ACCOUNT_ACCESS_COST, cost1);
    
    // Second access should be warm
    const cost2 = try access_list.access_address(test_address);
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, cost2);
    
    // Check warmth
    try testing.expect(access_list.is_address_warm(test_address));
    
    const cold_address = [_]u8{2} ** 20;
    try testing.expect(!access_list.is_address_warm(cold_address));
}

test "AccessList storage slots" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const test_address = [_]u8{1} ** 20;
    const slot1: u256 = 42;
    const slot2: u256 = 100;
    
    // First access to slot1 should be cold
    const cost1 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(COLD_SLOAD_COST, cost1);
    
    // Second access to slot1 should be warm
    const cost2 = try access_list.access_storage_slot(test_address, slot1);
    try testing.expectEqual(WARM_SLOAD_COST, cost2);
    
    // First access to slot2 should be cold
    const cost3 = try access_list.access_storage_slot(test_address, slot2);
    try testing.expectEqual(COLD_SLOAD_COST, cost3);
    
    // Check warmth
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot1));
    try testing.expect(access_list.is_storage_slot_warm(test_address, slot2));
    try testing.expect(!access_list.is_storage_slot_warm(test_address, 999));
}

test "AccessList transaction initialization" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const tx_origin = [_]u8{1} ** 20;
    const coinbase = [_]u8{2} ** 20;
    const to_address = [_]u8{3} ** 20;
    
    try access_list.init_transaction(tx_origin, coinbase, to_address);
    
    // All should be pre-warmed
    try testing.expect(access_list.is_address_warm(tx_origin));
    try testing.expect(access_list.is_address_warm(coinbase));
    try testing.expect(access_list.is_address_warm(to_address));
    
    // Accessing them should return warm cost
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(tx_origin));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(coinbase));
    try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(to_address));
}

test "AccessList pre-warming from EIP-2930" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const addresses = [_]Address.Address{
        [_]u8{1} ** 20,
        [_]u8{2} ** 20,
        [_]u8{3} ** 20,
    };
    
    try access_list.pre_warm_addresses(&addresses);
    
    // All should be warm
    for (addresses) |address| {
        try testing.expect(access_list.is_address_warm(address));
        try testing.expectEqual(WARM_ACCOUNT_ACCESS_COST, try access_list.access_address(address));
    }
    
    // Test storage slot pre-warming
    const contract_address = [_]u8{4} ** 20;
    const slots = [_]u256{ 1, 2, 3, 100 };
    
    try access_list.pre_warm_storage_slots(contract_address, &slots);
    
    for (slots) |slot| {
        try testing.expect(access_list.is_storage_slot_warm(contract_address, slot));
        try testing.expectEqual(WARM_SLOAD_COST, try access_list.access_storage_slot(contract_address, slot));
    }
}

test "AccessList call costs" {
    var access_list = AccessList.init(testing.allocator);
    defer access_list.deinit();
    
    const cold_address = [_]u8{1} ** 20;
    const warm_address = [_]u8{2} ** 20;
    
    // Pre-warm one address
    try access_list.pre_warm_addresses(&[_]Address.Address{warm_address});
    
    // Cold address should have extra cost
    try testing.expectEqual(COLD_CALL_EXTRA_COST, try access_list.get_call_cost(cold_address));
    
    // Warm address should have no extra cost
    try testing.expectEqual(@as(u64, 0), try access_list.get_call_cost(warm_address));
    
    // After getting cost, cold address should now be warm
    try testing.expect(access_list.is_address_warm(cold_address));
}
```
```zig [src/evm/access_list/access_list_storage_key_context.zig]
const AccessListStorageKey = @import("access_list_storage_key.zig");

/// HashMap context for AccessListStorageKey
const Self = @This();

pub fn hash(ctx: Self, key: AccessListStorageKey) u64 {
    _ = ctx;
    return key.hash();
}

pub fn eql(ctx: Self, a: AccessListStorageKey, b: AccessListStorageKey) bool {
    _ = ctx;
    return a.eql(b);
}
```
```zig [src/evm/access_list/access_list_storage_key.zig]
const std = @import("std");
const Address = @import("Address");

/// Storage slot key combining address and slot for access list operations
/// This version provides direct hash output for use with HashMap
const Self = @This();

address: Address.Address,
slot: u256,

pub fn hash(self: Self) u64 {
    var hasher = std.hash.Wyhash.init(0);
    hasher.update(&self.address);
    hasher.update(std.mem.asBytes(&self.slot));
    return hasher.final();
}

pub fn eql(self: Self, other: Self) bool {
    return std.mem.eql(u8, &self.address, &other.address) and self.slot == other.slot;
}
```
```zig [src/evm/call_result.zig]
/// Result structure returned by contract call operations.
///
/// This structure encapsulates the outcome of executing a contract call in the EVM,
/// including standard calls (CALL), code calls (CALLCODE), delegate calls (DELEGATECALL),
/// and static calls (STATICCALL). It provides a unified interface for handling the
/// results of all inter-contract communication operations.
///
/// ## Usage
/// This structure is returned by the VM's call methods and contains all information
/// needed to determine the outcome of a call and process its results.
///
/// ## Call Types
/// - **CALL**: Standard contract call with its own storage context
/// - **CALLCODE**: Executes external code in current storage context (deprecated)
/// - **DELEGATECALL**: Executes external code with current storage and msg context
/// - **STATICCALL**: Read-only call that cannot modify state
///
/// ## Example
/// ```zig
/// const result = try vm.call_contract(caller, to, value, input, gas, is_static);
/// if (result.success) {
///     // Process successful call
///     if (result.output) |data| {
///         // Handle returned data
///     }
/// } else {
///     // Handle failed call - gas_left indicates remaining gas
/// }
/// defer if (result.output) |output| allocator.free(output);
/// ```
const Self = @This();

/// Indicates whether the call completed successfully.
///
/// - `true`: Call executed without errors and any state changes were committed
/// - `false`: Call failed due to revert, out of gas, or other errors
///
/// Note: A successful call may still have no output data if the called
/// contract intentionally returns nothing.
success: bool,

/// Amount of gas remaining after the call execution.
///
/// This value is important for gas accounting:
/// - For successful calls: Indicates unused gas to be refunded to the caller
/// - For failed calls: May be non-zero if the call reverted (vs running out of gas)
///
/// The calling context should add this back to its available gas to continue execution.
gas_left: u64,

/// Optional output data returned by the called contract.
///
/// - `null`: No data was returned (valid for both success and failure)
/// - `[]const u8`: Returned data buffer
///
/// ## Memory Management
/// The output data is allocated by the VM and ownership is transferred to the caller.
/// The caller is responsible for freeing this memory when no longer needed.
///
/// ## For Different Call Types
/// - **RETURN**: Contains the data specified in the RETURN opcode
/// - **REVERT**: Contains the revert reason/data if provided
/// - **STOP**: Will be null (no data returned)
/// - **Out of Gas/Invalid**: Will be null
output: ?[]const u8,
```
```zig [src/evm/opcodes/opcode.zig]
/// EVM opcode definitions and utilities.
///
/// This module defines all EVM opcodes as specified in the Ethereum Yellow Paper
/// and various EIPs. Each opcode is a single byte instruction that the EVM
/// interpreter executes.
///
/// ## Opcode Categories
/// - Arithmetic: ADD, MUL, SUB, DIV, MOD, EXP, etc.
/// - Comparison: LT, GT, EQ, ISZERO
/// - Bitwise: AND, OR, XOR, NOT, SHL, SHR, SAR
/// - Environmental: ADDRESS, BALANCE, CALLER, CALLVALUE
/// - Block Information: BLOCKHASH, COINBASE, TIMESTAMP, NUMBER
/// - Stack Operations: POP, PUSH1-PUSH32, DUP1-DUP16, SWAP1-SWAP16
/// - Memory Operations: MLOAD, MSTORE, MSTORE8, MSIZE
/// - Storage Operations: SLOAD, SSTORE, TLOAD, TSTORE
/// - Flow Control: JUMP, JUMPI, PC, JUMPDEST
/// - System Operations: CREATE, CALL, RETURN, REVERT, SELFDESTRUCT
/// - Logging: LOG0-LOG4
///
/// ## Opcode Encoding
/// Opcodes are encoded as single bytes (0x00-0xFF). Not all byte values
/// are assigned; unassigned values are treated as INVALID operations.
///
/// ## Hardfork Evolution
/// New opcodes are introduced through EIPs and activated at specific
/// hardforks. Examples:
/// - PUSH0 (EIP-3855): Shanghai hardfork
/// - TLOAD/TSTORE (EIP-1153): Cancun hardfork
/// - MCOPY (EIP-5656): Cancun hardfork
///
/// Example:
/// ```zig
/// const opcode = Opcode.Enum.ADD;
/// const byte_value = opcode.to_u8(); // 0x01
/// const name = opcode.get_name(); // "ADD"
/// ```
pub const MemorySize = @import("../memory_size.zig");

/// Opcode module providing EVM instruction definitions.
const Self = @This();

/// Enumeration of all EVM opcodes with their byte values.
///
/// Each opcode is assigned a specific byte value that remains
/// constant across all EVM implementations. The enum ensures
/// type safety when working with opcodes.
pub const Enum = enum(u8) {
    /// Halts execution (0x00)
    STOP = 0x00,
    /// Addition operation: a + b (0x01)
    ADD = 0x01,
    /// Multiplication operation: a * b (0x02)
    MUL = 0x02,
    /// Subtraction operation: a - b (0x03)
    SUB = 0x03,
    /// Integer division operation: a / b (0x04)
    DIV = 0x04,
    /// Signed integer division operation (0x05)
    SDIV = 0x05,
    /// Modulo operation: a % b (0x06)
    MOD = 0x06,
    /// Signed modulo operation (0x07)
    SMOD = 0x07,
    /// Addition modulo: (a + b) % N (0x08)
    ADDMOD = 0x08,
    /// Multiplication modulo: (a * b) % N (0x09)
    MULMOD = 0x09,
    /// Exponential operation: a ** b (0x0A)
    EXP = 0x0A,
    /// Sign extend operation (0x0B)
    SIGNEXTEND = 0x0B,
    /// Less-than comparison: a < b (0x10)
    LT = 0x10,
    /// Greater-than comparison: a > b (0x11)
    GT = 0x11,
    /// Signed less-than comparison (0x12)
    SLT = 0x12,
    /// Signed greater-than comparison (0x13)
    SGT = 0x13,
    /// Equality comparison: a == b (0x14)
    EQ = 0x14,
    /// Check if value is zero (0x15)
    ISZERO = 0x15,
    /// Bitwise AND operation (0x16)
    AND = 0x16,
    /// Bitwise OR operation (0x17)
    OR = 0x17,
    /// Bitwise XOR operation (0x18)
    XOR = 0x18,
    /// Bitwise NOT operation (0x19)
    NOT = 0x19,
    /// Retrieve single byte from word (0x1A)
    BYTE = 0x1A,
    /// Logical shift left (0x1B)
    SHL = 0x1B,
    /// Logical shift right (0x1C)
    SHR = 0x1C,
    /// Arithmetic shift right (0x1D)
    SAR = 0x1D,
    /// Compute Keccak-256 hash (0x20)
    KECCAK256 = 0x20,
    /// Get address of currently executing account (0x30)
    ADDRESS = 0x30,
    /// Get balance of the given account (0x31)
    BALANCE = 0x31,
    /// Get execution origination address (0x32)
    ORIGIN = 0x32,
    /// Get caller address (0x33)
    CALLER = 0x33,
    /// Get deposited value by the caller (0x34)
    CALLVALUE = 0x34,
    /// Load input data of current call (0x35)
    CALLDATALOAD = 0x35,
    /// Get size of input data in current call (0x36)
    CALLDATASIZE = 0x36,
    /// Copy input data to memory (0x37)
    CALLDATACOPY = 0x37,
    /// Get size of code running in current environment (0x38)
    CODESIZE = 0x38,
    /// Copy code to memory (0x39)
    CODECOPY = 0x39,
    /// Get price of gas in current environment (0x3A)
    GASPRICE = 0x3A,
    EXTCODESIZE = 0x3B,
    EXTCODECOPY = 0x3C,
    RETURNDATASIZE = 0x3D,
    RETURNDATACOPY = 0x3E,
    EXTCODEHASH = 0x3F,
    BLOCKHASH = 0x40,
    COINBASE = 0x41,
    TIMESTAMP = 0x42,
    NUMBER = 0x43,
    PREVRANDAO = 0x44,
    GASLIMIT = 0x45,
    CHAINID = 0x46,
    SELFBALANCE = 0x47,
    BASEFEE = 0x48,
    BLOBHASH = 0x49,
    BLOBBASEFEE = 0x4A,
    POP = 0x50,
    MLOAD = 0x51,
    MSTORE = 0x52,
    MSTORE8 = 0x53,
    /// Load word from storage (0x54)
    SLOAD = 0x54,
    /// Store word to storage (0x55)
    SSTORE = 0x55,
    /// Unconditional jump (0x56)
    JUMP = 0x56,
    /// Conditional jump (0x57)
    JUMPI = 0x57,
    /// Get current program counter (0x58)
    PC = 0x58,
    /// Get size of active memory in bytes (0x59)
    MSIZE = 0x59,
    /// Get amount of available gas (0x5A)
    GAS = 0x5A,
    /// Mark valid jump destination (0x5B)
    JUMPDEST = 0x5B,
    /// Load word from transient storage (0x5C)
    TLOAD = 0x5C,
    /// Store word to transient storage (0x5D)
    TSTORE = 0x5D,
    /// Copy memory areas (0x5E)
    MCOPY = 0x5E,
    /// Push zero onto stack (0x5F)
    PUSH0 = 0x5F,
    PUSH1 = 0x60,
    PUSH2 = 0x61,
    PUSH3 = 0x62,
    PUSH4 = 0x63,
    PUSH5 = 0x64,
    PUSH6 = 0x65,
    PUSH7 = 0x66,
    PUSH8 = 0x67,
    PUSH9 = 0x68,
    PUSH10 = 0x69,
    PUSH11 = 0x6A,
    PUSH12 = 0x6B,
    PUSH13 = 0x6C,
    PUSH14 = 0x6D,
    PUSH15 = 0x6E,
    PUSH16 = 0x6F,
    PUSH17 = 0x70,
    PUSH18 = 0x71,
    PUSH19 = 0x72,
    PUSH20 = 0x73,
    PUSH21 = 0x74,
    PUSH22 = 0x75,
    PUSH23 = 0x76,
    PUSH24 = 0x77,
    PUSH25 = 0x78,
    PUSH26 = 0x79,
    PUSH27 = 0x7A,
    PUSH28 = 0x7B,
    PUSH29 = 0x7C,
    PUSH30 = 0x7D,
    PUSH31 = 0x7E,
    PUSH32 = 0x7F,
    DUP1 = 0x80,
    DUP2 = 0x81,
    DUP3 = 0x82,
    DUP4 = 0x83,
    DUP5 = 0x84,
    DUP6 = 0x85,
    DUP7 = 0x86,
    DUP8 = 0x87,
    DUP9 = 0x88,
    DUP10 = 0x89,
    DUP11 = 0x8A,
    DUP12 = 0x8B,
    DUP13 = 0x8C,
    DUP14 = 0x8D,
    DUP15 = 0x8E,
    DUP16 = 0x8F,
    SWAP1 = 0x90,
    SWAP2 = 0x91,
    SWAP3 = 0x92,
    SWAP4 = 0x93,
    SWAP5 = 0x94,
    SWAP6 = 0x95,
    SWAP7 = 0x96,
    SWAP8 = 0x97,
    SWAP9 = 0x98,
    SWAP10 = 0x99,
    SWAP11 = 0x9A,
    SWAP12 = 0x9B,
    SWAP13 = 0x9C,
    SWAP14 = 0x9D,
    SWAP15 = 0x9E,
    SWAP16 = 0x9F,
    LOG0 = 0xA0,
    LOG1 = 0xA1,
    LOG2 = 0xA2,
    LOG3 = 0xA3,
    LOG4 = 0xA4,
    /// Create new contract (0xF0)
    CREATE = 0xF0,
    /// Message-call into account (0xF1)
    CALL = 0xF1,
    /// Message-call with current code (0xF2)
    CALLCODE = 0xF2,
    /// Halt execution returning output data (0xF3)
    RETURN = 0xF3,
    /// Call with current sender and value (0xF4)
    DELEGATECALL = 0xF4,
    /// Create with deterministic address (0xF5)
    CREATE2 = 0xF5,
    /// Load return data (0xF7)
    RETURNDATALOAD = 0xF7,
    /// Extended call (EOF) (0xF8)
    EXTCALL = 0xF8,
    /// Extended delegate call (EOF) (0xF9)
    EXTDELEGATECALL = 0xF9,
    /// Static message-call (0xFA)
    STATICCALL = 0xFA,
    /// Extended static call (EOF) (0xFB)
    EXTSTATICCALL = 0xFB,
    /// Halt execution reverting state changes (0xFD)
    REVERT = 0xFD,
    /// Invalid instruction (0xFE)
    INVALID = 0xFE,
    /// Destroy current contract (0xFF)
    SELFDESTRUCT = 0xFF,
};

/// Convert an opcode to its byte representation.
///
/// Returns the underlying byte value of the opcode for use in
/// bytecode encoding/decoding and jump table lookups.
///
/// @param self The opcode to convert
/// @return The byte value (0x00-0xFF)
///
/// Example:
/// ```zig
/// const add_byte = Opcode.Enum.ADD.to_u8(); // Returns 0x01
/// const push1_byte = Opcode.Enum.PUSH1.to_u8(); // Returns 0x60
/// ```
pub fn to_u8(self: Enum) u8 {
    return @intFromEnum(self);
}

/// Get the human-readable name of an opcode.
///
/// Returns the mnemonic string representation of the opcode
/// as used in assembly code and debugging output.
///
/// @param self The opcode to get the name of
/// @return Static string containing the opcode mnemonic
///
/// Example:
/// ```zig
/// const name = Opcode.Enum.ADD.get_name(); // Returns "ADD"
/// std.debug.print("Executing opcode: {s}\n", .{name});
/// ```
pub fn get_name(self: Enum) []const u8 {
    // Build a lookup table at comptime
    const names = comptime blk: {
        var n: [256][]const u8 = undefined;

        // Initialize all to "UNDEFINED"
        for (&n) |*name| {
            name.* = "UNDEFINED";
        }

        // Map enum values to their names using reflection
        const enum_info = @typeInfo(Enum);
        switch (enum_info) {
            .@"enum" => |e| {
                for (e.fields) |field| {
                    const value = @field(Enum, field.name);
                    n[@intFromEnum(value)] = field.name;
                }
            },
            else => @compileError("get_name requires an enum type"),
        }

        break :blk n;
    };
    
    return names[@intFromEnum(self)];
}

```
```zig [src/evm/opcodes/operation.zig]
const std = @import("std");
const Opcode = @import("opcode.zig");
const ExecutionError = @import("../execution/execution_error.zig");
const Stack = @import("../stack/stack.zig");
const Memory = @import("../memory.zig");

/// Operation metadata and execution functions for EVM opcodes.
///
/// This module defines the structure for EVM operations, including their
/// execution logic, gas costs, and stack requirements. Each opcode in the
/// EVM is associated with an Operation that controls its behavior.
///
/// ## Design Philosophy
/// Operations encapsulate all opcode-specific logic:
/// - Execution function that implements the opcode
/// - Gas calculation (both constant and dynamic)
/// - Stack validation requirements
/// - Memory expansion calculations
///
/// ## Function Types
/// The module uses function pointers for flexibility, allowing:
/// - Different implementations for different hardforks
/// - Optimized variants for specific conditions
/// - Mock implementations for testing
///
/// ## Gas Model
/// EVM gas costs consist of:
/// - Constant gas: Fixed cost for the operation
/// - Dynamic gas: Variable cost based on operation parameters
///
/// Example:
/// ```zig
/// // ADD operation
/// const add_op = Operation{
///     .execute = executeAdd,
///     .constant_gas = 3,
///     .min_stack = 2,
///     .max_stack = Stack.CAPACITY - 1,
/// };
/// ```
pub const ExecutionResult = @import("../execution/execution_result.zig");

/// Forward declaration for the interpreter context.
/// The actual interpreter implementation provides VM state and context.
pub const Interpreter = opaque {};

/// Forward declaration for execution state.
/// Contains transaction context, account state, and execution environment.
pub const State = opaque {};

/// Function signature for opcode execution.
///
/// Each opcode implements this signature to perform its operation.
/// The function has access to:
/// - Program counter for reading immediate values
/// - Interpreter for stack/memory manipulation
/// - State for account and storage access
///
/// @param pc Current program counter position
/// @param interpreter VM interpreter context
/// @param state Execution state and environment
/// @return Execution result indicating success/failure and gas consumption
pub const ExecutionFunc = *const fn (pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult;

/// Function signature for dynamic gas calculation.
///
/// Some operations have variable gas costs based on:
/// - Current state (e.g., cold vs warm storage access)
/// - Operation parameters (e.g., memory expansion size)
/// - Network rules (e.g., EIP-2929 access lists)
///
/// @param interpreter VM interpreter context
/// @param state Execution state
/// @param stack Current stack for parameter inspection
/// @param memory Current memory for size calculations
/// @param requested_size Additional memory requested by operation
/// @return Dynamic gas cost to add to constant gas
/// @throws OutOfGas if gas calculation overflows
pub const GasFunc = *const fn (interpreter: *Interpreter, state: *State, stack: *Stack, memory: *Memory, requested_size: u64) error{OutOfGas}!u64;

/// Function signature for memory size calculation.
///
/// Operations that access memory need to calculate the required size
/// before execution to:
/// - Charge memory expansion gas
/// - Validate memory bounds
/// - Pre-allocate memory if needed
///
/// @param stack Stack containing operation parameters
/// @return Required memory size for the operation
pub const MemorySizeFunc = *const fn (stack: *Stack) Opcode.MemorySize;

/// EVM operation definition containing all metadata and functions.
///
/// Each entry in the jump table is an Operation that fully describes
/// how to execute an opcode, including validation, gas calculation,
/// and the actual execution logic.
const Self = @This();

/// Execution function implementing the opcode logic.
/// This is called after all validations pass.
execute: ExecutionFunc,

/// Base gas cost for this operation.
/// This is the minimum gas charged regardless of parameters.
/// Defined by the Ethereum Yellow Paper and EIPs.
constant_gas: u64,

/// Optional dynamic gas calculation function.
/// Operations with variable costs (storage, memory, calls) use this
/// to calculate additional gas based on runtime parameters.
dynamic_gas: ?GasFunc = null,

/// Minimum stack items required before execution.
/// The operation will fail with StackUnderflow if the stack
/// has fewer than this many items.
min_stack: u32,

/// Maximum stack size allowed before execution.
/// Ensures the operation won't cause stack overflow.
/// Calculated as: CAPACITY - (pushes - pops)
max_stack: u32,

/// Optional memory size calculation function.
/// Operations that access memory use this to determine
/// memory expansion requirements before execution.
memory_size: ?MemorySizeFunc = null,

/// Indicates if this is an undefined/invalid opcode.
/// Undefined opcodes consume all gas and fail execution.
/// Used for opcodes not assigned in the current hardfork.
undefined: bool = false,

/// Singleton NULL operation for unassigned opcode slots.
///
/// This operation is used for opcodes that:
/// - Are not yet defined in the current hardfork
/// - Have been removed in the current hardfork
/// - Are reserved for future use
///
/// Executing NULL always results in InvalidOpcode error.
pub const NULL = Self{
    .execute = undefined_execute,
    .constant_gas = 0,
    .min_stack = 0,
    .max_stack = Stack.CAPACITY,
    .undefined = true,
};

/// Execution function for undefined opcodes.
///
/// Consumes all remaining gas and returns InvalidOpcode error.
/// This ensures undefined opcodes cannot be used for computation.
fn undefined_execute(pc: usize, interpreter: *Interpreter, state: *State) ExecutionError.Error!ExecutionResult {
    _ = pc;
    _ = interpreter;
    _ = state;
    return ExecutionError.Error.InvalidOpcode;
}```
```zig [src/evm/context.zig]
const std = @import("std");
const Address = @import("Address");

/// Execution context providing transaction and block information to the EVM.
///
/// This structure encapsulates all environmental data that smart contracts
/// can access during execution. It provides the context needed for opcodes
/// like ORIGIN, TIMESTAMP, COINBASE, etc. to return appropriate values.
///
/// ## Purpose
/// The context separates environmental information from the VM's execution
/// state, enabling:
/// - Consistent environment across nested calls
/// - Easy testing with mock environments
/// - Support for historical block execution
/// - Fork simulation with custom parameters
///
/// ## Opcode Mapping
/// Context fields map directly to EVM opcodes:
/// - `tx_origin` → ORIGIN (0x32)
/// - `gas_price` → GASPRICE (0x3A)
/// - `block_number` → NUMBER (0x43)
/// - `block_timestamp` → TIMESTAMP (0x42)
/// - `block_coinbase` → COINBASE (0x41)
/// - `block_difficulty` → DIFFICULTY/PREVRANDAO (0x44)
/// - `block_gas_limit` → GASLIMIT (0x45)
/// - `chain_id` → CHAINID (0x46)
/// - `block_base_fee` → BASEFEE (0x48)
/// - `blob_hashes` → BLOBHASH (0x49)
///
/// ## Usage Example
/// ```zig
/// const context = Context.init_with_values(
///     .tx_origin = sender_address,
///     .gas_price = 20_000_000_000, // 20 gwei
///     .block_number = 15_000_000,
///     .block_timestamp = 1656633600,
///     .block_coinbase = miner_address,
///     .block_difficulty = 0, // post-merge
///     .block_gas_limit = 30_000_000,
///     .chain_id = 1, // mainnet
///     .block_base_fee = 15_000_000_000,
///     .blob_hashes = &.{},
///     .blob_base_fee = 1,
/// );
/// ```
const Self = @This();

/// The original sender address that initiated the transaction.
///
/// ## ORIGIN Opcode (0x32)
/// This value remains constant throughout all nested calls and
/// represents the externally-owned account (EOA) that signed the
/// transaction.
///
/// ## Security Warning
/// Using tx.origin for authentication is dangerous as it can be
/// exploited through phishing attacks. Always use msg.sender instead.
///
/// ## Example
/// EOA → Contract A → Contract B → Contract C
/// - tx.origin = EOA (same for all)
/// - msg.sender differs at each level
tx_origin: Address.Address = Address.zero(),
/// The gas price for the current transaction in wei.
///
/// ## GASPRICE Opcode (0x3A)
/// Returns the effective gas price that the transaction is paying:
/// - Legacy transactions: The specified gas price
/// - EIP-1559 transactions: min(maxFeePerGas, baseFee + maxPriorityFeePerGas)
///
/// ## Typical Values
/// - 1 gwei = 1,000,000,000 wei
/// - Mainnet: Usually 10-100 gwei
/// - Test networks: Often 0 or 1 gwei
gas_price: u256 = 0,
/// The current block number (height).
///
/// ## NUMBER Opcode (0x43)
/// Returns the number of the block being executed. Block numbers
/// start at 0 (genesis) and increment by 1 for each block.
///
/// ## Network Examples
/// - Mainnet genesis: 0
/// - The Merge: ~15,537,394
/// - Typical mainnet: >18,000,000
///
/// ## Use Cases
/// - Time-locked functionality
/// - Random number generation (pre-Merge)
/// - Historical reference points
block_number: u64 = 0,
/// The current block's timestamp in Unix seconds.
///
/// ## TIMESTAMP Opcode (0x42)
/// Returns seconds since Unix epoch (January 1, 1970).
/// Miners/validators can manipulate this within limits:
/// - Must be > parent timestamp
/// - Should be close to real time
///
/// ## Time Precision
/// - Pre-Merge: ~13 second blocks, loose precision
/// - Post-Merge: 12 second slots, more predictable
///
/// ## Security Note
/// Can be manipulated by miners/validators within ~15 seconds.
/// Not suitable for precise timing or as randomness source.
block_timestamp: u64 = 0,
/// The address of the block's miner/validator (beneficiary).
///
/// ## COINBASE Opcode (0x41)
/// Returns the address that receives block rewards and fees:
/// - Pre-Merge: Miner who found the block
/// - Post-Merge: Validator proposing the block
///
/// ## Special Values
/// - Zero address: Often used in tests
/// - Burn address: Some L2s burn fees
///
/// ## MEV Considerations
/// Searchers often send payments to block.coinbase for
/// transaction inclusion guarantees.
block_coinbase: Address.Address = Address.zero(),
/// Block difficulty (pre-Merge) or PREVRANDAO (post-Merge).
///
/// ## DIFFICULTY/PREVRANDAO Opcode (0x44)
/// The meaning changed at The Merge:
/// - Pre-Merge: Mining difficulty value
/// - Post-Merge: Previous block's RANDAO value
///
/// ## PREVRANDAO Usage
/// Provides weak randomness from beacon chain:
/// - NOT cryptographically secure
/// - Can be biased by validators
/// - Suitable only for non-critical randomness
///
/// ## Typical Values
/// - Pre-Merge: 10^15 to 10^16 range
/// - Post-Merge: Random 256-bit value
block_difficulty: u256 = 0,
/// Maximum gas allowed in the current block.
///
/// ## GASLIMIT Opcode (0x45)
/// Returns the total gas limit for all transactions in the block.
/// This limit is adjusted by miners/validators within protocol rules:
/// - Can change by max 1/1024 per block
/// - Target: 15M gas (100% full blocks)
/// - Max: 30M gas (200% full blocks)
///
/// ## Typical Values
/// - Mainnet: ~30,000,000
/// - Some L2s: 100,000,000+
///
/// ## EIP-1559 Impact
/// Elastic block sizes allow temporary increases to 2x target.
block_gas_limit: u64 = 0,
/// The chain identifier for replay protection.
///
/// ## CHAINID Opcode (0x46)
/// Returns the unique identifier for the current chain,
/// preventing transaction replay across different networks.
///
/// ## Common Values
/// - 1: Ethereum Mainnet
/// - 5: Goerli (deprecated)
/// - 11155111: Sepolia
/// - 137: Polygon
/// - 10: Optimism
/// - 42161: Arbitrum One
///
/// ## EIP-155
/// Introduced chain ID to prevent replay attacks where
/// signed transactions could be valid on multiple chains.
chain_id: u256 = 1,
/// The base fee per gas for the current block (EIP-1559).
///
/// ## BASEFEE Opcode (0x48)
/// Returns the minimum fee per gas that must be paid for
/// transaction inclusion. Dynamically adjusted based on
/// parent block's gas usage:
/// - Increases if blocks are >50% full
/// - Decreases if blocks are <50% full
/// - Changes by max 12.5% per block
///
/// ## Fee Calculation
/// Total fee = (base fee + priority fee) * gas used
/// Base fee is burned, priority fee goes to validator.
///
/// ## Typical Values
/// - Low congestion: 5-10 gwei
/// - Normal: 15-30 gwei  
/// - High congestion: 100+ gwei
block_base_fee: u256 = 0,
/// List of blob hashes for EIP-4844 blob transactions.
///
/// ## BLOBHASH Opcode (0x49)
/// Returns the hash of a blob at the specified index.
/// Blob transactions can include up to 6 blobs, each
/// containing ~125KB of data for L2 data availability.
///
/// ## Blob Properties
/// - Size: 4096 field elements (~125KB)
/// - Hash: KZG commitment of blob data
/// - Lifetime: ~18 days on chain
/// - Cost: Separate blob fee market
///
/// ## Empty for Non-Blob Transactions
/// Regular transactions have no blob hashes.
blob_hashes: []const u256 = &[_]u256{},
/// The base fee per blob gas for the current block (EIP-4844).
///
/// ## BLOBBASEFEE Opcode (0x4A)  
/// Returns the current base fee for blob gas, which uses
/// a separate fee market from regular transaction gas.
///
/// ## Blob Fee Market
/// - Independent from regular gas fees
/// - Target: 3 blobs per block
/// - Max: 6 blobs per block
/// - Adjusts similar to EIP-1559
///
/// ## Cost Calculation
/// Blob cost = blob_base_fee * blob_gas_used
/// Where blob_gas_used = num_blobs * 131,072
///
/// ## Typical Values
/// - Low usage: 1 wei
/// - High usage: Can spike significantly
blob_base_fee: u256 = 0,

/// Creates a new context with default values.
///
/// ## Default Values
/// - All addresses: Zero address (0x0000...0000)
/// - All numbers: 0
/// - Chain ID: 1 (Ethereum mainnet)
/// - Blob hashes: Empty array
///
/// ## Usage
/// ```zig
/// const context = Context.init();
/// // Suitable for basic testing, but usually you'll want
/// // to set more realistic values
/// ```
///
/// ## Warning
/// Default values may not be suitable for production use.
/// Consider using `init_with_values` for realistic contexts.
pub fn init() Self {
    return .{};
}

/// Creates a new context with specified values.
///
/// This constructor allows full control over all environmental
/// parameters, enabling accurate simulation of any blockchain state.
///
/// ## Parameters
/// - `tx_origin`: EOA that initiated the transaction
/// - `gas_price`: Effective gas price in wei
/// - `block_number`: Current block height
/// - `block_timestamp`: Unix timestamp in seconds
/// - `block_coinbase`: Block producer address
/// - `block_difficulty`: Difficulty or PREVRANDAO value
/// - `block_gas_limit`: Maximum gas for the block
/// - `chain_id`: Network identifier
/// - `block_base_fee`: EIP-1559 base fee
/// - `blob_hashes`: Array of blob hashes for EIP-4844
/// - `blob_base_fee`: Base fee for blob gas
///
/// ## Example
/// ```zig
/// const context = Context.init_with_values(
///     sender_address,           // tx_origin
///     20_000_000_000,          // gas_price: 20 gwei
///     18_500_000,              // block_number
///     1_700_000_000,           // block_timestamp
///     validator_address,        // block_coinbase
///     0,                       // block_difficulty (post-merge)
///     30_000_000,              // block_gas_limit
///     1,                       // chain_id: mainnet
///     15_000_000_000,          // block_base_fee: 15 gwei
///     &[_]u256{},              // blob_hashes: none
///     1,                       // blob_base_fee: minimum
/// );
/// ```
pub fn init_with_values(
    tx_origin: Address.Address,
    gas_price: u256,
    block_number: u64,
    block_timestamp: u64,
    block_coinbase: Address.Address,
    block_difficulty: u256,
    block_gas_limit: u64,
    chain_id: u256,
    block_base_fee: u256,
    blob_hashes: []const u256,
    blob_base_fee: u256,
) Self {
    return .{
        .tx_origin = tx_origin,
        .gas_price = gas_price,
        .block_number = block_number,
        .block_timestamp = block_timestamp,
        .block_coinbase = block_coinbase,
        .block_difficulty = block_difficulty,
        .block_gas_limit = block_gas_limit,
        .chain_id = chain_id,
        .block_base_fee = block_base_fee,
        .blob_hashes = blob_hashes,
        .blob_base_fee = blob_base_fee,
    };
}

/// Checks if the context represents Ethereum mainnet.
///
/// ## Returns
/// - `true` if chain_id == 1 (Ethereum mainnet)
/// - `false` for all other networks
///
/// ## Common Chain IDs
/// - 1: Ethereum Mainnet ✓
/// - 5: Goerli Testnet ✗
/// - 137: Polygon ✗
/// - 10: Optimism ✗
///
/// ## Usage
/// ```zig
/// if (context.is_eth_mainnet()) {
///     // Apply mainnet-specific logic
///     // e.g., different gas limits, precompiles
/// }
/// ```
///
/// ## Note
/// This is a convenience method. For checking other chains,
/// compare chain_id directly.
pub fn is_eth_mainnet(self: Self) bool {
    return self.chain_id == 1;
}
```
```zig [src/evm/evm.zig]
//! EVM (Ethereum Virtual Machine) module - Core execution engine
//!
//! This is the main entry point for the EVM implementation. It exports all
//! the components needed to execute Ethereum bytecode, manage state, and
//! handle the complete lifecycle of smart contract execution.
//!
//! ## Architecture Overview
//!
//! The EVM is structured into several key components:
//!
//! ### Core Execution
//! - **VM**: The main virtual machine that orchestrates execution
//! - **Frame**: Execution contexts for calls and creates
//! - **Stack**: 256-bit word stack (max 1024 elements)
//! - **Memory**: Byte-addressable memory (expands as needed)
//! - **Contract**: Code and storage management
//!
//! ### Opcodes
//! - **Opcode**: Enumeration of all EVM instructions
//! - **Operation**: Metadata about each opcode (gas, stack effects)
//! - **JumpTable**: Maps opcodes to their implementations
//! - **execution/**: Individual opcode implementations
//!
//! ### Error Handling
//! - **ExecutionError**: Unified error type for all execution failures
//! - Strongly typed errors for each component
//! - Error mapping utilities for consistent handling
//!
//! ### Utilities
//! - **CodeAnalysis**: Bytecode analysis and jump destination detection
//! - **Hardfork**: Fork-specific behavior configuration
//! - **gas_constants**: Gas cost calculations
//! - **chain_rules**: Chain-specific validation rules
//!
//! ## Usage Example
//!
//! ```zig
//! const evm = @import("evm");
//!
//! // Create a VM instance
//! var vm = try evm.Vm.init(allocator, config);
//! defer vm.deinit();
//!
//! // Execute bytecode
//! const result = try vm.run(bytecode, context);
//! ```
//!
//! ## Design Principles
//!
//! 1. **Correctness**: Strict adherence to Ethereum Yellow Paper
//! 2. **Performance**: Efficient execution with minimal allocations
//! 3. **Safety**: Strong typing and comprehensive error handling
//! 4. **Modularity**: Clear separation of concerns
//! 5. **Testability**: Extensive test coverage for all components

const std = @import("std");

// Import external modules
/// Address utilities for Ethereum addresses
pub const Address = @import("Address");

// Import all EVM modules

/// Bytecode analysis for jump destination detection
pub const CodeAnalysis = @import("contract/code_analysis.zig");

/// Contract code and storage management
pub const Contract = @import("contract/contract.zig");

/// Unified error types for EVM execution
pub const ExecutionError = @import("execution/execution_error.zig");

/// Execution result type
pub const ExecutionResult = @import("execution/execution_result.zig");

/// Execution frame/context management
pub const Frame = @import("frame.zig");

/// Ethereum hardfork configuration
pub const Hardfork = @import("hardforks/hardfork.zig");

/// Opcode to implementation mapping
pub const JumpTable = @import("jump_table/jump_table.zig");

/// Byte-addressable memory implementation
pub const Memory = @import("memory.zig");

/// EVM instruction enumeration
pub const Opcode = @import("opcodes/opcode.zig");

/// Opcode metadata (gas costs, stack effects)
pub const Operation = @import("opcodes/operation.zig");

/// 256-bit word stack implementation
pub const Stack = @import("stack/stack.zig");

/// Stack depth validation utilities
pub const stack_validation = @import("stack/stack_validation.zig");

/// Storage slot pooling for gas optimization
pub const StoragePool = @import("contract/storage_pool.zig");

/// Main virtual machine implementation
pub const Vm = @import("vm.zig");

/// EVM state management (accounts, storage, logs)
pub const EvmState = @import("state/state.zig");

/// Precompiled contracts implementation (IDENTITY, SHA256, etc.)
pub const Precompiles = @import("precompiles/precompiles.zig");

// Import execution
/// All opcode implementations (arithmetic, stack, memory, etc.)
pub const execution = @import("execution/package.zig");

// Backwards compatibility alias
pub const opcodes = execution;

// Import utility modules

/// Bit vector utilities for jump destination tracking
pub const bitvec = @import("contract/bitvec.zig");

/// Chain-specific validation rules
pub const chain_rules = @import("hardforks/chain_rules.zig");

/// EVM constants (stack size, memory limits, etc.)
pub const constants = @import("constants/constants.zig");

/// EIP-7702 EOA delegation bytecode format
pub const eip_7702_bytecode = @import("contract/eip_7702_bytecode.zig");

/// Fee market calculations (EIP-1559)
pub const fee_market = @import("fee_market.zig");

/// Gas cost constants and calculations
pub const gas_constants = @import("constants/gas_constants.zig");

/// Memory size limits and expansion rules
pub const memory_limits = @import("constants/memory_limits.zig");

// Export all error types for strongly typed error handling
///
/// These error types provide fine-grained error handling throughout
/// the EVM. Each error type corresponds to a specific failure mode,
/// allowing precise error handling and recovery strategies.

// VM error types
/// Errors from VM contract creation operations
pub const CreateContractError = Vm.CreateContractError;
pub const CallContractError = Vm.CallContractError;
pub const ConsumeGasError = Vm.ConsumeGasError;
pub const Create2ContractError = Vm.Create2ContractError;
pub const CallcodeContractError = Vm.CallcodeContractError;
pub const DelegatecallContractError = Vm.DelegatecallContractError;
pub const StaticcallContractError = Vm.StaticcallContractError;
pub const EmitLogError = Vm.EmitLogError;
pub const InitTransactionAccessListError = Vm.InitTransactionAccessListError;
pub const PreWarmAddressesError = Vm.PreWarmAddressesError;
pub const PreWarmStorageSlotsError = Vm.PreWarmStorageSlotsError;
pub const GetAddressAccessCostError = Vm.GetAddressAccessCostError;
pub const GetStorageAccessCostError = Vm.GetStorageAccessCostError;
pub const GetCallCostError = Vm.GetCallCostError;
pub const ValidateStaticContextError = Vm.ValidateStaticContextError;
pub const SetStorageProtectedError = Vm.SetStorageProtectedError;
pub const SetTransientStorageProtectedError = Vm.SetTransientStorageProtectedError;
pub const SetBalanceProtectedError = Vm.SetBalanceProtectedError;
pub const SetCodeProtectedError = Vm.SetCodeProtectedError;
pub const EmitLogProtectedError = Vm.EmitLogProtectedError;
pub const CreateContractProtectedError = Vm.CreateContractProtectedError;
pub const Create2ContractProtectedError = Vm.Create2ContractProtectedError;
pub const ValidateValueTransferError = Vm.ValidateValueTransferError;
pub const SelfdestructProtectedError = Vm.SelfdestructProtectedError;

// VM result types
/// Result of running EVM bytecode
pub const RunResult = Vm.RunResult;
/// Result of CREATE/CREATE2 operations
pub const CreateResult = Vm.CreateResult;
/// Result of CALL/DELEGATECALL/STATICCALL operations
pub const CallResult = Vm.CallResult;

// Memory error types
/// Errors from memory operations (expansion, access)
pub const MemoryError = Memory.MemoryError;

// Stack error types
/// Errors from stack operations (overflow, underflow)
pub const StackError = Stack.Error;

// Contract error types
/// General contract operation errors
pub const ContractError = Contract.ContractError;
/// Storage access errors
pub const StorageOperationError = Contract.StorageOperationError;
/// Bytecode analysis errors
pub const CodeAnalysisError = Contract.CodeAnalysisError;
/// Storage warming errors (EIP-2929)
pub const MarkStorageSlotWarmError = Contract.MarkStorageSlotWarmError;

// Access List error types (imported via import statement to avoid circular deps)
/// Access list module for EIP-2929/2930 support
const AccessListModule = @import("access_list/access_list.zig");
/// Error accessing addresses in access list
pub const AccessAddressError = AccessListModule.AccessAddressError;
/// Error accessing storage slots in access list
pub const AccessStorageSlotError = AccessListModule.AccessStorageSlotError;
/// Error pre-warming addresses
pub const PreWarmAddressesAccessListError = AccessListModule.PreWarmAddressesError;
/// Error pre-warming storage slots
pub const PreWarmStorageSlotsAccessListError = AccessListModule.PreWarmStorageSlotsError;
/// Error initializing transaction access list
pub const InitTransactionError = AccessListModule.InitTransactionError;
/// Error calculating call costs with access list
pub const GetCallCostAccessListError = AccessListModule.GetCallCostError;

// Address error types
/// Error calculating CREATE address
pub const CalculateAddressError = Address.CalculateAddressError;
/// Error calculating CREATE2 address
pub const CalculateCreate2AddressError = Address.CalculateCreate2AddressError;

// Execution error
/// Main execution error enumeration used throughout EVM
pub const ExecutionErrorEnum = ExecutionError.Error;

// Tests - run all module tests
test {
    std.testing.refAllDeclsRecursive(@This());
}
```

</rawcode>
