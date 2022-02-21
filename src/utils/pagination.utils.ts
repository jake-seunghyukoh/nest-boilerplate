import commonConstants from '@constants/common.constants';
import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';

class PaginationUtils {
  private static buildLink(
    location: string,
    paginationParams?: PaginationParamsInterface,
  ): string {
    if (!process.env.HOST) {
      throw new Error('HOST parameter did not provide in env');
    }

    let url = `${process.env.HOST}/${location}?`;
    let count = 0;
    if (paginationParams) {
      if (paginationParams.page) {
        url += `page=${paginationParams.page}`;
        count += 1;
      }
      if (paginationParams.limit) {
        if (count > 0) {
          url += '&';
        }

        url += `pageLimit=${paginationParams.limit}`;
      }
    }

    return url;
  }

  private static normalizeParam(param?: number): number | false {
    if (param) {
      if (isNaN(param)) return false;
      if (param <= 0) return false;

      return param;
    }

    return false;
  }

  public normalizeParams(params: {
    page?: number;
    pageLimit?: number;
  }): PaginationParamsInterface | false {
    const ret: { page: number; limit?: number } = {
      page: 1,
      limit: commonConstants.pagination.defaultLimit,
    };
    if (!params) {
      return ret;
    }

    const page = PaginationUtils.normalizeParam(params.page);
    if (page) {
      ret.page = page;
    }

    const limit = PaginationUtils.normalizeParam(params.pageLimit);
    if (limit) {
      ret.limit = limit;
    }

    return ret;
  }

  public getPaginationLinks(
    location: string,
    paginationParams: PaginationParamsInterface,
    totalCount: number,
  ): any {
    const pageMax = Math.ceil(
      totalCount /
        (paginationParams.limit
          ? paginationParams.limit
          : commonConstants.pagination.defaultLimit),
    );

    return {
      self: PaginationUtils.buildLink(location, paginationParams),
      first: PaginationUtils.buildLink(location, {
        page: 1,
        limit: paginationParams.limit,
      }),
      last: PaginationUtils.buildLink(location, {
        page: pageMax,
        limit: paginationParams.limit,
      }),
      next: PaginationUtils.buildLink(location, {
        page:
          paginationParams.page === pageMax
            ? pageMax
            : paginationParams.page + 1,
        limit: paginationParams.limit,
      }),
      prev: PaginationUtils.buildLink(location, {
        page: paginationParams.page === 1 ? 1 : paginationParams.page - 1,
        limit: paginationParams.limit,
      }),
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
}

export default new PaginationUtils();
