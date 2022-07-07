import { useEffect } from "react";
import { getGridPosFromPos } from "../types/Grid";
import { OptionalField } from "../types/FieldData";
import { ResizingFieldInfo } from "./App";
import "../styles/Field.scss";

export interface FieldProps extends OptionalField {
   index: number;
   setResizingFieldInfo: (info: ResizingFieldInfo | null) => void;
}

export default function Field(props: FieldProps) {
   // useEffect(() => {
   //    // set field grid column and row to a set value so you can create empty spaces (for aesthetic purposes or to add personalisable stickers to fill that space).
   //    // make it so that it behaves like auto if a grid item to the left or top of it pushes it away
   //    const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;
   //    field.style.gridColumn = `${props.column.start} / ${getGridEndString(props.column.end)}`;
   //    field.style.gridRow = `${props.row.start} / ${getGridEndString(props.row.end)}`;
   // }, []);

   function getGridEndString(end: string) {
      if (end === "auto") {
         return "auto";
      } else {
         return parseInt(end) + 1;
      }
   }

   function manageOnMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;

      const fieldContainerRect = field.parentElement!.getBoundingClientRect();
      const grabbedPos = getGridPosFromPos(
         e.pageX - fieldContainerRect.left - 15,
         e.pageY - fieldContainerRect.top - 15
      );
      const fieldRect = field.getBoundingClientRect();

      if (e.pageX >= fieldRect.left && e.pageX <= fieldRect.left + 20) {
         props.setResizingFieldInfo({ field: field, edge: "left", grabbedPos: grabbedPos });
      } else if (e.pageX <= fieldRect.right && e.pageX >= fieldRect.right - 20) {
         props.setResizingFieldInfo({ field: field, edge: "right", grabbedPos: grabbedPos });
      } else if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         props.setResizingFieldInfo({ field: field, edge: "top", grabbedPos: grabbedPos });
      } else if (e.pageY <= fieldRect.bottom && e.pageY >= fieldRect.bottom - 20) {
         props.setResizingFieldInfo({ field: field, edge: "bottom", grabbedPos: grabbedPos });
      } else {
         props.setResizingFieldInfo(null);
      }

      field.style.cursor = "grabbing";
   }

   return (
      <div className="field" onMouseDown={(e) => manageOnMouseDown(e)}>
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
      </div>
   );
}
