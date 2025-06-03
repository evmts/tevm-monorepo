# WebUI Library for Zig

This directory contains a modular implementation of the WebUI library for Zig, which provides a modern web UI framework using web technologies for desktop applications.

> **Note:** This implementation was originally forked from [webui-dev/zig-webui](https://github.com/webui-dev/zig-webui) and has been refactored into a modular structure for improved maintainability and organization. We get better discoverability by ai tooling and we can customize anything to our liking.

## Overview

WebUI is a lightweight library that allows you to build desktop applications using web technologies (HTML, CSS, JavaScript) for the frontend while keeping your application logic in Zig. Instead of embedding a web engine, WebUI uses the user's existing web browser as the GUI, making your application extremely lightweight and portable.

Key features:
- **Lightweight**: No embedded browser engine - uses the system's existing browser
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Multiple browser support**: Chrome, Firefox, Edge, Safari, and more
- **WebView support**: Can also use native WebView when needed
- **Two-way communication**: Call Zig functions from JavaScript and vice versa
- **Type-safe bindings**: Automatic type conversion between JavaScript and Zig
- **File serving**: Built-in web server with custom file handling
- **Multi-client support**: Handle multiple browser connections
- **No runtime dependencies**: Just needs a web browser

## Directory Structure

```
src/ui/webui/
├── webui.zig         # Main module that combines all functionality
├── types.zig         # Common types, enums, and constants
├── event.zig         # Event handling and event-related functions
├── window.zig        # Window creation and management
├── binding.zig       # Function binding and type conversion
├── file_handler.zig  # File serving and custom handlers
├── javascript.zig    # JavaScript execution and runtime
├── config.zig        # Configuration and browser settings
├── utils.zig         # Utility functions (encoding, memory, etc.)
├── flags.zig         # Build configuration flags
└── README.md         # This file
```

## Module Descriptions

### webui.zig
The main entry point that combines all modules using `usingnamespace`. This provides a unified interface to all WebUI functionality.

```zig
const webui = @import("webui/webui.zig");
const window = webui.newWindow();
```

### types.zig
Defines all common types used across the library:
- `WebUIError` - Error types for various operations
- `Browser` - Supported browser types (Chrome, Firefox, Edge, etc.)
- `Runtime` - JavaScript runtime options (Deno, NodeJS, Bun)
- `EventKind` - Event types (connected, disconnected, mouse click, etc.)
- `Config` - Configuration options
- Version constants and limits

### event.zig
Handles all event-related functionality:
- `Event` struct with methods for:
  - Getting event data (`getInt`, `getString`, `getBool`, etc.)
  - Returning values to JavaScript (`returnInt`, `returnString`, etc.)
  - Client-specific operations (`showClient`, `closeClient`, etc.)
  - Automatic type conversion with `returnValue`

Example:
```zig
fn myHandler(e: *webui.Event) void {
    const name = e.getString();
    std.debug.print("Hello, {s}!\n", .{name});
    e.returnString("Response from Zig!");
}
```

### window.zig
Manages window creation and lifecycle:
- Window creation (`newWindow`, `newWindowWithId`)
- Display methods (`show`, `showBrowser`, `showWv`)
- Window properties (`setSize`, `setPosition`, `setIcon`)
- Navigation and state (`navigate`, `close`, `destroy`)
- Global functions (`wait`, `exit`, `clean`)

Example:
```zig
var window = webui.newWindow();
window.setSize(800, 600);
try window.show("index.html");
webui.wait();
```

### binding.zig
Provides function binding with automatic type conversion:
- Basic binding with `bind`
- Advanced binding with `binding` (automatic parameter conversion)
- Interface binding for low-level control
- Context management for passing user data

Example with automatic type conversion:
```zig
fn calculate(a: i32, b: i32, e: *webui.Event) void {
    const result = a + b;
    e.returnInt(result);
}

try window.binding("calculate", calculate);
```

### file_handler.zig
Manages file serving and custom handlers:
- Set root folders for file serving
- Custom file handlers for dynamic content
- Response handling for async operations

Example:
```zig
fn customHandler(filename: []const u8) ?[]const u8 {
    if (std.mem.eql(u8, filename, "data.json")) {
        return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"data\": \"value\"}";
    }
    return null;
}

window.setFileHandler(customHandler);
```

### javascript.zig
Handles JavaScript execution and interaction:
- Run JavaScript without waiting (`run`)
- Run JavaScript and get response (`script`)
- Set JavaScript runtime (`setRuntime`)
- Send raw data to UI (`sendRaw`)
- Client-specific JavaScript operations

Example:
```zig
// Run JavaScript
window.run("console.log('Hello from Zig!')");

// Get JavaScript result
var buffer: [256]u8 = undefined;
try window.script("return document.title", 0, &buffer);
```

### config.zig
Configuration and browser management:
- Global configuration (`setConfig`)
- Event blocking settings
- Timeout configuration
- Browser detection
- Proxy settings

Example:
```zig
webui.setConfig(.multi_client, true);
webui.setTimeout(30); // 30 seconds timeout
```

### utils.zig
Utility functions for various operations:
- Base64 encoding/decoding
- Memory management
- MIME type detection
- TLS certificate configuration
- Error information retrieval

Example:
```zig
const encoded = try webui.encode("Hello, World!");
defer webui.free(encoded);
```

### flags.zig
Build configuration flags:
- `enableTLS` - Enable TLS support (requires webui-2-secure library)

## API Reference

### Window Management

#### `newWindow() Webui`
Creates a new WebUI window instance.

```zig
const window = webui.newWindow();
```

**Returns:** A new `Webui` window instance
**Errors:** None

---

#### `newWindowWithId(id: usize) !Webui`
Creates a new window with a specific ID.

```zig
const window = try webui.newWindowWithId(5);
```

**Parameters:**
- `id`: Window ID (must be between 1 and `WEBUI_MAX_IDS`)

**Returns:** A new `Webui` window instance
**Errors:** `WebUIError.CreateWindowError` if ID is invalid

---

#### `show(content: [:0]const u8) !void`
Shows a window with HTML content or file path.

```zig
// Show HTML content
try window.show("<html><body><h1>Hello</h1></body></html>");

// Show file
try window.show("index.html");
```

**Parameters:**
- `content`: HTML string or file path (null-terminated)

**Errors:** `WebUIError.ShowError` if window cannot be shown

---

#### `showBrowser(content: [:0]const u8, browser: Browser) !void`
Shows window using a specific browser.

```zig
try window.showBrowser("index.html", .Chrome);
```

**Parameters:**
- `content`: HTML string or file path
- `browser`: Browser enum value

**Errors:** `WebUIError.ShowError` if browser is not available

---

#### `setSize(width: u32, height: u32) void`
Sets the window size.

```zig
window.setSize(800, 600);
```

**Parameters:**
- `width`: Window width in pixels
- `height`: Window height in pixels

---

#### `setPosition(x: u32, y: u32) void`
Sets the window position on screen.

```zig
window.setPosition(100, 100);
```

**Parameters:**
- `x`: X coordinate
- `y`: Y coordinate

---

#### `close() void`
Closes the window (keeps the window object).

```zig
window.close();
```

---

#### `destroy() void`
Closes the window and frees all resources.

```zig
window.destroy();
```

---

### Event Handling

#### `bind(element: [:0]const u8, callback: fn(e: *Event) void) !usize`
Binds a function to an HTML element event.

```zig
fn handleClick(e: *webui.Event) void {
    std.debug.print("Button clicked!\n", .{});
    e.returnString("Click processed");
}

try window.bind("myButton", handleClick);
```

**Parameters:**
- `element`: HTML element ID or empty string for all events
- `callback`: Function to call when event fires

**Returns:** Bind ID
**Errors:** `WebUIError.BindError` if binding fails

---

#### `binding(element: [:0]const u8, callback: anytype) !usize`
Advanced binding with automatic type conversion.

```zig
fn calculate(x: i32, y: i32, e: *webui.Event) void {
    e.returnInt(x + y);
}

try window.binding("calculate", calculate);
```

**JavaScript:**
```javascript
const result = await webui.calculate(10, 20);
console.log(result); // 30
```

**Supported parameter types:**
- `i32`, `i64`, `u32`, etc. - Integer types
- `f32`, `f64` - Floating point types
- `bool` - Boolean values
- `[:0]const u8` - Null-terminated strings
- `[*]const u8` - Raw byte pointers
- `*webui.Event` - Event object

---

### Event Object Methods

#### `getString() [:0]const u8`
Gets the first argument as a string.

```zig
fn handler(e: *webui.Event) void {
    const name = e.getString();
    std.debug.print("Name: {s}\n", .{name});
}
```

---

#### `getInt() i64`
Gets the first argument as an integer.

```zig
const value = e.getInt();
```

---

#### `getFloat() f64`
Gets the first argument as a float.

```zig
const value = e.getFloat();
```

---

#### `getBool() bool`
Gets the first argument as a boolean.

```zig
const isActive = e.getBool();
```

---

#### `getStringAt(index: usize) [:0]const u8`
Gets an argument at a specific index as a string.

```zig
const arg1 = e.getStringAt(0);
const arg2 = e.getStringAt(1);
```

---

#### `returnString(value: [:0]const u8) void`
Returns a string value to JavaScript.

```zig
e.returnString("Operation completed");
```

---

#### `returnInt(value: i64) void`
Returns an integer value to JavaScript.

```zig
e.returnInt(42);
```

---

#### `returnBool(value: bool) void`
Returns a boolean value to JavaScript.

```zig
e.returnBool(true);
```

---

#### `returnValue(value: anytype) void`
Automatically returns any supported type.

```zig
e.returnValue("text");     // String
e.returnValue(123);        // Integer
e.returnValue(3.14);       // Float
e.returnValue(true);       // Boolean
```

---

### JavaScript Execution

#### `run(script: [:0]const u8) void`
Executes JavaScript without waiting for result.

```zig
window.run("console.log('Hello from Zig!')");
window.run("document.body.style.backgroundColor = 'blue'");
```

**Parameters:**
- `script`: JavaScript code to execute

---

#### `script(script: [:0]const u8, timeout: usize, buffer: []u8) !void`
Executes JavaScript and gets the result.

```zig
var buffer: [1024]u8 = undefined;
try window.script("return document.title", 0, &buffer);
std.debug.print("Title: {s}\n", .{buffer});
```

**Parameters:**
- `script`: JavaScript code (should return a value)
- `timeout`: Timeout in seconds (0 = no timeout)
- `buffer`: Buffer to store the result

**Errors:** `WebUIError.ScriptError` if execution fails

---

### File Handling

#### `setRootFolder(path: [:0]const u8) !void`
Sets the root folder for serving files.

```zig
try window.setRootFolder("./public");
```

**Parameters:**
- `path`: Path to root folder

**Errors:** `WebUIError.GenericError` if path is invalid

---

#### `setFileHandler(handler: fn(filename: []const u8) ?[]const u8) void`
Sets a custom file handler.

```zig
fn myHandler(filename: []const u8) ?[]const u8 {
    if (std.mem.eql(u8, filename, "api/data")) {
        return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"data\": 123}";
    }
    return null; // Use default file serving
}

window.setFileHandler(myHandler);
```

**Handler returns:**
- Full HTTP response with headers and body
- `null` to use default file serving

---

### Configuration

#### `setConfig(option: Config, status: bool) void`
Sets global WebUI configuration.

```zig
// Allow multiple clients
webui.setConfig(.multi_client, true);

// Process events in blocking mode
webui.setConfig(.ui_event_blocking, true);

// Enable folder monitoring
webui.setConfig(.folder_monitor, true);
```

**Config options:**
- `.show_wait_connection` - Wait for connection before show() returns
- `.ui_event_blocking` - Process events synchronously
- `.folder_monitor` - Auto-refresh on file changes
- `.multi_client` - Allow multiple browser connections
- `.use_cookies` - Use authentication cookies

---

#### `setTimeout(seconds: usize) void`
Sets the connection timeout.

```zig
webui.setTimeout(30); // 30 seconds
webui.setTimeout(0);  // No timeout
```

---

#### `setEventBlocking(status: bool) void`
Sets event blocking for a specific window.

```zig
window.setEventBlocking(true);
```

---

### Utility Functions

#### `wait() void`
Blocks until all windows are closed.

```zig
webui.wait(); // Main event loop
```

---

#### `exit() void`
Closes all windows and breaks the wait loop.

```zig
webui.exit();
```

---

#### `clean() void`
Frees all resources (call at program end).

```zig
defer webui.clean();
```

---

#### `encode(str: [:0]const u8) ![]u8`
Base64 encodes a string.

```zig
const encoded = try webui.encode("Hello");
defer webui.free(encoded);
```

**Returns:** Allocated buffer with encoded data
**Errors:** `WebUIError.EncodeError` if encoding fails

---

#### `decode(str: [:0]const u8) ![]u8`
Base64 decodes a string.

```zig
const decoded = try webui.decode("SGVsbG8=");
defer webui.free(decoded);
```

**Returns:** Allocated buffer with decoded data
**Errors:** `WebUIError.DecodeError` if decoding fails

---

### Browser Detection

#### `browserExist(browser: Browser) bool`
Checks if a browser is installed.

```zig
if (webui.browserExist(.Chrome)) {
    std.debug.print("Chrome is installed\n", .{});
}
```

**Browser enum values:**
- `.NoBrowser`
- `.AnyBrowser`
- `.Chrome`
- `.Firefox`
- `.Edge`
- `.Safari`
- `.Chromium`
- `.Opera`
- `.Brave`
- `.Vivaldi`
- `.Epic`
- `.Yandex`
- `.ChromiumBased`

---

### WebView Support

#### `showWv(content: [:0]const u8) !void`
Shows window using native WebView.

```zig
try window.showWv("index.html");
```

**Platform support:**
- Windows: WebView2
- macOS: WKWebView
- Linux: GTK WebView

---

## Complete Example

Here's a complete example showing various WebUI features:

```zig
const std = @import("std");
const webui = @import("webui/webui.zig");

// Event handlers
fn onConnect(e: *webui.Event) void {
    std.debug.print("Client connected\n", .{});
}

fn greet(name: [:0]const u8, e: *webui.Event) void {
    var buffer: [256]u8 = undefined;
    const greeting = std.fmt.bufPrintZ(&buffer, "Hello, {s}!", .{name}) catch return;
    e.returnString(greeting);
}

fn calculate(a: i32, b: i32, operation: [:0]const u8, e: *webui.Event) void {
    const result = if (std.mem.eql(u8, operation, "add"))
        a + b
    else if (std.mem.eql(u8, operation, "multiply"))
        a * b
    else
        0;

    e.returnInt(result);
}

pub fn main() !void {
    // Initialize
    var window = webui.newWindow();
    defer webui.clean();

    // Configure
    webui.setConfig(.multi_client, false);
    window.setSize(800, 600);

    // Bind functions
    _ = try window.bind("", onConnect);
    _ = try window.binding("greet", greet);
    _ = try window.binding("calculate", calculate);

    // HTML content
    const html =
        \\<!DOCTYPE html>
        \\<html>
        \\<head>
        \\    <title>WebUI Example</title>
        \\    <style>
        \\        body { font-family: Arial, sans-serif; padding: 20px; }
        \\        input, button { margin: 5px; padding: 5px; }
        \\    </style>
        \\</head>
        \\<body>
        \\    <h1>WebUI + Zig Example</h1>
        \\
        \\    <div>
        \\        <input id="nameInput" placeholder="Enter name">
        \\        <button onclick="greetUser()">Greet</button>
        \\        <div id="greeting"></div>
        \\    </div>
        \\
        \\    <div>
        \\        <input id="num1" type="number" value="10">
        \\        <input id="num2" type="number" value="20">
        \\        <button onclick="doCalc('add')">Add</button>
        \\        <button onclick="doCalc('multiply')">Multiply</button>
        \\        <div id="result"></div>
        \\    </div>
        \\
        \\    <script>
        \\        async function greetUser() {
        \\            const name = document.getElementById('nameInput').value;
        \\            const response = await webui.greet(name);
        \\            document.getElementById('greeting').innerText = response;
        \\        }
        \\
        \\        async function doCalc(op) {
        \\            const a = parseInt(document.getElementById('num1').value);
        \\            const b = parseInt(document.getElementById('num2').value);
        \\            const result = await webui.calculate(a, b, op);
        \\            document.getElementById('result').innerText = `Result: ${result}`;
        \\        }
        \\    </script>
        \\</body>
        \\</html>
    ;

    // Show window and wait
    try window.show(html);
    webui.wait();
}
```

## Usage Examples

### Basic Window Application
```zig
const std = @import("std");
const webui = @import("webui/webui.zig");

pub fn main() !void {
    var window = webui.newWindow();
    defer webui.clean();

    try window.show("<html><body><h1>Hello WebUI!</h1></body></html>");
    webui.wait();
}
```

### Application with Event Handling
```zig
const std = @import("std");
const webui = @import("webui/webui.zig");

fn buttonClick(e: *webui.Event) void {
    std.debug.print("Button clicked!\n", .{});
    e.returnString("Button click handled!");
}

pub fn main() !void {
    var window = webui.newWindow();
    defer webui.clean();

    try window.bind("myButton", buttonClick);

    const html =
        \\<html>
        \\<body>
        \\  <button id="myButton" onclick="webui.myButton().then(r => alert(r))">
        \\    Click me!
        \\  </button>
        \\</body>
        \\</html>
    ;

    try window.show(html);
    webui.wait();
}
```

### Advanced Type Conversion
```zig
// The binding system automatically converts JavaScript arguments to Zig types
fn processData(name: [:0]const u8, age: i32, active: bool, e: *webui.Event) void {
    std.debug.print("Name: {s}, Age: {}, Active: {}\n", .{name, age, active});
    e.returnString("Data processed!");
}

try window.binding("processData", processData);
```

### Custom File Handler
```zig
fn serveFiles(filename: []const u8) ?[]const u8 {
    // Serve dynamic content based on filename
    if (std.mem.eql(u8, filename, "api/data")) {
        return "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\": \"ok\"}";
    }
    // Return null to use default file serving
    return null;
}

window.setFileHandler(serveFiles);
```

## C Bindings

Each module contains the relevant C function declarations alongside their Zig wrappers. This co-location makes it easy to understand the relationship between the C API and the Zig interface.

## Error Handling

Most functions that can fail return WebUI errors. Always handle these appropriately:
```zig
window.show("index.html") catch |err| {
    std.debug.print("Failed to show window: {}\n", .{err});
    return err;
};
```

## Thread Safety

WebUI handles threading internally. You can configure event handling behavior:
```zig
// Process events one at a time (blocking)
window.setEventBlocking(true);

// Or globally for all windows
webui.setConfig(.ui_event_blocking, true);
```

## Memory Management

WebUI manages most memory internally. For functions that return allocated memory (like `encode`/`decode`), use `webui.free()` to deallocate:
```zig
const encoded = try webui.encode("data");
defer webui.free(encoded);
```