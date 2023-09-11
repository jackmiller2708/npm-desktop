import { TestBed } from '@angular/core/testing';

import { MonadService } from './monad.service';

describe('MonadService', () => {
  let service: MonadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
