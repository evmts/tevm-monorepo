import { helloFoundry } from './index'
import { describe, expect, it } from 'vitest'

describe('solts', () => {
  it('is a boilerplate', () => {
    expect(helloFoundry).toMatchInlineSnapshot('undefined')
  })
})
