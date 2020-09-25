import {expect, test} from '@oclif/test'

describe('build:should-push', () => {
  test
  .stdout()
  .command(['build:should-push'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['build:should-push', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
