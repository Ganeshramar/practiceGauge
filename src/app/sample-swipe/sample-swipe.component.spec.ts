import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSwipeComponent } from './sample-swipe.component';

describe('SampleSwipeComponent', () => {
  let component: SampleSwipeComponent;
  let fixture: ComponentFixture<SampleSwipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleSwipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleSwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
