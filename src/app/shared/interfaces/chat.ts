export enum Sender {
  User = 'User',
  Bot = 'Bot',
}

export interface ChatMessageDTO {
  sender: Sender;
  message: string;
  references?: string[];
}

export interface ChatMessage {
  sender: Sender;
  message: string;
  references: Reference[];
}

export interface Reference {
  page: string;
  pageNumbers: number[];
}

export interface ChatMessageResponse {
  responseText: string;
  requestText: string;
}
