import {expect, test} from '@oclif/test'
import {configArgs} from '../../config/CommandConfig'

describe('build:list-publish', () => {
  test
  .stdout()
  .command(['build:list-publish', '-t', 'docker'].concat(configArgs))
  .it('prints docker', ctx => {
    expect(ctx.stdout).to.contain('docker')
  })
})
