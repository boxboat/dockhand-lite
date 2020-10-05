import fs from 'fs'
import {promisify} from 'util'
import YAML from 'js-yaml'

export const mkdirAsync = promisify(fs.mkdir)
export const readFileAsync = promisify(fs.readFile)
export const statAsync = promisify(fs.stat)
export const writeFileAsync = promisify(fs.writeFile)

export async function existsAsync(file: string): Promise<boolean> {
  try {
    const stats = await statAsync(file)
    return Boolean(stats)
  } catch (error) {
    return false
  }
}

export async function writeYamlAsync(file: string, data: any) {
  await writeFileAsync(file, YAML.safeDump(data, {indent: 2}), 'utf8')
}
