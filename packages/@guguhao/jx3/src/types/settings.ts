interface ConfigAssetDto {
  id: string;
  name: string;
  alias: string;
  price: number;
  avatar: string;
}

interface AssetCategories {
  [key: string]: ConfigAssetDto[];
}

interface ConfigDto {
  careers: string[];
  shapes: string[];
  assetCategories: AssetCategories;
  tags: string[];
}

export type { AssetCategories, ConfigAssetDto, ConfigDto };
