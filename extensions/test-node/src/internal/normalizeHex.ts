import type { Hex } from 'viem'

export const normalizeHex = (hex: Hex | undefined) => hex?.toLowerCase() ?? '0x'
