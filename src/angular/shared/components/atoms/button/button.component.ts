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
  private _classNames: string[] | undefined;

  @Input() contentTemplate: TemplateRef<any> | undefined;
  @Input() content: string | undefined;

  @Input()
  set className(value: string) {
    this._classNames = value.split(' ');
  }

  get classNames(): string[] {
    return this._classNames ?? [];
  }

  @Output() onClick: EventEmitter<MouseEvent>;

  constructor() {
    this.onClick = new EventEmitter();
  }
}
