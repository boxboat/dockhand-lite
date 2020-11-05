import {artifactPublishRepoKeys, Resolver} from '../artifact/Resolver'
import {IGlobalConfig} from '../../spec/global/IGlobalConfig'
import {IPromote} from '../../spec/repo/IPromote'
import {IArtifactPromotion} from '../artifact/Artifact'
import {BuildVersions} from '../../buildVersions/BuildVersions'
import {detectGitRepoAsync, GitRepo} from '../../git/GitRepo'
import semver from 'semver'
import {IRepoData} from '../../spec/buildVersions/IBuildVersions'

export class Promote {
  public promoteConfig: IPromote

  public globalConfig: IGlobalConfig

  private gitRepo: GitRepo | undefined

  constructor(globalConfig: IGlobalConfig, promoteConfig: IPromote) {
    this.globalConfig = globalConfig
    this.promoteConfig = promoteConfig
  }

  public async listPublishAsync(
    promotionKey: string,
    filterArtifactType: string | undefined,
    filterArtifactName: string | undefined,
    forceEvent: string | undefined,
    forceVersion: string | undefined,
    gitConnectionKey: string | undefined,
    gitConnectionPath: string | undefined,
    tags: string[] | undefined,
    tagsTip: string[] | undefined,
  ): Promise<IArtifactPromotion[]> {
    if (!this.promoteConfig.promotionMap) {
      console.error('warning: promote.promotionMap is not set')
      return []
    }
    if (!this.promoteConfig.artifactPublishEvents) {
      console.error('warning: promote.artifactPublishEvents is not set')
      return []
    }
    const promotion = this.promoteConfig.promotionMap[promotionKey]
    if (!promotion) {
      console.error(`warning: promote.promotionMap.${promotionKey} is not set`)
      return []
    }
    if (!promotion.artifacts) {
      console.error('warning: promote.artifacts is not set')
      return []
    }
    if (!promotion.promoteToEvent) {
      console.error(`warning: promote.promotionMap.${promotionKey}.promoteToEvent is not set`)
      return []
    }
    if (!promotion.promoteToEvent.startsWith('tag/')) {
      throw new Error(`promote.promotionMap.${promotionKey}.promoteToEvent must start with 'tag/'`)
    }
    promotion.promoteToEvent = this.normalizeTagEvent(promotion.promoteToEvent, `promote.promotionMap.${promotionKey}.promoteToEvent`)

    const buildVersions = new BuildVersions(this.globalConfig)
    await buildVersions.initAsync()
    const repoData = await buildVersions.getRepoDataAsync(await this.gitConnectionKeyAsync(gitConnectionKey), await this.gitConnectionPathAsync(gitConnectionPath))
    const versionAndTags = await this.versionAndTagsAsync(repoData, promotion.promoteToEvent, tags, tagsTip)

    if (forceEvent) {
      promotion.event = this.normalizeTagEvent(forceEvent, '--event')
    } else if (promotion.event) {
      promotion.event = this.normalizeTagEvent(promotion.event, `promote.promotionMap.${promotionKey}.event`)
    } else {
      console.error(`warning: promote.promotionMap.${promotionKey}.event is not set`)
      return []
    }

    const artifactPromotions: IArtifactPromotion[] = []
    const resolver = new Resolver(promotion, filterArtifactType, filterArtifactName)
    for (const artifact of await resolver.resolveAsync(this.promoteConfig.artifactPublishEvents, this.globalConfig.artifactRepoMap, buildVersions, {forceVersion})) {
      for (const repoKey of artifactPublishRepoKeys(this.promoteConfig.artifactPublishEvents, artifact.type, promotion.promoteToEvent)) {
        for (const versionOrTag of versionAndTags) {
          artifactPromotions.push({
            ...artifact,
            promoteToEvent: promotion.promoteToEvent,
            promoteToRepoKey: repoKey,
            promoteToRepo: this.globalConfig.artifactRepoMap?.[repoKey],
            promoteToVersion: versionOrTag,
          })
        }
      }
    }

    return artifactPromotions
  }

  public async completePublishAsync(
    promotionKey: string,
    filterArtifactType: string | undefined,
    filterArtifactName: string | undefined,
    forceEvent: string | undefined,
    forceVersion: string | undefined,
    gitConnectionKey: string | undefined,
    gitConnectionPath: string | undefined,
    tags: string[] | undefined,
    tagsTip: string[] | undefined,
  ): Promise<IArtifactPromotion[]> {
    const artifactSet = new Set<string>()
    const artifactPromotions = await this.listPublishAsync(
      promotionKey,
      filterArtifactType,
      filterArtifactName,
      forceEvent,
      forceVersion,
      gitConnectionKey,
      gitConnectionPath,
      tags,
      tagsTip)
    if (artifactPromotions.length === 0) {
      return artifactPromotions
    }

    const buildVersions = new BuildVersions(this.globalConfig)
    await buildVersions.initAsync()

    const gitTagCommitObjectSet = new Set<string>()
    let promoteToData: {
      releaseType: string;
      version: string;
    } | undefined

    const promises: Promise<void>[] = []
    for (const artifactPromotion of artifactPromotions) {
      const key = `${artifactPromotion.type}/${artifactPromotion.name}`
      if (artifactSet.has(key)) {
        continue
      }

      promoteToData = {
        releaseType: artifactPromotion.promoteToEvent.split('/')[1],
        version: artifactPromotion.promoteToVersion,
      }

      artifactSet.add(key)
      promises.push((async () => {
        const artifactData = await buildVersions.getArtifactDataAsync(artifactPromotion.type, artifactPromotion.name)
        artifactData.tagMap[promoteToData.releaseType] = artifactPromotion.promoteToVersion
      })())

      if (!this.promoteConfig.gitTagDisable) {
        if (artifactPromotion.event.startsWith('commit/')) {
          gitTagCommitObjectSet.add(artifactPromotion.version.substr(-12))
        } else if (artifactPromotion.event.startsWith('tag/')) {
          gitTagCommitObjectSet.add(artifactPromotion.version)
        }
      }
    }

    if (promoteToData) {
      promises.push((async () => {
        const repoData = await buildVersions.getRepoDataAsync(await this.gitConnectionKeyAsync(gitConnectionKey), await this.gitConnectionPathAsync(gitConnectionPath))
        if (!repoData.tagPrefixMap[this.promoteConfig.tagPrefix ?? '']) {
          repoData.tagPrefixMap[this.promoteConfig.tagPrefix ?? ''] = {}
        }
        if (!repoData.tagPrefixMap[this.promoteConfig.tagPrefix ?? ''][promoteToData.releaseType]) {
          repoData.tagPrefixMap[this.promoteConfig.tagPrefix ?? ''][promoteToData.releaseType] = []
        }
        repoData.tagPrefixMap[this.promoteConfig.tagPrefix ?? ''][promoteToData.releaseType].push(promoteToData.version)
      })())
    }

    await Promise.all(promises)
    if (await buildVersions.saveAsync()) {
      await buildVersions.gitRepo.commitAndPushAsync('update build versions')
    }

    if (!this.promoteConfig.gitTagDisable && promoteToData) {
      if (gitTagCommitObjectSet.size === 0) {
        console.error('not tagging git repo; unable to detect commit/object to tag')
      } else if (gitTagCommitObjectSet.size > 1) {
        console.error(`not tagging git repo; found multiple commits/objects to tag: ${[...gitTagCommitObjectSet].join(', ')}`)
      } else {
        const fullClone = new GitRepo(this.globalConfig, {
          gitConnectionKey: await this.gitConnectionKeyAsync(gitConnectionKey),
          path: await this.gitConnectionPathAsync(gitConnectionPath),
          ref: undefined,
        })
        await fullClone.ensureClonedAsync()
        await fullClone.tagAndPushAsync(`${this.promoteConfig.tagPrefix ?? ''}${promoteToData.version}`, {commitOrObject: [...gitTagCommitObjectSet][0]})
      }
    }

    return artifactPromotions
  }

  private normalizeTagEvent(event: string, errorPath: string): string {
    const segments = event.split('/')
    if (segments[0] === 'tag') {
      if (segments.length < 2 || segments.length > 3) {
        throw new Error(`${errorPath} must be in the format 'tag/<release type>[/<semver range>]`)
      }
      if (segments.length === 3) {
        if (!semver.validRange(segments[2])) {
          throw new Error(`${errorPath}  semver range '${segments[2]}' is invalid`)
        }
      }
      if (segments.length === 2 && this.promoteConfig.baseVersion) {
        if (!semver.validRange(this.promoteConfig.baseVersion)) {
          throw new Error(`promote.baseVersion semver range '${this.promoteConfig.baseVersion}' is invalid`)
        }
        segments.push(this.promoteConfig.baseVersion)
      }
    }
    return segments.join('/')
  }

  private async gitConnectionKeyAsync(gitConnectionKey: string | undefined): Promise<string> {
    return gitConnectionKey ?? (await this.gitRepoAsync()).gitConnectionRepo.gitConnectionKey as string
  }

  private async gitConnectionPathAsync(gitConnectionPath: string | undefined): Promise<string> {
    return gitConnectionPath ?? (await this.gitRepoAsync()).gitConnectionRepo.path as string
  }

  private async gitRepoAsync(): Promise<GitRepo> {
    if (!this.gitRepo) {
      this.gitRepo = await detectGitRepoAsync(this.globalConfig, '.')
    }
    return this.gitRepo
  }

  private async versionAndTagsAsync(repoData: IRepoData, event: string, tags: string[] | undefined, tagsTip: string[] | undefined): Promise<string[]> {
    const segments = event.split('/')
    const allTags: string[] = []

    const tagType = segments[1]
    let versionRange = segments.length > 2 ? segments[2] : '*.*.*'
    if (semver.valid(versionRange)) {
      versionRange = `~${versionRange}`
    }

    const versions = []
    const semverOptions: semver.Options = {}
    if (tagType !== 'release') {
      semverOptions.includePrerelease = true
      const rcVersions = repoData?.tagPrefixMap?.[this.promoteConfig.tagPrefix ?? '']?.[tagType]
      if (rcVersions) {
        versions.push(...rcVersions)
      }
    }
    const releaseVersion = repoData?.tagPrefixMap?.[this.promoteConfig.tagPrefix ?? '']?.['release']
    if (releaseVersion) {
      versions.push(...releaseVersion)
    }

    let version: string | null | undefined
    if (versions.length > 0) {
      const maxVersion = semver.maxSatisfying(versions, versionRange, semverOptions)
      if (maxVersion) {
        version = semver.inc(maxVersion, tagType === 'release' ? 'patch' : 'prerelease', tagType === 'release' ? undefined : tagType)
      }
    }

    if (!version) {
      const minVersion = semver.minVersion(versionRange)?.version
      if (minVersion && minVersion !== '0.0.0') {
        version = minVersion
      } else {
        version = '0.0.1'
      }
      if (tagType !== 'release') {
        version += `-${tagType}.0`
      }
    }

    allTags.push(version)
    if (tags && tags.length > 0) {
      allTags.push(...tags)
    }
    if (tagsTip && tagsTip.length > 0) {
      versions.push(version)
      const maxVersionRange = semver.maxSatisfying(versions, versionRange, semverOptions)
      const maxVersionAll = semver.maxSatisfying(versions, '*.*.*', semverOptions)
      if (maxVersionRange && maxVersionAll && maxVersionRange === maxVersionAll) {
        allTags.push(...tagsTip)
      }
    }

    return allTags
  }
}
