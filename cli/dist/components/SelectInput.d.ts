import React from 'react';
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
    items: Array<Item<V>>;
    /**
     * Function to call when user selects an item. Item object is passed to that function as an argument.
     */
    onSelect: (item: Item<V>) => void;
};
/**
 * Create EVMts app step to select the use case
 * Uses a MultiSelect
 */
export declare const SelectInput: <T extends unknown>({ items, onSelect, }: Props<T>) => React.JSX.Element;
export {};
//# sourceMappingURL=SelectInput.d.ts.map