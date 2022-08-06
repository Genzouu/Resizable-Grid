import { useState } from "react";

import "../styles/AddFieldModal.scss";

export default function AddFieldModal() {
   const [fieldType, setFieldType] = useState<string>("text");
   const [listElements, setListElements] = useState<string[]>([]);

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
               <div className="list-elements">
                  <input></input>
               </div>
            </div>
         )}
      </div>
   );
}
