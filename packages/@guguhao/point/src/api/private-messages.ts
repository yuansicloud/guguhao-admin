import type {
  PrivateMessageRequest,
  SystemMessageRequest,
} from '../types/private-messages';

import { requestClient } from '@abp/request';

export function sendPrivateMessage(data: PrivateMessageRequest): Promise<any> {
  return requestClient.post<any>(
    `/api/private-messaging/private-message/by-user-id`,
    data,
  );
}

export function publishSystemMessage(data: SystemMessageRequest): Promise<any> {
  return requestClient.post<any>(
    `/api/point-service/account/publish-system-message`,
    data,
  );
}
