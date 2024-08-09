import { Box, Text } from 'ink';
import { sha1 } from 'object-hash';
// Copied from ink-table https://github.com/maticzav/ink-table/blob/master/src/index.tsx
import React from 'react';
/* Table */
export default class Table extends React.Component {
    /* Config */
    /**
     * Merges provided configuration with defaults.
     */
    getConfig() {
        return {
            data: this.props.data,
            columns: this.props.columns || this.getDataKeys(),
            padding: this.props.padding || 1,
            header: this.props.header || Header,
            cell: this.props.cell || Cell,
            skeleton: this.props.skeleton || Skeleton,
        };
    }
    /**
     * Gets all keyes used in data by traversing through the data.
     */
    getDataKeys() {
        const keys = new Set();
        // Collect all the keys.
        for (const data of this.props.data) {
            for (const key in data) {
                keys.add(key);
            }
        }
        return Array.from(keys);
    }
    /**
     * Calculates the width of each column by finding
     * the longest value in a cell of a particular column.
     *
     * Returns a list of column names and their widths.
     */
    getColumns() {
        const { columns, padding } = this.getConfig();
        const widths = columns.map((key) => {
            const header = String(key).length;
            /* Get the width of each cell in the column */
            const data = this.props.data.map((data) => {
                const value = data[key];
                if (value === undefined || value == null)
                    return 0;
                return String(value).length;
            });
            const width = Math.max(...data, header) + padding * 2;
            /* Construct a cell */
            return {
                column: key,
                width: width,
                key: String(key),
            };
        });
        return widths;
    }
    /**
     * Returns a (data) row representing the headings.
     */
    getHeadings() {
        const { columns } = this.getConfig();
        const headings = columns.reduce((acc, column) => ({ ...acc, [column]: column }), {});
        return headings;
    }
    /* Rendering utilities */
    // The top most line in the table.
    header = row({
        cell: this.getConfig().skeleton,
        padding: this.getConfig().padding,
        skeleton: {
            component: this.getConfig().skeleton,
            // chars
            line: '─',
            left: '┌',
            right: '┐',
            cross: '┬',
        },
    });
    // The line with column names.
    heading = row({
        cell: this.getConfig().header,
        padding: this.getConfig().padding,
        skeleton: {
            component: this.getConfig().skeleton,
            // chars
            line: ' ',
            left: '│',
            right: '│',
            cross: '│',
        },
    });
    // The line that separates rows.
    separator = row({
        cell: this.getConfig().skeleton,
        padding: this.getConfig().padding,
        skeleton: {
            component: this.getConfig().skeleton,
            // chars
            line: '─',
            left: '├',
            right: '┤',
            cross: '┼',
        },
    });
    // The row with the data.
    data = row({
        cell: this.getConfig().cell,
        padding: this.getConfig().padding,
        skeleton: {
            component: this.getConfig().skeleton,
            // chars
            line: ' ',
            left: '│',
            right: '│',
            cross: '│',
        },
    });
    // The bottom most line of the table.
    footer = row({
        cell: this.getConfig().skeleton,
        padding: this.getConfig().padding,
        skeleton: {
            component: this.getConfig().skeleton,
            // chars
            line: '─',
            left: '└',
            right: '┘',
            cross: '┴',
        },
    });
    render() {
        /* Data */
        const columns = this.getColumns();
        const headings = this.getHeadings();
        /**
         * Render the table line by line.
         */
        return (React.createElement(Box, { flexDirection: 'column' },
            this.header({ key: 'header', columns, data: {} }),
            this.heading({ key: 'heading', columns, data: headings }),
            this.props.data.map((row, index) => {
                // Calculate the hash of the row based on its value and position
                const key = `row-${sha1(row)}-${index}`;
                // Construct a row.
                return (React.createElement(Box, { flexDirection: 'column', key: key },
                    this.separator({ key: `separator-${key}`, columns, data: {} }),
                    this.data({ key: `data-${key}`, columns, data: row })));
            }),
            this.footer({ key: 'footer', columns, data: {} })));
    }
}
/**
 * Constructs a Row element from the configuration.
 */
function row(config) {
    /* This is a component builder. We return a function. */
    const skeleton = config.skeleton;
    /* Row */
    return (props) => (React.createElement(Box, { flexDirection: 'row' },
        React.createElement(skeleton.component, null, skeleton.left),
        ...intersperse((i) => {
            const key = `${props.key}-hseparator-${i}`;
            // The horizontal separator.
            return (React.createElement(skeleton.component, { key: key }, skeleton.cross));
        }, 
        // Values.
        props.columns.map((column, colI) => {
            // content
            const value = props.data[column.column];
            if (value === undefined || value == null) {
                const key = `${props.key}-empty-${column.key}`;
                return (React.createElement(config.cell, { key: key, column: colI }, skeleton.line.repeat(column.width)));
            }
            else {
                const key = `${props.key}-cell-${column.key}`;
                // margins
                const ml = config.padding;
                const mr = column.width - String(value).length - config.padding;
                return (
                /* prettier-ignore */
                React.createElement(config.cell, { key: key, column: colI }, `${skeleton.line.repeat(ml)}${String(value)}${skeleton.line.repeat(mr)}`));
            }
        })),
        React.createElement(skeleton.component, null, skeleton.right)));
}
/**
 * Renders the header of a table.
 */
export function Header(props) {
    return (React.createElement(Text, { bold: true, color: 'blue' }, props.children));
}
/**
 * Renders a cell in the table.
 */
export function Cell(props) {
    return React.createElement(Text, null, props.children);
}
/**
 * Redners the scaffold of the table.
 */
export function Skeleton(props) {
    return React.createElement(Text, { bold: true }, props.children);
}
/* Utility functions */
/**
 * Intersperses a list of elements with another element.
 */
function intersperse(intersperser, elements) {
    // Intersparse by reducing from left.
    const interspersed = elements.reduce((acc, element, index) => {
        // Only add element if it's the first one.
        if (acc.length === 0)
            return [element];
        // Add the intersparser as well otherwise.
        return [...acc, intersperser(index), element];
    }, []);
    return interspersed;
}
