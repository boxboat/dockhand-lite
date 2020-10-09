import {expect, test} from '@oclif/test'
import {IArtifact} from '../../../src/lib/artifact/Artifact'

describe('build:list-dependencies', () => {
  test
  .stdout()
  .command(['build:list-dependencies',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/service-b/dockhand.yaml'])
  .it('lists build dependencies', ctx => {
    const artifacts: IArtifact[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(1)
    expect(artifacts[0].name).to.eq('service-a')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('tag/release')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('1.0.1')
  })
})
