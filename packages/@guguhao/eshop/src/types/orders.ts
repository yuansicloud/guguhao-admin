export interface OrderLineDto {
  actualTotalPrice: number;
  creationTime: string;
  creatorId: string;
  currency: string;
  deleterId: string;
  deletionTime: string;
  id: string;
  isDeleted: boolean;
  lastModificationTime: string;
  lastModifierId: string;
  mediaResources: string;
  paymentAmount: number;
  productDetailId: string;
  productDetailModificationTime: string;
  productDisplayName: string;
  productGroupDisplayName: string;
  productGroupName: string;
  productId: string;
  productInventoryStrategy: number;
  productModificationTime: string;
  productSkuId: string;
  productUniqueName: string;
  quantity: number;
  refundAmount: number;
  refundedQuantity: number;
  skuDescription: string;
  skuName: string;
  totalDiscount: number;
  totalPrice: number;
  unitPrice: number;
}

export interface OrderDiscountDto {
  discountedAmount: number;
  displayName: string;
  effectGroup: string;
  key: string;
  name: string;
  orderId: string;
  orderLineId: string;
}

export interface OrderExtraFeeDto {
  displayName: string;
  fee: number;
  key: string;
  name: string;
  orderId: string;
  paymentAmount: number;
  refundAmount: number;
}

export interface OrderDto {
  actualTotalPrice: number;
  canceledTime: string;
  cancellationReason: string;
  completionTime: string;
  creationTime: string;
  creatorId: string;
  currency: string;
  customerRemark: string;
  customerUserId: string;
  deleterId: string;
  deletionTime: string;
  id: string;
  isDeleted: boolean;
  lastModificationTime: string;
  lastModifierId: string;
  orderDiscounts: OrderDiscountDto[];
  orderExtraFees: OrderExtraFeeDto[];
  orderLines: OrderLineDto[];
  orderNumber: string;
  orderStatus: number;
  paidTime: string;
  paymentAmount: number;
  paymentExpiration: string;
  paymentId: string;
  productTotalPrice: number;
  reducedInventoryAfterPaymentTime: string;
  reducedInventoryAfterPlacingTime: string;
  refundAmount: number;
  staffRemark: string;
  storeId: string;
  totalDiscount: number;
  totalPrice: number;
}
