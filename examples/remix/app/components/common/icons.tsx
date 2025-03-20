import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	CircleAlert,
	Clipboard,
	Copy,
	CopyCheck,
	FileCode,
	Github,
	Info,
	Layers,
	Loader2,
	type LucideIcon,
	type LucideProps,
	Monitor,
	Moon,
	MoreHorizontal,
	RefreshCcw,
	Search,
	SlidersHorizontal,
	Sun,
	Wallet,
	X,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
	logo: Layers,
	close: X,
	spinner: Loader2,
	chevronLeft: ChevronLeft,
	chevronRight: ChevronRight,
	chevronDown: ChevronDown,
	chevronsUpDown: ChevronsUpDown,
	check: CheckCircle2,
	copy: Copy,
	copyDone: CopyCheck,
	clipboard: Clipboard,
	sun: Sun,
	moon: Moon,
	monitor: Monitor,
	gitHub: Github,
	search: Search,
	info: Info,
	error: AlertCircle,
	warning: CircleAlert,
	more: MoreHorizontal,
	wallet: Wallet,
	filter: SlidersHorizontal,
	loading: (props: LucideProps) => <Loader2 {...props} className="animate-spin" />,
	refresh: RefreshCcw,
	code: FileCode,
}
