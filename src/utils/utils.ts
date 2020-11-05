import YAML from 'js-yaml'
import {cloneDeep, isObject} from 'lodash'

export function randBetween(lower: number, upper: number) {
  return Math.floor(Math.random() * upper) + lower
}

export function sleepAsync(milliseconds: number) {
  return new Promise(r => setTimeout(r, milliseconds))
}

export function output(data: any, type: string, prefix: string | undefined, options?: {
  map?: boolean;
  mapFormatter?: (arg0: any) => any;
  tableExcludeKeys?: string[];
}) {
  if (type !== 'table' && type !== 'json' && type !== 'yaml') {
    throw new Error(`invalid outputType '${type}'; should be 'table', 'json', or 'yaml'`)
  }
  data = cloneDeep(data)
  if (type === 'table' && options?.tableExcludeKeys && isObject(data) && Symbol.iterator in data) {
    for (const item of data as any) {
      if (isObject(item)){
        for (const key of options.tableExcludeKeys) {
          delete (item as any)[key]
        }
      }
    }
  }
  if (options?.map && options?.mapFormatter) {
    data = options.mapFormatter(data)
  }
  if (prefix) {
    for (const key of prefix.split('.').reverse()) {
      data = {[key]: data}
    }
  }

  switch (type) {
  case 'table':
    console.table(data)
    break
  case 'json':
    console.log(JSON.stringify(data, null, 2))
    break
  case 'yaml':
    process.stdout.write(YAML.safeDump(data, {
      noRefs: true,
    }))
    break
  }
}

export function alphaNumericDash(str: string): string {
  return str.replace(/[^a-z0-9]/ig, '-')
}
