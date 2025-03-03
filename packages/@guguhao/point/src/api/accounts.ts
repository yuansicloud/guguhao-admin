import type { PagedResultDto } from '@abp/core';

import type {
  AccountDto,
  AccountGetListInput,
  ChangeAccountBalanceInput,
} from '../types/accounts';

import { requestClient } from '@abp/request';
/**
 * 获取账户分页列表
 * @param data 参数
 */
export function getPagedListApi(
  data: AccountGetListInput,
): Promise<PagedResultDto<AccountDto>> {
  return requestClient.get<PagedResultDto<AccountDto>>(
    '/api/point-service/account',
    { params: data },
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
  return requestClient.get<AccountDto>(
    `/api/point-service/account/user-account/${id}`,
  );
}

/**
 * Changes the balance of an account.
 *
 * @param id - The unique identifier of the account.
 * @param data - The input data containing the new balance information.
 * @returns A promise that resolves to the updated account details.
 */
export function changeBalanceApi(
  id: string,
  data: ChangeAccountBalanceInput,
): Promise<AccountDto> {
  return requestClient.post<AccountDto>(
    `/api/point-service/account/${id}/change-balance`,
    data,
  );
}
