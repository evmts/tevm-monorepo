# The `gas.rs` Module

The `gas.rs` module in this Rust EVM implementation manages the concept of "gas" within the Ethereum network. In Ethereum, "gas" signifies the computational effort needed to execute operations, whether a simple transfer of ether or the execution of a smart contract function. Each operation carries a gas cost, and transactions must specify the maximum amount of gas they are willing to consume.

## Data Structures
- `Gas` Struct

    The `Gas` struct represents the gas state for a particular operation or transaction. The struct is defined as follows:

    ### Fields in `Gas` Struct

    - `limit`: The maximum amount of gas allowed for the operation or transaction.
    - `all_used_gas`: The total gas used, inclusive of memory expansion costs.
    - `used`: The gas used, excluding memory expansion costs.
    - `memory`: The gas used for memory expansion.
    - `refunded`: The gas refunded. Certain operations in Ethereum allow for gas refunds, up to half the gas used by a transaction.

## Methods of the `Gas` Struct

The `Gas` struct also includes several methods to manage the gas state. Here's a brief summary of their functions:

- `new`: Creates a new `Gas` instance with a specified gas limit and zero usage and refunds.
- `limit`, `memory`, `refunded`, `spend`, `remaining`: These getters return the current state of the corresponding field.
- `erase_cost`: Decreases the gas usage by a specified amount.
- `record_refund`: Increases the refunded gas by a specified amount.
- `record_cost`: Increases the used gas by a specified amount. It also checks for gas limit overflow. If the new total used gas would exceed the gas limit, it returns `false` and doesn't change the state.
- `record_memory`: This method works similarly to `record_cost`, but specifically for memory expansion gas. It only updates the state if the new memory gas usage is greater than the current usage.
- `gas_refund`: Increases the refunded gas by a specified amount.

