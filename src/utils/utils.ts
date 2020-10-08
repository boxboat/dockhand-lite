import YAML from 'js-yaml'

export function randBetween(lower: number, upper: number) {
  return Math.floor(Math.random() * upper) + lower
}

export function sleepAsync(milliseconds: number) {
  return new Promise(r => setTimeout(r, milliseconds))
}

export function output(type: string, data: any) {
  if (type !== 'table' && type !== 'json' && type !== 'yaml') {
    throw new Error(`invalid type '${type}'; should be 'table', 'json', or 'yaml'`)
  }
  switch (type) {
  case 'table':
    console.table(data)
    break
  case 'json':
    console.log(JSON.stringify(data))
    break
  case 'yaml':
    console.log(YAML.safeDump(data))
    break
  }
}
