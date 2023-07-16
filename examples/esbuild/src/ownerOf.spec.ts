import { describe, expect, it } from "vitest";
import { ownerOf } from "./ownerOf";

describe(ownerOf.name, () => {
  it('should work', async () => {
    await expect(ownerOf()).resolves.toMatchInlineSnapshot('"0x1a1E021A302C237453D3D45c7B82B19cEEB7E2e6"')
  })
})
