import type { PagedAndSortedResultRequestDto } from '@abp/core';

interface GameItemDto {
  alias?: string;
  avatar?: string;
  category?: string;
  creationTime: Date;
  creatorId?: string;
  description?: string;
  id: string;
  isHighValue: boolean;
  lastModificationTime?: string;
  lastModifierId?: string;
  name: string;
  price?: number;
}

interface CreateUpdateGameItemDto {
  alias?: string;
  avatar?: string;
  category?: string;
  description?: string;
  isHighValue: boolean;
  name: string;
  price?: number;
}

interface GameItemGetListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
  IsHighValue?: boolean;
  MaxPrice?: number;
  MinPrice?: number;
}

export type { CreateUpdateGameItemDto, GameItemDto, GameItemGetListInput };
