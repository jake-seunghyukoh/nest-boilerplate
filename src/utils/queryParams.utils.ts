import commonConstants from '@constants/common.constants';
import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';
import { QueryParamsInterface } from '@interfaces/queryParams.interface';
import { FindManyOptions } from 'typeorm';

class QueryParamsUtils {
  public parseQueryParams(params: QueryParamsInterface): FindManyOptions<any> {
    const { page, pageLimit: limit, orders, ...where } = params;
    const { skip, take } = this.parsePaginationParams({ page, limit });
    const order = this.parseOrdersParam(orders);

    return { skip, take, order, where };
  }

  private static normalizeParam(param?: string): number | false {
    if (param) {
      const tmp = parseInt(param, 10);

      if (isNaN(tmp)) return false;
      if (tmp <= 0) return false;

      return tmp;
    }

    return false;
  }

  public normalizeParams(params: {
    page?: string;
    limit?: string;
  }): PaginationParamsInterface {
    const ret: { page: number; limit?: number } = { page: 1 };
    if (!params) {
      return ret;
    }

    const page = QueryParamsUtils.normalizeParam(params.page);
    if (page) {
      ret.page = page;
    }

    const limit = QueryParamsUtils.normalizeParam(params.limit);
    if (limit) {
      ret.limit = limit;
    }

    return ret;
  }

  public parsePaginationParams({ page, limit }) {
    const { page: normalizedPage, limit: normalizedLimit } =
      this.normalizeParams({
        page,
        limit,
      });

    return {
      skip: this.getSkipCount(normalizedPage, normalizedLimit),
      take: this.getLimitCount(normalizedLimit),
    };
  }

  public getSkipCount(page?: number, limit?: number): number {
    let skip = 0;

    if (page) {
      skip = page - 1;

      if (limit) {
        skip *= limit;
      } else {
        skip *= commonConstants.pagination.defaultLimit;
      }
    }

    return skip;
  }

  public getLimitCount(limit?: number): number {
    let limitPerPage = commonConstants.pagination.defaultLimit;
    if (limit) {
      limitPerPage = limit;
    }
    return limitPerPage;
  }

  public parseOrdersParam(orders: string[]) {
    const order = {};

    if (orders && orders.length > 0) {
      orders.map((_order: string) => {
        const desc = _order[0] === '-';
        const key = desc ? _order.slice(1) : _order;
        const value = desc ? 'DESC' : 'ASC';
        order[key] = value;
      });
    }

    return order;
  }
}

export default new QueryParamsUtils();
