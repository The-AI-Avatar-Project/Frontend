import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, Sender } from '../../../shared/interfaces/chat';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgClass, FormsModule],
})
export class ChatWindowComponent {
  @Input() chatLog: ChatMessage[] = [];
  @Input() userInput = '';
  @Input() loading = false;
  @Output() userInputChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<void>();

  public Sender = Sender;

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.userInputChange.emit(value);
  }

  onSend(): void {
    this.sendMessage.emit();
  }
}
