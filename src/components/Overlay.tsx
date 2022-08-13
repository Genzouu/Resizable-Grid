import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useContextMenuContext } from "../context/ContextMenuContext";
import { StateType } from "../redux/reducers";
import "../styles/Overlay.scss";
import AddFieldModal from "./AddFieldModal";
import ContextMenu from "./ContextMenu";
import Modal from "./Modal";

export default function Overlay() {
   const fieldModalStates = useSelector((state: StateType) => state.gridInfo.modalStates);
   const contextMenuContext = useContextMenuContext();

   useEffect(() => {
      const overlay = document.getElementById("overlay") as HTMLElement;
      if (overlay.children.length > 0) {
         const contextMenu = document.getElementById("context-menu") as HTMLElement;
         if (contextMenu) {
            overlay.style.backgroundColor = "transparent";
         } else {
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
         }
         overlay.style.display = "unset";
      } else {
         overlay.style.display = "none";
      }
   });

   function handleOnClick() {
      if (contextMenuContext.contextMenu) contextMenuContext.setContextMenu(null);
   }

   return (
      <div id="overlay" className="overlay" onClick={() => handleOnClick()}>
         {fieldModalStates.add ? <Modal modal={<AddFieldModal />} /> : null}
         {fieldModalStates.edit ? <Modal modal={<AddFieldModal /* EditFieldModal */ />} /> : null}
         {contextMenuContext.contextMenu ? (
            <ContextMenu items={contextMenuContext.contextMenu.items} mouseEvent={contextMenuContext.contextMenu.mouseEvent} />
         ) : null}
      </div>
   );
}
