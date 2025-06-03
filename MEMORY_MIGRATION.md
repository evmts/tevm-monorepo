# Memory Module Migration Plan

## Problem Summary

The current Memory implementation has several architectural issues that can lead to memory leaks:

1. **Self-referential pointer design**: The `root_ptr` field creates a circular reference that's fragile when Memory structs are copied
2. **Untracked child contexts**: Child contexts are returned by value with no tracking mechanism
3. **Missing cleanup**: If child contexts aren't properly reverted/committed, memory leaks occur
4. **Value type semantics**: Memory is a value type that gets copied, breaking the self-referential pointer

## Solution Architecture

We've implemented a new `ArenaMemory` that fixes these issues:

1. **Arena allocator pattern**: All memory is managed through a single arena allocator
2. **Context stack**: Child contexts are tracked in a stack within the arena
3. **RAII cleanup**: The arena automatically cleans up all memory on deinitialization
4. **No self-referential pointers**: Clean ownership model without circular references

## Migration Steps

### Phase 1: Compatibility Layer (COMPLETED)
- ✅ Created `ArenaMemory` implementation
- ✅ Created `MemoryV2` compatibility wrapper
- ✅ Both maintain the same public interface as the original Memory

### Phase 2: Gradual Migration (IN PROGRESS)
1. Update Frame to optionally use MemoryV2
2. Add feature flag to switch between Memory implementations
3. Migrate tests one by one to use MemoryV2
4. Update VM to use MemoryV2 for new contexts

### Phase 3: Complete Migration
1. Replace all Memory usage with MemoryV2
2. Remove the original Memory implementation
3. Rename MemoryV2 to Memory
4. Remove compatibility layer

## Usage Example

```zig
// Old way (leaks if not careful)
var mem = try Memory.init_default(allocator);
mem.finalize_root(); // Easy to forget
defer mem.deinit();

// New way (no leaks)
var mem = try MemoryV2.init_default(allocator);
defer mem.deinit(); // That's it!
```

## Benefits

1. **No memory leaks**: Arena allocator ensures all memory is freed
2. **Simpler API**: No need for finalize_root()
3. **Better performance**: Less pointer chasing, better cache locality
4. **Thread-safe design**: Could be made concurrent-safe in the future
5. **Clear ownership**: No ambiguity about who owns what memory

## Testing

The ArenaMemory has been tested with:
- All existing Memory test cases (adapted)
- Memory leak detection tests
- Stress tests with nested contexts
- Edge case handling

## Next Steps

1. Update Frame to use MemoryV2 behind a compile-time flag
2. Run full test suite with MemoryV2
3. Performance benchmarks comparing both implementations
4. Gradual rollout to production code