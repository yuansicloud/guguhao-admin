import type { PagedResultDto } from '@abp/core';

import type { AccountDto, AccountGetListInput } from '../types/accounts';

import { requestClient } from '@abp/request';
/**
 * 获取账户分页列表
 * @param data 参数
 */
export function getPagedListApi(
  data: AccountGetListInput,
): Promise<PagedResultDto<AccountDto>> {
  return requestClient.post<PagedResultDto<AccountDto>>(
    '/api/point-service/account',
    data,
  );
}

/**
 * 获取账户
 * @param id 账户id
 */
export function getApi(id: string): Promise<AccountDto> {
  return requestClient.get<AccountDto>(`/api/point-service/account/${id}`);
}

/**
 * 获取账户
 * @param id 账户id
 */
 export function getByUserIdApi(id: string): Promise<AccountDto> {
  return requestClient.get<AccountDto>(`/api/point-service/account/user-account/userId=${id}`);
}
