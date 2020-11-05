import {isObject} from 'lodash'
import {IArtifactData} from '../spec/buildVersions/IBuildVersions'
import {BuildVersions} from './BuildVersions'
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
    return ['artifacts', this.artifactType, ...this.artifactName.split(/\/|\\/)]
  }

  protected initData(data: IArtifactData | undefined): IArtifactData {
    if (!isObject(data)) {
      return {
        commitMap: {},
        tagMap: {},
      }
    }
    if (!isObject(data.commitMap)) {
      data.commitMap = {}
    }
    if (!isObject(data.tagMap)) {
      data.tagMap = {}
    }
    return data
  }
}
