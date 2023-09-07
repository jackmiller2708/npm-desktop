import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() type: 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 'paragraph' | 'inline';
  @Input() content: string;
  @Input() font: string;
  @Input() size: string;

  constructor() {
    this.type = 'paragraph';
    this.content = '';
    this.font = '';
    this.size = '';
  }
}
