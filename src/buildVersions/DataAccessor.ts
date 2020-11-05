import {cloneDeep, isEqual} from 'lodash'
import {existsAsync, mkdirAsync, readYamlAsync, writeYamlAsync} from '../utils/fs'
import {BuildVersions} from './BuildVersions'
import path from 'path'
import {IDataAccessor} from './IDataAccessor'

const dataFileName = 'dhl-v1.yaml'

export abstract class DataAccessor<T> implements IDataAccessor {
  private data: T | undefined;

  protected buildVersions: BuildVersions

  private original: T | undefined;

  constructor(buildVersions: BuildVersions) {
    this.buildVersions = buildVersions
  }

  protected abstract get fileSegments(): string[]

  protected abstract initData(data: T | undefined): T

  private get dir(): string {
    return path.join(this.buildVersions.gitRepo.dir, ...this.fileSegments)
  }

  private get filePath(): string {
    return path.join(this.buildVersions.gitRepo.dir, ...this.fileSegments, dataFileName)
  }

  public async dataAsync(): Promise<T> {
    if (this.data === undefined) {
      let rawData: T | undefined
      if (await existsAsync(this.filePath)) {
        try {
          rawData = await readYamlAsync(this.filePath)
        } catch (error) {
          // ignore
        }
      }
      this.data = this.initData(rawData)
      this.original = cloneDeep(this.data)
    }
    return this.data
  }

  public async saveAsync(): Promise<boolean> {
    if (!isEqual(this.data, this.original)) {
      await mkdirAsync(this.dir, {recursive: true})
      await writeYamlAsync(this.filePath, this.data)
      return true
    }
    return false
  }
}
