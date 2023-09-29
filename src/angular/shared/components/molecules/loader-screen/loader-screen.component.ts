import { Component, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject, skip, distinctUntilChanged } from 'rxjs';
import { LoaderService } from '@services/loader/loader.service';
import { AnimeInstance } from 'animejs';
import { CommonModule } from '@angular/common';
import { Helper } from '@shared/helper.class';

import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-loader-screen',
  templateUrl: './loader-screen.component.html',
  styleUrls: ['./loader-screen.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LoaderScreenComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _openAnimation: AnimeInstance | undefined;
  private _closeAnimation: AnimeInstance | undefined;

  @HostBinding('class')
  private get _classes(): string[] {
    return [
      'h-screen',
      'w-screen',
      'absolute',
      'left-full',
      'bg-white',
      'flex',
      'items-center',
      'justify-center',
      'z-10',
      'select-none'
    ];
  }

  set openAnimation(value: AnimeInstance) {
    this._openAnimation = value;
  }

  set closeAnimation(value: AnimeInstance) {
    this._closeAnimation = value;
  }

  constructor(
    private readonly _loaderService: LoaderService,
    private readonly _el: ElementRef<Element>
  ) {
    this._ngDestroy$ = new Subject();
  }

  ngOnInit(): void {
    Helper.makeObservableRegistrar.call(this, this._ngDestroy$)(
      this._loaderService.isLoading$.pipe(skip(1), distinctUntilChanged()),
      (isLoading) => this._play(!isLoading)
    );
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  private _play(reverse?: boolean): void {
    if ((typeof reverse === 'boolean' && reverse)) {
      return (this._closeAnimation ?? this._defaultCloseAnimation()).play();
    }

    (this._openAnimation ?? this._defaultOpenAnimation()).play();
  }

  private _defaultOpenAnimation(): AnimeInstance {
    return anime({
      targets: this._el.nativeElement,
      autoplay: false,
      translateX: ['0%', '-100%'],
      easing: 'cubicBezier(.5, .05, .1, .3)',
      duration: 300,
      begin: () => this._loaderService.setAnimationState('start'),
      complete: () => this._loaderService.setAnimationState('finish')
    });
  } 

  private  _defaultCloseAnimation(): AnimeInstance {
    return anime({
      targets: this._el.nativeElement,
      autoplay: false,
      translateX: ['-100%', '-200%'],
      easing: 'cubicBezier(.5, .05, .1, .3)',
      duration: 300,
      begin: () => this._loaderService.setAnimationState('start'),
      complete: () => this._loaderService.setAnimationState('finish')
    });
  }
}
