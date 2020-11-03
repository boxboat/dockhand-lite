export interface ITrigger {
  trigger: boolean | undefined;
  triggerAction: ITriggerAction | undefined;
  triggerBranch: string | undefined;
  triggerName: string | undefined;
}

export interface ITriggerAction {
  clone: boolean | undefined;
  script: string | string[] | undefined;
}
