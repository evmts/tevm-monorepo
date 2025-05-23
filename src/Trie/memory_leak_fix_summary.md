# Memory Leak Fix Summary for Trie Implementation

## Issues Identified

### 1. HashMap Key Memory Leaks
- **Problem**: `bytesToHexString` creates new allocations for hash strings used as HashMap keys
- **Impact**: These keys were never freed when nodes were replaced, deleted, or the HashMap was cleared
- **Locations**: Throughout the code where `nodes.put(hash_str, node)` was called

### 2. Missing Key Cleanup in deinit/reset
- **Problem**: Only node values were being freed, not the HashMap keys
- **Impact**: Every hash string key remained allocated after cleanup

### 3. Node Replacement Without Cleanup
- **Problem**: When updating nodes, old nodes were replaced without freeing their HashMap keys
- **Impact**: Memory accumulation over time as nodes were updated

## Solutions Implemented

### 1. Fixed deinit() and reset() Methods
```zig
// Now properly frees both keys and values
var it = self.nodes.iterator();
while (it.next()) |entry| {
    // Free the hash key string
    self.allocator.free(entry.key_ptr.*);
    // Deinit the node
    var node = entry.value_ptr.*;
    node.deinit(self.allocator);
}
```

### 2. Added storeNode() Helper Method
- Centralizes node storage logic
- Properly handles replacing existing nodes
- Uses `fetchRemove` to get and remove old entries atomically
- Frees both old keys and old nodes before storing new ones

### 3. Updated All Node Storage Patterns
- Replaced direct `nodes.put()` calls with `storeNode()`
- Ensures consistent memory management across all operations
- Returns a copy of the hash string for caller to manage

## Key Changes

1. **storeNode() method** (lines 54-73):
   - Checks for existing nodes with `fetchRemove`
   - Frees old key and node if replacing
   - Stores new node with proper ownership

2. **Updated insert()** (lines 75-102):
   - Uses `storeNode()` for proper memory management
   - Frees temporary hash strings after use

3. **Updated delete()** (lines 122-149):
   - Uses `storeNode()` for result nodes
   - Properly manages temporary allocations

4. **Updated all update() paths**:
   - Every place that stores a node now uses `storeNode()`
   - Ensures no hash string keys are leaked

## Memory Ownership Model

1. **HashMap owns its keys**: When a key-value pair is stored, the HashMap takes ownership of the key string
2. **Temporary hash strings**: Created with `bytesToHexString` for lookups are freed after use with `defer`
3. **Node replacement**: Old keys and nodes are freed before new ones are stored
4. **Cleanup**: Both `deinit()` and `reset()` free all keys and nodes

## Testing Recommendations

1. Run with memory leak detection tools
2. Test with large datasets and many updates
3. Verify proof generation and verification still works correctly
4. Check that memory usage remains stable over time

## Next Steps

1. Replace the original `hash_builder.zig` with this fixed version
2. Run all tests to ensure functionality is preserved
3. Monitor memory usage in production scenarios
4. Consider adding memory usage tests