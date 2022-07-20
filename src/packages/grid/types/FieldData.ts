export interface OptionalField {
   title: string;
   body: OptionalFieldBody;
}

export type OptionalFieldBody = string | string[];
