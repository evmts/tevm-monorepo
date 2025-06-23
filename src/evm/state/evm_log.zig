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
const EvmLog = @This();

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
