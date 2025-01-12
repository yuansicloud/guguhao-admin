import type { PagedResultDto } from '@abp/core';

import type { AssetDto, AssetGetListInput, CreateUpdateAssetDto } from '../types/assets';

import { requestClient } from '@abp/request';

/**
 * 新增剑三外观
 * @param input 参数
 * @returns 剑三外观实体数据传输对象
 */
export function createApi(input: CreateUpdateAssetDto): Promise<AssetDto> {
  return requestClient.post<AssetDto>('/api/jx3/asset', input);
}

/**
 * 更新剑三外观
 * @param id 剑三外观id
 * @returns 剑三外观实体数据传输对象
 */
export function updateApi(id: string, input: CreateUpdateAssetDto): Promise<AssetDto> {
  return requestClient.put<AssetDto>(`/api/jx3/asset/${id}`, input);
}

/**
 * 获取剑三外观
 * @param id 剑三外观id
 */
export function getApi(id: string): Promise<AssetDto> {
  return requestClient.get<AssetDto>(`/api/jx3/asset/${id}`);
}

/**
 * 获取剑三外观分页列表
 * @param input 参数
 */
export function getPagedListApi(
  input: AssetGetListInput,
): Promise<PagedResultDto<AssetDto>> {
  return requestClient.get<PagedResultDto<AssetDto>>('/api/jx3/asset', {
    params: input,
  });
}

/**
 * 删除剑三外观
 * @param id 剑三外观id
 */
export function deleteApi(id: string): Promise<void> {
  return requestClient.delete(`/api/jx3/asset/${id}`);
}
