export interface IDataAccessor {
  saveAsync(): Promise<boolean>;
}
