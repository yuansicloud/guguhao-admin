import type { PagedResultDto } from '@abp/core';

import type { CharacterDto, CharacterPostListInput } from '../types/characters';

import { requestClient } from '@abp/request';
/**
 * 获取剑三角色分页列表
 * @param data 参数
 */
export function postPagedListApi(
  data: CharacterPostListInput,
): Promise<PagedResultDto<CharacterDto>> {
  return requestClient.post<PagedResultDto<CharacterDto>>(
    '/api/jx3/character/filter-characters',
    data,
  );
}

/**
 * 获取
 * @param id 剑三角色id
 */
export function getApi(id: string): Promise<CharacterDto> {
  return requestClient.get<CharacterDto>(`/api/jx3/Character/${id}`);
}

/**
 * 更新剑三角色
 * @param code 剑三角色code
 * @returns 剑三外观实体数据传输对象
 */
export function updateApi(code: string): Promise<CharacterDto> {
  return requestClient.put<CharacterDto>(
    `/api/jx3/character/character-status?code=${code}`,
  );
}
