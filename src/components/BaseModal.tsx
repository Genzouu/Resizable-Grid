import { ReactNode } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setFieldAddState } from "../redux/slices/gridSlice";

import "../styles/BaseModal.scss";

export interface BaseModalProps {
   modal: ReactNode;
}

export default function BaseModal(props: BaseModalProps) {
   const dispatch = useDispatch();

   return (
      <div className="base-modal">
         <IoCloseSharp className="close-modal-button" onClick={() => dispatch(setFieldAddState(false))} />
         {props.modal}
      </div>
   );
}
