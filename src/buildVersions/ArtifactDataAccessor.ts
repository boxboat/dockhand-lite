import {IArtifactData} from '../spec/buildVersions/IBuildVersions'
import {BuildVersions} from '.'
import {DataAccessor} from './DataAccessor'

export class ArtifactDataAccessor extends DataAccessor<IArtifactData> {
  private artifactType: string;

  private artifactName: string;

  constructor(buildVersions: BuildVersions, artifactType: string, artifactName: string) {
    super(buildVersions)
    this.artifactType = artifactType
    this.artifactName = artifactName
  }

  protected get fileSegments(): string[] {
    return ['artifacts', this.artifactType, ...this.artifactName.split('/')]
  }

  protected get schemaRef(): string {
    return '#/definitions/IArtifactData'
  }

  protected initData(): IArtifactData {
    return {
      commitMap: {},
      releaseMap: {},
    }
  }
}
