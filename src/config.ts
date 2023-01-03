import nodeConfig from 'config'
import defaultConfig from '../config/default'

type ConfigType = typeof defaultConfig

export default (nodeConfig as any as ConfigType)
export {
  ConfigType
}
