import { ReactNode } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setFieldModalState } from "../redux/slices/gridInfoSlice";

import "../styles/Modal.scss";

export interface ModalProps {
   modal: ReactNode;
}

export default function BaseModal(props: ModalProps) {
   const dispatch = useDispatch();

   return (
      <div className="modal">
         <IoCloseSharp className="close-modal-button" onClick={() => dispatch(setFieldModalState({ show: false }))} />
         {props.modal}
      </div>
   );
}
