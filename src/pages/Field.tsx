import { getGridPosFromPos } from "../packages/grid/Grid";
import { FieldData } from "../packages/grid/types/FieldTypes";
import { CgCornerDoubleLeftDown } from "react-icons/cg";
import "../styles/Field.scss";
import React from "react";
import { useFieldActionContext } from "../context/FieldActionContext";

export interface FieldProps extends FieldData {
   index: number;
}

export default function Field(props: FieldProps) {
   const { fieldAction, setFieldAction } = useFieldActionContext();

   function handleAction(e: React.MouseEvent<Element, MouseEvent>, action: "resize" | "reposition") {
      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
      const fieldRect = field.getBoundingClientRect();
      const fieldContainerRect = field.parentElement!.getBoundingClientRect();

      // if the user grabbed the top or the resize icon
      if (action === "resize") {
         const grabbedPos = getGridPosFromPos(
            e.pageX - fieldContainerRect.left + 5,
            e.pageY - fieldContainerRect.top + 5
         );
         setFieldAction({ field: field, index: props.index, action: action, grabbedPos });
         // display grid lines
         (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";
      } else if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         if (field.classList.contains("reposition-selected-border")) {
            // if the field has already been selected
            field.classList.remove("reposition-selected-border");
            setFieldAction(null);
         } else {
            // if another field was already selected
            if (fieldAction?.action === "reposition" && fieldAction.field && fieldAction.field !== field) {
               setFieldAction({
                  ...fieldAction,
                  action: action,
                  targetField: field,
                  targetIndex: props.index,
               });
               fieldAction.field.classList.remove("reposition-selected-border");
               field.classList.remove("reposition-selected-border");
            } else {
               setFieldAction({
                  field: field,
                  index: props.index,
                  action: action,
                  targetField: null,
                  targetIndex: -1,
               });
               field.classList.add("reposition-selected-border");
            }
         }
      }
   }

   function handleHoverStart() {
      if (fieldAction) {
         const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
         if (fieldAction.action === "reposition" && fieldAction.field !== field) {
            field.classList.add("reposition-hover-border");
         }
      }
   }

   function handleHoverEnd() {
      if (fieldAction?.action === "reposition") {
         const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
         field.classList.remove("reposition-hover-border");
      }
   }

   return (
      <div
         className="field"
         onDoubleClick={(e) => handleAction(e, "reposition")}
         onMouseEnter={() => handleHoverStart()}
         onMouseLeave={() => handleHoverEnd()}
      >
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
         <CgCornerDoubleLeftDown className="resizer" onMouseDown={(e) => handleAction(e, "resize")} />
      </div>
   );
}
