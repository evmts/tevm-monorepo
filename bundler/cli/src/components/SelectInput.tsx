

import { Box, Text } from 'ink'
import InkSelectInput, { type IndicatorProps, type ItemProps } from 'ink-select-input'
import React from 'react'
import { mainSymbols } from 'figures'

export type Item<V> = {
  key?: string;
  label: string;
  value: V;
};

type Props<V> = {
  /**
   * Items to display in a list. Each item must be an object and have `label` and `value` props, it may also optionally have a `key` prop.
   * If no `key` prop is provided, `value` will be used as the item key.
   */
  items: Array<Item<V>>
  /**
   * Index of initially-selected item in `items` array.
   *
   * @default 0
   */
  initialSelection?: V;
  /**
   * Function to call when user selects an item. Item object is passed to that function as an argument.
   */
  onSelect: (item: Item<V>) => void;
};

/**
 * Create EVMts app step to select the use case
 * Uses a MultiSelect
 */
export const SelectInput = <T extends any>({ items, onSelect, initialSelection = items[0]?.value }: Props<T>) => {
  return (
    <InkSelectInput
      itemComponent={ItemComponent}
      indicatorComponent={IndicatorComponent}
      initialIndex={initialSelection && items.findIndex(item => item.value === initialSelection) || 0}
      items={items}
      onSelect={onSelect}
    />
  )
}

const IndicatorComponent: React.FC<IndicatorProps> = ({ isSelected }) => {
  return (
    <Box marginRight={1}>
      {isSelected ? (
        <Text color="#B19CD9">{mainSymbols.pointer}</Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  )
}

const ItemComponent: React.FC<ItemProps> = ({ label, isSelected }) => {
  return <Text color={isSelected ? '#A4DDED' : 'white'}>{label}</Text>
}
