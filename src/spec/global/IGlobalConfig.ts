import {IRepoConfig} from '../repo/IRepoConfig'

export interface IGlobalConfig {
  artifactRepoMap: Map<string, any>;
  buildVersionsRepo: IGitConnectionRepo;
  environmentMap: Map<string, any>;
  gitConnectionMap: IGitConnection;
  repo: IRepoConfig;
}

export interface IGitConnection {
  authorEmail: string;
  authorName: string;
  remoteHost: string;
  remotePathPrefix: string;
  sshUser: string;
  sshKeyFile: string;
}

export interface IGitConnectionRepo {
  gitConnectionKey: string;
  path: string;
  ref: string;
}
