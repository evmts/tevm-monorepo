import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

export const sidebarConfig = [
    {
        label: 'Getting Started',
        items: [{ label: 'Getting Started Guide', link: '/getting-started/getting-started/' }],
    },
    {
        label: 'Learn',
        items: [
            { label: 'Clients', link: '/learn/clients/' },
            { label: 'Actions', link: '/learn/actions/' },
            { label: 'Low-level API', link: '/learn/low-level-api/' },
            { label: 'JSON RPC', link: '/learn/json-rpc/' },
            { label: 'Contracts', link: '/learn/contracts/' },
            { label: 'Bundler', link: '/learn/solidity-imports/' },
            { label: 'Advanced Scripting', link: '/learn/scripting/' },
            { label: 'Reference', link: '/learn/reference/' },
        ],
    },
    typeDocSidebarGroug,
];
