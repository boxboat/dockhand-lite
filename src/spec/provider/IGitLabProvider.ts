interface IGitLabCiProvider {
  gitLab: IGitLab | undefined;
}

interface IGitLab {
  ciFile: string | undefined;
}
