import {expect, test} from '@oclif/test'
import {IArtifact} from '../../../src/lib/artifact/Artifact'

describe('deploy:list-dependencies', () => {
  test
  .stdout()
  .command(['deploy:list-dependencies',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/deployment/dockhand.yaml',
    '--deployment',
    'dev'])
  .it('lists deployment dependencies', ctx => {
    const artifacts: IArtifact[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.have.lengthOf(2)
    expect(artifacts[0].name).to.eq('service-a')
    expect(artifacts[0].type).to.eq('docker')
    expect(artifacts[0].event).to.eq('commit/master')
    expect(artifacts[0].repoKey).to.eq('default')
    expect(artifacts[0].version).to.eq('build-aaaaaaaaaaaa')
    expect(artifacts[1].name).to.eq('service-b')
    expect(artifacts[1].type).to.eq('docker')
    expect(artifacts[1].event).to.eq('commit/master')
    expect(artifacts[1].repoKey).to.eq('default')
    expect(artifacts[1].version).to.eq('build-bbbbbbbbbbbb')
  })
})
