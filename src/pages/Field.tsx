import { getGridPosFromPos } from "../packages/grid/Grid";
import { FieldActionType, FieldData } from "../packages/grid/types/FieldTypes";
import { CgCornerDoubleLeftDown } from "react-icons/cg";
import "../styles/Field.scss";
import React, { useContext } from "react";
import { useFieldActionContext } from "../context/FieldActionContext";

export interface FieldProps extends FieldData {
   index: number;
   setFieldActionInfo: (info: FieldActionType | null) => void;
}

export default function Field(props: FieldProps) {
   const { fieldAction } = useFieldActionContext();

   function manageAction(e: React.MouseEvent<Element, MouseEvent>, action: "resize" | "reposition") {
      // display the grid lines

      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
      const fieldRect = field.getBoundingClientRect();
      const fieldContainerRect = field.parentElement!.getBoundingClientRect();

      // if the user grabbed the top or the resize icon
      if (action === "resize") {
         const grabbedPos = getGridPosFromPos(
            e.pageX - fieldContainerRect.left + 5,
            e.pageY - fieldContainerRect.top + 5
         );
         props.setFieldActionInfo({ field: field, action: action, grabbedPos });
         // display grid lines
         (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";
      } else if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         if (!field.classList.contains("reposition-selected-outline")) {
            props.setFieldActionInfo({ field: field, action: action });
            field.classList.add("reposition-selected-outline");
         } else {
            // if the field has already been selected
            props.setFieldActionInfo(null);
            field.classList.remove("reposition-selected-outline");
         }
      }
   }

   return (
      <div className="field" onDoubleClick={(e) => manageAction(e, "reposition")}>
         <p className="title">{props.title}</p>
         {typeof props.body === "string" ? (
            <textarea className="body" defaultValue={props.body}></textarea>
         ) : (
            <div className="item-container">
               {props.body.map((item, index) => (
                  <div className="item" key={index}>
                     {item}
                  </div>
               ))}
            </div>
         )}
         <CgCornerDoubleLeftDown className="resizer" onMouseDown={(e) => manageAction(e, "resize")} />
      </div>
   );
}
