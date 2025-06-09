export interface OrderStatusInfo {
  color: string;
  name: string;
}

const statusMap: Record<number, OrderStatusInfo> = {
  1: { name: '待支付', color: 'blue' },
  2: { name: '已支付', color: 'orange' },
  4: { name: '已完成', color: 'green' },
  8: { name: '已取消', color: 'red' },
};

export function useOrderStatus() {
  const getStatusInfo = (status: number): OrderStatusInfo => {
    return statusMap[status] || { name: '-', color: 'default' };
  };
  return { getStatusInfo };
}
