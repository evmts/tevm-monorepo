import { describe, expect, it } from "vitest";
import { readCache } from "./cache";

describe(readCache.name, () => {
  const mockCache: any = {
    'moduleId': {
      solcInput: {
        sources: {
          'file1.sol': { content: 'content1' },
          'file2.sol': { content: 'content2' },
        },
      },
      solcOutput: { data: 'cachedData' },
    },
  };

  it('should return undefined if the entryModuleId is not in cache', () => {
    const result = readCache(mockCache, 'nonExistentModuleId', {});
    expect(result).toBeUndefined();
  });

  it('should return undefined if the number of sources is different', () => {
    const sources = {
      'file1.sol': { content: 'content1' },
    };
    const result = readCache(mockCache, 'moduleId', sources);
    expect(result).toBeUndefined();
  });

  it('should return undefined if there is a key mismatch', () => {
    const sources = {
      'file3.sol': { content: 'content3' },
      'file2.sol': { content: 'content2' },
    };
    const result = readCache(mockCache, 'moduleId', sources);
    expect(result).toBeUndefined();
  });

  it('should return undefined if content is missing in any source', () => {
    const sources: any = {
      'file1.sol': {},
      'file2.sol': { content: 'content2' },
    };
    const result = readCache(mockCache, 'moduleId', sources);
    expect(result).toBeUndefined();
  });

  it('should return undefined if content is different in any source', () => {
    const sources = {
      'file1.sol': { content: 'modifiedContent' },
      'file2.sol': { content: 'content2' },
    };
    const result = readCache(mockCache, 'moduleId', sources);
    expect(result).toBeUndefined();
  });

  it('should return cached output if everything matches', () => {
    const sources = {
      'file1.sol': { content: 'content1' },
      'file2.sol': { content: 'content2' },
    };
    const result = readCache(mockCache, 'moduleId', sources);
    expect(result).toEqual({ data: 'cachedData' });
  });
});
