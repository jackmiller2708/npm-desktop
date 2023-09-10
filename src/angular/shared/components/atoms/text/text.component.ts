import { Component, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() type: | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6' | 'paragraph' | 'inline'; 
  @Input() content: string;
  @Input() className: string;

  @Output() onClick: EventEmitter<MouseEvent>;

  @HostBinding('class')
  private get _classes(): string[] {
    return ([] as string[]).concat(this.className.split(' '));
  }

  constructor() {
    this.type = 'paragraph';
    this.content = '';
    this.className = '';

    this.onClick = new EventEmitter();
  }

  @HostListener('click', ['$event'])
  private _onSelfClick(event: MouseEvent): void {
    this.onClick.emit(event);
  }
}
