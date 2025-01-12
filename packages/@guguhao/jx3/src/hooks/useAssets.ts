import { useLocalization } from '@abp/core';

import { AssetType } from '../types/assets';

import { computed } from 'vue';

export function useAssets() {
  const { L } = useLocalization(['JX3', 'AbpUi']);

  const assetTypeDisplayMap = {
    [AssetType.Unknown]: { color: '#87d068', value: L('AssetTypeUnknown') },
    [AssetType.Exterior]: { color: '#87d068', value: L('AssetTypeExterior') },
    [AssetType.ShopExterior]: { color: '#87d068', value: L('AssetTypeShopExterior') },
    [AssetType.Hair]: { color: '#f56c6c', value: L('AssetTypeHair') },
    [AssetType.MiniAvatar]: { color: '#ff9900', value: L('AssetTypeMiniAvatar') },
    [AssetType.Adventure]: { color: '#00cc99', value: L('AssetTypeAdventure') },
    [AssetType.Pals]: { color: '#ffcc00', value: L('AssetTypePals') },
    [AssetType.Weapon]: { color: '#ff5722', value: L('AssetTypeWeapon') },
    [AssetType.Waist]: { color: '#9c27b0', value: L('AssetTypeWaist') },
    [AssetType.Back]: { color: '#3f51b5', value: L('AssetTypeBack') },
    [AssetType.Horse]: { color: '#4caf50', value: L('AssetTypeHorse') },
    [AssetType.Face]: { color: '#2196f3', value: L('AssetTypeFace') },
    [AssetType.LeftShoudler]: { color: '#8e24aa', value: L('AssetTypeLeftShoudler') },
    [AssetType.RightShoudler]: { color: '#c2185b', value: L('AssetTypeRightShoudler') },
    [AssetType.BackCloak]: { color: 'red', value: L('AssetTypeBackCloak') },
    [AssetType.Bag]: { color: '#108ee9', value: L('AssetTypeBag') },
    [AssetType.Pet]: { color: '#4caf50', value: L('AssetTypePet') },
    [AssetType.Glasses]: { color: '#673ab7', value: L('AssetTypeGlasses') },
    [AssetType.LeftLovePendent]: { color: '#f44336', value: L('AssetTypeLeftLovePendent') },
    [AssetType.RightLovePendent]: { color: '#9c27b0', value: L('AssetTypeRightLovePendent') },
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
