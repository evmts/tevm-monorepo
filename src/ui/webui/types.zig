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
    no_browser = 0,
    /// 1. Default recommended web browser
    any_browser,
    /// 2. Google Chrome
    chrome,
    /// 3. Mozilla Firefox
    firefox,
    /// 4. Microsoft Edge
    edge,
    /// 5. Apple Safari
    safari,
    /// 6. The Chromium Project
    chromium,
    /// 7. Opera Browser
    opera,
    /// 8. The Brave Browser
    brave,
    /// 9. The Vivaldi Browser
    vivaldi,
    /// 10. The Epic Browser
    epic,
    /// 11. The Yandex Browser
    yandex,
    /// 12. Any Chromium based browser
    chromium_based,
    /// 13. WebView (Non-web-browser)
    webview,
};

pub const Runtime = enum(usize) {
    /// 0. Prevent WebUI from using any runtime for .js and .ts files
    none = 0,
    /// 1. Use Deno runtime for .js and .ts files
    deno,
    /// 2. Use Nodejs runtime for .js files
    nodejs,
    /// 3. Use Bun runtime for .js and .ts files
    bun,
};

pub const EventKind = enum(usize) {
    /// 0. Window disconnection event
    event_disconnected = 0,
    /// 1. Window connection event
    event_connected,
    /// 2. Mouse click event
    event_mouse_click,
    /// 3. Window navigation event
    event_navigation,
    /// 4. Function call event
    event_callback,
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
