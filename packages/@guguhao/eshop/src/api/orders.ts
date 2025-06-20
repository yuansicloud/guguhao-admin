import type { PagedResultDto } from '@abp/core';

import type { OrderDto, OrderGetListInput } from '../types/orders';

import { requestClient } from '@abp/request';

enum Api {
  Order = '/api/app/order',
}

/**
 * 获取订单分页列表
 * @param data 参数
 */
export function getPagedListApi(
  data: OrderGetListInput,
): Promise<PagedResultDto<OrderDto>> {
  return requestClient.get<PagedResultDto<OrderDto>>(
    '/api/e-shop/orders/order',
    { params: data },
  );
}

/**
 * 获取订单
 * @param id 订单id
 */
export function getApi(id: string): Promise<OrderDto> {
  return requestClient.get<OrderDto>(`/api/e-shop/orders/order/${id}`);
}

export const getOrderList = (params?: any) =>
  requestClient.get<Order[]>(`${Api.Order}`, { params });

export const getOrderById = (id: string) =>
  requestClient.get<Order>(`${Api.Order}/${id}`);

export const createOrder = (data: Partial<Order>) =>
  requestClient.post<Order>(`${Api.Order}`, data);

export const updateOrder = (id: string, data: Partial<Order>) =>
  requestClient.put<Order>(`${Api.Order}/${id}`, data);

export const deleteOrder = (id: string) =>
  requestClient.delete(`${Api.Order}/${id}`);
