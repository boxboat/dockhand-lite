import {expect, test} from '@oclif/test'

describe('build:list-dependencies', () => {
  test
  .stdout()
  .command(['build:list-dependencies', 'docker'])
  .it('prints docker', ctx => {
    expect(ctx.stdout).to.contain('docker')
  })
})
