import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    this.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      this.subject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed, reconnecting...', event);
      setTimeout(() => {
        this.connect(); // Reconnect after a delay
      }, 5000);
    };
  }

  getMessages() {
    return this.subject.asObservable();
  }

  sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error(
        'WebSocket is not open. ReadyState:',
        this.socket.readyState
      );
    }
  }
}
