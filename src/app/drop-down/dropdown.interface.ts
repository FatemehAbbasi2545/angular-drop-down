
export interface ListItemModel {
    Key: number | string;
    Value: number | string;
}

export interface DropdownOutputModel {
    key: number | string | null;
    title: number | string | null;
    item: ListItemModel | null;
}

