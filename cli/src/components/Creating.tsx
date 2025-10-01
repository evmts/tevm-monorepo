import { relative } from 'node:path'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import type { Store } from '../state/Store.js'
import Table from './Table.js'

type Props = {
	store: Store
}

export const Creating: React.FC<Props> = ({ store }) => {
	return (
		<Box display="flex" flexDirection="column">
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
