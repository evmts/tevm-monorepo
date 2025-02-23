import { describe, it, expect, vi } from 'vitest'
import { createTevmNode } from 'tevm'
import { Contract } from 'tevm/contract'
import { createMemoryClient } from 'tevm'

describe('Debugger UI', () => {
  describe('EVMDebugger Component', () => {
    it('should track execution steps', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const steps: any[] = []

      // Setup event listener
      vm.evm.events?.on('step', (step, next) => {
        steps.push({
          pc: step.pc,
          opcode: step.opcode.name,
          gasLeft: step.gasLeft,
          stack: step.stack
        })
        next?.()
      })

      // Execute a transaction
      await vm.runTx({
        tx: {
          to: '0x1234567890123456789012345678901234567890',
          data: '0x',
          value: 1000000000000000000n
        }
      })

      expect(steps.length).toBeGreaterThan(0)
      expect(steps[0]).toHaveProperty('pc')
      expect(steps[0]).toHaveProperty('opcode')
      expect(steps[0]).toHaveProperty('gasLeft')
    })

    it('should track errors', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const errors: string[] = []

      vm.evm.events?.on('afterMessage', (result, next) => {
        if (result.execResult.exceptionError) {
          errors.push(result.execResult.exceptionError.error)
        }
        next?.()
      })

      // Execute invalid transaction
      try {
        await vm.runTx({
          tx: {
            to: '0x1234567890123456789012345678901234567890',
            data: '0xinvalid',
            value: 0n
          }
        })
      } catch (error) {
        // Expected error
      }

      expect(errors.length).toBeGreaterThan(0)
    })
  })

  describe('Memory Viewer Component', () => {
    it('should format memory correctly', () => {
      const memory = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
      const bytesPerRow = 16
      const startOffset = 0

      // Test memory formatting functions
      function formatByte(byte: number) {
        return byte.toString(16).padStart(2, '0')
      }

      function formatAscii(byte: number) {
        return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'
      }

      // Test byte formatting
      expect(formatByte(72)).toBe('48')
      expect(formatByte(101)).toBe('65')

      // Test ASCII formatting
      expect(formatAscii(72)).toBe('H')
      expect(formatAscii(101)).toBe('e')
    })
  })

  describe('Storage Viewer Component', () => {
    it('should load contract storage', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const address = '0x1234567890123456789012345678901234567890'

      // Setup some storage
      await vm.stateManager.putContractStorage(
        address,
        '0x0000000000000000000000000000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000000000000000000000000000002'
      )

      // Load storage
      const storage = await vm.stateManager.dumpStorage(address)
      expect(storage).toBeDefined()
    })
  })

  describe('Gas Profiling', () => {
    it('should track gas usage by opcode', async () => {
      const node = createTevmNode()
      const vm = await node.getVm()
      const gasProfile = new Map<string, { count: number, totalGas: bigint }>()

      vm.evm.events?.on('step', (step, next) => {
        const opName = step.opcode.name
        const gasCost = BigInt(step.opcode.fee)

        const stats = gasProfile.get(opName) ?? { count: 0, totalGas: 0n }
        stats.count++
        stats.totalGas += gasCost
        gasProfile.set(opName, stats)

        next?.()
      })

      // Execute transaction
      await vm.runTx({
        tx: {
          to: '0x1234567890123456789012345678901234567890',
          value: 1000000000000000000n
        }
      })

      expect(gasProfile.size).toBeGreaterThan(0)
      for (const [opcode, stats] of gasProfile) {
        expect(stats.count).toBeGreaterThan(0)
        expect(stats.totalGas).toBeGreaterThan(0n)
      }
    })
  })
})