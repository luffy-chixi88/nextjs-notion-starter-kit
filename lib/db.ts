import { isRedisEnabled, redisNamespace, redisUrl } from './config'
import Keyv from '@keyvhq/core'
import KeyvRedis from '@keyvhq/redis'

let db: Keyv
if (isRedisEnabled) {
  const keyvRedis = new KeyvRedis(redisUrl)
  db = new Keyv({ store: keyvRedis, namespace: redisNamespace || undefined })
} else {
  db = new Keyv()
}

export { db }
