export interface PrivateMessageRequest {
  category: string;
  content: string;
  title: string;
  toUserId: string;
}

export interface SystemMessageRequest {
  title: string;
  content: string;
}
