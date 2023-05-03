import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex items-center flex-col h-screen">
        {props.children}
    </main>
  );
};