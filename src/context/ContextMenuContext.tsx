import { createContext, ReactNode, useContext, useState } from "react";
import { ContextMenuProps } from "../components/context-menu/ContextMenu";

interface IContextMenuContext {
   contextMenu: ContextMenuProps | null;
   setContextMenu: (info: ContextMenuProps | null) => void;
}

export const ContextMenuContext = createContext<IContextMenuContext | null>(null);

export function ContextMenuProvider({ children }: { children: ReactNode }) {
   const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);
   return <ContextMenuContext.Provider value={{ contextMenu: contextMenu, setContextMenu: setContextMenu }}>{children}</ContextMenuContext.Provider>;
}

export function useContextMenuContext(): IContextMenuContext {
   const contextMenuContext = useContext(ContextMenuContext);
   if (!contextMenuContext) throw new Error("Couldn't find the provider for ContextMenuContext");
   return contextMenuContext;
}

export default ContextMenuProvider;
