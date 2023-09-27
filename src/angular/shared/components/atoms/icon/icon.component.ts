import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class IconComponent implements AfterViewInit {
  @ViewChild('pathEl')
  private readonly _PATHEl!: ElementRef<SVGGraphicsElement>;

  private _path: string;
  private _fill: string;
  private _size: string;
  private _viewBox: string;
  private _autoCenter: boolean;

  @Input()
  set path(value: string) {
    this._path = value;
  }

  get path(): string {
    return this._path;
  }

  @Input()
  set fill(value: string) {
    this._fill = value;
  }

  get fill(): string {
    return this._fill;
  }

  @Input()
  set size(value: string) {
    this._size = value;
  }

  get size(): string {
    return this._size;
  }

  @Input()
  set viewBox(value: string) {
    this._viewBox = value;
  }

  get viewBox(): string {
    return this._viewBox;
  }

  @Input()
  set isAutoCenter(value: boolean) {
    this._autoCenter = value;
  }

  constructor(private readonly _renderer: Renderer2) {
    this._fill = '#000';
    this._path = '';
    this._size = '1rem';
    this._viewBox = '0 0 512 512';
    this._autoCenter = false;
  }

  ngAfterViewInit(): void {
    if (this._autoCenter) {
      this._centerPath();
    }
  }

  private _centerPath() {
    const path = this._PATHEl.nativeElement;
    const bBox = path.getBBox();

    const [ , , width, height] = this._viewBox.split(' ')
    
    const relY = (Number(width) - bBox.width) / 2;
    const relX = (Number(height) - bBox.height) / 2;

    const translateX = relX - bBox.x;
    const translateY = relY - bBox.y

    this._renderer.setAttribute(path, 'transform', `translate(${translateX}, ${translateY})`);
  }
}
