import type { PropsWithChildren } from "react";

export const MenuLayout = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-row justify-around w-full order-last bg-gray-800 border-t-[1px] border-t-gray-700">
        {props.children}
    </div>
  );
};