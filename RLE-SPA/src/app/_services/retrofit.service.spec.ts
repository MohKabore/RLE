/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RetrofitService } from './retrofit.service';

describe('Service: Retrofit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrofitService]
    });
  });

  it('should ...', inject([RetrofitService], (service: RetrofitService) => {
    expect(service).toBeTruthy();
  }));
});
