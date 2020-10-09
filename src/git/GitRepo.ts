import {IGlobalConfig, IGitConnectionRepo, IGitConnection} from '../spec/global/IGlobalConfig'
import {execFileAsync} from '../utils/child_process'
import {existsAsync, mkdirAsync} from '../utils/fs'
import {randBetween, sleepAsync} from '../utils/utils'
import path from 'path'

export class GitRepo {
  private globalConfig: IGlobalConfig

  private gitConnectionRepo: IGitConnectionRepo

  public dir: Readonly<string>

  constructor(globalConfig: IGlobalConfig, gitConnectionRepo: IGitConnectionRepo, dir?: string) {
    this.globalConfig = globalConfig
    this.gitConnectionRepo = gitConnectionRepo
    if (dir) {
      this.dir = dir
    } else {
      this.dir = path.join(__dirname, '..', '..', 'repos',
        gitConnectionRepo.gitConnectionKey ?? '',
        ...(gitConnectionRepo.path ?? '')?.split('/'))
      .replace(/\.git$/, '')
    }
  }

  private gitConnection(): IGitConnection {
    const gitConnection = this.globalConfig.gitConnectionMap?.[this.gitConnectionRepo.gitConnectionKey ?? '']
    if (!gitConnection) {
      throw new Error(`gitConnectionKey '${this.gitConnectionRepo.gitConnectionKey}' does not exist`)
    }
    return gitConnection
  }

  private async gitNoLogAsync(...args: string[]) {
    const gc = this.gitConnection()
    const env = {
      GIT_AUTHOR_NAME: gc.authorName,
      GIT_AUTHOR_EMAIL: gc.authorEmail,
      GIT_COMMITTER_NAME: gc.authorName,
      GIT_COMMITTER_EMAIL: gc.authorEmail,
    } as Record<string, string>
    if (gc.remoteHost && gc.remoteProtocol === 'ssh') {
      let keyArg = ''
      if (gc.sshKeyFile || gc.sshKeyFileEnvVar) {
        keyArg = `-i "${gc.sshKeyFile ?? process.env[gc.sshKeyFileEnvVar]}"`
      }
      env.GIT_SSH_COMMAND = `ssh ${keyArg} -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no"`
    }
    return execFileAsync('git', args, {
      cwd: this.dir,
      env: {
        ...process.env,
        ...env,
      },
    })
  }

  private async gitAsync(...args: string[]) {
    try {
      return await this.gitNoLogAsync(...args)
    } catch (error) {
      console.error(error.stdout)
      console.error(error.stderr)
      throw error
    }
  }

  private async cloneAsync() {
    await mkdirAsync(this.dir, {recursive: true})
    const args = ['clone']
    if (this.gitConnectionRepo.ref) {
      args.push(`--branch=${this.gitConnectionRepo.ref}`)
    }
    args.push('--depth=1')
    const remoteUrl = createRemoteUrl(this.globalConfig, this.gitConnectionRepo)
    args.push(remoteUrl)
    args.push('.')
    await this.gitAsync(...args)
  }

  public async ensureClonedAsync() {
    if (!await existsAsync(this.dir) || !await existsAsync(path.join(this.dir, '.git'))) {
      await this.cloneAsync()
    }
  }

  public async resetHardAsync() {
    await this.gitAsync('reset', '--hard')
    await this.gitAsync('clean', '-ffdd')
  }

  public async commitAndPushAsync(message: string, retries = 3, maxSleepSeconds = 5) {
    if ((await this.gitAsync('status', '--porcelain')).stdout.trim())
      for (let i = 0; i < retries; i++) {
        await this.gitAsync('add', '--all')
        await this.gitAsync('commit', '-m', message)
        try {
          await this.gitAsync('push')
          break
        } catch (error) {
          await this.gitAsync('reset', 'HEAD~1')
          await this.gitAsync('add', '--all')
          await this.gitAsync('stash')
          await this.gitAsync('pull')
          await this.gitAsync('stash', 'pop')
          await sleepAsync(randBetween(1, maxSleepSeconds * 1000))
        }
      }
  }

  public async isBranchTipAsync(branch?: string) {
    if (!branch) {
      branch = await this.branchNameAsync()
    }
    const localHash = await this.hashAsync()
    const remote = (await this.gitAsync('remote')).stdout.split(/\r\n|\r|\n/)[0].trim()
    const remoteHash = (await this.gitAsync('ls-remote', remote, `refs/heads/${branch}`)).stdout.trim().split(/\s/)[0]
    return localHash === remoteHash
  }

  public async hashAsync() {
    return (await this.gitAsync('rev-parse', 'HEAD')).stdout.trim()
  }

  public async hashShortAsync() {
    return (await this.hashAsync()).substr(0, 12)
  }

  public async branchNameAsync() {
    return (await this.gitAsync('rev-parse', '--abbrev-ref', 'HEAD')).stdout.trim()
  }

  public async destroyAsync() {
    return execFileAsync('rm', ['-rf', this.dir])
  }
}

function createRemoteUrl(globalConfig: IGlobalConfig, gitConnectionRepo: IGitConnectionRepo): string {
  const gc = globalConfig.gitConnectionMap?.[gitConnectionRepo.gitConnectionKey ?? '']
  if (!gc) {
    throw new Error(`gitConnectionMap.${gitConnectionRepo.gitConnectionKey} does not exist`)
  }
  if (gc.remoteHost && gc.remoteProtocol !== 'ssh' && gc.remoteProtocol !== 'http' && gc.remoteProtocol !== 'https') {
    throw new Error(`gitConnectionMap.${gitConnectionRepo.gitConnectionKey}.remoteProtocol ` +
      ' must be ssh, http, or https')
  }
  if (gc.remoteHost && (gc.remoteProtocol === 'ssh' || gc.remotePasswordEnvVar) && !gc.remoteUser) {
    throw new Error(`gitConnectionMap.${gitConnectionRepo.gitConnectionKey}.remoteUser must be set`)
  }
  if (gc.remoteHost && gc.remoteProtocol !== 'ssh' && gc.remoteUser) {
    throw new Error(`gitConnectionMap.${gitConnectionRepo.gitConnectionKey}.remotePasswordEnvVar must be set`)
  }
  if (gc.remoteHost && gc.remotePasswordEnvVar && !process.env[gc.remotePasswordEnvVar]) {
    throw new Error(`environment variable '${gc.remotePasswordEnvVar}' is empty; ` +
      `specified by gitConnectionMap.${gitConnectionRepo.gitConnectionKey}.remotePasswordEnvVar`)
  }
  if (gc.remoteHost && gc.sshKeyFileEnvVar && !process.env[gc.sshKeyFileEnvVar]) {
    throw new Error(`environment variable '${gc.sshKeyFileEnvVar}' is empty; ` +
      `specified by gitConnectionMap.${gitConnectionRepo.gitConnectionKey}.sshKeyFileEnvVar`)
  }

  const pathPrefix = gc.pathPrefix ? gc.pathPrefix.replace(/(\/|\\)$/, '') : ''

  if (!gc.remoteHost) {
    return path.resolve(`${pathPrefix}${path.sep}${gitConnectionRepo.path}`)
  }

  if (gc.remoteProtocol === 'ssh') {
    return `${gc.remoteUser}@${gc.remoteHost}:${pathPrefix}/${gitConnectionRepo.path}`
  }

  let remotePrefix = `${gc.remoteProtocol}://`
  if (gc.remoteUser && gc.remotePasswordEnvVar) {
    const pass = process.env[gc.remotePasswordEnvVar] as string
    remotePrefix += `${encodeURIComponent(gc.remoteUser)}:${encodeURIComponent(pass)}`
  }

  return `${remotePrefix}/${pathPrefix}/${gitConnectionRepo.path}`
}

export async function detectGitRepoAsync(globalConfig: IGlobalConfig, dir: string): Promise<GitRepo> {
  if (!globalConfig.gitConnectionMap) {
    throw new Error('gitConnectionMap does not exist')
  }

  const remote = (await execFileAsync('git', ['remote'], {
    cwd: dir,
    env: process.env,
  })).stdout.split(/\r\n|\r|\n/)[0].trim()
  const url = (await execFileAsync('git', ['remote', 'get-url', remote], {
    cwd: dir,
    env: process.env,
  })).stdout.trim()

  let segments = url.split('@')
  let hostPath = segments.splice(-1)[0]
  segments = hostPath.split('://')
  hostPath = segments.splice(-1)[0]

  for (const [key, gc] of Object.entries(globalConfig.gitConnectionMap)) {
    let pathOnly = hostPath
    if (gc.remoteHost) {
      if (!hostPath.startsWith(gc.remoteHost)) {
        continue
      }
      pathOnly = hostPath.substr(gc.remoteHost.length + 1)
    }
    if (gc.pathPrefix) {
      const pathPrefix = gc.pathPrefix.replace(/(\/|\\)$/, '') + (gc.remoteHost ? '/' : path.sep)
      if (!pathOnly.startsWith(pathPrefix)) {
        continue
      }
      pathOnly = pathOnly.substr(pathPrefix.length)
    }

    const gitConnectionRepo = {
      gitConnectionKey: key,
      path: pathOnly,
    } as IGitConnectionRepo

    return new GitRepo(globalConfig, gitConnectionRepo, dir)
  }

  throw new Error(`cannot find matching entry in gitConnectionMap for remote url '${url}'`)
}
