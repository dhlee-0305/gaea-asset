export interface CodeData {
  id: number;
  category: string;
  categoryName: string;
  code: string;
  codeName: string;
  isNew?: boolean;
  isEditing?: boolean;
  isDeletable?: boolean;
}

export interface CodeGroupData {
  [category: string]: { id: string; code: string; codeName: string }[];
}
