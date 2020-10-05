import {cloneDeep, isEqual} from 'lodash'
import {parseSingleConfigAsync} from '../config/ConfigReader'
import {existsAsync, writeYamlAsync} from '../utils/fs'
import {BuildVersions} from '.'
import path from 'path'
import {IDataAccessor} from './IDataAccessor'

const dataFileName = 'dhl-v1.yaml'

export abstract class DataAccessor<T> implements IDataAccessor {
  public data: T;

  protected buildVersions: BuildVersions

  private original: T;

  constructor(buildVersions: BuildVersions) {
    this.buildVersions = buildVersions
    this.original = this.initData()
    this.data = cloneDeep(this.original)
  }

  protected abstract get fileSegments(): string[]

  protected abstract get schemaRef(): string

  protected abstract initData(): T

  private get filePath(): string {
    return path.join(this.buildVersions.gitRepo.dir, ...this.fileSegments, dataFileName)
  }

  public async initAsync() {
    if (await existsAsync(this.filePath)) {
      try {
        this.original = await parseSingleConfigAsync<T>('#/definitions/IRepoData', this.filePath)
        this.data = cloneDeep(this.original)
      } catch (error) {
        // ignore
      }
    }
  }

  public async saveAsync(): Promise<boolean> {
    if (!isEqual(this.data, this.original)) {
      await writeYamlAsync(this.filePath, this.data)
      return true
    }
    return false
  }
}
