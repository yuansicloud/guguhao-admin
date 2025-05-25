import type { PagedAndSortedResultRequestDto } from '@abp/core';

export enum AssetType {
  // / 奇遇
  Adventure = 4,

  // / <summary>
  // / 背部挂件
  // / </summary>
  Back = 14,

  // / <summary>
  // / 披风
  // / </summary>
  BackCloak = 22,

  // / <summary>
  // / 佩囊
  // / </summary>
  Bag = 24,

  // / <summary>
  // / 外装收集 - 只记录数量
  // / </summary>
  Exterior = 0,

  // / <summary>
  // / 面部挂件
  // / </summary>
  Face = 17,

  // / <summary>
  // / 眼饰
  // / </summary>
  Glasses = 26,

  // / <summary>
  // / 发型
  // / </summary>
  Hair = 2,

  // / <summary>
  // / 头饰
  // / </summary>
  HeadPendent = 30,

  // / <summary>
  // / 坐骑
  // / </summary>
  Horse = 15,

  // / <summary>
  // / 左手饰
  // / </summary>
  LeftLovePendent = 27,

  // / <summary>
  // / 左肩饰
  // / </summary>
  LeftShoudler = 20,

  // / <summary>
  // / 小头像
  // / </summary>
  MiniAvatar = 3,

  // / 跟宠
  Pals = 5,

  // / <summary>
  // / 挂宠
  // / </summary>
  Pet = 25,

  // / <summary>
  // / 右手饰
  // / </summary>
  RightLovePendent = 28,

  // / <summary>
  // / 右肩饰
  // / </summary>
  RightShoudler = 21,

  // / <summary>
  // / 商城外观
  // / </summary>
  ShopExterior = 1,

  // / <summary>
  // / 未知
  // / </summary>
  Unknown = -1,

  // / <summary>
  // / 腰部挂件
  // / </summary>
  Waist = 11,

  // / <summary>
  // / 武器拓印
  // / </summary>
  Weapon = 6,
}

interface AssetDto {
  adjustedPrice?: number;
  alias?: string;
  assetType: AssetType;
  avatar?: string;
  category?: string;
  creationTime: Date;
  creatorId?: string;
  description?: string;
  getSource?: number;
  id: string;
  isHighValue: boolean;
  isRare: boolean;
  isUnique: boolean;
  lastModificationTime?: string;
  lastModifierId?: string;
  mediaResources?: string;
  name: string;
  officialSaleDate?: string;
  price?: number;
  subType?: string;
  wblName?: string;
}

interface CreateUpdateAssetDto {
  adjustedPrice?: number;
  alias?: string;
  assetType: AssetType;
  avatar?: string;
  category?: string;
  description?: string;
  getSource?: number;
  isHighValue: boolean;
  isRare: boolean;
  isUnique: boolean;
  mediaResources?: string;
  name: string;
  officialSaleDate?: string;
  price?: number;
  subType?: string;
  wblName?: string;
}

interface AssetGetListInput extends PagedAndSortedResultRequestDto {
  assetType?: AssetType;
  filter?: string;
  IsHighValue?: boolean;
  isRare?: boolean;
  isUnique?: boolean;
  MaxPrice?: number;
  MinPrice?: number;
}

interface MergeAssetsDto {
  destinationAsset: AssetDto;
  originalAsset: AssetDto;
}

interface MergeAssetsInput {
  destinationAssetId: string;
  originalAssetId: string;
}

export type {
  AssetDto,
  AssetGetListInput,
  CreateUpdateAssetDto,
  MergeAssetsDto,
  MergeAssetsInput,
};
