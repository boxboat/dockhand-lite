export interface IDataAccessor {
  initAsync(): Promise<void>;

  saveAsync(): Promise<boolean>;
}
