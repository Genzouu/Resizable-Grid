import React from "react";
import { useContextMenuContext } from "../context/ContextMenuContext";
import { ContextMenuItemType } from "../packages/context-menu/types/ContextMenuItemType";
import "../styles/ContextMenuItem.scss";

export default function ContextMenuItem(props: ContextMenuItemType) {
   const contextMenuContext = useContextMenuContext();

   function handleOnClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      e.stopPropagation();
      if (props.onClick) props.onClick();
      contextMenuContext.setContextMenu(null);
   }

   return (
      <div className={`context-menu-item${props.colourTheme === "red" ? " red-colour-theme" : ""}`} onClick={(e) => handleOnClick(e)}>
         <p className="text">{props.text}</p>
      </div>
   );
}
