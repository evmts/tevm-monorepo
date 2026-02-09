// Some of these components are heavily inspired from shadcn/ui Typography
// see https://ui.shadcn.com/docs/components/typography

import Link from 'next/link'
import type { ReactNode } from 'react'

import { Icons } from '@/components/common/icons'

/**
 * @notice A link to an external resource
 */
export const LinkTo = ({ href, children }: { href: string; children: ReactNode }) => (
	<Link
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		className="hover:text-secondary-foreground font-medium underline underline-offset-3 transition-colors duration-100"
	>
		{children}
	</Link>
)

/**
 * @notice A styled paragraph
 */
export const P = ({ children }: { children: ReactNode }) => (
	<p className="leading-5 [&:not(:first-child)]:mt-2">{children}</p>
)

/**
 * @notice A styled list
 */
export const List = ({ items }: { items: ReactNode[] }) => (
	<ul className="ml-4 list-none [&:not(:first-child)]:mt-2 [&:not(:last-child)]:mb-2 [&>li]:mt-1">
		{items.map((item, i) => (
			<li key={i} className="flex items-start gap-2">
				<Icons.right className="text-secondary-foreground mt-[3px] size-4" />
				<span>{item}</span>
			</li>
		))}
	</ul>
)

/**
 * @notice A styled inline code snippet
 */
export const InlineCode = ({ children }: { children: ReactNode }) => (
	<code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">{children}</code>
)
