import { Component, ElementRef, HostBinding, Input, OnDestroy, OnInit, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { Subject, filter, fromEvent, share, switchMap, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Helper } from '@shared/helper.class';

const MIN_RESIZE_PERCENTAGE = 30;
const MAX_RESIZE_PERCENTAGE = 80;

@Component({
  selector: 'app-container-resizable',
  templateUrl: './container-resizable.component.html',
  styleUrls: ['./container-resizable.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ContainerResizableComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy: Subject<void>;
  private _minWidth: number | undefined;
  private _maxWidth: number | undefined;
  private _classNames: string[];

  @HostBinding('class')
  private get _classes(): string[] {
    return this._classNames.concat('block');
  }

  @Input()
  set className(value: string) {
    this._classNames = value.split(' ');
  }

  @Input()
  set minPercentage(value: number) {
    this._minWidth = Helper.clamp(value, 0, 100);
  }

  @Input()
  set maxPercentage(value: number) {
    this._maxWidth = Helper.clamp(value, 0, 100);
  }

  private get _minPercentage(): number {
    return  this._minWidth ?? MIN_RESIZE_PERCENTAGE;
  }

  private get _maxPercentage(): number {
    return this._maxWidth ?? MAX_RESIZE_PERCENTAGE;
  }

  private get _el(): HTMLElement {
    return this._elRef.nativeElement;
  }

  private get _rootEl(): Element {
    return document.body.firstElementChild!;
  }

  constructor(
    private readonly _elRef: ElementRef<HTMLElement>,
    private readonly _renderer: Renderer2
  ) {
    this._ngDestroy = new Subject();
    this._classNames = [];
  }

  ngOnInit(): void {
    this._initStores();
  }

  ngOnDestroy(): void {
    this._ngDestroy.next();
  }

  private _onDocumentMouseMove(event: MouseEvent): void {
    if (document.body.style.cursor === 'col-resize') {
      return;
    }

    const relX = Math.floor(event.pageX - this._el.getBoundingClientRect().left);
    const isOverRight = relX >= this._el.offsetWidth - 5 && relX <= this._el.offsetWidth + 5;

    if (isOverRight && !this._rootEl.classList.contains('cursor-col-resize')) {
      this._rootEl.classList.add('cursor-col-resize');
    }

    if (isOverRight) {
      return;
    }

    this._rootEl.classList.remove('cursor-col-resize');
  }

  private _onBeginDrag(event: MouseEvent) {
    const relX = event.pageX - this._el.getBoundingClientRect().left;

    this._renderer.setStyle(this._el, 'width', `${relX}px`, RendererStyleFlags2.Important);
    this._renderer.setStyle(document.body, 'cursor', 'col-resize');
    this._renderer.setStyle(document.body, 'user-select', 'none');
  }

  private _onDragging(event: MouseEvent) {
    const relX = ((event.pageX - this._el.getBoundingClientRect().left) / window.innerWidth) * 100;
    const relMinPercentage = (this._el.getBoundingClientRect().left / window.innerWidth) * 100;
    const calculatedMinPercentage = relMinPercentage < this._minPercentage ? relMinPercentage : this._minPercentage;
    const resizedPercentage = Helper.clamp(relX, calculatedMinPercentage, this._maxPercentage);

    this._renderer.setStyle(this._el, 'width', `${resizedPercentage}%`, RendererStyleFlags2.Important);
  }

  private _onEndDrag(): void {
    this._renderer.removeAttribute(document.body, 'style');
  }

  private _initStores(): void {
    const _register = Helper.makeObservableRegistrar.call(this, this._ngDestroy);
    const _mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const _mouseDown$ = fromEvent<MouseEvent>(document, 'mousedown');
    const _mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup');

    const _endDrag$ = _mouseUp$;
    const _beginDrag$ = _mouseDown$.pipe(filter(() => this._rootEl.classList.contains('cursor-col-resize')), share());
    const _dragging$ = _beginDrag$.pipe(switchMap(() => _mouseMove$.pipe(takeUntil(_endDrag$))));

    _register(_mouseMove$, this._onDocumentMouseMove);
    _register(_beginDrag$, this._onBeginDrag);
    _register(_dragging$, this._onDragging);
    _register(_endDrag$, this._onEndDrag);
  }
}
