import { computed } from 'vue';

import { useLocalization } from '@abp/core';

import { state } from '../types/characters';

export function useCharacter() {
  const { L } = useLocalization(['JX3', 'AbpUi']);

  const stateDisplayMap = {
    [state.Announcing]: {
      color: '#00cc99',
      value: L('CharacterState:Announcing'),
    },
    [state.Available]: {
      color: '#3f51b5',
      value: L('CharacterState:Available'),
    },
    [state.OffSale]: {
      color: 'red',
      value: L('CharacterState:OffSale'),
    },
    [state.Preparing]: {
      color: '#108ee9',
      value: L('CharacterState:Preparing'),
    },
    [state.Sold]: {
      color: '#87d068',
      value: L('CharacterState:Sold'),
    },
    [state.Something]: {
      color: '#2196f3',
      value: L('CharacterState:Something'),
    },
    [state.WaitingForValidation]: {
      color: '#673ab7',
      value: L('CharacterState:WaitingForValidation'),
    },
  };

  const getStateColor = computed(() => {
    return (state: state) => stateDisplayMap[state].color;
  });
  const getStateValue = computed(() => {
    return (state: state) => stateDisplayMap[state].value;
  });

  return {
    getStateColor,
    getStateValue,
    stateDisplayMap,
  };
}
