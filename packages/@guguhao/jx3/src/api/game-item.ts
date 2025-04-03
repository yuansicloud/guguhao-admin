import type { PagedResultDto } from '@abp/core';

import type {
  CreateUpdateGameItemDto,
  GameItemDto,
  GameItemGetListInput,
} from '../types/game-item';

import { requestClient } from '@abp/request';

/**
 * 新增剑三游戏道具
 * @param input 参数
 * @returns 剑三游戏道具实体数据传输对象
 */
export function createApi(
  input: CreateUpdateGameItemDto,
): Promise<GameItemDto> {
  return requestClient.post<GameItemDto>('/api/jx3/game-item', input);
}

/**
 * 更新剑三游戏道具
 * @param id 剑三游戏道具id
 * @returns 剑三游戏道具实体数据传输对象
 */
export function updateApi(
  id: string,
  input: CreateUpdateGameItemDto,
): Promise<GameItemDto> {
  return requestClient.put<GameItemDto>(`/api/jx3/game-item/${id}`, input);
}

/**
 * 获取剑三游戏道具
 * @param id 剑三游戏道具id
 */
export function getApi(id: string): Promise<GameItemDto> {
  return requestClient.get<GameItemDto>(`/api/jx3/game-item/${id}`);
}

/**
 * 获取剑三游戏道具分页列表
 * @param input 参数
 */
export function getPagedListApi(
  input: GameItemGetListInput,
): Promise<PagedResultDto<GameItemDto>> {
  return requestClient.get<PagedResultDto<GameItemDto>>('/api/jx3/game-item', {
    params: input,
  });
}

/**
 * 删除剑三游戏道具
 * @param id 剑三游戏道具id
 */
export function deleteApi(id: string): Promise<void> {
  return requestClient.delete(`/api/jx3/game-item/${id}`);
}
