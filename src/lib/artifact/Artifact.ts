export interface IArtifact {
  name: string;
  type: string;
  event: string;
  repoKey: string;
  repo: any;
  version: string;
}

export type IArtifactMap = Record<string, Record<string, IArtifact>>

export function artifactMapToList(artifactMap: IArtifactMap): IArtifact[] {
  const artifacts: IArtifact[] = []
  for (const artifactNameMap of Object.values(artifactMap)) {
    artifacts.push(...Object.values(artifactNameMap))
  }
  return artifacts
}

export function artifactListToMap(artifacts: IArtifact[]): IArtifactMap {
  const artifactMap: IArtifactMap = {}
  for (const artifact of artifacts) {
    if (!artifactMap[artifact.type]) {
      artifactMap[artifact.type] = {}
    }
    artifactMap[artifact.type][artifact.name] = artifact
  }
  return artifactMap
}
