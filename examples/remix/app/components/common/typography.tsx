import { cn } from '../../lib/utils'

type HeadingProps = {
	level?: 1 | 2 | 3 | 4
	children: React.ReactNode
	className?: string
}

type TextProps = {
	children: React.ReactNode
	className?: string
	as?: keyof JSX.IntrinsicElements
}

type CodeProps = {
	children: React.ReactNode
	className?: string
}

/**
 * @notice A component for displaying headings with consistent styling
 */
export function Heading({ level = 1, children, className }: HeadingProps) {
	const Tag = `h${level}` as keyof JSX.IntrinsicElements

	const styles = {
		1: 'text-3xl font-extrabold tracking-tight lg:text-4xl',
		2: 'text-2xl font-semibold tracking-tight',
		3: 'text-xl font-semibold tracking-tight',
		4: 'text-lg font-semibold tracking-tight',
	}

	return <Tag className={cn(styles[level], className)}>{children}</Tag>
}

/**
 * @notice A component for displaying paragraphs or spans with consistent styling
 */
export function Text({ children, className, as = 'p' }: TextProps) {
	const Tag = as

	return <Tag className={cn('leading-7', className)}>{children}</Tag>
}

/**
 * @notice A component for displaying code with consistent styling
 */
export function Code({ children, className }: CodeProps) {
	return (
		<code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)}>
			{children}
		</code>
	)
}

/**
 * @notice A component for displaying lists with consistent styling
 */
export function List({ children, className }: TextProps) {
	return <ul className={cn('my-4 ml-6 list-disc', className)}>{children}</ul>
}

/**
 * @notice A component for displaying list items with consistent styling
 */
export function ListItem({ children, className }: TextProps) {
	return <li className={cn('mt-2', className)}>{children}</li>
}
