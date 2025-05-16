/// Represents the type of call being made
pub const CallScheme = enum {
    Call,        // Regular call
    CallCode,    // Like call but only the code is used
    DelegateCall,// Like callcode but with sender and value from parent
    StaticCall,  // Cannot modify state
};