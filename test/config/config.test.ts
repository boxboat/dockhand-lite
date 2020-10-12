import {expect} from 'chai'
import {parseSingleConfigAsync} from '../../src/config/ConfigReader'
import {parseRepoConfigAsync} from '../../src/config/RepoConfig'
import {parseGlobalConfigAsync} from '../../src/config/GlobalConfig'
import {IGlobalConfig} from '../../src/spec/global/IGlobalConfig'
import {IRepoConfig} from '../../src/spec/repo/IRepoConfig'
import path from 'path'

describe('config:repo', async () => {
  it('repo config matches', async () => {
    const dataPromise = parseRepoConfigAsync([
      path.join(__dirname, 'data', 'repo', 'repo1.yaml'),
      path.join(__dirname, 'data', 'repo', 'repo2.yaml'),
      path.join(__dirname, 'data', 'repo', 'repo3.json'),
    ])
    const expectedPromise = parseSingleConfigAsync<IRepoConfig>('#/definitions/IRepoConfig',
      path.join(__dirname, 'data', 'repo', 'repo-expected.yaml'))

    expect(await dataPromise).to.deep.equal(await expectedPromise)
  })
})

describe('config:global', async () => {
  it('global config matches', async () => {
    const dataPromise = parseGlobalConfigAsync([
      path.join(__dirname, 'data', 'global', 'global1.json'),
      path.join(__dirname, 'data', 'global', 'global2.yaml'),
    ])
    const expectedPromise = parseSingleConfigAsync<IGlobalConfig>('#/definitions/IGlobalConfig',
      path.join(__dirname, 'data', 'global', 'global-expected.yaml'))

    expect(await dataPromise).to.deep.equal(await expectedPromise)
  })
})
