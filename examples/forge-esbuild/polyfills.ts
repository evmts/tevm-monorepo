import { Buffer } from 'buffer'
import process from 'process'

type AugmentedWindow = typeof window & {
  global: typeof window
  process: typeof process
  Buffer: typeof Buffer
}
;(window as AugmentedWindow).global = window
;(window as AugmentedWindow).process = process
;(window as AugmentedWindow).Buffer = Buffer
