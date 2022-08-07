import { createContext, ReactNode, useContext, useState } from "react";

interface IFieldModalContext {
   addState: boolean;
   editState: boolean;
   setAddState: (addState: boolean) => void;
   setEditState: (editState: boolean) => void;
}

export const FieldModalContext = createContext<IFieldModalContext>({ addState: false, editState: false, setAddState: () => {}, setEditState: () => {} });

const FieldModalProvider = ({ children }: { children: ReactNode }) => {
   const [addState, setAddState] = useState(false);
   const [editState, setEditState] = useState(false);
   return (
      <FieldModalContext.Provider value={{ addState: addState, editState: editState, setAddState: setAddState, setEditState: setEditState }}>
         {children}
      </FieldModalContext.Provider>
   );
};

export const useFieldModalContext = () => {
   const fieldModalContext = useContext(FieldModalContext);
   if (!fieldModalContext) {
      throw new Error("Couldn't find the provider for FieldModalContext");
   }
   return fieldModalContext;
};

export default FieldModalProvider;
