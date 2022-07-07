export interface OptionalField {
   title: string;
   body: OptionalFieldBody;
}

// export interface FieldGridData {
//    column: { start: string; end: string };
//    row: { start: string; end: string };
// }

export type OptionalFieldBody = string | string[];
