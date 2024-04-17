import { describe, expect, it } from "bun:test";
import { createCommon } from "./createCommon.js";

describe(createCommon.name, () => {
  it('wraps ethereumjs common with default eips', () => {
    const common = createCommon()
    expect(common.hardfork()).toBe('cancun')
    expect(common.eips()).toEqual([1559, 4895])
  })
})
