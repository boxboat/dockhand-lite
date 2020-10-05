import {IRepoConfigFile} from '../repo/IRepoConfig'

export interface IGlobalConfig {
  artifactRepoMap: Record<string, any> | undefined;
  buildVersionsRepo: IGitConnectionRepo | undefined;
  environmentMap: Record<string, any> | undefined;
  gitConnectionMap: Record<string, IGitConnection> | undefined;
}

export interface IGlobalConfigFile extends IGlobalConfig {
  repo: IRepoConfigFile;
}

export interface IGitConnection {
  authorEmail: string;
  authorName: string;
  pathPrefix: string;
  remoteHost: string;
  sshUser: string;
  sshKeyFile: string;
}

export interface IGitConnectionRepo {
  gitConnectionKey: string | undefined;
  path: string | undefined;
  ref: string | undefined;
}
