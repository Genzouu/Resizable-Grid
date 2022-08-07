import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";

import "../styles/AddFieldModal.scss";

export default function AddFieldModal() {
   const [fieldType, setFieldType] = useState<string>("text");
   const [listElements, setListElements] = useState<string[]>(["test 1", "test 2", "3", "4", "5", "6", "7", "8", "9", "10"]);

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
         <button className="add-field input-field button">Add Field</button>
      </div>
   );
}
