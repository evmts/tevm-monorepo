import { describe, it, expect } from 'vitest'
import { Block } from '@tevm/block'
import { createCommon } from '@tevm/common'
import { mainnet } from 'viem/chains'
import { EthjsAddress } from '@tevm/utils'

describe('@tevm/block', () => {
  describe('Block Class', () => {
    it('should create a new block', () => {
      const block = new Block({
        common: createCommon({ ...mainnet })
      })
      expect(block).toBeDefined()
    })

    it('should create a block from block data', () => {
      const common = createCommon({ ...mainnet })

      const blockData = {
        header: {
          parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
          coinbase: EthjsAddress.fromString('0x0000000000000000000000000000000000000000'),
          stateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
          transactionsTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
          receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
          logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          difficulty: 0n,
          number: 0n,
          gasLimit: 30000000n,
          gasUsed: 0n,
          timestamp: BigInt(Math.floor(Date.now() / 1000)),
          extraData: '0x',
          mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          nonce: '0x0000000000000000',
          baseFeePerGas: 1000000000n
        }
      }

      const block = Block.fromBlockData(blockData, { common })
      expect(block).toBeDefined()
    })

    it('should create a block from RLP-serialized data', () => {
      const common = createCommon({ ...mainnet })
      const serializedBlock = new Uint8Array([/* example data would go here */])
      const block = Block.fromRLPSerializedBlock(serializedBlock, { common })
      expect(block).toBeDefined()
    })

    it('should create a block from values array', () => {
      const common = createCommon({ ...mainnet })
      const values = [] // example values would go here
      const block = Block.fromValuesArray(values, { common })
      expect(block).toBeDefined()
    })
  })

  describe('Instance Methods', () => {
    it('should get block hash', () => {
      const common = createCommon({ ...mainnet })
      const block = new Block({ common })
      const hash = block.hash()
      expect(hash).toBeDefined()
    })

    it('should serialize block', () => {
      const common = createCommon({ ...mainnet })
      const block = new Block({ common })
      const serialized = block.serialize()
      expect(serialized).toBeDefined()
    })

    it('should convert block to JSON', () => {
      const common = createCommon({ ...mainnet })
      const block = new Block({ common })
      const json = block.toJSON()
      expect(json).toBeDefined()
    })
  })
})