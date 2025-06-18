import type { PagedAndSortedResultRequestDto } from '@abp/core';

interface AccountDto {
  balance: number;
  coupons: number;
  creationTime?: string;
  deletionTime?: string;
  experience: number;
  id: string;
  lastModificationTime?: string;
  lockedBalance: number;
  membershipDisplayName: string;
  membershipName?: string;
  name: string;
  phoneNumber: string;
  totalUsed: number;
  totalUsedCoupons: number;
  userId: string;
  userName: string;
}

interface AccountGetListInput extends PagedAndSortedResultRequestDto {
  maxBalance?: number;
  maxCoupons?: number;
  maxExperience?: number;
  maxTotalUsed?: number;
  maxTotalUsedCoupons?: number;
  minBalance?: number;
  minCoupons?: number;
  minExperience?: number;
  minTotalUsed?: number;
  minTotalUsedCoupons?: number;
}

interface ChangeAccountBalanceInput {
  changedBalance: number;
  description: string;
}

interface ChangeAccountCouponsInput {
  changedCoupons: number;
  description: string;
}

export type {
  AccountDto,
  AccountGetListInput,
  ChangeAccountBalanceInput,
  ChangeAccountCouponsInput,
};
