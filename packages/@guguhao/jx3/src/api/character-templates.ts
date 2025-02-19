import { requestClient } from '@abp/request';
import type { CharacterTemplateDto, CharacterTemplateGetListInput } from '../types/character-templates';
import type { PagedResultDto } from '@abp/core';

/**
 * Converts a character ID to its corresponding character template API representation.
 *
 * @param id - The unique identifier of the character to be converted.
 * @returns A promise that resolves to a CharacterTemplateDto object containing the character template data.
 */
export function convertToTemplateApi(id: string): Promise<CharacterTemplateDto> {
  return requestClient.post<CharacterTemplateDto>(`/api/jx3/Character-template/${id}/convert-character-to-template`);
}

/**
 * 估价角色模板
 * @param input 参数
 * @returns 评估ID
 */
export function assessCharacterTemplateApi(id: string): Promise<string> {
  return requestClient.post(`/api/jx3/character-template/${id}/assess-template`);
}

/**
 * 获取角色模板列表
 * @param input 参数
 */
export function getPagedListApi(
  input: CharacterTemplateGetListInput,
): Promise<PagedResultDto<CharacterTemplateDto>> {
  return requestClient.get<PagedResultDto<CharacterTemplateDto>>('/api/jx3/character-template', {
    params: input,
  });
}

/**
 * 删除角色模板
 * @param id 角色模板id
 */
export function deleteApi(id: string): Promise<void> {
  return requestClient.delete(`/api/jx3/character-template/${id}`);
}
