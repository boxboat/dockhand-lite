import {IRepoConfigFile} from '../repo/IRepoConfig'

export interface IGlobalConfig {
  artifactRepoMap: Map<string, any> | undefined;
  buildVersionsRepo: IGitConnectionRepo | undefined;
  environmentMap: Map<string, any> | undefined;
  gitConnectionMap: IGitConnection | undefined;
}

export interface IGlobalConfigFile extends IGlobalConfig {
  repo: IRepoConfigFile;
}

export interface IGitConnection {
  authorEmail: string | undefined;
  authorName: string | undefined;
  remoteHost: string | undefined;
  remotePathPrefix: string | undefined;
  sshUser: string | undefined;
  sshKeyFile: string | undefined;
}

export interface IGitConnectionRepo {
  gitConnectionKey: string | undefined;
  path: string | undefined;
  ref: string | undefined;
}
