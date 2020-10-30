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

interface IBuildVersionsGitRepo {
  gitRepo: IGitConnectionRepo;
}

export interface IGitConnectionRepo {
  gitConnectionKey: string | undefined;
  path: string | undefined;
  ref: string | undefined;
}
