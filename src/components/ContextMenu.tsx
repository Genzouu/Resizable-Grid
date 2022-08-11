import { MouseEvent, useEffect } from "react";
import { ContextMenuItemType } from "../packages/context-menu/types/ContextMenuItemType";
import "../styles/ContextMenu.scss";
import ContextMenuItem from "./ContextMenuItem";

export interface ContextMenuProps {
   items: ContextMenuItemType[];
   mouseEvent: MouseEvent<HTMLElement, globalThis.MouseEvent>;
}

export default function ContextMenu(props: ContextMenuProps) {
   useEffect(() => {
      const contextMenu = document.getElementById("context-menu") as HTMLElement;
      contextMenu.style.left = props.mouseEvent.pageX + "px";
      contextMenu.style.top = props.mouseEvent.pageY + "px";
   }, []);

   return (
      <div id="context-menu" className="context-menu">
         {props.items.map((item, index) => (
            <ContextMenuItem text={item.text} colourTheme={item.colourTheme} onClick={item.onClick} key={index} />
         ))}
      </div>
   );
}
