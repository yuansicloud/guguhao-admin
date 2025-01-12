import type {
  PagedAndSortedResultRequestDto,
} from '@abp/core';

interface AssetDto {
  creationTime: Date;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
  name: string;
  alias?: string;
  avatar?: string;
  mediaResources?: string;
  assetType: AssetType;
  subType?: string;
  isHighValue: boolean;
  id: string;
  isUnique: boolean;
  price?: number;
  category?: string;
  officialSaleDate?: string;
  getSource?: number;
  description?: string;
  wblName?: string;
}

interface CreateUpdateAssetDto {
  name: string;
  alias?: string;
  avatar?: string;
  mediaResources?: string;
  assetType: AssetType;
  subType?: string;
  isHighValue: boolean;
  isUnique: boolean;
  price?: number;
  category?: string;
  officialSaleDate?: string;
  getSource?: number;
  description?: string;
  wblName?: string;
}

interface AssetGetListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
  assetType?: AssetType;
  MinPrice?: number;
  MaxPrice?: number;
  IsHighValue?: boolean;
}

export enum AssetType
{
    /// <summary>
    /// 未知
    /// </summary>
    Unknown = -1,

    /// <summary>
    /// 外装收集 - 只记录数量
    /// </summary>
    Exterior = 0,

    /// <summary>
    /// 商城外观
    /// </summary>
    ShopExterior = 1,

    /// <summary>
    /// 发型
    /// </summary>
    Hair = 2,

    /// <summary>
    /// 小头像
    /// </summary>
    MiniAvatar = 3,

    /// 奇遇
    Adventure = 4,

    /// 跟宠
    Pals = 5,

    /// <summary>
    /// 武器拓印
    /// </summary>
    Weapon = 6,

    /// <summary>
    /// 腰部挂件
    /// </summary>
    Waist = 11,

    /// <summary>
    /// 背部挂件
    /// </summary>
    Back = 14,

    /// <summary>
    /// 坐骑
    /// </summary>
    Horse = 15,

    /// <summary>
    /// 面部挂件
    /// </summary>
    Face = 17,

    /// <summary>
    /// 左肩饰
    /// </summary>
    LeftShoudler = 20,

    /// <summary>
    /// 右肩饰
    /// </summary>
    RightShoudler = 21,

    /// <summary>
    /// 披风
    /// </summary>
    BackCloak = 22,

    /// <summary>
    /// 佩囊
    /// </summary>
    Bag = 24,

    /// <summary>
    /// 挂宠
    /// </summary>
    Pet = 25,

    /// <summary>
    /// 眼饰
    /// </summary>
    Glasses = 26,

    /// <summary>
    /// 左手饰
    /// </summary>
    LeftLovePendent = 27,

    /// <summary>
    /// 右手饰
    /// </summary>
    RightLovePendent = 28
}

export type { AssetDto, AssetGetListInput, CreateUpdateAssetDto };
