import { Component, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject, skip, distinctUntilChanged } from 'rxjs';
import { LoaderService } from '@services/loader/loader.service';
import { AnimeInstance } from 'animejs';
import { CommonModule } from '@angular/common';
import { Helper } from '@shared/helper.class';

import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-loader-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-screen.component.html',
  styleUrls: ['./loader-screen.component.scss'],
})
export class LoaderScreenComponent implements OnInit, OnDestroy {
  private readonly _ngDestroy$: Subject<void>;
  private _animation: AnimeInstance;

  @HostBinding('class')
  private get _classes(): string[] {
    return ['h-screen', 'w-screen', 'absolute', 'left-full', 'bg-white'];
  }

  constructor(
    private readonly _loaderService: LoaderService,
    private readonly _el: ElementRef<Element>
  ) {
    this._animation = this._initAnimation(this._el.nativeElement);
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
      return this._playCloseAnimation()
    }

    this._playOpenAnimation();
  }

  private _playOpenAnimation() {
    if (this._animation.reversed) {
      this._animation.reverse();
    }

    this._animation.play();
  }

  private _playCloseAnimation() {
    if (!this._animation.reversed) {
      this._animation.reverse();
    }

    this._animation.play();
  }

  private _initAnimation(element: Element): AnimeInstance {
    return anime({
      targets: element,
      autoplay: false,
      translateX: '-100%',
      easing: 'cubicBezier(.5, .05, .1, .3)',
      duration: 300,
      begin: () => this._loaderService.setAnimationState('start'),
      complete: () => this._loaderService.setAnimationState('finish')
    });
  }
}
