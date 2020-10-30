export interface ITrigger {
  trigger: boolean | undefined;
  triggerBranch: string | undefined;
  triggerAction: ITriggerAction | undefined;
}

export interface ITriggerAction {
  clone: boolean | undefined;
  cloneRef: string | undefined;
  script: string | string[] | undefined;
}
