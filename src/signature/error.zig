/// Errors that can occur during signature operations
pub const SignatureError = error{
    /// Signature is malformed or invalid
    InvalidSignature,
    /// Provided data is too short
    DataTooShort,
    /// s value is not in the lower half of the curve order
    InvalidS,
    /// v value is not 0, 1, 27 or 28
    InvalidV,
    /// Invalid hex string
    InvalidHex,
    /// Public key recovery failed
    RecoveryFailed,
};