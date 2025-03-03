import type { PagedResultDto } from '@abp/core';

import type {
  TransactionDto,
  TransactionGetListInput,
} from '../types/transactions';

import { requestClient } from '@abp/request';
/**
 * 获取账户分页列表
 * @param data 参数
 */
export function getPagedListApi(
  input: TransactionGetListInput,
): Promise<PagedResultDto<TransactionDto>> {
  return requestClient.get<PagedResultDto<TransactionDto>>(
    '/api/point-service/transaction',
    { params: input },
  );
}

/**
 * 获取账户
 * @param id 账户id
 */
export function getApi(id: string): Promise<TransactionDto> {
  return requestClient.get<TransactionDto>(
    `/api/point-service/transaction/${id}`,
  );
}
