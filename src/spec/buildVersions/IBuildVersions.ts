export interface IBuildVersions {
  artifacts: Record<string, IArtifactData>;
  repos: Record<string, IRepoData>;
}

export interface IArtifactData {
  commitMap: ICommitVersionMap;
  tagMap: ITagVersionMap;
}

export interface IRepoData {
  tagPrefixMap: ITagPrefixMap;
}

export type ICommitVersionMap = Record<string, string>     // branch      : version

export type ITagVersionMap = Record<string, string[]>      // releaseType : versions

export type ITagPrefixMap = Record<string, ITagVersionMap> // tagPrefix   : IReleaseVersionMap
