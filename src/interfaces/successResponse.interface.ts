import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';

export interface SuccessResponseInterface {
  readonly collectionName: string;
  readonly data: any;
  readonly options?: {
    readonly location: string;
    readonly paginationParams: PaginationParamsInterface;
    readonly totalCount: number;
  };
}
