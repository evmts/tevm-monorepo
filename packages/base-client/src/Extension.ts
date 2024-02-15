import type { BaseClient } from './BaseClient.js'

export type Extension<TExtended> = (client: BaseClient) => TExtended
