import type { Store } from '../state/Store.js'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import Table from './Table.js'
import React from 'react'
import { relative } from 'node:path'

type Props = {
  store: Store
}

export const Creating: React.FC<Props> = ({ store }) => {
  return (
    <Box display='flex' flexDirection='column'>
      <Table
        data={[
          {
            name: store.name,
            template: store.framework,
            path: relative(process.cwd(), store.path),
          },
        ]}
      />
      <Box>
        <Text>
          <Spinner type="dots" /> Creating project...
        </Text>
      </Box>
    </Box>
  )
} 