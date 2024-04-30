import { EMPTY_STATE_ROOT } from "./EMPTY_STATE_ROOT.js";
import { genesisStateRoot } from "./index.js";
import { describe, it, expect } from "bun:test";

describe('EMPTY_STATE_ROOT', () => {
  it('should generate state root for empty state', async () => {
    expect(
      await genesisStateRoot({})
    ).toEqual(EMPTY_STATE_ROOT)
  })
})
