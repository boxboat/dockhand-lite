import {IArtifacts} from '../base/IArtifacts'
import {IEvent, IEventRegex} from '../base/IEvent'
import {IGitConnectionRepo} from '../base/IGitConnectionRepo'
import {ITrigger} from '../base/ITrigger'

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

export type ITagPrefixMap = Record<string, ITagVersionMap> // tagPrefix   : ITagVersionMap

export type IRepoTriggerBase = IArtifacts & IEvent & IEventRegex & ITrigger

export interface IRepoTrigger extends IRepoTriggerBase {
  gitRepo: IGitConnectionRepo | undefined;
  deployment: string | undefined;
  promotion: string | undefined;
}

export type IRepoTriggers = IRepoTrigger[]
