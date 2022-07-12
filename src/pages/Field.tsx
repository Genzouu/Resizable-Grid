import { getGridPosFromPos } from "../types/Grid";
import { OptionalField } from "../types/FieldData";
import { ResizingFieldInfo } from "./App";
import { CgCornerDoubleLeftDown } from "react-icons/cg";
import "../styles/Field.scss";
import React from "react";

export interface FieldProps extends OptionalField {
   index: number;
   setResizingFieldInfo: (info: ResizingFieldInfo | null) => void;
}

export default function Field(props: FieldProps) {
   function manageOnResize(e: React.MouseEvent<SVGElement, MouseEvent>) {
      // display the grid lines
      (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";

      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;

      const fieldContainerRect = field.parentElement!.getBoundingClientRect();
      const grabbedPos = getGridPosFromPos(e.pageX - fieldContainerRect.left + 5, e.pageY - fieldContainerRect.top + 5);

      props.setResizingFieldInfo({ field: field, edge: "bottom-right", grabbedPos: grabbedPos });
      // field.style.cursor = "grabbing";
   }

   function manageOnReposition(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      // display the grid lines
      (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";

      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
      const fieldRect = field.getBoundingClientRect();

      if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         // props.setResizingFieldInfo({ field: field, edge: "bottom-right", grabbedPos: grabbedPos });
      }
   }

   return (
      <div className="field" onMouseDown={(e) => manageOnReposition(e)}>
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
         <CgCornerDoubleLeftDown className="resizer" onMouseDown={(e) => manageOnResize(e)} />
      </div>
   );
}
