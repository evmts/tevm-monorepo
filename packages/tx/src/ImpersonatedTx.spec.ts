import { describe, it, expect } from "bun:test";
import { ImpersonatedTx } from "./ImpersonatedTx.js";
import { EthjsAddress } from "@tevm/utils";

describe(ImpersonatedTx.name, () => {
  it('should impersonated a signed tx', () => {
    const impersonatedAddress = EthjsAddress.fromString(`0x${'69'.repeat(20)}`)
    const tx = new ImpersonatedTx({
      data: '0x5234',
      impersonatedAddress
    })
    expect(tx.hash()).toMatchSnapshot()
    expect(tx.isSigned()).toBeTrue()
    expect(tx.getSenderAddress()).toBe(impersonatedAddress)
  })
})
