/**
 * Testing utilities for the compiler package
 */
import { vi } from 'vitest'
import type { Logger } from './types.js'

type MockFileAccessObject = {
	readFile: (path: string, encoding?: BufferEncoding) => Promise<string>
	readFileSync: (path: string, encoding?: BufferEncoding) => string
	exists: (path: string) => Promise<boolean>
	existsSync: (path: string) => boolean
}

/**
 * Creates a mock file access object for testing
 *
 * @param fileMap - Map of file paths to file contents
 * @returns The mock file access object
 */
export function createMockFileAccessObject(fileMap: Record<string, string> = {}): MockFileAccessObject {
	return {
		readFile: async (path: string) => fileMap[path] || '',
		readFileSync: (path: string) => fileMap[path] || '',
		exists: async (path: string) => path in fileMap,
		existsSync: (path: string) => path in fileMap,
	}
}

/**
 * Creates a mock logger for testing
 *
 * @returns The mock logger object
 */
export function createMockLogger(): Logger {
	return {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}
}

/**
 * Simple Solidity contract for testing
 */
export const SIMPLE_CONTRACT = `
pragma solidity ^0.8.0;

contract SimpleContract {
  uint256 public value;
  
  constructor() {
    value = 0;
  }
  
  function setValue(uint256 _value) public {
    value = _value;
  }
  
  function getValue() public view returns (uint256) {
    return value;
  }
}
`

/**
 * Creates a mock solc compiler with the specified outputs
 *
 * @param outputs - The compiler outputs to return
 * @returns The mock solc compiler
 */
export function createMockSolc(outputs: any = {}): { compile: (...args: any[]) => any } {
	return {
		compile: vi.fn().mockReturnValue(outputs),
	}
}
