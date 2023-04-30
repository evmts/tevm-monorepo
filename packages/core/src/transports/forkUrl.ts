import { Transport } from 'viem'

type ForkUrlOptions = {
  url: string
}

export const forkUrl = (options: ForkUrlOptions): Transport => {
  console.log(options)
  return {} as any
}
