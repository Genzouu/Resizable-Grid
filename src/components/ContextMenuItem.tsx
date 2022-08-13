import { ContextMenuItemType } from "../packages/context-menu/types/ContextMenuItemType";
import "../styles/ContextMenuItem.scss";

export default function ContextMenuItem(props: ContextMenuItemType) {
   return (
      <div className={`context-menu-item${props.colourTheme === "red" ? " red-colour-theme" : ""}`} onClick={props.onClick}>
         <p className="text">{props.text}</p>
      </div>
   );
}
