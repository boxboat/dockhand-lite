import {IGitConnectionRepo} from '../base/IGitConnectionRepo'

export interface IGlobalConfig {
  artifactRepoMap: Record<string, any> | undefined;
  buildVersions: IBuildVersionsGitRepo | undefined;
  environmentMap: Record<string, any> | undefined;
  gitConnectionMap: Record<string, IGitConnection> | undefined;
}

export interface IGitConnection {
  authorEmail: string;
  authorName: string;
  pathPrefix: string;
  remoteHost: string;
  remoteProtocol: string;
  remoteUser: string;
  remotePasswordEnvVar: string;
  sshKeyFile: string;
  sshKeyFileEnvVar: string;
}

export interface IBuildVersionsGitRepo {
  gitRepo: IGitConnectionRepo;
}
