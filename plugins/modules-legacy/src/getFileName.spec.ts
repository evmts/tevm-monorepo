import { getFileName } from './getFileName'
import { describe, expect, it } from 'vitest'

describe(getFileName.name, () => {
  it('should parse the contractName', () => {
    const testCases = [
      'Foo.sol',
      './Foo.sol',
      '/Foo.sol',
      'Bar.sol/Foo.sol',
      '../../Foo.sol',
      '../../Bar/Foo.sol',
      'bar/Foo/sol/Foo.sol',
    ]
    testCases.forEach((testCase) => {
      console.log(testCase)
      expect(getFileName(testCase)).toBe('Foo.sol')
    })
  })

  it('should throw error if passed empty string', () => {
    expect(() => getFileName('')).toThrowErrorMatchingInlineSnapshot(
      '"unable to parse contract name from path: "',
    )
  })
})
