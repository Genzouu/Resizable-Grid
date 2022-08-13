import { CgCornerDoubleLeftDown } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";

import "../../styles/Field.scss";
import { getGridPosFromPos } from "../../packages/grid/Grid";
import { FieldInfo } from "../../packages/grid/types/FieldTypes";
import { StateType } from "../../redux/reducers";
import { setFieldAction, setFieldModalState } from "../../redux/slices/gridInfoSlice";
import { useContextMenuContext } from "../../context/ContextMenuContext";

export interface FieldProps extends FieldInfo {
   index: number;
   deleteField: (index: number) => void;
}

export default function Field(props: FieldProps) {
   const dispatch = useDispatch();
   const fieldAction = useSelector((state: StateType) => state.gridInfo.fieldAction);
   const contextMenuContext = useContextMenuContext();

   useEffect(() => {
      (document.getElementsByClassName("field-container")[0].children[props.index] as HTMLElement).style.backgroundColor = props.colour;
   }, [props.colour]);

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
            if (fieldAction && fieldAction.action === "reposition") {
               const otherField = (document.getElementById("field-container") as HTMLElement).children[fieldAction.indexOne] as HTMLElement;
               if (fieldAction.idOne !== -1 && otherField !== field) {
                  dispatch(
                     setFieldAction({
                        ...fieldAction,
                        idTwo: props.id,
                        indexTwo: props.index,
                     })
                  );
                  otherField.classList.remove("reposition-selected-border");
                  field.classList.remove("reposition-selected-border");
                  field.classList.remove("reposition-hover-border");
               }
            } else {
               dispatch(
                  setFieldAction({
                     action: action,
                     idOne: props.id,
                     indexOne: props.index,
                     idTwo: -1,
                     indexTwo: -1,
                  })
               );
               field.classList.add("reposition-selected-border");
            }
         }
      }
   }

   function handleHoverStart() {
      if (fieldAction && fieldAction.action === "reposition") {
         const field = document.getElementById("field-container")?.children[props.index] as HTMLElement;
         const otherField = (document.getElementById("field-container") as HTMLElement).children[fieldAction.indexTwo] as HTMLElement;
         if (fieldAction.idOne !== props.id && otherField !== field) {
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
         items: [
            { text: "Edit", onClick: () => dispatch(setFieldModalState({ show: true, editIndex: props.index })) },
            { text: "Delete", colourTheme: "red", onClick: () => props.deleteField(props.id) },
         ],
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
            <div className="body scrollable">{props.content}</div>
         ) : (
            <div className="item-container scrollable">
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
