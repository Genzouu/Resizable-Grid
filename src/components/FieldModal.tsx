import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addToGrid, displayGrid, getNewId } from "../packages/grid/Grid";
import { FieldContent } from "../packages/grid/types/FieldTypes";
import { StateType } from "../redux/reducers";
import { setFieldModalState, setFields, setFieldsAndGrid } from "../redux/slices/gridInfoSlice";

import "../styles/FieldModal.scss";

export default function FieldModal() {
   const [fieldType, setFieldType] = useState<string>("text");
   const [list, setList] = useState<string[]>([]);
   const [body, setBody] = useState<string>("");

   const dispatch = useDispatch();
   const gridInfo = useSelector((state: StateType) => state.gridInfo);

   useEffect(() => {
      if (gridInfo.modalStates.editIndex !== -1) {
         const fieldInfo = gridInfo.fields[gridInfo.modalStates.editIndex];
         if (typeof fieldInfo.content === "string") {
            setBody(fieldInfo.content);
         } else {
            setList(fieldInfo.content);
         }
         (document.getElementsByClassName("title-input")[0] as HTMLInputElement).value = fieldInfo.title;

         (document.getElementsByClassName("add-edit-field")[0] as HTMLButtonElement).textContent = "Edit Field";
      } else {
         (document.getElementsByClassName("add-edit-field")[0] as HTMLButtonElement).textContent = "Add Field";
      }
   }, []);

   function addListElement() {
      const inputElement = document.getElementsByClassName("list-element-input")[0] as HTMLInputElement;
      if (inputElement.value !== "" && !list.includes(inputElement.value)) {
         setList([...list, inputElement.value]);
         inputElement.value = "";
      } else {
         alert("Please enter the name of a unique list element");
      }
   }

   function deleteListElement(index: number) {
      const newList = [...list];
      newList.splice(index, 1);
      setList(newList);
   }

   function addField() {
      let newContent: FieldContent | null = null;

      const title = (document.getElementsByClassName("title-input")[0] as HTMLInputElement).value;
      const type = (document.getElementsByClassName("type-select")[0] as HTMLSelectElement).value;
      if (type === "text") {
         const body = (document.getElementsByClassName("body-textarea")[0] as HTMLInputElement).value;
         newContent = { title: title, content: body };
      } else if (type === "list") {
         newContent = { title: title, content: list };
      } else {
         console.error("Incorrect field type: " + type);
      }

      if (newContent) {
         let newGrid = [...gridInfo.grid];
         const id = getNewId(newGrid);
         addToGrid(newGrid, gridInfo.size, id);
         displayGrid(newGrid, gridInfo.size.x);

         let newFields = [...gridInfo.fields];
         newFields.push({ id: id, ...newContent });
         dispatch(setFieldsAndGrid({ fields: newFields, grid: newGrid }));

         dispatch(setFieldModalState({ show: false }));
      }
   }

   function editField() {
      const title = (document.getElementsByClassName("title-input")[0] as HTMLInputElement).value;
      const type = (document.getElementsByClassName("type-select")[0] as HTMLSelectElement).value;

      const fieldIndex = gridInfo.modalStates.editIndex;

      let newFields = [...gridInfo.fields];
      let newField = { ...newFields[fieldIndex] };
      newField.title = title;
      if (type === "text") {
         newField.content = body;
      } else if (type === "list") {
         newField.content = list;
      } else {
         console.error("Incorrect field type: " + type);
      }
      newFields[fieldIndex] = newField;
      dispatch(setFields(newFields));

      dispatch(setFieldModalState({ show: false }));
   }

   // add an option for adding to end of grid or to the first empty space
   // make it so the body text expands/shrinks to the size of the text then at some point becomes scrollable
   return (
      <div className="field-modal">
         <div className="title-container">
            <p className="title-text">Title</p>
            <input type="text" className="title-input input-field" />
         </div>
         <div className="type-container">
            <p className="type-text">Type</p>
            <select className="type-select input-field" onChange={(e) => setFieldType(e.target.value)}>
               <option value="text">Text</option>
               <option value="list">List</option>
            </select>
         </div>
         {fieldType === "text" ? (
            <div className="body-container">
               <p className="body-text">Body</p>
               <textarea className="body-textarea input-field" value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
         ) : (
            <div className="list-container">
               <p className="list-text">List</p>
               <div className="list-element-input-container">
                  <input className="list-element-input input-field"></input>
                  <AiOutlinePlus className="add-list-element button" onClick={() => addListElement()} />
               </div>
               <div className="list-elements">
                  {list.map((element, index) => (
                     <div className="list-element-container" key={index}>
                        <p className="list-element-text">{element}</p>
                        <IoCloseSharp className="delete-list-element button" onClick={() => deleteListElement(index)} />
                     </div>
                  ))}
               </div>
            </div>
         )}
         <button
            className="add-edit-field input-field button"
            onClick={() => {
               if (gridInfo.modalStates.editIndex === -1) {
                  addField();
               } else {
                  editField();
               }
            }}
         ></button>
      </div>
   );
}
