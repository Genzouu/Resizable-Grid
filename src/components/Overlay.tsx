import { useEffect } from "react";
import { useSelector } from "react-redux";

import "../styles/Overlay.scss";
import ContextMenu from "./ContextMenu";
import Modal from "./Modal";
import FieldModal from "./FieldModal";
import { StateType } from "../redux/reducers";
import { setFieldModalState } from "../redux/slices/gridInfoSlice";
import { useContextMenuContext } from "../context/ContextMenuContext";

export default function Overlay() {
   const fieldModalStates = useSelector((state: StateType) => state.gridInfo.modalStates);
   const contextMenuContext = useContextMenuContext();

   useEffect(() => {
      const overlay = document.getElementById("overlay") as HTMLElement;
      if (overlay.children.length > 0) {
         const contextMenu = document.getElementById("context-menu") as HTMLElement;
         if (contextMenu) {
            overlay.style.background = "unset";
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
      if (fieldModalStates.show) setFieldModalState({ show: false });
   }

   return (
      <div id="overlay" className="overlay" onClick={() => handleOnClick()} onContextMenu={(e) => e.preventDefault()}>
         {fieldModalStates.show && fieldModalStates.editIndex === -1 && <Modal modal={<FieldModal />} />}
         {fieldModalStates.show && fieldModalStates.editIndex !== -1 && <Modal modal={<FieldModal />} />}
         {contextMenuContext.contextMenu ? (
            <ContextMenu items={contextMenuContext.contextMenu.items} mouseEvent={contextMenuContext.contextMenu.mouseEvent} />
         ) : null}
      </div>
   );
}
