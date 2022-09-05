import fs from 'fs'
import path from 'path'
import YAML from 'yaml'

const configFile = path.join(__dirname, '../config.yml')
const configPlain = fs.readFileSync(configFile).toString()

const config = YAML.parse(configPlain)

export default config