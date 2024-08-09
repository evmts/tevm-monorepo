import { mainSymbols } from 'figures';
import { Box, Text } from 'ink';
import InkSelectInput, {} from 'ink-select-input';
import React from 'react';
/**
 * Create EVMts app step to select the use case
 * Uses a MultiSelect
 */
export const SelectInput = ({ items, onSelect, }) => {
    const initialIndex = items.findIndex((item) => item.label.includes('(recommended)'));
    return (React.createElement(InkSelectInput, { itemComponent: ItemComponent, indicatorComponent: IndicatorComponent, initialIndex: initialIndex > -1 ? initialIndex : 0, items: items, onSelect: onSelect }));
};
const IndicatorComponent = ({ isSelected }) => {
    return (React.createElement(Box, { marginRight: 1 }, isSelected ? (React.createElement(Text, { color: '#B19CD9' }, mainSymbols.pointer)) : (React.createElement(Text, null, " "))));
};
const ItemComponent = ({ label, isSelected }) => {
    return React.createElement(Text, { color: isSelected ? '#A4DDED' : 'white' }, label);
};
