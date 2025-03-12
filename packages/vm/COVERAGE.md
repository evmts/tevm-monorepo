# Test Coverage Status

## Files with Good Test Coverage

1. deepCopy.js - 100% coverage
2. generateTxResult.ts - 100% line and function coverage, 59.52% branch coverage
3. runTx.ts - 100% line coverage, 68.42% branch coverage
4. validateRunTx.js - 100% coverage
5. Several other utility and helper files with 100% coverage

## Files with Tests Added

We've restored and fixed the following test files:

1. accumulateParentBlockHash.spec.ts - Tests added but requires Vitest
2. genTxTrie.spec.ts - Tests added but requires Vitest
3. deepCopy.spec.ts - Now fully tested
4. runBlock.spec.ts - Basic tests added but more needed

## Known Issues

1. **Testing Framework Incompatibility**: Some tests use `vi.mock()` which works in Vitest but not in Bun's test runner. These tests include:
   - accumulateParentBlockHash.spec.ts
   - genTxTrie.spec.ts
   - generateTxResult.spec.ts

2. **MaxListenersExceededWarning**: Warning appears in runTx tests due to multiple EVM instances being created

3. **Complex Mocking Requirements**: Some functions are tightly coupled to ethereumjs internals, making them difficult to test:
   - accumulateParentBlockHash.ts
   - applyDAOHardfork.ts
   - applyTransactions.ts 
   - genTxTrie.ts

## Files Needing Additional Test Coverage

These files still need better test coverage:
- accumulateParentBlockHash.ts
- applyBlock.ts
- applyDAOHardfork.ts
- applyTransactions.ts
- assignWithdrawals.ts 
- genTxTrie.ts
- runBlock.ts

## Future Work

To improve test coverage:
1. Refactor tests to work with both Vitest and Bun test runners
2. Fix the MaxListenersExceededWarning issue
3. Implement more comprehensive tests for low-coverage files
4. Consider a mock strategy that doesn't rely on vi.mock

