import { CgCornerDoubleLeftDown } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

import "../styles/Field.scss";
import { getGridPosFromPos } from "../packages/grid/Grid";
import { FieldContent } from "../packages/grid/types/FieldTypes";
import { StateType } from "../redux/reducers";
import { setFieldAction } from "../redux/slices/gridInfoSlice";
import { IoCloseSharp } from "react-icons/io5";
import { useContextMenuContext } from "../context/ContextMenuContext";

export interface FieldProps extends FieldContent {
   index: number;
   deleteField: (index: number) => void;
}

export default function Field(props: FieldProps) {
   const dispatch = useDispatch();
   const fieldAction = useSelector((state: StateType) => state.gridInfo.fieldAction);
   const contextMenuContext = useContextMenuContext();

   function handleAction(e: React.MouseEvent<Element, MouseEvent>, action: "resize" | "reposition") {
      const field = document.getElementById("field-container")?.children[props.index] as HTMLElement;
      const fieldRect = field.getBoundingClientRect();
      const fieldContainerRect = field.parentElement!.getBoundingClientRect();

      // if the user grabbed the top or the resize icon
      if (action === "resize") {
         const grabbedPos = getGridPosFromPos(e.pageX - fieldContainerRect.left + 5, e.pageY - fieldContainerRect.top + 5);
         dispatch(setFieldAction({ index: props.index, action: action, grabbedPos }));
         // display grid lines
         (document.getElementsByClassName("grid-lines-overlay")[0] as HTMLElement).style.display = "unset";
      } else if (e.pageY >= fieldRect.top && e.pageY <= fieldRect.top + 20) {
         if (field.classList.contains("reposition-selected-border")) {
            // if the field has already been selected
            field.classList.remove("reposition-selected-border");
            dispatch(setFieldAction(null));
         } else {
            // if another field was already selected
            if (fieldAction) {
               const otherField = (document.getElementById("field-container") as HTMLElement).children[fieldAction!.index] as HTMLElement;
               if (fieldAction?.action === "reposition" && fieldAction.index !== -1 && otherField !== field) {
                  dispatch(
                     setFieldAction({
                        ...fieldAction,
                        action: action,
                        targetIndex: props.index,
                     })
                  );
                  otherField.classList.remove("reposition-selected-border");
                  field.classList.remove("reposition-selected-border");
                  field.classList.remove("reposition-hover-border");
               }
            } else {
               dispatch(
                  setFieldAction({
                     index: props.index,
                     action: action,
                     targetIndex: -1,
                  })
               );
               field.classList.add("reposition-selected-border");
            }
         }
      }
   }

   function handleHoverStart() {
      if (fieldAction) {
         const field = document.getElementById("field-container")?.children[props.index] as HTMLElement;
         const otherField = (document.getElementById("field-container") as HTMLElement).children[fieldAction.index] as HTMLElement;
         if (fieldAction.action === "reposition" && otherField !== field) {
            field.classList.add("reposition-hover-border");
         }
      }
   }

   function handleHoverEnd() {
      if (fieldAction?.action === "reposition") {
         const field = document.getElementById("field-container")?.children[props.index] as HTMLElement;
         field.classList.remove("reposition-hover-border");
      }
   }

   function handleContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      e.preventDefault();
      contextMenuContext.setContextMenu({
         items: [{ text: "Edit" }, { text: "Change Colour" }, { text: "Delete", colourTheme: "red", onClick: () => props.deleteField(props.index) }],
         mouseEvent: e,
      });
   }

   return (
      <div
         className="field"
         onDoubleClick={(e) => handleAction(e, "reposition")}
         onMouseEnter={() => handleHoverStart()}
         onMouseLeave={() => handleHoverEnd()}
         onContextMenu={(e) => handleContextMenu(e)}
      >
         <p className="title">{props.title}</p>
         {typeof props.content === "string" ? (
            <textarea className="body" defaultValue={props.content}></textarea>
         ) : (
            <div className="item-container">
               {props.content.map((item, index) => (
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
