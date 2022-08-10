import { useSelector } from "react-redux";
import { StateType } from "../redux/reducers";
import "../styles/Overlay.scss";
import AddFieldModal from "./AddFieldModal";
import BaseModal from "./BaseModal";

export default function Overlay() {
   const fieldModalStates = useSelector((state: StateType) => state.gridInfo.modalStates);

   return (
      <div className="overlay">
         {fieldModalStates.add ? <BaseModal modal={<AddFieldModal />} /> : null}
         {fieldModalStates.edit ? <BaseModal modal={<AddFieldModal /* EditFieldModal */ />} /> : null}
      </div>
   );
}
