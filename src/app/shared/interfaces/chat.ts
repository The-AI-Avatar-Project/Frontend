export enum Sender {
  User = 'User',
  Bot = 'Bot',
}

export interface ChatMessage {
  sender: Sender;
  message: string;
  references?: string[];
}

export interface ChatMessageResponse {
  responseText: string;
  requestText: string;
}
