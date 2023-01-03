import { MemoryCache as IMemoryCache, caching } from 'cache-manager'

let memoryCache: IMemoryCache
void caching('memory', { max: 1000, ttl: 10 }).then(cache => {
  memoryCache = cache
})

interface CacheConfig {
  key?: string,
  ttl: number | Function,
}
/**
 * Methods level cache, can cache raw value.
 * @notes don't cache large amount of data in production with memory cache!.
 * @param key
 * @param ttl {number} Seconds
 * @constructor
 */
export function RAMCache ({ key, ttl }: CacheConfig = { ttl: 10 }) {
  return function (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!key) {
      key = `${target.constructor.name}/${propertyKey.toString()}`
    }
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const cachedItem = await memoryCache.get(key)
      if (cachedItem) {
        return cachedItem // return observable
      }

      const result = await method.apply(this, args)
      const calcTtl = typeof ttl === 'function' ? ttl() : ttl
      await memoryCache.set(key, result, calcTtl)
      return result // return observable
    }
  }
}
