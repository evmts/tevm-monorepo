export type IntervalMining = {
  type: 'interval'
  interval: number
}
export type ManualMining = {
  type: 'manual',
}
export type AutoMining = {
  type: 'auto'
}
export type MiningConfig = IntervalMining | ManualMining | AutoMining
