export interface IArtifact {
  name: string;
  type: string;
  event: string;
  repoKey: string | undefined;
  version: string;
}
