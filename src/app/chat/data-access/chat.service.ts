import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ChatMessage,
  ChatMessageResponse,
  Sender,
} from '../../shared/interfaces/chat';
import { API_URL } from '../../shared/constants/constants';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  // state
  private state = signal<ChatState>({
    messages: [{sender: Sender.Bot, message: "Hallo! Wie kann ich dir heute helfen?"}],
    loading: false,
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);

  sendMessage(messageText: string): void {
    console.log('reached sending with message:', messageText);
    const userMessage: ChatMessage = {
      sender: Sender.User,
      message: messageText,
    };

    this.state.update((state) => ({
      ...state,
      messages: [...state.messages, userMessage],
      loading: true,
      error: null,
    }));

    // Sende die Nachricht an den Server
    this.sendChatMessage(messageText)
      .pipe(
takeUntil(this.destroy$),
        finalize(() => {
          this.state.update((state) => ({
            ...state,
            loading: false,
          }));
        })
      )
      .subscribe({
        next: (response) => {
          console.log('got server response');
          const botMessage: ChatMessage = {
            sender: Sender.Bot,
            message: response.responseText,
          };
          this.state.update((state) => ({
            ...state,
            messages: [...state.messages, botMessage],
          }));
        },
        error: (err) => {
          this.state.update((state) => ({
            ...state,
            error: 'Error while sending message to api:' + err.message,
          }));
        },
      });
  }
  private sendChatMessage(message: string) {
    return this.http
      .post<ChatMessageResponse>(`${API_URL}/ai/text/0`, { message: message })
      .pipe(
        catchError((err) => {
          console.error('Error while fetching api:', err);
          throw err;
        })
      );
  }

  resetChat(): void {
    this.state.update((state) => ({
      ...state,
      messages: [],
      error: null,
    }));
  }
  constructor() {}
}
