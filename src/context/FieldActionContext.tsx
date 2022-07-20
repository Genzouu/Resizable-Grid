import { createContext, ReactNode, useContext, useState } from "react";
import { FieldActionType } from "../packages/grid/types/FieldTypes";

interface IFieldActionContext {
   fieldAction: FieldActionType | null;
   setFieldAction: (info: FieldActionType) => void;
}

export const FieldActionContext = createContext<IFieldActionContext | null>(null);

const FieldActionProvider = ({ children }: { children: ReactNode }) => {
   const [fieldAction, setFieldAction] = useState<FieldActionType | null>(null);
   return (
      <FieldActionContext.Provider value={{ fieldAction: fieldAction, setFieldAction: setFieldAction }}>
         {children}
      </FieldActionContext.Provider>
   );
};

export const useFieldActionContext = () => {
   const fieldActionContext = useContext(FieldActionContext);
   if (!fieldActionContext) {
      throw new Error("Couldn't find the provider for FieldActionContext");
   }
   return fieldActionContext;
};

export default FieldActionProvider;
