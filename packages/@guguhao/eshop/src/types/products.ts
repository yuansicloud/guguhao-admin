import type {
  FullAuditedEntityDto,
  IHasExtraProperties,
  PagedAndSortedResultRequestDto,
} from '@abp/core';

import type { CategoryBriefDto } from './categories';

export interface CreateUpdateProductAttributeOptionDto
  extends IHasExtraProperties {
  description?: string;
  displayName: string;
  displayOrder: number;
}

export interface CreateUpdateProductAttributeDto extends IHasExtraProperties {
  description?: string;
  displayName: string;
  displayOrder: number;
  productAttributeOptions: CreateUpdateProductAttributeOptionDto[];
}

export interface CreateUpdateProductDto extends IHasExtraProperties {
  categoryIds: string[];
  displayName: string;
  displayOrder: number;
  inventoryProviderName?: string;
  inventoryStrategy: number;
  isHidden: boolean;
  isPublished: boolean;
  mediaResources?: string;
  overview?: string;
  paymentExpireIn?: string;
  productAttributes: CreateUpdateProductAttributeDto[];
  productDetailId?: string;
  productGroupName?: string;
  storeId: string;
  uniqueName?: string;
}

export interface ProductAttributeOptionDto
  extends FullAuditedEntityDto<string> {
  description?: string;
  displayName?: string;
  displayOrder: number;
}

export interface ProductAttributeDto extends FullAuditedEntityDto<string> {
  description?: string;
  displayName?: string;
  displayOrder: number;
  productAttributeOptions: ProductAttributeOptionDto[];
}

export interface ProductSkuDto extends FullAuditedEntityDto<string> {
  attributeOptionIds?: string[];
  currency?: string;
  inventory: number;
  mediaResources?: string;
  name?: string;
  originalPrice?: number;
  price: number;
  sold: number;
}

export interface ProductDto extends FullAuditedEntityDto<string> {
  categories: CategoryBriefDto[];
  displayName?: string;
  displayOrder: number;
  inventoryProviderName?: string;
  inventoryStrategy: number;
  isHidden: boolean;
  isPublished: boolean;
  isStatic: boolean;
  maximumPrice?: number;
  mediaResources?: string;
  minimumPrice?: number;
  overview?: string;
  paymentExpireIn?: string;
  productAttributes: ProductAttributeDto[];
  productDetailId?: string;
  productGroupDisplayName?: string;
  productGroupName?: string;
  productSkus: ProductSkuDto[];
  sold: number;
  storeId: string;
  uniqueName?: string;
}

export interface ProductGetListInput extends PagedAndSortedResultRequestDto {
  categoryId?: string;
  showHidden?: boolean;
  storeId?: string;
}

export interface ProductGroupDto {
  name?: string;
  displayName?: string;
  description?: string;
}

export interface ProductDetailDto extends FullAuditedEntityDto<string> {
  description?: string;
  storeId: string;
}

export interface ProductViewDto extends FullAuditedEntityDto<string> {
  displayName?: string;
  displayOrder: number;
  mediaResources?: string;
  productSkus: ProductSkuDto[];
  sold: number;
}

export interface CreateProductSkuDto extends IHasExtraProperties {
  attributeOptionIds?: string[];
  currency: string;
  inventory: number;
  mediaResources?: string;
  name?: string;
  originalPrice?: number;
  paymentExpireIn?: string;
  price: number;
}

export interface UpdateProductSkuDto extends IHasExtraProperties {
  currency: string;
  inventory: number;
  mediaResources?: string;
  name?: string;
  originalPrice?: number;
  paymentExpireIn?: string;
  price: number;
}
