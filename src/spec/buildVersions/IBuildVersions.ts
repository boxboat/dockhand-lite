export interface IBuildVersions {
  artifacts: Record<string, IArtifactData>;
  repos: Record<string, IRepoData>;
}

export interface IArtifactData {
  commitMap: ICommitVersionMap;
  releaseMap: IReleaseVersionMap;
}

export interface IRepoData {
  tagPrefixMap: ITagPrefixMap;
}

export type ICommitVersionMap = Record<string, string>         // branch      : version

export type IReleaseVersionMap = Record<string, string[]>      // releaseType : versions

export type ITagPrefixMap = Record<string, IReleaseVersionMap> // tagPrefix   : IReleaseVersionMap
