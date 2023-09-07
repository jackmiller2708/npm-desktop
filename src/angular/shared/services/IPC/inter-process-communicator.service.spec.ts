import { TestBed } from '@angular/core/testing';

import { InterProcessCommunicator } from './inter-process-communicator.service';

describe('InterProcessCommunicatorService', () => {
  let service: InterProcessCommunicator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterProcessCommunicator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
