import { otherUsagesSidebar } from "./usagewithotherlibraries/sidebar";

export const advancedSidebar = {
  text: '🚧 Advanced',
  collapsed: true,
  items: [
    {
      text: '🚧 Building your own custom Actions',
      link: '/advanced/section/name',
    },
    otherUsagesSidebar,
    {
      text: '🚧 Contributing to EVMts',
      link: '/advanced/section/name',
    },
  ],
} as const
