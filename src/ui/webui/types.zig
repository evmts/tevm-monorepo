const std = @import("std");

pub const WebUIError = error{
    // WebUI does not currently provide any information as to what caused errors
    // in most functions, instead we will just return a GenericError
    GenericError,
    /// this present create window new id failed
    CreateWindowError,
    /// this present bind element with callback failed
    BindError,
    /// show window failed
    ShowError,
    /// start server failed(like show, but no window)
    ServerError,
    /// encode failed
    EncodeError,
    /// decode failed
    DecodeError,
    /// get url failed
    UrlError,
    /// get process info failed
    ProcessError,
    /// get HWND failed, this is only occur on MS window
    HWNDError,
    /// get or set windows listening prot failed
    PortError,
    /// run javascript failed
    ScriptError,
    /// allocate memory failed
    AllocateFailed,
};

/// webui error wrapper
pub const WebUIErrorInfo = struct {
    num: i32,
    msg: [:0]const u8,
};

pub const Browser = enum(usize) {
    /// 0. No web browser
    NoBrowser = 0,
    /// 1. Default recommended web browser
    AnyBrowser,
    /// 2. Google Chrome
    Chrome,
    /// 3. Mozilla Firefox
    Firefox,
    /// 4. Microsoft Edge
    Edge,
    /// 5. Apple Safari
    Safari,
    /// 6. The Chromium Project
    Chromium,
    /// 7. Opera Browser
    Opera,
    /// 8. The Brave Browser
    Brave,
    /// 9. The Vivaldi Browser
    Vivaldi,
    /// 10. The Epic Browser
    Epic,
    /// 11. The Yandex Browser
    Yandex,
    /// 12. Any Chromium based browser
    ChromiumBased,
    /// 13. WebView (Non-web-browser)
    Webview,
};

pub const Runtime = enum(usize) {
    /// 0. Prevent WebUI from using any runtime for .js and .ts files
    None = 0,
    /// 1. Use Deno runtime for .js and .ts files
    Deno,
    /// 2. Use Nodejs runtime for .js files
    NodeJS,
    /// 3. Use Bun runtime for .js and .ts files
    Bun,
};

pub const EventKind = enum(usize) {
    /// 0. Window disconnection event
    EVENT_DISCONNECTED = 0,
    /// 1. Window connection event
    EVENT_CONNECTED,
    /// 2. Mouse click event
    EVENT_MOUSE_CLICK,
    /// 3. Window navigation event
    EVENT_NAVIGATION,
    /// 4. Function call event
    EVENT_CALLBACK,
};

pub const Config = enum(c_int) {
    /// Control if `show()`,`c.webui_show_browser`,`c.webui_show_wv` should wait
    /// for the window to connect before returns or not.
    /// Default: True
    show_wait_connection = 0,
    /// Control if WebUI should block and process the UI events
    /// one a time in a single thread `True`, or process every
    /// event in a new non-blocking thread `False`. This updates
    /// all windows. You can use `setEventBlocking()` for
    /// a specific single window update.
    /// Default: False
    ui_event_blocking = 1,
    /// Automatically refresh the window UI when any file in the
    /// root folder gets changed.
    /// Default: False
    folder_monitor,
    /// Allow or prevent WebUI from adding `webui_auth` cookies.
    /// WebUI uses these cookies to identify clients and block
    /// unauthorized access to the window content using a URL.
    /// Please keep this option to `True` if you want only a single
    /// client to access the window content.
    /// Default: True
    multi_client,
    /// Allow multiple clients to connect to the same window,
    /// This is helpful for web apps (non-desktop software),
    /// Please see the documentation for more details.
    /// Default: True
    use_cookies,
};

// Version information
pub const WEBUI_VERSION: std.SemanticVersion = .{
    .major = 2,
    .minor = 5,
    .patch = 0,
    .pre = "beta.2",
};

/// Max windows, servers and threads
pub const WEBUI_MAX_IDS = 256;

/// Max allowed argument's index
pub const WEBUI_MAX_ARG = 16;
