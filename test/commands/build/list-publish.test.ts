import {expect, test} from '@oclif/test'
import {IArtifact} from '../../../src/lib/artifact/IArtifact'

describe('build:list-publish', () => {
  test
  .stdout()
  .command(['build:list-publish',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml',
    '--event',
    'commit/master'])
  .it('lists artifact to publish', ctx => {
    const artifacts: IArtifact[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-b')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('commit/master')
    expect(artifacts[0].repoKey).to.eq('default')
  })
})
