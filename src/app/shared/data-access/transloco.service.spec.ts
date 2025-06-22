import { TestBed } from '@angular/core/testing';

import { TranslocoService } from './transloco.service';

describe('TranslocoService', () => {
  let service: TranslocoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslocoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
