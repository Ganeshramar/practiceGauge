import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeSampleComponent } from './swipe-sample.component';

describe('SwipeSampleComponent', () => {
  let component: SwipeSampleComponent;
  let fixture: ComponentFixture<SwipeSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwipeSampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwipeSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
