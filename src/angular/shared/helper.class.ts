type F = (...args: any[]) => void;

export class Helper {
  private constructor() {}

  static clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  }

  static throttle(fn: F, t: number): F {
    let lastTimeout: NodeJS.Timeout;
    let lastCall: number;

    return function (...args) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      const now = Date.now();

      if (!lastCall || now - lastCall >= t) {
        fn(...args);
        lastCall = now;

        return;
      }

      lastTimeout = setTimeout(() => {
        fn(...args);
        lastCall = Date.now();
      }, t - (now - lastCall));
    };
  }
}
