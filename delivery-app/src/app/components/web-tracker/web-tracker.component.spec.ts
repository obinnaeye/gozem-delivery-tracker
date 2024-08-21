import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebTrackerComponent } from './web-tracker.component';
import { HttpClientModule } from '@angular/common/http';

describe('WebTrackerComponent', () => {
  let component: WebTrackerComponent;
  let fixture: ComponentFixture<WebTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebTrackerComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WebTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
