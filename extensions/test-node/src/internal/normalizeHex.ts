import type { Hex } from 'viem'

export const normalizeHex = (hex: Hex | null | undefined) => hex?.toLowerCase() ?? '0x'
