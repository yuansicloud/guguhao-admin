import type { PagedResultDto } from '@abp/core';

import type {
  CreateUpdateStoreDto,
  StoreDto,
  StoreGetListInput,
} from '../types/stores';

import { requestClient } from '@abp/request';

enum Api {
  Store = '/api/e-shop/stores/store',
}

export const getStoreList = (params: StoreGetListInput) =>
  requestClient.get<PagedResultDto<StoreDto>>(`${Api.Store}`, { params });

export const getStoreById = (id: string) =>
  requestClient.get<StoreDto>(`${Api.Store}/${id}`);

export const createStore = (data: CreateUpdateStoreDto) =>
  requestClient.post<StoreDto>(`${Api.Store}`, data);

export const updateStore = (id: string, data: CreateUpdateStoreDto) =>
  requestClient.put<StoreDto>(`${Api.Store}/${id}`, data);

export const deleteStore = (id: string) =>
  requestClient.delete(`${Api.Store}/${id}`);

export const getDefaultStore = () =>
  requestClient.get<StoreDto>(`${Api.Store}/default`);
