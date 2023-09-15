import { TestBed } from '@angular/core/testing';

import { LoaderScreenService } from './loader-screen.service';

describe('LoaderScreenService', () => {
  let service: LoaderScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
