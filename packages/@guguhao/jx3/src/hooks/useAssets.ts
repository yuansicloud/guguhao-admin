import { computed } from 'vue';

import { useLocalization } from '@abp/core';

import { AssetType } from '../types/assets';

export function useAssets() {
  const { L } = useLocalization(['JX3', 'AbpUi']);

  const assetTypeDisplayMap = {
    [AssetType.Adventure]: {
      color: '#00cc99',
      value: L('AssetType:Adventure'),
    },
    [AssetType.Back]: { color: '#3f51b5', value: L('AssetType:Back') },
    [AssetType.BackCloak]: { color: 'red', value: L('AssetType:BackCloak') },
    [AssetType.Bag]: { color: '#108ee9', value: L('AssetType:Bag') },
    [AssetType.Exterior]: { color: '#87d068', value: L('AssetType:Exterior') },
    [AssetType.Face]: { color: '#2196f3', value: L('AssetType:Face') },
    [AssetType.Glasses]: { color: '#673ab7', value: L('AssetType:Glasses') },
    [AssetType.Hair]: { color: '#f56c6c', value: L('AssetType:Hair') },
    [AssetType.HeadPendent]: {
      color: '#9c27b0',
      value: L('AssetType:HeadPendent'),
    },
    [AssetType.Horse]: { color: '#4caf50', value: L('AssetType:Horse') },
    [AssetType.LeftLovePendent]: {
      color: '#f44336',
      value: L('AssetType:LeftLovePendent'),
    },
    [AssetType.LeftShoudler]: {
      color: '#8e24aa',
      value: L('AssetType:LeftShoudler'),
    },
    [AssetType.MiniAvatar]: {
      color: '#ff9900',
      value: L('AssetType:MiniAvatar'),
    },
    [AssetType.Pals]: { color: '#ffcc00', value: L('AssetType:Pals') },
    [AssetType.Pet]: { color: '#4caf50', value: L('AssetType:Pet') },
    [AssetType.RightLovePendent]: {
      color: '#f44336',
      value: L('AssetType:RightLovePendent'),
    },
    [AssetType.RightShoudler]: {
      color: '#c2185b',
      value: L('AssetType:RightShoudler'),
    },
    [AssetType.ShopExterior]: {
      color: '#87d068',
      value: L('AssetType:ShopExterior'),
    },
    [AssetType.Unknown]: { color: '#87d068', value: L('AssetType:Unknown') },
    [AssetType.Waist]: { color: '#9c27b0', value: L('AssetType:Waist') },
    [AssetType.Weapon]: { color: '#ff5722', value: L('AssetType:Weapon') },
  };

  const getAssetTypeColor = computed(() => {
    return (assetType: AssetType) => assetTypeDisplayMap[assetType].color;
  });
  const getAssetTypeValue = computed(() => {
    return (assetType: AssetType) => assetTypeDisplayMap[assetType].value;
  });

  return {
    assetTypeDisplayMap,
    getAssetTypeColor,
    getAssetTypeValue,
  };
}
