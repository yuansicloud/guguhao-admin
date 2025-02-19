import type { PagedAndSortedResultRequestDto } from "@abp/core";

interface CharacterTemplateDto {
  achievementPoint?: number;
  marketPrice: number;
  career?: string;
  creationTime?: string;
  deletionTime?: string;
  description?: string;
  equipmentPoint?: number;
  id: string;
  isDeleted?: true;
  isFetched?: true;
  lastModificationTime?: string;
  name: string;
  shape?: string;
  tags?: string;
}

interface CharacterTemplateGetListInput extends PagedAndSortedResultRequestDto {

}

export type { CharacterTemplateDto, CharacterTemplateGetListInput };
