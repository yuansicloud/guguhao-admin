import { requestClient } from '@abp/request';

/**
 * 获取CDN Data信息
 */
export function getCDNData(data: {
  domainName: string;
  interval: string;
  metric: string;
  mode: string;
}): Promise<any> {
  return requestClient.post<any>('/api/administration/CDN/cdn-data', data);
}

/**
 * 获取CDN Top Data信息
 */
export function getCDNTopData(data: {
  domainName: string;
  filter: string;
  metric: string;
  mode: string;
}): Promise<any> {
  return requestClient.post<any>('/api/administration/CDN/list-top-data', data);
}

export function getCOSSignature(): Promise<any> {
  return requestClient.get<any>('/api/administration/COS/cos-signature');
}

export function getJX3SessionId(): Promise<any> {
  return requestClient.get<any>('/api/jx3/settings/session-id');
}

export function setJX3SessionId(sessionId: string): Promise<any> {
  return requestClient.post<any>(
    `/api/jx3/character/set-session-id/${sessionId}`,
  );
}
