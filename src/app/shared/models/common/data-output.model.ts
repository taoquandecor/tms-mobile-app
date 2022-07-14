export class DataOutput {
  public tableName: string | undefined;
  public searchColumn: string | undefined;
  public searchValue: any;
  public changedColumn: string | undefined;
  public changedValue: any;
  public changedValueOld: any;
  public success: boolean | undefined;
  public message: string | undefined;
  public dataOutputs: DataOutput[] | undefined;

  public constructor(
    fields?: {
      tableName?: string,
      searchColumn?: string,
      searchValue?: any,
      changedColumn?: string,
      changedValue?: any,
      changedValueOld?: any,
      success?: boolean
    }) {
   if (fields) Object.assign(this, fields);
  }
}
