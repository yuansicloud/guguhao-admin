
import type {
  ConfigDto
} from '../types/settings';

import { requestClient } from '@abp/request';

/**
 * 获取剑三配置
 * @param isSearch 是否搜索
 */
export function getConfigApi(isSearch: boolean): Promise<ConfigDto> {
  return requestClient.get<ConfigDto>(`/api/jx3/settings/config?isSearch=${isSearch}`);
}

