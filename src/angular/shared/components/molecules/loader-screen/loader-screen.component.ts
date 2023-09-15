import { Subject, Observable, takeUntil, Subscription, skip } from 'rxjs';
import { Component, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { LoaderScreenService } from './services/loader-screen.service';
import { AnimeInstance } from 'animejs';
import { CommonModule } from '@angular/common';
import { Helper } from 'src/angular/shared/helper.class';

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
    private readonly _loaderScreenService: LoaderScreenService,
    private readonly _el: ElementRef<Element>
  ) {
    this._animation = this._initAnimation(this._el.nativeElement);
    this._play = Helper.throttle(this._play.bind(this), 1000);
    this._ngDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this._register(
      this._loaderScreenService.isLoading$.pipe(skip(2)),
      (isLoading) => this._play(!isLoading)
    );
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next();
  }

  private _play(reverse?: boolean): void {
    if ((typeof reverse === 'boolean' && reverse) || this._animation.reversed) {
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
    });
  }

  private _register<T>(store$: Observable<T>, processor: (data: T) => void): Subscription {
    return store$.pipe(takeUntil(this._ngDestroy$)).subscribe(processor.bind(this));
  }
}
