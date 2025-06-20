import type {
  FullAuditedEntityDto,
  IHasExtraProperties,
  PagedAndSortedResultRequestDto,
} from '@abp/core';

export interface CreateUpdateStoreDto extends IHasExtraProperties {
  name: string;
}

export interface StoreDto
  extends FullAuditedEntityDto<string>,
    IHasExtraProperties {
  name: string;
}

export interface StoreGetListInput extends PagedAndSortedResultRequestDto {
  name?: string;
}
