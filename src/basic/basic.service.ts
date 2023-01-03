import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOneOptions, FindManyOptions, FindOptionsWhere, DeepPartial } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { IsNumberString, validateOrReject, ValidationError } from 'class-validator'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

@Injectable()
export class BasicService<T> {
  readonly repo: Repository<T>
  readonly entity: any

  async insertOne (body: Partial<T>): Promise<T> {
    body = plainToClass(this.entity, body)

    await validateOrReject(body)

    return (await this.repo.insert(body as QueryDeepPartialEntity<T>)).generatedMaps[0] as T
  }

  async findOne (condition: FindOneOptions<T>) {
    return await this.repo.findOne(condition)
  }

  async findOneById (id: number) {
    return await this.repo.findOne({ id } as any)
  }

  async updateOneById (id: number, update: QueryDeepPartialEntity<T>) {
    return (await this.repo.update(id, update)).generatedMaps[0] as T
  }

  async deleteOneById (id: number) {
    return await this.repo.delete(id)
  }

  async insertMany (items: Array<Partial<T>>) {
    if (this.entity) {
      for (let i = 0; i < items.length; i++) {
        items[i] = plainToClass(this.entity, items[i])
        await validateOrReject(this.entity)
      }
    }

    return await this.repo.insert(items as Array<QueryDeepPartialEntity<T>>)
  }

  async update (condition: FindOptionsWhere<T>, update: QueryDeepPartialEntity<T>) {
    return (await this.repo.update(condition, update)).generatedMaps
  }

  async find (findManyOptions?: FindManyOptions<T>) {
    return await this.repo.find(findManyOptions)
  }

  async findAndCount (findManyOptions: FindManyOptions<T>) {
    return await this.repo.findAndCount(findManyOptions)
  }

  async count (findManyOptions?: FindManyOptions<T>) {
    return await this.repo.count(findManyOptions)
  }
}

export function createBasicService<E> (EntityClass: any, connection: string) {
  @Injectable()
  class CreatedService extends BasicService<E> {
    entity = EntityClass

    constructor (
      @InjectRepository(EntityClass, connection)
      readonly repo: Repository<E>,
    ) {
      super()
    }
  }

  return CreatedService
}
