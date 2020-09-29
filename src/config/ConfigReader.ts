import Ajv from 'ajv'
import fs from 'fs'
import util from 'util'
import YAML from 'js-yaml'
import path from 'path'

const readFile = util.promisify(fs.readFile)

let ajvInit = false
const ajv = new Ajv()

async function initAjvAsync() {
  if (!ajvInit) {
    ajvInit = true
    const schema = await readFile(path.join(__dirname, '..', 'spec', 'schema.json'), 'utf8')
    ajv.addSchema(JSON.parse(schema), 'default')
  }
}

async function loadYamlAsync<T>(configFile: string): Promise<T> {
  return YAML.load(await readFile(configFile, 'utf8')) as T
}

async function loadJsonAsync<T>(configFile: string): Promise<T> {
  return JSON.parse(await readFile(configFile, 'utf8')) as T
}

export async function parseConfigsAsync<T>(schemaRef: string, configFiles: string[]): Promise<T[]> {
  const initAjvPromise = initAjvAsync()
  const configPromiseMap = new Map<string, Promise<T>>()
  const configs = new Array<T>()

  for (const configFile of configFiles) {
    const configFileLower = configFile.toLowerCase()
    if (configFileLower.endsWith('.yaml') || configFileLower.endsWith('.yml')) {
      configPromiseMap.set(configFile, loadYamlAsync(configFile))
    } else if (configFileLower.endsWith('.json')) {
      configPromiseMap.set(configFile, loadJsonAsync(configFile))
    } else {
      throw new Error(`config file '${configFile}' must end with '.json', '.yaml', or '.yml'`)
    }
  }

  await initAjvPromise
  for (const configFile of configFiles) {
    const data = await configPromiseMap.get(configFile)
    if (!ajv.validate('default' + schemaRef, data)) {
      throw new Error(`validation error in '${configFile}':\n${ajv.errorsText()}`)
    }
    configs.push(data as T)
  }

  return configs
}
