// todo: implement this with interceptors may be simpler
/**
 * Generate return data based on the result of typeorm's findAndCount and findOptions
 * @param list
 * @param total
 * @param findOptions
 */
export function buildReturnListWithPagination ([list, total], findOptions) {
  return {
    list,
    pagination: {
      skip: findOptions.skip,
      limit: findOptions.take,
      total
    }
  }
}
