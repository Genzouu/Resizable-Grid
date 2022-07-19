import { getGridPosFromPos } from "../types/Grid";
import { OptionalField } from "../types/FieldData";
import { FieldActionInfo } from "./App";
import { CgCornerDoubleLeftDown } from "react-icons/cg";
import "../styles/Field.scss";
import React from "react";

export interface FieldProps extends OptionalField {
   index: number;
   setFieldActionInfo: (info: FieldActionInfo | null) => void;
}

export default function Field(props: FieldProps) {
   function manageAction(e: React.MouseEvent<Element, MouseEvent>, action: "resize" | "reposition") {
      // display the grid lines

      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
      const fieldRect = field.getBoundingClientRect();
      const fieldContainerRect = field.parentElement!.getBoundingClientRect();
      let grabbedPos: { column: number; row: number } | null = null;

      // if the user grabbed the top or the resize icon
      if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         grabbedPos = { column: e.pageX, row: e.pageY };
         field.style.cursor = "grabbing";
      } else if (action === "resize") {
         grabbedPos = getGridPosFromPos(e.pageX - fieldContainerRect.left + 5, e.pageY - fieldContainerRect.top + 5);
      }

      if (grabbedPos) {
         props.setFieldActionInfo({ field: field, action: action, grabbedPos });
         // display grid lines
         (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";
      }
   }

   return (
      <div className="field" onMouseDown={(e) => manageAction(e, "reposition")}>
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
