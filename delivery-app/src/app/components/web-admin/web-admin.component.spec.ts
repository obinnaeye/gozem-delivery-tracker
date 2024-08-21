import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebAdminComponent } from './web-admin.component';
import { HttpClientModule } from '@angular/common/http';

describe('WebAdminComponent', () => {
  let component: WebAdminComponent;
  let fixture: ComponentFixture<WebAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebAdminComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WebAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
