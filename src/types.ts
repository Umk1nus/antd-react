export type TElementType = {
  key: React.Key;
  name: string;
  date: number;
  num: number;
}

export enum Actions {
  Update = "UPDATE",
  Add = "ADD"
}