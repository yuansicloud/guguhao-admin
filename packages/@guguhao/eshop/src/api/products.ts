import type { PagedResultDto, ListResultDto } from '@abp/core';
import type {
  ProductDto,
  ProductGetListInput,
  CreateUpdateProductDto,
  ProductGroupDto,
} from '../types/products';
import { requestClient } from '@abp/request';

enum Api {
  Product = '/api/e-shop/products/product',
  ProductGroup = '/api/e-shop/products/product/product-group',
}

export const getProductList = (params: ProductGetListInput) =>
  requestClient.get<PagedResultDto<ProductDto>>(`${Api.Product}`, { params });

export const getProductGroupList = () =>
  requestClient.get<ListResultDto<ProductGroupDto>>(`${Api.ProductGroup}`);

export const getProductById = (id: string) =>
  requestClient.get<ProductDto>(`${Api.Product}/${id}`);

export const createProduct = (data: CreateUpdateProductDto) =>
  requestClient.post<ProductDto>(`${Api.Product}`, data);

export const updateProduct = (id: string, data: CreateUpdateProductDto) =>
  requestClient.put<ProductDto>(`${Api.Product}/${id}`, data);

export const deleteProduct = (id: string) =>
  requestClient.delete(`${Api.Product}/${id}`); 