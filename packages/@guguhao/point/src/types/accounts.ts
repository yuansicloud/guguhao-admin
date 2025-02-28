import type { PagedAndSortedResultRequestDto } from '@abp/core';

interface AccountDto {
  creationTime?: string;
  deletionTime?: string;
  id: string;
  lastModificationTime?: string;
  userId: string;
  lockedBalance: number;
  balance: number;
  totalUsed: number;
  membershipName?: string;
}

interface AccountGetListInput extends PagedAndSortedResultRequestDto {
}

export type { AccountDto, AccountGetListInput };
