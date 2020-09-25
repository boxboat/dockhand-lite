import {expect, test} from '@oclif/test'

describe('build:list-publish', () => {
  test
  .stdout()
  .command(['build:list-publish', 'docker'])
  .it('prints docker', ctx => {
    expect(ctx.stdout).to.contain('docker')
  })
})
