import { TestBed } from '@angular/core/testing';

import { NgxSpeedTestService } from './ngx-speed-test.service';

describe('NgxSpeedTestService', () => {
  let service: NgxSpeedTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSpeedTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
