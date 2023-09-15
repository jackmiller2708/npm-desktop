import { TestBed } from '@angular/core/testing';

import { DisplayToastService } from './display-toast.service';

describe('DisplayToastService', () => {
  let service: DisplayToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
