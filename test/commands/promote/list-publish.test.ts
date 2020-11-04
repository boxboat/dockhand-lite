import {expect, test} from '@oclif/test'
import {IArtifactPromotion} from '../../../src/lib/artifact/Artifact'

describe('promote:list-publish', () => {
  test
  .stdout()
  .command(['promote:list-publish',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml',
    '--promotion',
    'rc',
    '--gitConnectionKey',
    'local',
    '--gitConnectionPath',
    'service-b'])
  .it('list rc tag artifacts to publish', ctx => {
    const artifacts: IArtifactPromotion[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-b')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('commit/master')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('build-bbbbbbbbbbbb')
    expect(artifacts[0].promoteToEvent).to.eq('tag/rc/1.0')
    expect(artifacts[0].promoteToRepoKey).to.eq('default')
    expect(artifacts[0].promoteToVersion).to.eq('1.0.2-rc.1')
  })

  test
  .stdout()
  .command(['promote:list-publish',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml',
    '--promotion',
    'release',
    '--gitConnectionKey',
    'local',
    '--gitConnectionPath',
    'service-b'])
  .it('list release tag artifacts to publish', ctx => {
    const artifacts: IArtifactPromotion[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-b')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('tag/rc/1.0')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('1.0.2-rc.0')
    expect(artifacts[0].promoteToEvent).to.eq('tag/release/1.0')
    expect(artifacts[0].promoteToRepoKey).to.eq('default')
    expect(artifacts[0].promoteToVersion).to.eq('1.0.2')
  })

  test
  .stdout()
  .command(['promote:list-publish',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml',
    '--promotion',
    'rc',
    '--version',
    'build-bbbbbbbbbbbb',
    '--gitConnectionKey',
    'local',
    '--gitConnectionPath',
    'service-repo-dne'])
  .it('list rc tag artifacts to publish when repo versions does not exist', ctx => {
    const artifacts: IArtifactPromotion[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-b')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('commit/master')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('build-bbbbbbbbbbbb')
    expect(artifacts[0].promoteToEvent).to.eq('tag/rc/1.0')
    expect(artifacts[0].promoteToRepoKey).to.eq('default')
    expect(artifacts[0].promoteToVersion).to.eq('1.0.0-rc.0')
  })
})
