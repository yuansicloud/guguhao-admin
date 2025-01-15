import type { PagedAndSortedResultRequestDto } from '@abp/core';

export enum state {
  // / <summary>
  // / 公示中
  // / </summary>
  Announcing = 3,
  // / <summary>
  // / 可购买
  // / </summary>
  Available = 5,

  // / <summary>
  // / 已下架
  // / </summary>
  OffSale = 7,

  // / <summary>
  // / 待上架
  // / </summary>
  Preparing = 1,
  // / <summary>
  // / 已售出
  // / </summary>
  Sold = 6,
  // / <summary>
  // / 未知状态
  // / </summary>
  Something = 4,
  // / <summary>
  // / 下架未更新
  // / </summary>
  WaitingForValidation = -1,
}

interface CharacterDto {
  achievementPoint?: number;
  bookmarkNumber?: number;
  camp?: string;
  career?: string;
  code: string;
  creationTime?: string;
  deletionTime?: string;
  description?: string;
  detailSource?: number;
  equipmentPoint?: number;
  exteriorNumber?: number;
  faceNumber?: number;
  id: string;
  isDeleted?: true;
  isFetched?: true;
  lastModificationTime?: string;
  name: string;
  offSaleTime?: string;
  onSaleTime?: string;
  petNumber?: number;
  price?: number;
  recommendLevel?: number;
  serverName?: string;
  shape?: string;
  state: state;
  tags?: string;
  zoneName?: string;
}

interface CharacterPostListInput extends PagedAndSortedResultRequestDto {
  state?: state;
}

export type { CharacterDto, CharacterPostListInput };
