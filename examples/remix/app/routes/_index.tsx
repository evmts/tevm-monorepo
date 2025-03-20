import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { METADATA_BASE } from "../lib/constants/site";
import { Button } from "../components/ui/button";
import { Icons } from "../components/common/icons";

export const meta: MetaFunction = () => {
  return [
    { title: METADATA_BASE.title as string },
    { name: "description", content: METADATA_BASE.description as string },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Tevm Remix Example
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A Remix implementation of the Tevm contract explorer and debugger
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
          <Icons.code className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Contract Interaction</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Interact with any contract on any EVM chain with a local fork
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
          <Icons.wallet className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Account Simulation</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Impersonate any address and simulate transactions
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center rounded-lg border p-6 shadow-sm">
          <Icons.refresh className="h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Chain Forking</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Fork any EVM chain at the latest block and make local changes
          </p>
        </div>
      </div>

      <Link to="/0x1823FbFF49f731061E8216ad2467112C0469cBFD" className="mt-6">
        <Button>
          Try with an Example Contract
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
