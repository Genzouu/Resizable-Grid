export interface FieldData {
   title: string;
   body: FieldBody;
}

export type FieldBody = string | string[];

export type FieldActionType = {
   field: HTMLElement;
} & (ResizeFieldType | RepositionFieldType);

type ResizeFieldType = {
   action: "resize";
   grabbedPos: { column: number; row: number };
};

type RepositionFieldType = {
   action: "reposition";
};
