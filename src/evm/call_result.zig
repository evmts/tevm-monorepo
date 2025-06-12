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
pub const CallResult = @This();

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
