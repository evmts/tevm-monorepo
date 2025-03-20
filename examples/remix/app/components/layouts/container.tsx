import type { FC, JSX, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ContainerLayoutProps = JSX.IntrinsicElements["div"] & {
  children?: ReactNode;
};

/**
 * @notice The container layout component for all pages
 */
const ContainerLayout: FC<ContainerLayoutProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-screen-2xl grow flex-col p-4 md:px-8 md:py-10",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default ContainerLayout;
