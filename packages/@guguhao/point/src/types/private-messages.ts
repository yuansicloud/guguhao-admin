export interface PrivateMessageRequest {
  category: string;
  content: string;
  title: string;
  toUserId: string;
}

export interface SystemMessageRequest {
  content: string;
  title: string;
}
