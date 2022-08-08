import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { FieldData } from "../packages/grid/types/FieldTypes";
import { StateType } from "../redux/reducers";
import { setFieldAddState, setFields } from "../redux/slices/gridSlice";

import "../styles/AddFieldModal.scss";

export default function AddFieldModal() {
   const [fieldType, setFieldType] = useState<string>("text");
   const [listElements, setListElements] = useState<string[]>([]);

   const dispatch = useDispatch();
   const fields = useSelector((state: StateType) => state.grid.fields);

   function addListElement() {
      const inputElement = document.getElementsByClassName("list-element-input")[0] as HTMLInputElement;
      if (inputElement.value !== "" && !listElements.includes(inputElement.value)) {
         setListElements([...listElements, inputElement.value]);
         inputElement.value = "";
      } else {
         alert("Please enter the name of a unique list element");
      }
   }

   function deleteListElement(index: number) {
      const newListElements = [...listElements];
      newListElements.splice(index, 1);
      setListElements(newListElements);
   }

   function addField() {
      let newField: FieldData | null = null;

      const title = (document.getElementsByClassName("title-input")[0] as HTMLInputElement).value;
      const type = (document.getElementsByClassName("type-select")[0] as HTMLSelectElement).value;
      if (type === "text") {
         const body = (document.getElementsByClassName("body-textarea")[0] as HTMLInputElement).value;
         newField = { id: fields.length, title: title, content: body, pos: { column: 0, row: 0 }, size: { x: 0, y: 0 } };
      } else if (type === "list") {
         newField = { id: fields.length, title: title, content: listElements, pos: { column: 0, row: 0 }, size: { x: 0, y: 0 } };
      } else {
         console.error("Incorrect field type: " + type);
      }

      if (newField) dispatch(setFields([...fields, newField]));
   }

   // add an option for adding to end of grid or to the first empty space
   return (
      <div className="add-field-modal">
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
               <textarea className="body-textarea input-field" />
            </div>
         ) : (
            <div className="list-container">
               <p className="list-text">List</p>
               <div className="list-element-input-container">
                  <input className="list-element-input input-field"></input>
                  <AiOutlinePlus className="add-list-element button" onClick={() => addListElement()} />
               </div>
               <div className="list-elements">
                  {listElements.map((element, index) => (
                     <div className="list-element-container">
                        <p className="list-element-text" key={index}>
                           {element}
                        </p>
                        <IoCloseSharp className="delete-list-element button" onClick={() => deleteListElement(index)} />
                     </div>
                  ))}
               </div>
            </div>
         )}
         <button
            className="add-field input-field button"
            onClick={() => {
               addField();
               dispatch(setFieldAddState(false));
            }}
         >
            Add Field
         </button>
      </div>
   );
}
