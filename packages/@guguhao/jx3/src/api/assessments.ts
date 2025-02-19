import { requestClient } from '@abp/request';
import type { AssessmentDto, AssessmentGetListInput } from '../types/assessments';
import type { PagedResultDto } from '@abp/core';
/**
 * 获取评估列表
 * @param input 参数
 */
export function getPagedListApi(
  input: AssessmentGetListInput,
): Promise<PagedResultDto<AssessmentDto>> {
  return requestClient.get<PagedResultDto<AssessmentDto>>('/api/jx3/assessment', {
    params: input,
  });
}
