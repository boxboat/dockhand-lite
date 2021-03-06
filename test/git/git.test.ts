import {expect} from 'chai'
import {BuildVersions} from '../../src/buildVersions/BuildVersions'
import {parseGlobalConfigAsync} from '../../src/config/GlobalConfig'
import path from 'path'

describe('git:repo', async () => {
  it('build versions', async () => {
    const global = await parseGlobalConfigAsync([path.join(__dirname, 'data', 'global.yaml')])
    const gitConfig = global.gitConnectionMap?.['local']
    if (gitConfig) {
      gitConfig.pathPrefix = path.join(__dirname, 'data', 'repos')
    }
    if (!global.buildVersions?.gitRepo) {
      throw new Error('buildVersions.gitRepo must be set')
    }

    // clone
    let buildVersions = new BuildVersions(global)
    await buildVersions.initAsync()
    expect(await buildVersions.gitRepo.isBranchTipAsync()).to.be.true

    // read
    let artifactServiceA = await buildVersions.getArtifactDataAsync('docker', 'service-a')
    const artifactServiceB = await buildVersions.getArtifactDataAsync('docker', 'service-b')
    let repoServiceA = await buildVersions.getRepoDataAsync('local', 'service-a')
    expect(artifactServiceA.commitMap.test).to.equal('build-aaaaaaaaaaaa')
    expect(repoServiceA.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.1')

    // dne
    const artifactServiceDNE = await buildVersions.getArtifactDataAsync('docker', 'service-dne')
    const repoServiceDNE = await buildVersions.getRepoDataAsync('local', 'service-dne')

    // write
    artifactServiceA.commitMap.test = 'build-aaaaaaaaaaa0'
    artifactServiceDNE.commitMap.test = 'build-000000000000'
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
    repoServiceA = await buildVersions.getRepoDataAsync('local', 'service-a')
    expect(artifactServiceA.commitMap.test).to.equal('build-aaaaaaaaaaa0')
    expect(artifactServiceB.commitMap.test).to.equal('build-bbbbbbbbbbbb')
    expect(repoServiceA.tagPrefixMap[''].release.slice(-1)[0]).to.equal('1.0.2')
  })
})
