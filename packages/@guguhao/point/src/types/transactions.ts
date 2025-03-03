import type { PagedAndSortedResultRequestDto } from '@abp/core';

interface TransactionDto {
  accountId: string;
  accountUserId: string;
  actionName: string;
  changedBalance: number;
  creationTime?: string;
  creatorId: string;
  description: string;
  externalTradingCode: string;
  id: string;
  originalBalance: number;
  transactionType: number;
}

interface TransactionGetListInput extends PagedAndSortedResultRequestDto {
  accountUserId?: string;
}

export type { TransactionDto, TransactionGetListInput };
