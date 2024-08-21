import { TestBed } from '@angular/core/testing';

import { PackageService } from './package.service';
import { HttpClientModule } from '@angular/common/http';

describe('PackageService', () => {
  let service: PackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    service = TestBed.inject(PackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
