import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FindManyOptions, Like } from 'typeorm'

interface IQueryWithPagination {
  skip: number,
  limit: number,
  order_by: string,
  order: 1 | -1,
}

interface LikeField {
  like: true,
  key: string,
}

interface IgnorantField {
  ignorant: true,
  key: string,
}

type FindField = string | LikeField | IgnorantField

/**
 * 从 query 中生成 sql 查询条件
 * @param query
 * @param fields 可以过滤的字段
 */
export function buildFindOptionsFromQuery (query: IQueryWithPagination, fields: FindField[]): FindManyOptions {
  const findOptions: FindManyOptions = {
    skip: query.skip || 0,
    take: Math.min(query.limit || 50, 1000),
  }

  if (query.order_by) {
    const order = query.order || 1

    findOptions.order = {
      [query.order_by]: order > 0 ? 'ASC' : 'DESC'
    }
  }

  if (fields?.length) {
    findOptions.where = {}
    fields.forEach(field => {
      if (typeof field === 'string') {
        if (typeof query[field] !== 'undefined') {
          findOptions.where[field] = query[field]
        }
      }
      else if ('ignorant' in field) {
        if (query[field.key]) {
          findOptions.where[field.key] = query[field.key]
        }
      }
      else if ('like' in field) {
        const likeValue = query[field.key]
        if (likeValue) {
          findOptions.where[field.key] = Like(`%${likeValue}%`)
        }
      }
    })
  }

  return findOptions
}

/**
 * ignorant 的字段，会忽略空值（默认的不会忽略空值，导致空字符串会被搜索）
 * @param args
 */
export function ignorants (...args: string[]): IgnorantField[] {
  return args.map(key => {
    return {
      key,
      ignorant: true,
    }
  })
}

/**
 * 生成字段的 like 值 `%xxx%`
 * @param args
 */
export const likes = function (...args: string[]): LikeField[] {
  return args.map(key => {
    return {
      key,
      like: true
    }
  })
}
/**
 * 从 query 中生成 sql 查询，分页、排序、过滤
 * fields 可以是字段全等，也可以是 like（根据 FindField 的类型决定）
 */
export const Find = createParamDecorator<FindField[], ExecutionContext>((fields, ctx) => {
  const req = ctx.switchToHttp().getRequest()

  return buildFindOptionsFromQuery(req.query, fields)
})
