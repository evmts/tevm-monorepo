import { Link } from "@remix-run/react";

import { METADATA_EXTRA } from "../../lib/constants/site";
import { buttonVariants } from "../ui/button";
import { Icons } from "./icons";
import NavBar from "./nav-bar";
import ThemeToggle from "./theme-toggle";

const SiteHeader = () => {
  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <NavBar />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              to={METADATA_EXTRA.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="size-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
