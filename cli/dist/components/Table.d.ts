import React from 'react';
type Scalar = string | number | boolean | null | undefined;
type ScalarDict = {
    [key: string]: Scalar;
};
export type CellProps = React.PropsWithChildren<{
    column: number;
}>;
export type TableProps<T extends ScalarDict> = {
    /**
     * List of values (rows).
     */
    data: T[];
    /**
     * Columns that we should display in the table.
     */
    columns: (keyof T)[];
    /**
     * Cell padding.
     */
    padding: number;
    /**
     * Header component.
     */
    header: (props: React.PropsWithChildren<{}>) => JSX.Element;
    /**
     * Component used to render a cell in the table.
     */
    cell: (props: CellProps) => JSX.Element;
    /**
     * Component used to render the skeleton of the table.
     */
    skeleton: (props: React.PropsWithChildren<{}>) => JSX.Element;
};
export default class Table<T extends ScalarDict> extends React.Component<Pick<TableProps<T>, 'data'> & Partial<TableProps<T>>> {
    /**
     * Merges provided configuration with defaults.
     */
    getConfig(): TableProps<T>;
    /**
     * Gets all keyes used in data by traversing through the data.
     */
    getDataKeys(): (keyof T)[];
    /**
     * Calculates the width of each column by finding
     * the longest value in a cell of a particular column.
     *
     * Returns a list of column names and their widths.
     */
    getColumns(): Column<T>[];
    /**
     * Returns a (data) row representing the headings.
     */
    getHeadings(): Partial<T>;
    header: (props: RowProps<T>) => JSX.Element;
    heading: (props: RowProps<T>) => JSX.Element;
    separator: (props: RowProps<T>) => JSX.Element;
    data: (props: RowProps<T>) => JSX.Element;
    footer: (props: RowProps<T>) => JSX.Element;
    render(): React.JSX.Element;
}
type RowProps<T extends ScalarDict> = {
    key: string;
    data: Partial<T>;
    columns: Column<T>[];
};
type Column<T> = {
    key: string;
    column: keyof T;
    width: number;
};
/**
 * Renders the header of a table.
 */
export declare function Header(props: React.PropsWithChildren<{}>): React.JSX.Element;
/**
 * Renders a cell in the table.
 */
export declare function Cell(props: CellProps): React.JSX.Element;
/**
 * Redners the scaffold of the table.
 */
export declare function Skeleton(props: React.PropsWithChildren<{}>): React.JSX.Element;
export {};
//# sourceMappingURL=Table.d.ts.map