import { getGridPosFromPos } from "../types/Grid";
import { OptionalField } from "../types/FieldData";
import { ResizingFieldInfo } from "./App";
import { CgCornerDoubleLeftDown } from "react-icons/cg";
import "../styles/Field.scss";

export interface FieldProps extends OptionalField {
   index: number;
   setResizingFieldInfo: (info: ResizingFieldInfo | null) => void;
}

export default function Field(props: FieldProps) {
   function manageOnMouseDown(e: React.MouseEvent<SVGElement, MouseEvent>) {
      const field = document.getElementById("fields-container")?.children[props.index] as HTMLElement;

      const fieldContainerRect = field.parentElement!.getBoundingClientRect();
      const grabbedPos = getGridPosFromPos(e.pageX - fieldContainerRect.left + 5, e.pageY - fieldContainerRect.top + 5);
      const fieldRect = field.getBoundingClientRect();

      // if the grabbed position is between the outer edge of the field and the inner edge of its padding
      let edge: "left" | "right" | "top" | "bottom" | "invalid" = "invalid";
      if (e.pageX >= fieldRect.left && e.pageX <= fieldRect.left + 20) {
         edge = "left";
      } else if (e.pageX <= fieldRect.right && e.pageX >= fieldRect.right - 20) {
         edge = "right";
      } else if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         edge = "top";
      } else if (e.pageY <= fieldRect.bottom && e.pageY >= fieldRect.bottom - 20) {
         edge = "bottom";
      } else {
         edge = "invalid";
      }

      if (edge !== "invalid") {
         props.setResizingFieldInfo({ field: field, edge: edge, grabbedPos: grabbedPos });
         // field.style.cursor = "grabbing";
      } else {
         props.setResizingFieldInfo(null);
      }
   }

   return (
      <div className="field">
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
         <CgCornerDoubleLeftDown className="resizer" onMouseDown={(e) => manageOnMouseDown(e)} />
      </div>
   );
}
