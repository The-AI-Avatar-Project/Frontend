export enum Sender {
  User = 'User',
  Bot = 'Bot',
}

export interface ChatMessage {
  sender: Sender;
  message: string;
}

export interface ChatMessageResponse {
  responseText: string;
  responseAudio: string;
  requestText: string;
}
