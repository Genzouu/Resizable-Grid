import { ReactNode } from "react";
import { IoCloseSharp } from "react-icons/io5";

import "../styles/BaseModal.scss";

export interface BaseModalProps {
   modal: ReactNode;
}

export default function BaseModal(props: BaseModalProps) {
   return (
      <div className="base-modal">
         <IoCloseSharp className="close-modal-button" />
         {props.modal}
      </div>
   );
}
