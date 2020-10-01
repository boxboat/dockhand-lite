interface IOrphanBranchUpdateMethod {
  orphanBranch: IOrphanBranch | undefined;
}

interface IOrphanBranch {
  branchNameTemplate: string | undefined;
  imageVersionsFile: string | undefined;
}
