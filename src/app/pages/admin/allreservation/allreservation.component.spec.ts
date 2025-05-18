import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllreservationComponent } from './allreservation.component';

describe('AllreservationComponent', () => {
  let component: AllreservationComponent;
  let fixture: ComponentFixture<AllreservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllreservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllreservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
