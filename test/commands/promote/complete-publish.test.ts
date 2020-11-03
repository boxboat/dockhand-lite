import {expect, test} from '@oclif/test'
import {IArtifactPromotion} from '../../../src/lib/artifact/Artifact'

describe('promote:complete-publish', () => {
  test
  .stdout()
  .command(['promote:complete-publish',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml',
    '--promotion',
    'beta',
    '--gitConnectionKey',
    'local',
    '--gitConnectionPath',
    'service-b'])
  .it('saves beta artifacts to build-versions repo', ctx => {
    const artifacts: IArtifactPromotion[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-b')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('commit/master')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('build-bbbbbbbbbbbb')
    expect(artifacts[0].promoteToEvent).to.eq('tag/beta/1.0')
    expect(artifacts[0].promoteToRepoKey).to.eq('default')
    expect(artifacts[0].promoteToVersion).to.eq('1.0.2-beta.0')
  })
})
