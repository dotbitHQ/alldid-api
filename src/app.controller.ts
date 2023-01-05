import { Get, Controller, Query, Param, UseFilters, UseInterceptors, CacheInterceptor } from '@nestjs/common'
import { AllDIDExceptionFilter } from './filters/alldid-exception.filter'
import { createInstance, AllDID } from 'alldid'
import { InvalidParameterError } from './error/CodedError'

@Controller({
  path: 'name',
  version: 'v1',
})
@UseInterceptors(CacheInterceptor)
@UseFilters(AllDIDExceptionFilter)
export class AppController {
  private readonly alldid: AllDID
  constructor () {
    this.alldid = createInstance()
  }

  @Get('/:name/check/supported')
  async isSupported (@Param() param): Promise<Record<string, any>> {
    const isSupported = await this.alldid.isSupported(param.name)
    return {
      is_supported: isSupported,
    }
  }

  @Get('/:name/check/available')
  async isAvailable (@Param() param): Promise<Record<string, any>> {
    const isAvailable = await this.alldid.isAvailable(param.name)
    return {
      is_available: isAvailable,
    }
  }

  @Get('/:name/check/registered')
  async isRegistered (@Param() param): Promise<Record<string, any>> {
    const isRegistered = await this.alldid.isRegistered(param.name)
    return {
      is_registered: isRegistered,
    }
  }

  @Get('/:name/owner')
  async findOwnerByName (@Param() param): Promise<Record<string, any>> {
    const owner = await this.alldid.owner(param.name)
    return {
      owner,
    }
  }

  @Get('/:name/manager')
  async findManagerByName (@Param() param): Promise<Record<string, any>> {
    const manager = await this.alldid.manager(param.name)
    return {
      manager,
    }
  }

  @Get('/:name/tokenid')
  async findTokenIdByName (@Param() param): Promise<Record<string, any>> {
    const tokenId = await this.alldid.tokenId(param.name)
    return {
      token_id: tokenId,
    }
  }

  @Get('/:name/records')
  async findRecordsByName (@Param() param, @Query() query): Promise<Array<Record<string, any>>> {
    let keys: string[] | undefined
    try {
      const queryKeys = JSON.parse(query.keys)
      if (Array.isArray(queryKeys) && queryKeys.length > 0) {
        keys = queryKeys
      }
    }
    catch (e) {
      throw new InvalidParameterError()
    }
    const records = await this.alldid.records(param.name, keys)
    return records
  }

  @Get('/:name/addrs')
  async findAddrsByName (@Param() param, @Query() query): Promise<Array<Record<string, any>>> {
    let keys: string | string[] | undefined
    try {
      const queryKeys = JSON.parse(query.keys)
      if ((Array.isArray(queryKeys) && queryKeys.length > 0) || typeof queryKeys === 'string') {
        keys = queryKeys
      }
    }
    catch (e) {
      throw new InvalidParameterError()
    }
    const addrs = await this.alldid.addrs(param.name, keys)
    return addrs
  }

  @Get('/:name/registry')
  async findRegistryByName (@Param() param): Promise<Record<string, any>> {
    const addr = await this.alldid.registryAddress(param.name)
    return {
      registry_address: addr
    }
  }
}
