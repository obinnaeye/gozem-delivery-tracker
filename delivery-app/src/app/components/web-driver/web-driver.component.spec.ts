import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebDriverComponent } from './web-driver.component';
import { HttpClientModule } from '@angular/common/http';

describe('WebDriverComponent', () => {
  let component: WebDriverComponent;
  let fixture: ComponentFixture<WebDriverComponent>;

  beforeAll((done) => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY';
    script.onload = () => done();
    document.head.appendChild(script);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebDriverComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WebDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
