import {expect, test} from '@oclif/test'
import {IArtifact} from '../../../src/lib/artifact/Artifact'

describe('deploy:environment', () => {
  test
  .stdout()
  .command(['deploy:environment',
    '-g',
    'test/git/data/global.yaml',
    '-c',
    'test/git/data/repo-base.yaml',
    '-c',
    'test/git/data/repos/deployment/dockhand.yaml',
    '--deployment',
    'dev'])
  .it('prints deployment environment info', ctx => {
    const artifacts: IArtifact[] = JSON.parse(ctx.stdout)
    expect(artifacts).to.deep.eq({
      cluster: 'nonprod1',
    })
  })
})
