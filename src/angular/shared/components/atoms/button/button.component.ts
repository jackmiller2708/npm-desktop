import { Component, Input, Output, TemplateRef, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() contentTemplate: TemplateRef<any> | undefined;
  @Input() content: string | undefined;

  @Output() onClick: EventEmitter<MouseEvent>;

  constructor() {
    this.onClick = new EventEmitter();
  }
}
