import { mainSymbols } from 'figures'
import { Box, Text } from 'ink'
import InkSelectInput, {
	type IndicatorProps,
	type ItemProps,
} from 'ink-select-input'
import React from 'react'

export type Item<V> = {
	key?: string
	label: string
	value: V
}

type Props<V> = {
	/**
	 * Items to display in a list. Each item must be an object and have `label` and `value` props, it may also optionally have a `key` prop.
	 * If no `key` prop is provided, `value` will be used as the item key.
	 */
	items: Array<Item<V>>
	/**
	 * Function to call when user selects an item. Item object is passed to that function as an argument.
	 */
	onSelect: (item: Item<V>) => void
}

// rome fails if we don't do this
type AnyItem = any

/**
 * Create EVMts app step to select the use case
 * Uses a MultiSelect
 */
export const SelectInput = <T extends AnyItem>({
	items,
	onSelect,
}: Props<T>) => {
	const initialIndex = items.findIndex((item) =>
		item.label.includes('(recommended)'),
	)
	return (
		<InkSelectInput
			itemComponent={ItemComponent}
			indicatorComponent={IndicatorComponent}
			initialIndex={initialIndex > -1 ? initialIndex : 0}
			items={items}
			onSelect={onSelect}
		/>
	)
}

const IndicatorComponent: React.FC<IndicatorProps> = ({ isSelected }) => {
	return (
		<Box marginRight={1}>
			{isSelected ? (
				<Text color='#B19CD9'>{mainSymbols.pointer}</Text>
			) : (
				<Text> </Text>
			)}
		</Box>
	)
}

const ItemComponent: React.FC<ItemProps> = ({ label, isSelected }) => {
	return <Text color={isSelected ? '#A4DDED' : 'white'}>{label}</Text>
}
