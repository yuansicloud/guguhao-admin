import type { PrivateMessageRequest } from '../types/private-messages';

import { requestClient } from '@abp/request';

export function sendPrivateMessage(data: PrivateMessageRequest): Promise<any> {
  return requestClient.post<any>(
    `/api/private-messaging/private-message/by-user-id`,
    data,
  );
}
