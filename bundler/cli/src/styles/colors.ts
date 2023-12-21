export const colorPallet = {
	black: '#000000',
	green: '#77dd77',
	blue: '#a6dcef',
	red: '#ff6961',
	yellow: '#fdd663',
	purple: '#b19cd9',
	orange: '#ffb347',
	pink: '#ff9ff3',
	gray: '#d3d3d3',
	white: '#ffffff',
} as const
export const asyncStateColors = {
	loading: colorPallet.blue,
	error: colorPallet.red,
	success: colorPallet.green,
} as const
