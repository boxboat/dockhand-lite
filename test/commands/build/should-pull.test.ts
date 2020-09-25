import {expect, test} from '@oclif/test'

describe('build:should-pull', () => {
  test
  .stdout()
  .command(['build:should-pull'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['build:should-pull', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
