interface IOrphanBranchUpdateMethod {
  orphanBranch: IOrphanBranch;
}

interface IOrphanBranch {
  branchNameTemplate: string;
  imageVersionsFile: string;
}
