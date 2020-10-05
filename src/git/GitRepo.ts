import {IGlobalConfig, IGitConnectionRepo, IGitConnection} from '../spec/global/IGlobalConfig'
import {promisify} from 'util'
import {execFile} from 'child_process'
import {existsAsync, mkdirAsync} from '../utils/fs'
import {randBetween, sleepAsync} from '../utils'
import path from 'path'

const execFileAsync = promisify(execFile)

export class GitRepo {
  private globalConfig: IGlobalConfig

  private gitConnectionRepo: IGitConnectionRepo

  public dir: Readonly<string>

  constructor(globalConfig: IGlobalConfig, gitConnectionRepo: IGitConnectionRepo) {
    this.globalConfig = globalConfig
    this.gitConnectionRepo = gitConnectionRepo
    this.dir = path.join(__dirname, '..', '..', 'repos',
      gitConnectionRepo.gitConnectionKey ?? '',
      ...(gitConnectionRepo.path ?? '')?.split('/'))
    .replace(/\.git$/, '')
  }

  private gitConnection(): IGitConnection {
    const gitConnection = this.globalConfig.gitConnectionMap?.[this.gitConnectionRepo.gitConnectionKey ?? '']
    if (!gitConnection) {
      throw new Error(`gitConnectionKey '${this.gitConnectionRepo.gitConnectionKey}' does not exist`)
    }
    return gitConnection
  }

  private gitAsync(...args: string[]) {
    const gc = this.gitConnection()
    const env = {
      GIT_AUTHOR_NAME: gc.authorName,
      GIT_AUTHOR_EMAIL: gc.authorEmail,
      GIT_COMMITTER_NAME: gc.authorName,
      GIT_COMMITTER_EMAIL: gc.authorEmail,
    } as any
    if (gc.remoteHost) {
      env.GIT_SSH_COMMAND = `ssh -i ${gc.sshKeyFile} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no`
    }
    return execFileAsync('git', args, {
      cwd: this.dir,
      env: Object.assign({}, process.env, env),
    })
  }

  private async cloneAsync() {
    await mkdirAsync(this.dir, {recursive: true})
    const gc = this.gitConnection()
    const args = ['clone']
    if (this.gitConnectionRepo.ref) {
      args.push(`--branch=${this.gitConnectionRepo.ref}`)
    }
    args.push('--depth=1')
    const remoteUserHost = gc.remoteHost ? `${gc.sshUser}@${gc.remoteHost}:` : ''
    const pathPrefix = gc.pathPrefix ? gc.pathPrefix.replace(/\/$/, '') + '/' : ''
    args.push(`${remoteUserHost}${pathPrefix}${this.gitConnectionRepo.path}`)
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

  public async isBranchTipAsync() {
    const ref = (await this.gitAsync('symbolic-ref', 'HEAD')).stdout.trim()
    const local = (await this.gitAsync('ls-remote', '.', ref)).stdout.trim()
    const remote = (await this.gitAsync('ls-remote', 'origin', ref)).stdout.trim()
    return local === remote
  }

  public async destroyAsync() {
    return execFileAsync('rm', ['-rf', this.dir])
  }
}
