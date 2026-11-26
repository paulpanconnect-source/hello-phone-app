import { Component, signal } from '@angular/core';

const GREETINGS = [
  'Hello World!',
  'Hi there!',
  'Welcome!',
  'Hey!',
  'Good to see you!',
];

@Component({
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly index = signal(0);
  protected readonly greeting = signal(GREETINGS[0]);

  protected nextGreeting(): void {
    const next = (this.index() + 1) % GREETINGS.length;
    this.index.set(next);
    this.greeting.set(GREETINGS[next]);
  }
}
