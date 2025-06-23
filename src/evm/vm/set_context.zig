const Context = @import("../access_list/context.zig");
const Vm = @import("../vm.zig");

/// Update the transaction and block context for the VM.
/// This updates the context stored in the access list which is used for
/// pre-warming addresses according to EIP-2929.
///
/// @param context The new context to use for subsequent operations
///
/// Example:
/// ```zig
/// const new_context = Context.init_with_values(
///     sender_address,
///     gas_price,
///     block_number,
///     block_timestamp,
///     coinbase_address,
///     difficulty,
///     gas_limit,
///     chain_id,
///     base_fee,
///     blob_hashes,
///     blob_base_fee,
/// );
/// vm.set_context(new_context);
/// ```
pub fn set_context(self: *Vm, context: Context) void {
    self.context = context;
    self.access_list.context = context;
}