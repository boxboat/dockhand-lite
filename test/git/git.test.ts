import {expect} from 'chai'
import {BuildVersions} from '../../src/buildVersions/BuildVersions'
import {parseGlobalConfigAsync} from '../../src/config/GlobalConfig'
import path from 'path'

describe('git:repo', async () => {
  it('build versions', async () => {
    const {global} = await parseGlobalConfigAsync([path.join(__dirname, 'data', 'global.yaml')])
    const gitConfig = global.gitConnectionMap?.['local']
    if (gitConfig) {
      gitConfig.pathPrefix = path.join(__dirname, 'data', 'repos')
    }
    if (!global.buildVersionsRepo) {
      throw new Error('buildVersionsRepo must be set')
    }

    // clone
    let buildVersions = new BuildVersions(global)
    await buildVersions.initAsync()
    expect(await buildVersions.gitRepo.isBranchTipAsync()).to.be.true

    // read
    let artifactServiceA = await buildVersions.getArtifactDataAsync('docker', 'service-a')
    let artifactServiceB = await buildVersions.getArtifactDataAsync('docker', 'service-b')
    let repoServiceA = await buildVersions.getRepoDataAsync('local', 'service-a')
    let repoServiceB = await buildVersions.getRepoDataAsync('local', 'service-b')
    expect(artifactServiceA.commitMap.master).to.equal('build-aaaaaaaaaaaa')
    expect(artifactServiceB.commitMap.master).to.equal('build-bbbbbbbbbbbb')
    expect(repoServiceA.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.1')
    expect(repoServiceB.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.2')

    // dne
    const artifactServiceDNE = await buildVersions.getArtifactDataAsync('docker', 'service-dne')
    const repoServiceDNE = await buildVersions.getRepoDataAsync('local', 'service-dne')

    // write
    artifactServiceA.commitMap.master = 'build-aaaaaaaaaaa0'
    artifactServiceDNE.commitMap.master = 'build-000000000000'
    repoServiceA.tagPrefixMap[''].release.push('1.0.2')
    repoServiceDNE.tagPrefixMap[''] = {
      release: ['1.0.0'],
    }
    await buildVersions.saveAsync()

    // destroy and clone again
    await buildVersions.gitRepo.destroyAsync()
    buildVersions = new BuildVersions(global)
    await buildVersions.initAsync()

    artifactServiceA = await buildVersions.getArtifactDataAsync('docker', 'service-a')
    artifactServiceB = await buildVersions.getArtifactDataAsync('docker', 'service-b')
    repoServiceA = await buildVersions.getRepoDataAsync('local', 'service-a')
    repoServiceB = await buildVersions.getRepoDataAsync('local', 'service-b')
    expect(artifactServiceA.commitMap.master).to.equal('build-aaaaaaaaaaa0')
    expect(artifactServiceB.commitMap.master).to.equal('build-bbbbbbbbbbbb')
    expect(repoServiceA.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.2')
    expect(repoServiceB.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.2')
  })
})
