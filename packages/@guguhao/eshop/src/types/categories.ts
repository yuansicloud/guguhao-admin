import type { FullAuditedEntityDto, IHasExtraProperties } from '@abp/core';

export interface CategoryBriefDto {
  displayName?: string;
  id: string;
}

export interface CategoryDto extends FullAuditedEntityDto<string> {
  description?: string;
  displayName?: string;
  displayOrder: number;
  isHidden: boolean;
  mediaResources?: string;
  parentCategory?: CategoryBriefDto;
  parentId?: string;
  slug?: string;
  uniqueName?: string;
}

export interface CreateUpdateCategoryDto extends IHasExtraProperties {
  description?: string;
  displayName: string;
  displayOrder: number;
  isHidden: boolean;
  mediaResources?: string;
  parentId?: string;
  uniqueName?: string;
}
