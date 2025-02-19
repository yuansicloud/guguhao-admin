import type { PagedAndSortedResultRequestDto } from "@abp/core";

interface SimilarCharacterDto {
  id: string;
  assessmentId: string;
  characterId: string;
  commonAssets: string;
  onSaleTime: string;
  description?: string;
  price: number;
  bookmarkNumber: number;
}

interface PredictionResultDto {
  id: string;
  creationTime: string;
  creatorId?: string;
  name?: string;
  displayName: string;
  description: string;
  price: number;
  pastDayPrice?: number;
  trainingDataDate: string;
}

interface AssessmentDto {
  id: string;
  creationTime: string;
  creatorId?: string;
  lastModificationTime?: string;
  lastModifierId?: string;
  isDeleted: boolean;
  name?: string;
  marketPrice?: number;
  wblPrice?: number;
  sequence: number;
  characterId: string;
  priceRange?: string;
  characterType: number;
  description?: string;
  comment?: string;
  isCompleted: boolean;
  isInProgress: boolean;
  rating?: number;
  feedback?: string;
  modelVersion?: string;
  modelDate?: string;
  adjustedPrice?: number;
  pastPriceDays?: number;
  similarCharacters: SimilarCharacterDto[];
  predictionResults: PredictionResultDto[];
  confidence?: number;
  averagePrice?: number;
  minPrice?: number;
  maxPrice?: number;
}

interface AssessmentGetListInput extends PagedAndSortedResultRequestDto {
}

// 修正导出语句，移除不存在的CharacterTemplateDto
export type { AssessmentDto, AssessmentGetListInput, SimilarCharacterDto, PredictionResultDto };
