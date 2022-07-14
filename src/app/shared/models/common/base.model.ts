export enum RowState {
    added = 'Added',
    deleted = 'Deleted',
    modified = 'Modified',
    unchanged = 'Unchanged'
}

export class BaseModel {
    public rowState: RowState = RowState.unchanged;
}
