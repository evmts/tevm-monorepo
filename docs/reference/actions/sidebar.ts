export const actionsReferenceSidebar = {
  text: '🚧 Actions reference',
  collapsed: true,
  items: [
    {
      text: '🚧 Contract actions',
      collapsed: true,
      items: [
        {
          text: '🚧 Contract writes',
          link: '/reference/actions/state/snapshot'
        },
        {
          text: '🚧 Contract reads',
          link: '/reference/actions/state/snapshot'
        },
        {
          text: '🚧 Events',
          link: '/reference/actions/state/createfork'
        },
        {
          text: '🚧 Storage',
          link: '/reference/actions/state/selectfork'
        },
      ]
    }]
} as const
