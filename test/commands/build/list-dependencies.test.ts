import {expect, test} from '@oclif/test'
import {configArgs} from '../../config/CommandConfig'

describe('build:list-dependencies', () => {
  test
  .stdout()
  .command(['build:list-dependencies', '-t', 'docker'].concat(configArgs))
  .it('prints docker', ctx => {
    expect(ctx.stdout).to.contain('docker')
  })
})
