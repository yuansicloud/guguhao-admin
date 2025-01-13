import { requestClient } from '@abp/request';
import { useAppConfig } from '@vben/hooks';
import type { OAuthUserInfo, UserInfo } from '../types/user';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const { authURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
  const result = await requestClient.get<OAuthUserInfo>('/connect/userinfo', {
    baseURL: authURL,
  });
  return {
    ...result,
    emailVerified: result.email_verified,
    givenName: result.given_name,
    phoneNumberVerified: result.phone_number_verified,
    preferredUsername: result.preferred_username,
    uniqueName: result.unique_name,
  };
}
