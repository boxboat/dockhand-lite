interface IFileUpdateMethod {
  orphanBranch: IFile;
}

interface IFile {
  branch: string;
  fileNameTemplate: string;
}
