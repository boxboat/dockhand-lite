import child_process from 'child_process'
import {promisify} from 'util'

export const execFileAsync = promisify(child_process.execFile)
