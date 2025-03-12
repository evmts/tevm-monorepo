import { describe, expect, it } from 'vitest'
import { genTxTrie } from './genTxTrie.js'
import { KECCAK256_RLP } from '@tevm/utils'

describe('genTxTrie', () => {
  it('should return KECCAK256_RLP for empty transactions', async () => {
    const mockBlock = {
      transactions: []
    }
    
    const result = await genTxTrie(mockBlock as any)
    
    expect(result).toBe(KECCAK256_RLP)
  })
  
  // Note: Additional tests would be useful but are complex due to
  // difficulties in mocking Trie and Rlp in Bun's Vitest environment
})