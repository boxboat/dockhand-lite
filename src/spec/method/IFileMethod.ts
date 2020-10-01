interface IFileUpdateMethod {
  orphanBranch: IFile | undefined;
}

interface IFile {
  branch: string | undefined;
  fileNameTemplate: string | undefined;
}
